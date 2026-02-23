# 🎬 YouTube Mixtape

**Create professional mixtape videos from audio files with AI-generated descriptions and smooth transitions.**

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![FastAPI](https://img.shields.io/badge/FastAPI-latest-009485)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- 🎵 **Drag & Drop Upload** - Easily upload multiple MP3 files
- 🎨 **Smooth Transitions** - Cross-fade audio blending between tracks
- 📝 **AI Descriptions** - Auto-generated YouTube descriptions with timestamps
- 🎬 **Video Generation** - Creates HD (1280x720) MP4 videos with cover art
- 🌙 **Dark Mode** - Beautiful dark theme UI
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Progress Tracking** - Real-time upload and processing progress

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- FFmpeg (installed and in PATH)

### Setup (2 minutes)

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
pip install -r requirements.txt

# Run system check
python init_system.py

# Start backend server
python run.py
```

In a **second terminal**:

```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start development server
npm run dev
```

### Open Browser

Navigate to `http://localhost:5173` and start creating mixtapes! 🎵

---

## 📚 Architecture

### Backend Stack
- **Framework**: FastAPI + Uvicorn
- **Audio**: PyDub (mixing), SciPy (filtering)
- **Video**: FFmpeg (encoding)
- **Image**: Pillow (resizing)

**Key Services**:
- `AudioService` - Blends songs with fade transitions
- `DescriptionService` - Generates YouTube descriptions
- `VideoService` - Creates MP4 videos

**API Endpoints**:
- `POST /generate` - Upload audio files and generate video
- `GET /download/{filename}` - Download generated video
- `GET /health` - Health check

See [BACKEND_ARCHITECTURE.md](BACKEND_ARCHITECTURE.md) for detailed backend information.

### Frontend Stack
- **Framework**: React 18.2 + Vite
- **Styling**: Tailwind CSS 3.4
- **HTTP**: Axios
- **State**: React Hooks

**Components**:
- `HeroSection` - Landing section with gradient
- `StepIndicator` - 4-step progress tracker
- `UploadPanel` - File drag-and-drop
- `TracklistPreview` - Selected songs list
- `GenerateButton` - Action button with loading
- `DescriptionSection` - Generated content display
- `UploadProgressIndicator` - Progress modal

See [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md) for detailed frontend information.

---

## 📖 Workflow

```
Upload Audio Files
        ↓
Drag & Drop to Queue
        ↓
Click Generate Video
        ↓
Backend Processing:
  ├─ Mix Audio (PyDub)
  ├─ Generate Description
  └─ Create Video (FFmpeg)
        ↓
View Description & Download
        ↓
Use on YouTube! 🎥
```

---

## 🛠️ Development

### Backend (see BACKEND_ARCHITECTURE.md)

```bash
cd backend
python run.py  # Starts on http://127.0.0.1:8000
```

Services are located in `app/services/`:
- `audio_service.py` - Audio mixing logic
- `description_service.py` - Description generation
- `video_service.py` - Video creation

### Frontend (see FRONTEND_ARCHITECTURE.md)

```bash
cd frontend
npm run dev    # Starts on http://localhost:5173
npm run build  # Production build
```

Components are located in `src/components/`:
- `HeroSection.jsx`
- `StepIndicator.jsx`
- `UploadPanel.jsx`
- `TracklistPreview.jsx`
- `GenerateButton.jsx`
- `DescriptionSection.jsx`
- `UploadProgressIndicator.jsx`

---

## 🎯 Key Features Explained

### Audio Mixing
- Loads all uploaded MP3 files
- Standardizes to 44100 Hz, 2-channel audio
- Creates 2-second cross-fade transitions
- Applies low-pass filter (4000 Hz) to fade regions
- Outputs combined mixtape as MP3

### Description Generation
- Extracts track duration from audio
- Creates timestamps for each song
- Formats YouTube-ready description
- Includes artist name, hashtags, CTAs
- Displays total mix duration

### Video Creation
- Uses cover image (static/image.png)
- Resizes to 1280x720 HD
- Combines with audio using FFmpeg
- Creates H.264 encoded MP4
- Optimized for YouTube upload

---

## 🐛 Troubleshooting

### FFmpeg not found
```bash
# Windows
choco install ffmpeg

# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg
```

### Backend won't start
```bash
cd backend
python init_system.py  # Verify all dependencies
python run.py          # Check console output
```

### Frontend shows blank
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### CORS errors
Ensure backend is running on `http://127.0.0.1:8000`

---

## 📦 Project Structure

```
youtube_mixtape/
│
├── README.md                          # This file
├── BACKEND_ARCHITECTURE.md            # Backend details
├── FRONTEND_ARCHITECTURE.md           # Frontend details
│
├── backend/                           # FastAPI Application
│   ├── app/
│   │   ├── main.py                   # FastAPI app setup
│   │   ├── api/routes.py             # API endpoints
│   │   ├── services/                 # Business logic
│   │   │   ├── audio_service.py      # Audio mixing
│   │   │   ├── description_service.py # Description generation
│   │   │   └── video_service.py      # Video creation
│   │   └── core/config.py            # Configuration
│   ├── run.py                        # Server entry point
│   ├── requirements.txt              # Python dependencies
│   ├── init_system.py                # System setup script
│   ├── static/image.png              # Cover art template
│   └── uploads/                      # Temp upload folder
│
├── frontend/                          # React Application
│   ├── src/
│   │   ├── App.jsx                   # Main component
│   │   ├── components/               # UI components
│   │   │   ├── HeroSection.jsx
│   │   │   ├── StepIndicator.jsx
│   │   │   ├── UploadPanel.jsx
│   │   │   ├── TracklistPreview.jsx
│   │   │   ├── GenerateButton.jsx
│   │   │   ├── DescriptionSection.jsx
│   │   │   └── UploadProgressIndicator.jsx
│   │   ├── services/api.js           # HTTP client
│   │   ├── index.css                 # Tailwind directives
│   │   └── main.jsx                  # React entry point
│   ├── package.json                  # Dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind config
│   └── postcss.config.js            # PostCSS config
│
└── djenv/                             # Python virtual environment
```

---

## 🔧 Configuration

**Backend Environment** (`backend/`):
- Auto-detects Python virtual environment
- Creates `uploads/`, `static/` directories
- Stores output files in backend root

**Frontend Environment** (`frontend/`):
- Vite development proxy to backend
- Dark mode persisted in localStorage
- Responsive breakpoints: mobile, tablet, desktop

---

## 📝 API Reference

### POST /generate
Generate mixtape video from audio files

**Request**:
```bash
curl -X POST http://127.0.0.1:8000/generate \
  -F "files=@song1.mp3" \
  -F "files=@song2.mp3"
```

**Response**:
```json
{
  "status": "success",
  "video_path": "/download/final_video.mp4",
  "video_filename": "final_video.mp4",
  "description": "🎧 Mixtape\n...[generated description]..."
}
```

### GET /download/{filename}
Download generated video file

### GET /health
Health check endpoint

---

## 💡 Usage Examples

### Basic Workflow
1. Open http://localhost:5173
2. Drag 3-5 MP3 files into upload area
3. Click "Generate Video"
4. Wait 1-3 minutes (depends on file size)
5. Copy generated description
6. Download video
7. Upload to YouTube

### Tips
- Use 320kbps+ audio for best quality
- Keep total mix under 30 songs for faster processing
- Generated image.png can be customized in `backend/static/`
- Timestamps auto-calculated based on audio duration

---

## 🌟 Customization

### Change Cover Art
Replace `backend/static/image.png` with your own 1280x720 image

### Modify Video Settings
Edit `backend/app/services/video_service.py`:
- Resolution: line 31 `(1280, 720)`
- Bitrate: line 43 `192k`
- Codec: line 41 `libx264`

### Customize UI Colors
Edit `frontend/tailwind.config.js`:
- Primary colors in `theme.colors`
- Dark mode in `darkMode: 'class'`

---

## 📄 License

MIT License - Feel free to use this project for personal or commercial use.

---

## 🤝 Contributing

Found a bug or have a feature request? Open an issue or submit a pull request!

---

## ⚙️ System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Python | 3.8 | 3.10+ |
| Node.js | 16 | 18+ |
| RAM | 2GB | 4GB+ |
| Disk | 500MB | 1GB+ |
| FFmpeg | Latest | Latest |

---

## 🎓 Learning Resources

- [PyDub Documentation](https://github.com/jiaaro/pydub)
- [FastAPI Guide](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [FFmpeg Wiki](https://trac.ffmpeg.org/)

---

**Made with ❤️ for music lovers and content creators**

Questions? Check BACKEND_ARCHITECTURE.md or FRONTEND_ARCHITECTURE.md for detailed information.
