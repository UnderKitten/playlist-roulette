const EmptyPlaylistState = () => {
  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-12 border border-gray-700/30 shadow-xl text-center">
      <div className="space-y-4">
        <div className="text-6xl mb-4">🎵</div>
        <h2 className="text-2xl font-bold text-gray-200">Select a Playlist</h2>
        <p className="text-gray-400 text-lg">
          Choose a playlist from the sidebar to start shuffling!
        </p>
      </div>
    </div>
  );
};

export default EmptyPlaylistState;
