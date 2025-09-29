import { useState, useEffect } from "react";
import { spotifyService } from "../services/SpotifyService";
import Dashboard from "./Dashboard";
import reactLogo from "/src/assets/react.svg";
import viteLogo from "/vite.svg";

function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticated = spotifyService.isAuthenticated();
    setIsAuthenticated(authenticated);
    setLoading(false);
  }, []);

  const handleSpotifyLogin = () => {
    window.location.href = "http://127.0.0.1:5000/auth/login"; // Consistent hostname
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>🎵 Playlist Roulette</h1>
      <div className="card">
        <p>Shuffle and randomize your Spotify playlists!</p>
        <button
          onClick={handleSpotifyLogin}
          style={{
            backgroundColor: "#1db954",
            color: "white",
            padding: "12px 24px",
            fontSize: "16px",
            border: "none",
            borderRadius: "25px",
            cursor: "pointer",
            margin: "20px",
            fontWeight: "bold",
          }}
        >
          🎵 Login with Spotify
        </button>
        <p style={{ opacity: 0.8, maxWidth: "400px", margin: "0 auto" }}>
          Connect your Spotify account to access your playlists and create
          randomized versions of them.
        </p>
      </div>
    </>
  );
}

export default HomePage;
