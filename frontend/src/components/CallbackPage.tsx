import { useEffect, useState } from "react";

const CallbackPage = () => {
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get("success");
      const sessionId = urlParams.get("session");
      const error = urlParams.get("error");

      console.log("URL params:", { success, sessionId, error });

      if (error) {
        setStatus(`Authentication failed: ${error}`);
        return;
      }

      if (success === "true" && sessionId) {
        try {
          const response = await fetch("http://127.0.0.1:5000/auth/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });

          if (response.ok) {
            const tokenData = await response.json();
            localStorage.setItem("spotify_access_token", tokenData.access_token);
            localStorage.setItem("spotify_expires_at", tokenData.expires_at.toString());
            setStatus("Authentication successful!");

            setTimeout(() => {
              window.location.href = "/";
            }, 1000);
          } else {
            const errorData = await response.json();
            setStatus(`Failed to retrieve token: ${errorData.message}`);
          }
        } catch (error) {
          setStatus(`Error during token retrieval: ${error}`);
        }
      } else {
        setStatus("Invalid callback parameters.");
      }
    };

    handleCallback();
  }, []);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      flexDirection: "column"
    }}>
      <h2>Spotify Authentication</h2>
      <p>{status}</p>
      {status === "Processing..." && <div>⏳</div>}
      {status.includes("successful") && <div>✅</div>}
      {status.includes("failed") && <div>❌</div>}
    </div>
  );
};

export default CallbackPage;