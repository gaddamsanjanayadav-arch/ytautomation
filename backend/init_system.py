#!/usr/bin/env python3
"""
System initialization and dependency check script
Verifies all required components are installed and configured
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def print_status(message, status="INFO"):
    """Print status message with color coding"""
    colors = {
        "INFO": "\033[94m",      # Blue
        "SUCCESS": "\033[92m",   # Green
        "WARNING": "\033[93m",   # Yellow
        "ERROR": "\033[91m",     # Red
    }
    reset = "\033[0m"
    
    color = colors.get(status, "")
    symbol = {
        "INFO": "ℹ️ ",
        "SUCCESS": "✅",
        "WARNING": "⚠️ ",
        "ERROR": "❌",
    }.get(status, "")
    
    print(f"{color}{symbol} {message}{reset}")

def check_ffmpeg():
    """Check if FFmpeg is installed"""
    print("\n📹 Checking FFmpeg...")
    try:
        result = subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True)
        if result.returncode == 0:
            version_line = result.stdout.split('\n')[0]
            print_status(f"FFmpeg found: {version_line}", "SUCCESS")
            return True
    except FileNotFoundError:
        pass
    
    print_status("FFmpeg NOT found!", "ERROR")
    print_status("Please install FFmpeg:", "WARNING")
    print("  Windows: choco install ffmpeg")
    print("  macOS: brew install ffmpeg")
    print("  Ubuntu/Debian: sudo apt-get install ffmpeg")
    return False

def check_python_dependencies():
    """Check if required Python packages are installed"""
    print("\n📦 Checking Python dependencies...")
    
    required_packages = {
        "fastapi": "FastAPI",
        "pydub": "PyDub",
        "pillow": "Pillow (PIL)",
        "uvicorn": "Uvicorn",
        "python-multipart": "python-multipart",
        "scipy": "SciPy",
    }
    
    missing = []
    
    for package, name in required_packages.items():
        try:
            __import__(package.replace("-", "_"))
            print_status(f"{name} is installed", "SUCCESS")
        except ImportError:
            print_status(f"{name} NOT installed", "ERROR")
            missing.append(package)
    
    if missing:
        print_status(f"Missing packages: {', '.join(missing)}", "WARNING")
        print_status(f"Install with: pip install {' '.join(missing)}", "INFO")
        return False
    
    return True

def create_directories():
    """Create necessary directories"""
    print("\n📁 Creating directories...")
    
    directories = [
        "static",
        "uploads",
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print_status(f"Directory exists: {directory}", "SUCCESS")

def create_placeholder_image():
    """Create a placeholder image if it doesn't exist"""
    print("\n🖼️  Checking cover image...")
    
    image_path = "static/image.png"
    
    if os.path.exists(image_path):
        print_status(f"Cover image found: {image_path}", "SUCCESS")
        return True
    
    print_status(f"Creating placeholder image: {image_path}", "INFO")
    
    try:
        from PIL import Image, ImageDraw, ImageFont
        
        # Create a gradient image
        width, height = 1280, 720
        img = Image.new('RGB', (width, height), color='#1a1a2e')
        draw = ImageDraw.Draw(img)
        
        # Add gradient-like effect with rectangles
        for y in range(height):
            r = int(26 + (100 - 26) * (y / height))
            g = int(26 + (100 - 26) * (y / height))
            b = int(46 + (120 - 46) * (y / height))
            draw.line([(0, y), (width, y)], fill=(r, g, b))
        
        # Add text
        text = "🎵 Mixtape"
        try:
            # Try to use a default font, fallback if not available
            draw.text((width//2 - 100, height//2 - 50), text, fill=(0, 255, 150), font=None)
        except:
            draw.text((width//2 - 100, height//2 - 50), text, fill=(0, 255, 150))
        
        os.makedirs("static", exist_ok=True)
        img.save(image_path)
        
        print_status(f"Placeholder image created: {image_path}", "SUCCESS")
        return True
        
    except Exception as e:
        print_status(f"Failed to create placeholder image: {e}", "ERROR")
        return False

def test_imports():
    """Test that all app imports work"""
    print("\n🔧 Testing imports...")
    
    try:
        from app.services.audio_service import AudioService
        print_status("AudioService imports successfully", "SUCCESS")
        
        from app.services.description_service import DescriptionService
        print_status("DescriptionService imports successfully", "SUCCESS")
        
        from app.services.video_service import VideoService
        print_status("VideoService imports successfully", "SUCCESS")
        
        from app.api.routes import router
        print_status("Routes import successfully", "SUCCESS")
        
        from app.main import app
        print_status("FastAPI app imports successfully", "SUCCESS")
        
        return True
        
    except Exception as e:
        print_status(f"Import failed: {e}", "ERROR")
        return False

def main():
    """Run all checks"""
    print("\n" + "="*60)
    print("🚀 YouTube Mixtape System Initialization")
    print("="*60)
    
    checks = [
        ("FFmpeg", check_ffmpeg),
        ("Python Dependencies", check_python_dependencies),
        ("Create Directories", create_directories),
        ("Placeholder Image", create_placeholder_image),
        ("Import Tests", test_imports),
    ]
    
    results = []
    
    for check_name, check_func in checks:
        try:
            if check_name == "Create Directories":
                check_func()
                results.append((check_name, True))
            elif check_name == "Placeholder Image":
                result = check_func()
                results.append((check_name, result))
            else:
                result = check_func()
                results.append((check_name, result))
        except Exception as e:
            print_status(f"Unexpected error in {check_name}: {e}", "ERROR")
            results.append((check_name, False))
    
    # Summary
    print("\n" + "="*60)
    print("📊 Initialization Summary")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for check_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {check_name}")
    
    print(f"\nScore: {passed}/{total}")
    
    if passed == total:
        print_status("✨ System is ready! You can now run:", "SUCCESS")
        print("  Backend:  python run.py")
        print("  Frontend: npm run dev")
        return 0
    else:
        print_status("⚠️  Some checks failed. Please fix the issues above.", "WARNING")
        return 1

if __name__ == "__main__":
    sys.exit(main())
