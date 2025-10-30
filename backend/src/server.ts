import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import querystring from "querystring";
import cookieParser from "cookie-parser";
import { SpotifyTokenResponse } from "./types/spotify";

const app = express();
const PORT = process.env.PORT || 5000;

const requiredEnvVars = [
  "SPOTIFY_CLIENT_ID",
  "SPOTIFY_CLIENT_SECRET",
  "FRONTEND_URL",
];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

const userSessions = new Map();

const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of userSessions) {
    if (now > session.expires_at) {
      userSessions.delete(sessionId);
    }
  }
}, 15 * 60 * 1000);

app.get("/hello", (req, res) => {
  res.json({ message: "Hello World" });
});

app.get("/auth/login", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");

  res.cookie("oauth_state", state, {
    signed: true,
    httpOnly: true,
    maxAge: 10 * 60 * 1000,
    sameSite: "lax",
    // secure: false,
  });

  const params = querystring.stringify({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    state: state,
    scope: " playlist-modify-public",
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});

app.get("/auth/callback", async (req, res) => {
  const { code, state } = req.query;
  const storedState = req.signedCookies["oauth_state"];

  if (!storedState || state !== storedState) {
    return res.status(422).send("Invalid state parameter");
  }

  res.clearCookie("oauth_state");

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  try {
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
        body: querystring.stringify({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      return res.redirect(
        `${process.env.FRONTEND_URL}/callback?error=token_failed`
      );
    }

    const tokenData = (await tokenResponse.json()) as SpotifyTokenResponse;

    if (tokenData.access_token && tokenData.expires_in) {
      const sessionId = crypto.randomBytes(16).toString("hex");
      userSessions.set(sessionId, {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: Date.now() + tokenData.expires_in * 1000,
      });
      return res.redirect(
        `${process.env.FRONTEND_URL}/callback?success=true&session=${sessionId}`
      );
    } else {
      return res.redirect(
        `${process.env.FRONTEND_URL}/callback?error=no_token`
      );
    }
  } catch (error) {
    console.error("Auth failed:", error);
    return res.redirect(
      `${process.env.FRONTEND_URL}/callback?error=auth_failed`
    );
  }
});

app.post("/auth/token", (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "Missing session ID" });
  }

  const session = userSessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  if (Date.now() > session.expires_at) {
    userSessions.delete(sessionId);
    return res.status(401).json({ error: "Session expired" });
  }

  res.json({
    access_token: session.access_token,
    expires_at: session.expires_at,
    expires_in: Math.floor((session.expires_at - Date.now()) / 1000),
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  clearInterval(cleanupInterval);
  console.log("Cleanup interval cleared");
});
