interface ErrorDisplayProps {
  error: string;
  onBack?: () => void;
}

const ErrorDisplay = ({ error, onBack }: ErrorDisplayProps) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center p-8 bg-red-900/30 backdrop-blur-sm rounded-xl border border-red-500/20 max-w-md">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
        <p className="text-red-200 mb-6">{error}</p>
        <button
          onClick={onBack || (() => (window.location.href = "/"))}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
        >
          Go back to home
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
