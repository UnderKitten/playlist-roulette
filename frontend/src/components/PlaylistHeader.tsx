interface PlaylistHeaderProps {
  playlistName: string;
  trackCount: number;
  onShuffle: () => void;
  isShuffling: boolean;
  shuffleSuccess: boolean;
  error?: string | null;
}

const PlaylistHeader = ({
  playlistName,
  trackCount,
  onShuffle,
  isShuffling,
  shuffleSuccess,
  error,
}: PlaylistHeaderProps) => {
  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
      <h2 className="text-2xl font-bold mb-2 text-white truncate" title={playlistName}>
        {playlistName}
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <span className="text-gray-400 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          {trackCount} tracks loaded
        </span>

        <div className="flex items-center gap-4">
          <button
            onClick={onShuffle}
            disabled={trackCount === 0 || isShuffling}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-3 transition-all duration-200 shadow-lg ${
              trackCount > 0 && !isShuffling
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
          <span className="flex items-center gap-2">❌ {error}</span>
        </div>
      )}
    </div>
  );
};

export default PlaylistHeader;
