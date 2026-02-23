# 🔧 Backend Architecture Guide

## Overview

The backend is a **FastAPI** application that processes audio files and generates mixtape videos. It follows a service-oriented architecture with clear separation of concerns.

---

## Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                        # FastAPI app instance & CORS setup
│   ├── core/
│   │   └── config.py                  # Configuration settings
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py                  # API endpoints (3 routes)
│   └── services/                      # Business logic layer
│       ├── __init__.py
│       ├── audio_service.py           # Audio mixing & transitions
│       ├── description_service.py     # YouTube description generation
│       └── video_service.py           # MP4 video creation
│
├── run.py                             # Entry point (Uvicorn server)
├── requirements.txt                   # Python dependencies
├── init_system.py                     # System verification script
├── static/
│   └── image.png                      # Cover art (1280x720)
└── uploads/                           # Temporary uploaded files
```

---

## Core Files Explained

### 1. `run.py` - Server Entry Point

```python
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
```

**Purpose**: Starts the FastAPI server
**Command**: `python run.py`
**Output**: Server runs on `http://127.0.0.1:8000`

---

### 2. `app/main.py` - FastAPI Setup

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI()

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routes
app.include_router(router)
```

**Responsibilities**:
- Create FastAPI instance
- Configure CORS (enables frontend to call backend)
- Register API routes
- Setup middleware

**Why CORS?**: Browser security - frontend on localhost:5173 needs permission to call backend on 127.0.0.1:8000

---

### 3. `app/api/routes.py` - API Endpoints

#### Endpoint 1: POST /generate
```python
@router.post("/generate")
async def generate(files: list[UploadFile] = File(...)):
```

**What it does**:
1. Receives uploaded MP3 files
2. Saves them to `uploads/` folder
3. Calls `AudioService.create_mixtape()` to blend audio
4. Calls `DescriptionService.generate_description()` for YouTube text
5. Calls `VideoService.create_video()` to make MP4
6. Returns video download link + description

**Flow**:
```
User uploads files → Save to disk → AudioService → DescriptionService 
→ VideoService → Return results
```

**Response**:
```json
{
  "status": "success",
  "video_path": "/download/final_video.mp4",
  "video_filename": "final_video.mp4",
  "description": "🎧 Mixtape\n[tracklist with timestamps]"
}
```

#### Endpoint 2: GET /download/{filename}
```python
@router.get("/download/{filename}")
async def download_video(filename: str):
```

**What it does**:
- Allows frontend to download generated MP4 files
- Returns file with proper MIME type (`video/mp4`)
- Browser downloads file automatically

#### Endpoint 3: GET /health
```python
@router.get("/health")
async def health_check():
```

**What it does**:
- Simple status check
- Returns: `{"status": "ok", "message": "Backend is running"}`
- Used by frontend to verify backend is available

---

## Service Layer

### 1. `audio_service.py` - Audio Mixing

**Purpose**: Blend multiple audio files into one smooth mixtape

**Key Method**: `AudioService.create_mixtape(file_paths, output)`

**Process**:
```
1. Load all MP3 files using PyDub
2. Standardize format:
   - Sample rate: 44100 Hz
   - Channels: 2 (stereo)
3. For each pair of consecutive songs:
   - Create 2-second cross-fade
   - Apply low-pass filter (4000 Hz) to fade region
   - Smoothly transition from one song to next
4. Combine all segments
5. Export as single MP3
```

**Example Code**:
```python
from app.services.audio_service import AudioService

# Mix songs with smooth transitions
mixtape = AudioService.create_mixtape(
    ["song1.mp3", "song2.mp3", "song3.mp3"],
    output="mixtape.mp3"
)
```

**Technologies**:
- **PyDub**: Audio processing (mixing, fading)
- **SciPy**: Low-pass filter for smooth transitions

---

### 2. `description_service.py` - Description Generation

**Purpose**: Create YouTube-ready description with timestamps

**Key Method**: `DescriptionService.generate_description(files, artist_name)`

**Output Format**:
```
🎧 Artist Name Mixtape

🔥 Smooth transitions | Chill vibes | Perfect mix

⏱️ Tracklist:

00:00 - Song Title 1
02:45 - Song Title 2
05:10 - Song Title 3

⏳ Total Mix Duration: 08:22

💬 Comment your favorite track!
👍 Like | 🔔 Subscribe | 🔁 Share

📌 Follow Artist for more mixes!

#Artist #ArtistMix #ChillVibes #SmoothMix #Mixtape #DJMix #MusicLovers
```

**Capabilities**:
- Automatically calculates song duration
- Creates timestamps (MM:SS format)
- Extracts filename as song name
- Calculates total mix duration
- Adds hashtags and CTAs

**Helper Method**: `format_timestamp(milliseconds)`
- Converts milliseconds → MM:SS format
- Used for tracklist timestamps

---

### 3. `video_service.py` - Video Creation

**Purpose**: Combine static image + audio into MP4 video

**Key Method**: `VideoService.create_video(image_path, audio_path, output)`

**Process**:
```
1. Verify image and audio files exist
2. Load image, resize to 1280x720
3. Save as temporary JPEG
4. Call FFmpeg with these parameters:
   - Loop image for entire audio duration
   - Encode video with H.264 codec
   - Use AAC audio codec
   - Output MP4 container
5. Clean up temporary files
6. Return output path
```

**FFmpeg Command** (approximate):
```bash
ffmpeg -loop 1 -i image.jpg -i audio.mp3 \
  -c:v libx264 -c:a aac -shortest -pix_fmt yuv420p \
  -movflags +faststart output.mp4
