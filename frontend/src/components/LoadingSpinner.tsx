interface LoadingSpinnerProps {
  message?: string;
  subMessage?: string;
}

const LoadingSpinner = ({ message = "Loading...", subMessage }: LoadingSpinnerProps) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full mx-auto"></div>
        <h2 className="text-2xl font-bold text-white">{message}</h2>
        {subMessage && <p className="text-gray-300">{subMessage}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
