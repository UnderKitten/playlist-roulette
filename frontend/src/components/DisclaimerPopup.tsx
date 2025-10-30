interface DisclaimerPopupProps {
  isOpen: boolean;
  onAccept: () => void;
}

const DisclaimerPopup = ({ isOpen, onAccept }: DisclaimerPopupProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />

      <div className="relative bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Important Notice
          </h2>
        </div>

        <div className="text-gray-300 space-y-4 mb-8">
          <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 border border-gray-600">
            <p className="text-sm leading-relaxed">
              <span className="text-yellow-400 font-medium">
                ⚠️ Please read carefully:
              </span>
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span>
                  <strong>Liked Songs cannot be shuffled</strong> - only regular
                  playlists
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span>
                  <strong>Shuffling is permanent</strong> - changes cannot be
                  undone
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span>
                  <strong>Create backups first</strong> if you want to preserve
                  original order
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span>
                  <strong>Use at your own risk</strong> - I am not responsible
                  for your Spotify account
                </span>
              </li>
            </ul>
          </div>

          <p className="text-xs text-gray-400 text-center">
            By continuing, you acknowledge that you understand these limitations
            and accept full responsibility for any changes to your playlists.
          </p>
        </div>

        <button
          onClick={onAccept}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          I Understand - Continue
        </button>
      </div>
    </div>
  );
};

export default DisclaimerPopup;
