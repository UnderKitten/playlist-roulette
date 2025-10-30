interface TrackLoadingOverlayProps {
  isVisible: boolean;
}

const TrackLoadingOverlay = ({ isVisible }: TrackLoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-12 border border-gray-700/30 shadow-xl">
      <div className="text-center space-y-4">
        <div className="animate-spin w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full mx-auto"></div>
        <h2 className="text-2xl font-bold text-gray-200">Loading Tracks...</h2>
        <p className="text-gray-400 text-lg">Fetching playlist tracks from Spotify</p>
      </div>
    </div>
  );
};

export default TrackLoadingOverlay;
