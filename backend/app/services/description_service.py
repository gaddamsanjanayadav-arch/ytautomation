from pydub import AudioSegment
from datetime import timedelta
import os

class DescriptionService:

    @staticmethod
    def format_timestamp(milliseconds):
        """Format milliseconds to MM:SS format"""
        seconds = milliseconds // 1000
        return str(timedelta(seconds=seconds))[2:7] if seconds < 3600 else str(timedelta(seconds=seconds))

    @staticmethod
    def generate_description(files, artist_name="Amani"):
        """
        Generate detailed YouTube description with timestamps and metadata
        """
        if not files:
            return "No audio files found."

        description = []
        description.append(f"🎧 {artist_name} Mixtape")
        description.append("")
        description.append("🔥 Smooth transitions | Chill vibes | Perfect mix")
        description.append("")
        description.append("⏱️ Tracklist:")
        description.append("")

        current_time = 0
        total_duration = 0

        for file in files:
            try:
                audio = AudioSegment.from_file(file)
                duration = len(audio)
                timestamp = DescriptionService.format_timestamp(current_time)

                # Clean song name (remove extension)
                song_name = os.path.splitext(os.path.basename(file))[0]

                description.append(f"{timestamp} - {song_name}")

                current_time += duration
                total_duration += duration
            except Exception as e:
                print(f"Error processing {file}: {e}")
                continue

        total_time_formatted = DescriptionService.format_timestamp(total_duration)

        description.append("")
        description.append(f"⏳ Total Mix Duration: {total_time_formatted}")
        description.append("")
        description.append("💬 Comment your favorite track!")
        description.append("👍 Like | 🔔 Subscribe | 🔁 Share")
        description.append("")
        description.append(f"📌 Follow {artist_name} for more mixes!")
        description.append("")
        description.append(f"#{artist_name} #{artist_name}Mix #ChillVibes #SmoothMix #Mixtape #DJMix #MusicLovers")

        return "\n".join(description)