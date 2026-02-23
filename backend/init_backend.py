#!/usr/bin/env python3
"""
Initialize backend and create necessary files
Run this before starting the backend for the first time
"""

import os
import sys
from PIL import Image

def create_directories():
    """Create necessary directories"""
    dirs = ['uploads', 'static']
    for directory in dirs:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ Created/verified directory: {directory}")

def create_placeholder_image():
    """Create placeholder image if not exists"""
    image_path = 'static/image.png'
    
    if os.path.exists(image_path):
        print(f"✅ Image already exists: {image_path}")
        return
    
    try:
        # Create a nice gradient image
        from PIL import Image, ImageDraw
        
        img = Image.new('RGB', (1280, 720), color=(10, 10, 20))  # Dark background
        draw = ImageDraw.Draw(img)
        
        # Add some gradient-like effect with circles
        for i in range(720, 0, -30):
            color_intensity = int(255 * (i / 720))
            draw.rectangle([(0, i-30), (1280, i)], fill=(50, color_intensity//2, color_intensity))
        
        img.save(image_path)
        print(f"✅ Created placeholder image: {image_path}")
    except Exception as e:
        print(f"⚠️  Error creating image: {e}")

def check_dependencies():
    """Check if all dependencies are installed"""
    dependencies = {
        'fastapi': 'FastAPI',
        'fastapi.responses': 'FastAPI Responses',
        'pydub': 'PyDub (audio processing)',
        'PIL': 'Pillow (image processing)',
        'numpy': 'NumPy',
    }
    
    missing = []
    for module, name in dependencies.items():
        try:
            __import__(module)
            print(f"✅ {name} installed")
        except ImportError:
            print(f"❌ {name} NOT installed")
            missing.append(name)
    
    return missing

def check_ffmpeg():
    """Check if FFmpeg is installed"""
    import subprocess
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
        print("✅ FFmpeg installed")
        return True
    except (FileNotFoundError, subprocess.CalledProcessError):
        print("❌ FFmpeg NOT installed - required for video creation")
        return False

def main():
    print("\n" + "="*50)
    print("🚀 YouTube Mixtape Backend Initialization")
    print("="*50 + "\n")
    
    # Create directories
    print("📁 Creating directories...")
    create_directories()
    
    print("\n🖼️  Creating placeholder image...")
    create_placeholder_image()
    
    print("\n📦 Checking dependencies...")
    missing = check_dependencies()
    
    print("\n🎥 Checking FFmpeg...")
    ffmpeg_ok = check_ffmpeg()
    
    print("\n" + "="*50)
    if missing:
        print(f"⚠️  Missing {len(missing)} dependencies:")
        for dep in missing:
            print(f"   - {dep}")
        print("\n💡 Run: pip install -r requirements.txt")
    
    if not ffmpeg_ok:
        print("\n💡 Install FFmpeg:")
        if sys.platform == 'win32':
            print("   Windows: choco install ffmpeg")
        elif sys.platform == 'darwin':
            print("   macOS: brew install ffmpeg")
        else:
            print("   Linux: sudo apt-get install ffmpeg")
    
    if not missing and ffmpeg_ok:
        print("\n✅ All prerequisites met! Ready to run.")
        print("\nStart backend with: python run.py")
    
    print("="*50 + "\n")

if __name__ == "__main__":
    main()
