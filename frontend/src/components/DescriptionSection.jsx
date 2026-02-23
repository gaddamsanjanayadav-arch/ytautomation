import { useState, useRef } from 'react';

export default function DescriptionSection({ description, isLoading, onDownload }) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const textareaRef = useRef(null);

  const handleCopyToClipboard = async () => {
    if (textareaRef.current) {
      try {
        await navigator.clipboard.writeText(textareaRef.current.value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  if (!description) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-8 sm:p-10 border border-gray-200 dark:border-slate-700">
      <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-2">
        ✨ Step 3: YouTube Description
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Your AI-generated description with timestamps, ready to paste on YouTube
      </p>

      {/* Description Textarea */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            📝 Generated Description
          </label>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {description.length} characters
          </span>
        </div>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={description}
            readOnly
            className="w-full h-72 p-5 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm leading-relaxed"
          />
          {/* Corner indicator */}
          <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500 font-semibold">
            Read-only
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4 flex gap-3">
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
        </svg>
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-semibold">Pro Tip:</p>
          <p className="text-xs mt-1">Copy this description and paste it into your YouTube video details. The timestamps help viewers find their favorite tracks!</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Copy button */}
        <button
          onClick={handleCopyToClipboard}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 flex-1 sm:flex-initial ${
            copied
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-5 h-5 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Copied to Clipboard!
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 011 1v1h2V4a2 2 0 10-4 0v-.5H8v.5a1 1 0 011-1h2a1 1 0 011 1v1h2V4a2 2 0 10-4 0V3H8zm3 0v1h2V3H11zm0 5a2 2 0 104 0 2 2 0 00-4 0z" />
              </svg>
              Copy Description
            </>
          )}
        </button>

        {/* Download button */}
        <button
          onClick={onDownload}
          disabled={isLoading}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`relative flex items-center justify-center gap-3 px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 flex-1 sm:flex-initial overflow-hidden group ${
            isLoading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {/* Animated gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 transition-all duration-500 ${
            hovered && !isLoading ? 'shadow-xl shadow-green-500/50' : 'shadow-lg'
          }`} />
          
          {/* Content */}
          <div className="relative flex items-center justify-center gap-3 text-white">
            {isLoading ? (
              <>
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="font-bold">Preparing Download...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm8-5a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
                <span>Step 4: Download Video</span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Character count info */}
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
        </svg>
        <span>YouTube Description Length: {description.length} characters of {5000} max</span>
      </div>
    </div>
  );
}
