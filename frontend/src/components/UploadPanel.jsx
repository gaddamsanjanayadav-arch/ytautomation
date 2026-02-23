import { useState } from 'react';

export default function UploadPanel({ onFilesSelected, isLoading }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const processFiles = (selectedFiles) => {
    const audioFiles = selectedFiles.filter((file) =>
      file.type.startsWith('audio/')
    );
    
    if (audioFiles.length > 0) {
      const updatedFiles = [...files, ...audioFiles];
      setFiles(updatedFiles);
      onFilesSelected(updatedFiles);
    } else {
      alert('Please select audio files only (MP3, WAV, OGG, M4A, etc.)');
    }
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  const getTotalDuration = () => {
    return (files.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(1);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-8 sm:p-10 border border-gray-200 dark:border-slate-700">
      <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
        📁 Step 1: Upload Your Tracks
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Add 2-10 audio files to create your mixtape
      </p>

      {/* Drag and Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-3 border-dashed rounded-xl p-12 sm:p-16 text-center transition-all duration-300 cursor-pointer overflow-hidden ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-lg'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/10'
        }`}
      >
        {/* Background gradient effect */}
        <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${isDragActive ? 'opacity-100' : ''}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5"></div>
        </div>

        <input
          type="file"
          multiple
          accept="audio/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />

        <div className="pointer-events-none relative z-10">
          {isDragActive ? (
            <>
              <div className="relative">
                <svg
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 text-blue-500 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="text-xl text-blue-600 dark:text-blue-400 font-bold">
                Drop your tracks here! 🎵
              </p>
              <p className="text-blue-500 dark:text-blue-400 text-sm mt-2">
                They'll be added to your mashup
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <svg
                    className="w-20 h-20 sm:w-24 sm:h-24 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                  {/* Floating music notes icon */}
                  <div className="absolute -top-3 -right-3 text-2xl">🎵</div>
                </div>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 font-bold">
                Drag and drop your audio files here
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 mb-4">
                or click to select files (MP3, WAV, OGG, M4A)
              </p>
              <div className="flex gap-2 justify-center text-xs text-gray-500 dark:text-gray-400">
                <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">Max 2GB per file</span>
                <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">Multiple formats</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {files.length}
              </span>
              Selected Files
            </h4>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">{getTotalDuration()} MB</span> total
            </div>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-slate-600 group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {index + 1}. {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-3 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  disabled={isLoading}
                  title="Remove file"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* File stats */}
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800/50">
            <p className="text-sm text-green-700 dark:text-green-400">
              <span className="font-semibold">✅ Ready to process:</span> {files.length} {files.length === 1 ? 'file' : 'files'} ({getTotalDuration()} MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
