// src/components/Dashboard.tsx
import { useState, useEffect } from 'react';
import { spotifyService, type SpotifyPlaylist, type SpotifyTrack } from '../services/SpotifyService';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [shuffledTracks, setShuffledTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      if (!spotifyService.isAuthenticated()) {
        setError('Please login with Spotify first');
        return;
      }

      // Load user profile and playlists
      const [userProfile, userPlaylists] = await Promise.all([
        spotifyService.getCurrentUser(),
        spotifyService.getUserPlaylists()
      ]);

      setUser(userProfile);
      setPlaylists(userPlaylists);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistSelect = async (playlist: SpotifyPlaylist) => {
    try {
      setLoading(true);
      setSelectedPlaylist(playlist);
      
      const playlistTracks = await spotifyService.getPlaylistTracks(playlist.id);
      setTracks(playlistTracks);
      setShuffledTracks([]); // Reset shuffled tracks
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load playlist tracks');
    } finally {
      setLoading(false);
    }
  };

  const handleShuffle = () => {
    if (tracks.length === 0) return;
    
    const shuffled = spotifyService.shuffleArray(tracks);
    setShuffledTracks(shuffled);
  };

  const handleLogout = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_expires_at');
    window.location.href = '/';
  };

  if (loading && !user) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Loading...</h2>
        <p>Getting your Spotify data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.href = '/'}>
          Go back to home
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        borderBottom: '1px solid #333',
        paddingBottom: '1rem'
      }}>
        <div>
          <h1>🎵 Playlist Roulette</h1>
          {user && (
            <p>Welcome back, <strong>{user.display_name}</strong>!</p>
          )}
        </div>
        <button 
          onClick={handleLogout}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Playlists Sidebar */}
        <div>
          <h2>Your Playlists ({playlists.length})</h2>
          <div style={{ 
            maxHeight: '400px', 
            overflowY: 'auto',
            border: '1px solid #333',
            borderRadius: '4px'
          }}>
            {playlists.map(playlist => (
              <div
                key={playlist.id}
                onClick={() => handlePlaylistSelect(playlist)}
                style={{
                  padding: '0.75rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #222',
                  backgroundColor: selectedPlaylist?.id === playlist.id ? '#1db954' : 'transparent',
                  color: selectedPlaylist?.id === playlist.id ? 'white' : 'inherit'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{playlist.name}</div>
                <div style={{ fontSize: '0.9em', opacity: 0.8 }}>
                  {playlist.tracks.total} tracks
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {selectedPlaylist ? (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <h2>{selectedPlaylist.name}</h2>
                <p>{selectedPlaylist.description}</p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span>{tracks.length} tracks loaded</span>
                  <button
                    onClick={handleShuffle}
                    disabled={tracks.length === 0}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#1db954',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: tracks.length > 0 ? 'pointer' : 'not-allowed',
                      opacity: tracks.length > 0 ? 1 : 0.5
                    }}
                  >
                    🎲 Shuffle Playlist
                  </button>
                </div>
              </div>

              {/* Track List */}
              {(shuffledTracks.length > 0 ? shuffledTracks : tracks).map((track, index) => (
                <div
                  key={`${track.id}-${index}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.5rem',
                    marginBottom: '0.5rem',
                    backgroundColor: shuffledTracks.length > 0 ? '#1a472a' : '#222',
                    borderRadius: '4px',
                    gap: '1rem'
                  }}
                >
                  <span style={{ 
                    minWidth: '30px', 
                    fontWeight: 'bold',
                    color: shuffledTracks.length > 0 ? '#1db954' : '#666'
                  }}>
                    {index + 1}
                  </span>
                  {track.album.images[0] && (
                    <img
                      src={track.album.images[0].url}
                      alt={track.album.name}
                      style={{ width: '40px', height: '40px', borderRadius: '4px' }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>{track.name}</div>
                    <div style={{ fontSize: '0.9em', opacity: 0.8 }}>
                      {track.artists.map(artist => artist.name).join(', ')} • {track.album.name}
                    </div>
                  </div>
                  {/* <div style={{ fontSize: '0.9em', opacity: 0.6 }}>
                    {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                  </div> */}
                </div>
              ))}

              {shuffledTracks.length > 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#1a472a',
                  borderRadius: '4px',
                  color: '#1db954'
                }}>
                  ✨ Playlist shuffled! Enjoy your randomized music experience!
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2>Select a Playlist</h2>
              <p>Choose a playlist from the sidebar to start shuffling!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
