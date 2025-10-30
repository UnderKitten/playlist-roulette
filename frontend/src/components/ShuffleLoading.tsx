interface ShuffleLoadingOverlayProps {
  isVisible: boolean;
}

const ShuffleLoadingOverlay = ({ isVisible }: ShuffleLoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
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
  );
};

export default ShuffleLoadingOverlay;
