import { useState } from 'react';

export default function GenerateButton({ isLoading, onGenerate, hasFiles }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-8 sm:p-10 border border-gray-200 dark:border-slate-700">
      <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-3">
        🚀 Step 2: Generate Your Mixtape
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm">
        {hasFiles 
          ? `Ready to process ${hasFiles === 1 ? '1 file' : `${hasFiles} files`}` 
          : 'Upload audio files to get started'
        }
      </p>

      <div className="flex flex-col items-center gap-8 mt-8">
        {/* Info cards */}
        {hasFiles > 0 && !isLoading && (
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800/50">
              <div className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase tracking-wide">Files Ready</div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">{hasFiles}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800/50">
              <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide">Processing</div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">~2-3m</div>
            </div>
          </div>
        )}

        {/* Main button */}
        <button
          onClick={onGenerate}
          disabled={isLoading || !hasFiles}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`relative group w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
            isLoading || !hasFiles
              ? 'cursor-not-allowed opacity-75'
              : 'cursor-pointer'
          }`}
        >
          {/* Animated gradient background */}
          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 transition-all duration-500 ${
            isLoading ? 'animate-pulse' : hovered ? 'shadow-xl shadow-purple-500/50' : 'shadow-lg'
          }`} />
          
          {/* Shine effect on hover */}
          {!isLoading && hasFiles && (
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-opacity duration-500 ${
              hovered ? 'opacity-30 animate-pulse' : ''
            }`} />
          )}
          
          {/* Button content */}
          <div className="relative flex items-center justify-center gap-3 text-white">
            {isLoading ? (
              <>
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="font-bold">Processing Your Mixtape...</span>
              </>
            ) : !hasFiles ? (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-6-4m6 4l6-4" />
                </svg>
                <span>Upload Files First</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                </svg>
                <span className="font-bold">Generate Video</span>
              </>
            )}
          </div>
        </button>

        {/* Processing info */}
        {!isLoading && hasFiles > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4 text-sm text-blue-700 dark:text-blue-300 text-center max-w-md">
            <span className="font-semibold">💡 Tip:</span> The process creates a smooth mixtape with AI-generated YouTube descriptions. Total time depends on file sizes.
          </div>
        )}

        {isLoading && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 text-sm text-amber-700 dark:text-amber-300 text-center max-w-md">
            <span className="font-semibold">⏳ Processing:</span> Please don't close this window. This typically takes 2-3 minutes.
          </div>
        )}
      </div>
    </div>
  );
}
