import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 900000, // 15 minutes for long video processing operations
  headers: {
    'Accept': 'application/json',
  }
});

export const generateVideo = async (songs, onProgressUpdate) => {
  try {
    // Create FormData for multipart upload
    const formData = new FormData();
    
    songs.forEach((file) => {
      formData.append('files', file);
    });

    console.log(`📤 Uploading ${songs.length} file(s)...`);

    let lastProgressTime = Date.now();
    let progressStalled = false;

    const response = await apiClient.post('/generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        lastProgressTime = Date.now();
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`📊 Upload progress: ${percentCompleted}%`);
          // Upload phase: 0-30%
          if (onProgressUpdate) {
            onProgressUpdate(Math.min(30, (percentCompleted * 30) / 100));
          }
        }
      },
      onDownloadProgress: (progressEvent) => {
        // Track download progress (response coming back)
        lastProgressTime = Date.now();
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`📊 Download progress: ${percentCompleted}%`);
          // Download phase: 90-100%
          if (onProgressUpdate) {
            onProgressUpdate(90 + (percentCompleted * 10) / 100);
          }
        }
      },
    });

    console.log('✅ Video generation successful:', response.data);
    return response.data;

  } catch (error) {
    console.error('❌ Error generating video:', error);
    
    // Provide helpful error messages
    let message = 'Failed to generate video';
    
    if (error.response?.status === 408) {
      message = 'Request timeout - video processing took too long. Try with shorter audio files.';
    } else if (error.response?.status === 413) {
      message = 'File size too large. Maximum 2GB per file.';
    } else if (error.response?.status === 500) {
      message = error.response?.data?.detail || 'Server error during video generation.';
    } else if (error.code === 'ECONNABORTED') {
      message = 'Connection timeout - backend is not responding.';
    } else if (error.message === 'Network Error') {
      message = 'Backend is not running. Start it with: python run.py';
    } else {
      message = error.response?.data?.detail || error.message || message;
    }
    
    throw new Error(message);
  }
};

export const downloadVideo = (videoPath) => {
  try {
    // videoPath is like "/download/final_video.mp4"
    const downloadUrl = `${API_BASE_URL}${videoPath}`;
    
    console.log(`📥 Downloading from: ${downloadUrl}`);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = videoPath.split('/').pop() || 'video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ Download started');
  } catch (error) {
    console.error('❌ Error downloading video:', error);
    throw new Error('Failed to download video');
  }
};

export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health');
    console.log('✅ Backend is running:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Backend is not running:', error.message);
    throw new Error('Backend is not running. Make sure to start it with: python run.py');
  }
};

export default apiClient;
