interface DashboardHeaderProps {
  userName?: string;
  onLogout: () => void;
  isDisabled?: boolean;
}

const DashboardHeader = ({ userName, onLogout, isDisabled = false }: DashboardHeaderProps) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-2xl">
      <div className="mb-4 md:mb-0">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
          🎵 Playlist Roulette
        </h1>
        {userName && (
          <p className="text-gray-300 text-lg">
            Welcome back,{" "}
            <span className="text-green-400 font-semibold">{userName}</span>!
          </p>
        )}
      </div>
      <button
        onClick={onLogout}
        disabled={isDisabled}
        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg ${
          isDisabled
            ? "bg-gray-700 text-gray-400 cursor-not-allowed opacity-50"
            : "bg-red-600 hover:bg-red-700 text-white hover:shadow-xl hover:scale-105"
        }`}
      >
        Logout
      </button>
    </header>
  );
};

export default DashboardHeader;
