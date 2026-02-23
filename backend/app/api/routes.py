from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import os
from app.services.audio_service import AudioService
from app.services.video_service import VideoService
from app.services.description_service import DescriptionService

router = APIRouter()

@router.post("/generate")
async def generate(files: list[UploadFile] = File(...)):
    """
    Generate a mixtape video from uploaded audio files
    """
    try:
        if not files:
            raise HTTPException(status_code=400, detail="No files provided")

        # Create uploads folder inside backend
        upload_folder = os.path.join(os.getcwd(), "uploads")
        os.makedirs(upload_folder, exist_ok=True)

        file_paths = []

        # Save uploaded files
        for file in files:
            path = os.path.join(upload_folder, file.filename)
            with open(path, "wb") as f:
                f.write(await file.read())
            file_paths.append(path)
            print(f"✅ Saved: {path}")

        # Create mixtape
        print("🎵 Creating mixtape...")
        mixtape_path = os.path.join(os.getcwd(), "mixtape.mp3")
        mixtape = AudioService.create_mixtape(file_paths, output=mixtape_path)
        print(f"✅ Mixtape created: {mixtape}")

        # Generate description
        print("📝 Generating description...")
        description = DescriptionService.generate_description(file_paths)
        print(f"✅ Description generated")

        # Get static image path
        image_path = os.path.join(os.getcwd(), "static", "image.png")
        
        if not os.path.exists(image_path):
            print(f"⚠️  Image not found at {image_path}, using default")
            # Try alternative paths
            image_path = "static/image.png"
            if not os.path.exists(image_path):
                raise HTTPException(status_code=500, detail="Cover image not found")

        # Create video
        print("🎬 Creating video...")
        video_output = os.path.join(os.getcwd(), "final_video.mp4")
        video = VideoService.create_video(image_path, mixtape_path, output=video_output)
        print(f"✅ Video created: {video}")

        return {
            "status": "success",
            "video_path": f"/download/{os.path.basename(video)}",
            "video_filename": os.path.basename(video),
            "description": description
        }

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating video: {str(e)}")


@router.get("/download/{filename}")
async def download_video(filename: str):
    """
    Download generated video file
    """
    try:
        file_path = os.path.join(os.getcwd(), filename)
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")
        
        return FileResponse(
            path=file_path,
            filename=filename,
            media_type="video/mp4"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error downloading: {str(e)}")


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "Backend is running"
    }