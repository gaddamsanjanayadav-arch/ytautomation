export default function HeroSection() {
  // Creative Logo Component
  const CreativeLogo = () => (
    <div className="mb-8 flex justify-center">
      <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-1 shadow-2xl transform hover:scale-105 transition-transform duration-300">
        <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
          <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Music note combined with play button */}
            <path d="M30 80 Q30 50 35 40" stroke="url(#grad1)" strokeWidth="4" fill="none" strokeLinecap="round"/>
            <path d="M50 70 Q50 30 55 20" stroke="url(#grad1)" strokeWidth="4" fill="none" strokeLinecap="round"/>
            <path d="M70 75 Q70 45 75 35" stroke="url(#grad1)" strokeWidth="4" fill="none" strokeLinecap="round"/>
            <circle cx="35" cy="90" r="6" fill="url(#grad1)"/>
            <circle cx="55" cy="80" r="6" fill="url(#grad1)"/>
            <circle cx="75" cy="85" r="6" fill="url(#grad1)"/>
            {/* Play triangle */}
            <polygon points="50,35 65,45 65,55" fill="url(#grad2)" opacity="0.8"/>
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#0ea5e9', stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-950 flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Creative Logo */}
        <CreativeLogo />

        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in leading-tight">
          🎵 Mixtape
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"> Creator</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto animate-slide-up leading-relaxed">
          Transform your audio files into professional YouTube videos with AI-generated descriptions and stunning visuals
        </p>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 animate-slide-up">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-400/30 rounded-xl p-6 hover:border-blue-400/60 transition-all duration-300">
            <div className="text-3xl mb-3">🎵</div>
            <h3 className="text-white font-semibold mb-2">Smooth Blending</h3>
            <p className="text-gray-400 text-sm">Cross-fade transitions between tracks</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-6 hover:border-cyan-400/60 transition-all duration-300">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-white font-semibold mb-2">Auto Descriptions</h3>
            <p className="text-gray-400 text-sm">AI-generated YouTube descriptions with timestamps</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6 hover:border-purple-400/60 transition-all duration-300">
            <div className="text-3xl mb-3">🎬</div>
            <h3 className="text-white font-semibold mb-2">HD Videos</h3>
            <p className="text-gray-400 text-sm">1280x720 MP4 ready for upload</p>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap animate-slide-up">
          <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-300 px-4 py-2 rounded-full text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            ✨ Drag & Drop Upload
          </div>
          <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 text-blue-300 px-4 py-2 rounded-full text-sm">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            📊 Real-time Progress
          </div>
          <div className="flex items-center gap-2 bg-purple-500/20 border border-purple-500/40 text-purple-300 px-4 py-2 rounded-full text-sm">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            🌙 Dark Mode
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}
