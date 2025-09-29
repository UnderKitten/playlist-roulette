const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string; height: number; width: number }>;
  tracks: { total: number };
  external_urls: { spotify: string };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: { name: string; images: Array<{ url: string }> };
  external_urls: { spotify: string };
}

class SpotifyService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("spotify_access_token");
    if (!token) {
      throw new Error("No Spotify access token found");
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  async getCurrentUser() {
    const response = await fetch(`${SPOTIFY_BASE_URL}/me`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error fetching user profile: ${response.statusText}`);
    }

    return response.json();
  }

  async getUserPlaylists(): Promise<SpotifyPlaylist[]> {
    const response = await fetch(`${SPOTIFY_BASE_URL}/me/playlists?limit=50`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error fetching user playlists: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items;
  }

  async getPlaylistTracks(playlistId: string): Promise<SpotifyTrack[]> {
    const response = await fetch(
      `${SPOTIFY_BASE_URL}/playlists/${playlistId}/tracks`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching playlist tracks: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items.map((item: any) => item.track);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem("spotify_access_token");
    const expiresAt = localStorage.getItem("spotify_expires_at");
    if (!token || !expiresAt) {
      return false;
    }

    return new Date().getTime() < parseInt(expiresAt);
  }

  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

export const spotifyService = new SpotifyService();