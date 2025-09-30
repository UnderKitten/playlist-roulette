import { useState, useEffect } from "react";
import {
  spotifyService,
  type SpotifyPlaylist,
  type SpotifyTrack,
} from "../services/SpotifyService";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] =
    useState<SpotifyPlaylist | null>(null);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [shuffledTracks, setShuffledTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleSuccess, setShuffleSuccess] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!spotifyService.isAuthenticated()) {
        setError("Please login with Spotify first");
        return;
      }

      const [userProfile, userPlaylists] = await Promise.all([
        spotifyService.getCurrentUser(),
        spotifyService.getUserPlaylists(),
      ]);

      setUser(userProfile);
      setPlaylists(userPlaylists);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistSelect = async (playlist: SpotifyPlaylist) => {
    if (isShuffling) return;

    try {
      setLoading(true);
      setSelectedPlaylist(playlist);

      const playlistTracks = await spotifyService.getPlaylistTracks(
        playlist.id
      );
      setTracks(playlistTracks);
      setShuffledTracks([]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load playlist tracks"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShuffleAndApply = async () => {
    if (!selectedPlaylist || tracks.length === 0) return;

    try {
      setIsShuffling(true);
      setError(null);
      setShuffleSuccess(false);

      const shuffled = await spotifyService.shuffleAndApplyPlaylist(
        selectedPlaylist.id,
        tracks
      );

      setShuffledTracks(shuffled);
      setShuffleSuccess(true);

      setTimeout(() => {
        setShuffleSuccess(false);
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to shuffle playlist"
      );
    } finally {
      setIsShuffling(false);
    }
  };

  const handleLogout = () => {
    if (isShuffling) return;

    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_expires_at");
    window.location.href = "/";
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full mx-auto"></div>
          <h2 className="text-2xl font-bold text-white">Loading...</h2>
          <p className="text-gray-300">Getting your Spotify data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-red-900/30 backdrop-blur-sm rounded-xl border border-red-500/20 max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Shuffle Loading Overlay */}
      {isShuffling && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-10 border border-green-500/30 shadow-2xl text-center space-y-6 max-w-md">
            <div className="animate-spin w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full mx-auto"></div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-green-400">
                Shuffling Playlist
              </h2>
              <p className="text-gray-300 text-lg">
                Applying your shuffled tracks to Spotify...
              </p>
              <p className="text-gray-400 text-sm">This may take a moment</p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-400 h-full rounded-full animate-pulse w-full"></div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-2xl">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
              🎵 Playlist Roulette
            </h1>
            {user && (
              <p className="text-gray-300 text-lg">
                Welcome back,{" "}
                <span className="text-green-400 font-semibold">
                  {user.display_name}
                </span>
                !
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            disabled={isShuffling}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg ${
              isShuffling
                ? "bg-gray-700 text-gray-400 cursor-not-allowed opacity-50"
                : "bg-red-600 hover:bg-red-700 text-white hover:shadow-xl hover:scale-105"
            }`}
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[500px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-8 border border-gray-700/30 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-100">
                Your Playlists
                <span className="text-green-400 text-lg ml-2">
                  ({playlists.length})
                </span>
              </h2>
              <div className="max-h-[600px] overflow-y-auto space-y-3 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-green-600">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    onClick={() =>
                      !isShuffling && handlePlaylistSelect(playlist)
                    }
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isShuffling
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:scale-[1.02]"
                    } ${
                      selectedPlaylist?.id === playlist.id
                        ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-600/25"
                        : "bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/30"
                    }`}
                  >
                    <div
                      className="font-semibold text-md truncate"
                      title={playlist.name}
                    >
                      {playlist.name}
                    </div>
                    <div className="text-sm opacity-75 flex items-center justify-center">
                      {playlist.tracks.total} tracks
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {selectedPlaylist ? (
              <>
                {/* Playlist Header */}
                <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
                  <h2
                    className="text-2xl font-bold mb-2 text-white truncate"
                    title={selectedPlaylist.name}
                  >
                    {selectedPlaylist.name}
                  </h2>

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <span className="text-gray-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      {tracks.length} tracks loaded
                    </span>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleShuffleAndApply}
                        disabled={tracks.length === 0 || isShuffling}
                        className={`px-6 py-3 rounded-lg font-medium flex items-center gap-3 transition-all duration-200 shadow-lg ${
                          tracks.length > 0 && !isShuffling
                            ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-green-600/25"
                            : "bg-gray-700 text-gray-400 cursor-not-allowed opacity-50"
                        }`}
                      >
                        {isShuffling ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Shuffling...
                          </>
                        ) : (
                          <>🎲 Shuffle & Apply</>
                        )}
                      </button>

                      {shuffleSuccess && (
                        <span className="text-green-400 font-semibold flex items-center gap-2 animate-fade-in">
                          ✅ Shuffle Success!
                        </span>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 p-4 bg-red-900/30 border border-red-500/30 text-red-200 rounded-lg backdrop-blur-sm">
                      <span className="flex items-center gap-2">
                        ❌ {error}
                      </span>
                    </div>
                  )}
                </div>

                {/* Track List */}
                <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-xl overflow-hidden">
                  <div className="max-h-[560px] overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-green-600">
                    {(shuffledTracks.length > 0 ? shuffledTracks : tracks).map(
                      (track, index) => (
                        <div
                          key={`${track.id}-${index}`}
                          className={`flex items-center p-1 hover:bg-gray-700/30 transition-colors duration-200 border-b border-gray-700/20 last:border-b-0 ${
                            shuffledTracks.length > 0 ? "bg-green-900/10" : ""
                          }`}
                        >
                          <span
                            className={`min-w-[40px] text-center font-bold text-lg flex-shrink-0 ${
                              shuffledTracks.length > 0
                                ? "text-green-400"
                                : "text-gray-500"
                            }`}
                          >
                            {index + 1}
                          </span>

                          {track.album.images[0] && (
                            <img
                              src={track.album.images[0].url}
                              alt={track.album.name}
                              className="w-10 h-10 rounded-lg ml-4 shadow-md flex-shrink-0"
                            />
                          )}

                          <div className="flex-1 ml-4 min-w-0">
                            <div
                              className="text-white font-semibold truncate text-lg"
                              title={track.name}
                            >
                              {track.name}
                            </div>
                            <div
                              className="text-gray-400 truncate"
                              title={track.artists
                                .map((artist) => artist.name)
                                .join(", ")}
                            >
                              {track.artists
                                .map((artist) => artist.name)
                                .join(", ")}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-12 border border-gray-700/30 shadow-xl text-center">
                <div className="space-y-4">
                  <div className="text-6xl mb-4">🎵</div>
                  <h2 className="text-2xl font-bold text-gray-200">
                    Select a Playlist
                  </h2>
                  <p className="text-gray-400 text-lg">
                    Choose a playlist from the sidebar to start shuffling!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