```

**Output Specifications**:
- Resolution: 1280 × 720 (HD)
- Codec: H.264 (MP4 compatible)
- Audio: AAC @ 192kbps
- Format: MP4 (YouTube ready)

---

## Data Flow

### Complete Request Flow

```
┌─────────────────────────────────────────────────────────┐
│  Frontend sends POST /generate with 3 MP3 files         │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────▼───────────────┐
        │  routes.py /generate        │
        │  1. Save files to uploads/  │
        │  2. Validate files         │
        └─────────────┬───────────────┘
                      │
        ┌─────────────▼──────────────────────┐
        │  AudioService.create_mixtape()     │
        │  - Load 3 MP3 files                │
        │  - Standardize format              │
        │  - Add cross-fades                 │
        │  - Output: mixtape.mp3             │
        └─────────────┬──────────────────────┘
                      │
        ┌─────────────▼────────────────────────────┐
        │  DescriptionService.generate_description()
        │  - Extract song durations              │
        │  - Create timestamps                   │
        │  - Format description                 │
        │  - Output: YouTube text               │
        └─────────────┬────────────────────────────┘
                      │
        ┌─────────────▼──────────────────────┐
        │  VideoService.create_video()       │
        │  - Load cover image                │
        │  - Combine with mixtape.mp3        │
        │  - Call FFmpeg                     │
        │  - Output: final_video.mp4         │
        └─────────────┬──────────────────────┘
                      │
        ┌─────────────▼──────────────────────┐
        │  Return to frontend                │
        │  - video_path                      │
        │  - description                     │
        └──────────────────────────────────┘
```

---

## Error Handling

### Service Validation

Each service validates inputs:

**AudioService**:
```python
if not files or len(files) == 0:
    raise ValueError("No audio files provided")

for file in files:
    if not os.path.exists(file):
        raise FileNotFoundError(f"File not found: {file}")
```

**VideoService**:
```python
if not os.path.exists(image_path):
    raise FileNotFoundError(f"Image not found: {image_path}")
```

### Error Response

If any step fails, routes.py catches and returns:
```json
{
  "detail": "Error generating video: [error message]"
}
```

---

## Dependencies

### Python Packages

```
fastapi==0.104.1          # Web framework
uvicorn==0.24.0           # ASGI server
pydub==0.25.1             # Audio processing
pillow==12.1              # Image processing
scipy==1.17               # Signal processing (filtering)
python-multipart==0.0.6   # File upload support
```

### System Requirements

```
ffmpeg     # Video encoding (must be in PATH)
python3    # Python interpreter
```

---

## Configuration

### Audio Processing Settings

**Sample Rate**: 44100 Hz (CD quality)
**Channels**: 2 (stereo)
**Fade Duration**: 2 seconds
**Filter Frequency**: 4000 Hz (low-pass)

Located in: `audio_service.py`

### Video Encoding Settings

**Resolution**: 1280 × 720
**Codec**: libx264
**Bitrate**: 192kbps (audio)
**Format**: MP4

Located in: `video_service.py`

---

## File Locations

| File Type | Location | Purpose |
|-----------|----------|---------|
| Uploaded files | `backend/uploads/` | Temporary storage |
| Cover art | `backend/static/image.png` | Video cover image |
| Mixtape output | `backend/mixtape.mp3` | Final audio mix |
| Video output | `backend/final_video.mp4` | Final video file |

---

## Testing the Backend

### Health Check
```bash
curl http://127.0.0.1:8000/health
# Response: {"status":"ok","message":"Backend is running"}
```

### Generate Mixtape
```bash
curl -X POST http://127.0.0.1:8000/generate \
  -F "files=@song1.mp3" \
  -F "files=@song2.mp3" \
  -F "files=@song3.mp3"
```

### Download Video
```bash
curl http://127.0.0.1:8000/download/final_video.mp4 -o video.mp4
```

---

## Performance Optimization

### Bottlenecks
1. **Audio processing**: Time depends on total audio duration
2. **Video encoding**: FFmpeg processing (slow on low-end systems)
3. **File I/O**: Disk write speed for large videos

### Typical Times
- 3 songs (total 30 min) → 2-3 minutes processing
- 10 songs (total 60 min) → 5-7 minutes processing

---

## Debugging

### Enable Verbose Logging

Add to `run.py`:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Check Service Directly

```python
# Test in Python shell
from app.services.audio_service import AudioService
result = AudioService.create_mixtape(['song1.mp3', 'song2.mp3'])
```

---

## Deployment Considerations

### Production Setup

1. Disable CORS for specific origins:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    ...
)
```

2. Use production ASGI server:
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

3. Store uploads in secure temp directory

4. Implement cleanup for old files

---

## Quick Reference

| Action | Command | Location |
|--------|---------|----------|
| Start backend | `python run.py` | backend/ |
| Check system | `python init_system.py` | backend/ |
| View logs | Console output during `python run.py` | - |
| Add service | Create in `app/services/` | backend/app/services/ |
| Add endpoint | Edit `app/api/routes.py` | backend/app/api/ |
| Change image | Replace `static/image.png` | backend/static/ |

---

## Next Steps

- Check [README.md](README.md) for overall project info
- Check [FRONTEND_ARCHITECTURE.md](../FRONTEND_ARCHITECTURE.md) for frontend details
- Review individual service files for implementation details

**Questions?** Check the docstrings in each service file!
