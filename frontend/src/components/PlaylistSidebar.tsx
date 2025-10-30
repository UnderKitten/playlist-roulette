import { type SpotifyPlaylist } from "../services/SpotifyService";

interface PlaylistSidebarProps {
  playlists: SpotifyPlaylist[];
  selectedPlaylistId?: string;
  onPlaylistSelect: (playlist: SpotifyPlaylist) => void;
  isDisabled?: boolean;
}

const PlaylistSidebar = ({
  playlists,
  selectedPlaylistId,
  onPlaylistSelect,
  isDisabled = false,
}: PlaylistSidebarProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-8 border border-gray-700/30 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">
          Your Playlists
          <span className="text-green-400 text-lg ml-2">({playlists.length})</span>
        </h2>
        <div className="max-h-[600px] overflow-y-auto space-y-3 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-green-600">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => !isDisabled && onPlaylistSelect(playlist)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:scale-[1.02]"
              } ${
                selectedPlaylistId === playlist.id
                  ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-600/25"
                  : "bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/30"
              }`}
            >
              <div className="font-semibold text-md truncate" title={playlist.name}>
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
  );
};

export default PlaylistSidebar;
