import subprocess
import os
from PIL import Image

class VideoService:

    @staticmethod
    def create_video(image_path, audio_path, output="final_mixtape_video.mp4", resolution=(1280, 720)):
        """
        Create video from image and audio using ffmpeg
        Robust error handling and timeout
        """
        
        # Check if files exist
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found: {image_path}")
        
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio not found: {audio_path}")

        temp_image = None
        try:
            # Resize image to specified resolution
            print(f"📸 Resizing image to {resolution}...")
            img = Image.open(image_path)
            img = img.resize(resolution)
            temp_image = os.path.join(os.getcwd(), "temp_image.jpg")
            img.save(temp_image)
            print(f"✅ Image resized and saved")

            # Get audio duration for validation
            audio_size_mb = os.path.getsize(audio_path) / (1024 * 1024)
            print(f"📊 Audio file size: {audio_size_mb:.2f} MB")

            # FFmpeg command with better quality settings
            cmd = [
                "ffmpeg",
                "-y",                      # Overwrite output file without asking
                "-loglevel", "info",       # Reduce verbosity
                "-loop", "1",              # Loop the image
                "-i", temp_image,          # Input image
                "-i", audio_path,          # Input audio
                "-c:v", "libx264",         # Video codec
                "-preset", "medium",       # Speed/quality tradeoff (slow=better, fast=faster)
                "-crf", "23",              # Quality (0-51, lower is better, 23 is default)
                "-c:a", "aac",             # Audio codec
                "-b:a", "192k",            # Audio bitrate
                "-shortest",               # End when shortest input ends
                "-pix_fmt", "yuv420p",     # Pixel format (compatibility)
                "-movflags", "+faststart", # Enable streaming
                "-vsync", "0",             # Don't sync frames
                output                     # Output file
            ]

            print(f"🎬 Running FFmpeg: {' '.join(cmd)}")
            print(f"⏳ This may take a few minutes depending on audio length...")
            
            result = subprocess.run(
                cmd, 
                capture_output=True, 
                text=True,
                timeout=600  # 10 minute timeout
            )
            
            if result.returncode != 0:
                error_msg = result.stderr
                print(f"❌ FFmpeg stderr: {error_msg}")
                raise RuntimeError(f"FFmpeg failed with code {result.returncode}: {error_msg}")
            
            # Verify output file was created
            if not os.path.exists(output):
                raise RuntimeError(f"Output video file was not created: {output}")
            
            video_size_mb = os.path.getsize(output) / (1024 * 1024)
            print(f"✅ Video created successfully!")
            print(f"📊 Output size: {video_size_mb:.2f} MB")
            print(f"📁 Location: {output}")
            
            return output
                
        except subprocess.TimeoutExpired:
            print(f"❌ FFmpeg timed out after 10 minutes")
            raise RuntimeError("Video encoding timed out - file may be too large")
        except Exception as e:
            print(f"❌ Error creating video: {type(e).__name__}: {str(e)}")
            raise
        finally:
            # Clean up temp image
            if temp_image and os.path.exists(temp_image):
                try:
                    os.remove(temp_image)
                    print(f"🗑️  Cleaned up temporary image")
                except Exception as e:
                    print(f"⚠️  Could not remove temp image: {e}")