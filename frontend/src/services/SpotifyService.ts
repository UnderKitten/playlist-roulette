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
    const response = await fetch(`${SPOTIFY_BASE_URL}/me/playlists`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error fetching user playlists: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items;
  }

  async getPlaylistTracks(playlistId: string): Promise<SpotifyTrack[]> {
    const allTracks: SpotifyTrack[] = [];
    let url = `${SPOTIFY_BASE_URL}/playlists/${playlistId}/tracks?limit=100`;

    while (url) {
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(
          `Error fetching playlist tracks: ${response.statusText}`
        );
      }

      const data = await response.json();
      const tracks = data.items.map((item: any) => item.track);
      allTracks.push(...tracks);

      url = data.next;
    }

    return allTracks;
  }

  async replacePlaylistTracks(
    playlistId: string,
    trackUris: string[],
    onProgress?: (current: number, total: number) => void
  ): Promise<void> {
    const totalBatches = Math.ceil(trackUris.length / 100);
    let currentBatch = 0;

    const firstBatch = trackUris.slice(0, 100);

    const response = await fetch(
      `${SPOTIFY_BASE_URL}/playlists/${playlistId}/tracks`,
      {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          uris: firstBatch,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update playlist: ${response.statusText}`);
    }

    currentBatch++;
    if (onProgress) {
      onProgress(currentBatch, totalBatches);
    }

    if (trackUris.length > 100) {
      for (let i = 100; i < trackUris.length; i += 100) {
        const batch = trackUris.slice(i, i + 100);

        const addResponse = await fetch(
          `${SPOTIFY_BASE_URL}/playlists/${playlistId}/tracks`,
          {
            method: "POST",
            headers: this.getAuthHeaders(),
            body: JSON.stringify({
              uris: batch,
            }),
          }
        );

        if (!addResponse.ok) {
          throw new Error(
            `Failed to add tracks to playlist: ${addResponse.statusText}`
          );
        }

        currentBatch++;
        if (onProgress) {
          onProgress(currentBatch, totalBatches);
        }
      }
    }
  }

  async shuffleAndApplyPlaylist(
    playlistId: string,
    tracks: SpotifyTrack[],
    onProgress?: (current: number, total: number) => void
  ): Promise<SpotifyTrack[]> {
    const shuffledTracks = this.shuffleArray(tracks);

    const trackUris = this.getTrackUris(shuffledTracks);

    await this.replacePlaylistTracks(playlistId, trackUris, onProgress);

    return shuffledTracks;
  }

  getTrackUris(tracks: SpotifyTrack[]): string[] {
    return tracks.map((track) => `spotify:track:${track.id}`);
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
