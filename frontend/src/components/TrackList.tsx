import { type SpotifyTrack } from "../services/SpotifyService";

interface TrackListProps {
  tracks: SpotifyTrack[];
  isShuffled?: boolean;
}

const TrackList = ({ tracks, isShuffled = false }: TrackListProps) => {
  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-xl overflow-hidden">
      <div className="max-h-[560px] overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-green-600">
        {tracks.map((track, index) => (
          <div
            key={`${track.id}-${index}`}
            className={`flex items-center p-1 hover:bg-gray-700/30 transition-colors duration-200 border-b border-gray-700/20 last:border-b-0 ${
              isShuffled ? "bg-green-900/10" : ""
            }`}
          >
            <span
              className={`min-w-[40px] text-center font-bold text-lg flex-shrink-0 ${
                isShuffled ? "text-green-400" : "text-gray-500"
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
              <div className="text-white font-semibold truncate text-lg" title={track.name}>
                {track.name}
              </div>
              <div
                className="text-gray-400 truncate"
                title={track.artists.map((artist) => artist.name).join(", ")}
              >
                {track.artists.map((artist) => artist.name).join(", ")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackList;
