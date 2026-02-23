export default function TracklistPreview({ tracks, isLoading }) {
  if (!tracks || tracks.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 sm:p-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Step 2: Tracklist Preview
      </h3>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {tracks.map((track, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white truncate">
                {track.title || track.name || `Track ${index + 1}`}
              </p>
              {track.artist && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Artist: {track.artist}
                </p>
              )}
              {track.duration && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Duration: {track.duration}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          <span className="font-semibold">{tracks.length}</span> song
          {tracks.length !== 1 ? 's' : ''} ready for processing
        </p>
      </div>
    </div>
  );
}
