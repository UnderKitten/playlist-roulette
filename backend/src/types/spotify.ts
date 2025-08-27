export interface SpotifyTokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: {
    total: number;
  };
  owner: {
    display_name: string;
  };
}
