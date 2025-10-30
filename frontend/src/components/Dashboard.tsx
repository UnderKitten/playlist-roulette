import { useState, useEffect } from "react";
import {
  spotifyService,
  type SpotifyPlaylist,
  type SpotifyTrack,
} from "../services/SpotifyService";
import LoadingSpinner from "./LoadingSpinner";
import ErrorDisplay from "./ErrorDisplay";
import ShuffleLoadingOverlay from "./ShuffleLoading";
import TrackLoadingOverlay from "./TrackLoadingOverlay";
import DashboardHeader from "./DashboardHeader";
import PlaylistSidebar from "./PlaylistSidebar";
import PlaylistHeader from "./PlaylistHeader";
import TrackList from "./TrackList";
import EmptyPlaylistState from "./EmptyPlaylistState";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] =
    useState<SpotifyPlaylist | null>(null);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [shuffledTracks, setShuffledTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTracks, setLoadingTracks] = useState(false);
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
    if (isShuffling || loadingTracks) return;

    try {
      setLoadingTracks(true);
      setSelectedPlaylist(playlist);
      setTracks([]);
      setShuffledTracks([]);

      const playlistTracks = await spotifyService.getPlaylistTracks(
        playlist.id
      );
      setTracks(playlistTracks);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load playlist tracks"
      );
    } finally {
      setLoadingTracks(false);
    }
  };

  const handleShuffleAndApply = async () => {
    if (!selectedPlaylist || tracks.length === 0 || loadingTracks) return;

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
    if (isShuffling || loadingTracks) return;

    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_expires_at");
    window.location.href = "/";
  };

  if (loading && !user) {
    return (
      <LoadingSpinner
        message="Loading..."
        subMessage="Getting your Spotify data..."
      />
    );
  }

  if (error && !user) {
    return <ErrorDisplay error={error} />;
  }

  const displayTracks = shuffledTracks.length > 0 ? shuffledTracks : tracks;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <ShuffleLoadingOverlay isVisible={isShuffling} />

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <DashboardHeader
          userName={user?.display_name}
          onLogout={handleLogout}
          isDisabled={isShuffling || loadingTracks}
        />

        <div className="grid grid-cols-1 xl:grid-cols-[500px_1fr] gap-8">
          <PlaylistSidebar
            playlists={playlists}
            selectedPlaylistId={selectedPlaylist?.id}
            onPlaylistSelect={handlePlaylistSelect}
            isDisabled={isShuffling || loadingTracks}
          />

          <div className="space-y-6">
            {selectedPlaylist ? (
              <>
                <PlaylistHeader
                  playlistName={selectedPlaylist.name}
                  trackCount={tracks.length}
                  onShuffle={handleShuffleAndApply}
                  isShuffling={isShuffling}
                  isLoadingTracks={loadingTracks}
                  shuffleSuccess={shuffleSuccess}
                  error={error}
                />
                {loadingTracks ? (
                  <TrackLoadingOverlay isVisible={true} />
                ) : (
                  <TrackList
                    tracks={displayTracks}
                    isShuffled={shuffledTracks.length > 0}
                  />
                )}
              </>
            ) : (
              <EmptyPlaylistState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
