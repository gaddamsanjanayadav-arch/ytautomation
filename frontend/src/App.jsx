import { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import StepIndicator from './components/StepIndicator';
import UploadPanel from './components/UploadPanel';
import TracklistPreview from './components/TracklistPreview';
import GenerateButton from './components/GenerateButton';
import DescriptionSection from './components/DescriptionSection';
import UploadProgressIndicator from './components/UploadProgressIndicator';
import { generateVideo, downloadVideo } from './services/api';
import './App.css';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [videoPath, setVideoPath] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  const handleFilesSelected = (files) => {
    setSelectedFiles(files);
    setCurrentStep(1);
    setErrorMessage('');
  };

  const handleGenerate = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Please upload at least one audio file');
      return;
    }

    setIsLoading(true);
    setShowProgress(true);
    setErrorMessage('');
    setUploadProgress(0);

    try {
      console.log(`🚀 Starting video generation with ${selectedFiles.length} file(s)...`);
      
      // Simulate initial progress
      await new Promise(resolve => setTimeout(resolve, 500));
      setUploadProgress(10);

      // Call the API with song files and progress callback
      const response = await generateVideo(
        selectedFiles,
        (progress) => {
          console.log(`📊 Progress: ${progress}%`);
          setUploadProgress(Math.min(progress, 95)); // Cap at 95% until complete
        }
      );

      console.log('✅ Response from backend:', response);
      setUploadProgress(100);

      // Handle response
      if (response.description) {
        console.log('📝 Description received');
        setGeneratedDescription(response.description);
      }

      if (response.video_path) {
        console.log(`🎬 Video path: ${response.video_path}`);
        setVideoPath(response.video_path);
        setCurrentStep(4);
      } else if (response.description) {
        setCurrentStep(3); // Go to review step if no video path but description exists
      }

      // Auto close progress modal after 2 seconds
      setTimeout(() => {
        setShowProgress(false);
        setIsLoading(false);
      }, 2000);

    } catch (error) {
      console.error('❌ Error:', error);
      setErrorMessage(error.message || 'Failed to generate video');
      setUploadProgress(0);
      setIsLoading(false);
      setTimeout(() => {
        setShowProgress(false);
      }, 2000);
    }
  };

  const handleDownload = () => {
    if (videoPath) {
      console.log(`📥 Starting download: ${videoPath}`);
      try {
        downloadVideo(videoPath);
      } catch (error) {
        setErrorMessage(`Download error: ${error.message}`);
      }
    } else {
      setErrorMessage('No video to download');
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 min-h-screen">
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm4 2v4h8V8H6z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                YouTube Mixtape
              </h1>
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.293 2.293a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828 2.828a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 7a3 3 0 110 6 3 3 0 010-6zm0 1a2 2 0 100 4 2 2 0 000-4zm4.464 1.536a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828-2.828a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM13 10a1 1 0 110 2h1a1 1 0 110-2h-1zm1.464 1.536a1 1 0 01-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM9 16a1 1 0 110 2v1a1 1 0 11-2 0v-1a1 1 0 012-1zm0 1a3 3 0 110-6 3 3 0 010 6zm0 2a1 1 0 110-2 1 1 0 010 2z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <HeroSection />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Step Indicator */}
          <div className="mb-12">
            <StepIndicator currentStep={currentStep} />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Step 1: Upload */}
            {currentStep >= 1 && (
              <div className="animate-fade-in">
                <UploadPanel
                  onFilesSelected={handleFilesSelected}
                  isLoading={isLoading}
                />
              </div>
            )}

            {/* Step 2: Tracklist Preview */}
            {currentStep >= 1 && selectedFiles.length > 0 && (
              <div className="animate-fade-in">
                <TracklistPreview tracks={selectedFiles} isLoading={isLoading} />
              </div>
            )}

            {/* Step 2: Generate */}
            {currentStep === 1 && selectedFiles.length > 0 && (
              <div className="animate-fade-in">
                <GenerateButton
                  isLoading={isLoading}
                  onGenerate={handleGenerate}
                  hasFiles={selectedFiles.length > 0}
                />
              </div>
            )}

            {/* Step 3: Description */}
            {currentStep >= 3 && generatedDescription && (
              <div className="animate-fade-in">
                <DescriptionSection
                  description={generatedDescription}
                  isLoading={isLoading}
                  onDownload={handleDownload}
                />
              </div>
            )}

            {/* Success Message */}
            {currentStep === 4 && videoPath && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800 rounded-lg p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-green-900 dark:text-green-100">
                    Video Generated Successfully!
                  </h3>
                </div>
                <p className="text-green-800 dark:text-green-200">
                  Your YouTube video is ready for download. Click the button above to download your video file.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Indicator Modal */}
        <UploadProgressIndicator
          progress={uploadProgress}
          isVisible={showProgress}
        />

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  About
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automate your YouTube video creation workflow with AI-powered descriptions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Features
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Drag & drop upload</li>
                  <li>AI descriptions</li>
                  <li>One-click download</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Status
                </h4>
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Backend Connected
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>&copy; 2024 YouTube Mixtape. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
