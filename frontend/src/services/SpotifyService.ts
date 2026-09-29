const SPOTIFY_BASE_URL = import.meta.env.VITE_SPOTIFY_BASE_URL;
const MAX_RETRY_WAIT_MS = 60 * 1000;
const MOVE_DELAY_MS = 100;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

  private async fetchWithRetry(
    url: string,
    init: RequestInit,
    maxRetries: number = 5,
  ): Promise<Response> {
    for (let attempt = 0; ;attempt++) {
      const response = await fetch(url, init);

      const shouldRetry = response.status ===429 || response.status >= 500;
      if(!shouldRetry || attempt >= maxRetries) {
        return response;
      }

      const retryAfterSeconds = Number(response.headers.get("Retry-After"));
      const waitTime = retryAfterSeconds ? retryAfterSeconds * 1000 : 1000 * Math.pow(2, attempt);

      if(waitTime > MAX_RETRY_WAIT_MS) {
        return response;
      }

      await sleep(waitTime);
    }
  }

  private async moveTrack(
    playlistId: string,
    from: number,
    to: number,
    snapshotId?: string
  ): Promise<string> {
    const response = await this.fetchWithRetry(
      `${SPOTIFY_BASE_URL}/playlists/${playlistId}/tracks`,
      {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          range_start: from,
          insert_before: to,
          range_length: 1,
          snapshot_id: snapshotId,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to move track: ${response.statusText}`);
    }

    const data = await response.json();
    return data.snapshot_id;
  }
  

  async shuffleAndApplyPlaylist(
    playlistId: string,
    tracks: SpotifyTrack[],
    onProgress?: (current: number, total: number) => void,
  ): Promise<SpotifyTrack[]> {
    const order = [...tracks];
    const totalSteps = order.length - 1;
    let snapshotId: string | undefined;

    for (let i= 0; i< totalSteps; i++) {
      const j = i + Math.floor(Math.random() * (order.length - i));

      if(j !== i){
        try {
          snapshotId = await this.moveTrack(playlistId, j, i, snapshotId);
        } catch (error) {
          const reason = error instanceof Error ? error.message : "unknown error";
          throw new Error(
            `Shuffle stopped after ${i} of ${totalSteps}, ${reason}`
          );
        }
        const [moved] = order.splice(j, 1);
        order.splice(i, 0, moved);

        await sleep(MOVE_DELAY_MS);
      }
      onProgress?.(i+1,totalSteps);
    }
    return order;
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
