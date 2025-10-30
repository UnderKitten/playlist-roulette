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
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/token`, {
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
  <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-10 border border-gray-700/30 shadow-2xl max-w-md w-full text-center space-y-6">
      <h2 className="text-3xl font-bold text-white mb-4">
        🎵 Spotify Authentication
      </h2>
      
      <div className="space-y-4">
        <p className="text-gray-300 text-lg">{status}</p>
        
        {status === "Processing..." && (
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full"></div>
            <div className="text-4xl">⏳</div>
          </div>
        )}
        
        {status.includes("successful") && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <div className="text-4xl animate-bounce">✅</div>
            </div>
            <div className="p-4 bg-green-900/30 border border-green-500/30 text-green-200 rounded-lg">
              Authentication successful! Redirecting to your playlists...
            </div>
          </div>
        )}
        
        {status.includes("failed") && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <div className="text-4xl">❌</div>
            </div>
            <div className="p-4 bg-red-900/30 border border-red-500/30 text-red-200 rounded-lg">
              Authentication failed. Please try again.
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

};

export default CallbackPage;