export default async function handler(req, res) {
  const { code, state } = req.query;
  const cookies = parseCookies(req.headers.cookie || "");

  if (!cookies.oauth_state || state !== cookies.oauth_state) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/callback?error=invalid_state`
    );
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
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    const params = new URLSearchParams({
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in.toString(),
      success: "true",
    });

    res.redirect(`${process.env.FRONTEND_URL}/callback?${params}`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/callback?error=auth_failed`);
  }
}
