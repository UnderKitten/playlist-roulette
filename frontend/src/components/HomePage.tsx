import { useState, useEffect } from "react";
import { spotifyService } from "../services/SpotifyService";
import Dashboard from "./Dashboard";

function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticated = spotifyService.isAuthenticated();
    setIsAuthenticated(authenticated);
    setLoading(false);
  }, []);

  const handleSpotifyLogin = () => {
    window.location.href = "http://127.0.0.1:5000/auth/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full mx-auto"></div>
          <h2 className="text-2xl font-bold text-white">Loading...</h2>
          <p className="text-gray-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">     

      {/* Main Content Card */}
      <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-10 border border-gray-700/30 shadow-2xl max-w-md w-full text-center space-y-8">
        {/* Title */}
        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-4">
          🎵 Playlist Roulette
        </h1>

        {/* Description */}
        <p className="text-gray-300 text-lg leading-relaxed">
          Shuffle and randomize your Spotify playlists with a single click!
        </p>

        {/* Login Button */}
        <button
          onClick={handleSpotifyLogin}
          className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-4 px-8 text-lg font-bold rounded-2xl cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-green-600/25 hover:scale-105 flex items-center justify-center gap-3"
        >
          <span className="text-2xl">🎵</span>
          Login with Spotify
        </button>

        {/* Additional Info */}
        <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
          Connect your Spotify account to access your playlists and create
          randomized versions of them instantly.
        </p>

        {/* Features List */}
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-3 text-gray-300">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span className="text-sm">Shuffle any public playlist instantly</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span className="text-sm">Secure OAuth authentication</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-gray-500 text-sm">
        <p>Built with React, TypeScript, and the Spotify Web API</p>
      </div>
    </div>
  );
}

export default HomePage;
