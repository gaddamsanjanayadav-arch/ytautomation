from pydub import AudioSegment
import os

class AudioService:

    @staticmethod
    def create_mixtape(files, output="mixtape.mp3", fade_duration_ms=2000):
        """
        Create a smooth fade mixtape by concatenating audio files with crossfades
        Simple and reliable approach
        """
        if not files or len(files) == 0:
            raise ValueError("No audio files provided")
            
        songs = []

        # Load all valid audio files
        for file in files:
            if not os.path.exists(file):
                print(f"⚠️  Skipping missing file: {file}")
                continue
                
            try:
                print(f"Loading: {file}")
                song = AudioSegment.from_file(file)
                # Standardize format to 2 channels, 44100 Hz
                song = song.set_channels(2).set_frame_rate(44100)
                songs.append(song)
                print(f"✅ Loaded: {file} ({len(song)}ms)")
            except Exception as e:
                print(f"❌ Error processing file {file}: {e}")
                continue

        if not songs:
            raise ValueError("No valid audio files could be processed")
        
        # Start with first song
        mixtape = songs[0]
        
        # Add remaining songs with crossfade
        for song in songs[1:]:
            try:
                # Crossfade between current mixtape and next song
                # Use min to ensure fade duration doesn't exceed song length
                fade_ms = min(fade_duration_ms, len(mixtape), len(song))
                
                # Use fast builtin crossfade (simpler than low-pass filter approach)
                mixtape = mixtape.append(song, crossfade=fade_ms)
                print(f"✅ Added song with {fade_ms}ms crossfade")
            except Exception as e:
                print(f"⚠️  Error during crossfade, appending without fade: {e}")
                # Fallback: just append without crossfade
                mixtape = mixtape + song
        
        # Export the final mixtape
        print(f"💾 Exporting mixtape to {output}...")
        mixtape.export(output, format="mp3", bitrate="192k")
        print(f"✅ Mixtape exported successfully: {output}")
        
        return output