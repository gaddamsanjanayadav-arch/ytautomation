export default function UploadProgressIndicator({ progress, isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 sm:p-8 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Uploading Files
        </h3>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Text */}
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {progress}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {progress < 100 ? 'Uploading...' : 'Complete!'}
          </p>
        </div>

        {/* Animated dots */}
        {progress < 100 && (
          <div className="flex justify-center gap-2 mt-6">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>
    </div>
  );
}
