import os
import whisper
from shutil import which

# Define the path to the ffmpeg executable
ffmpeg_path = r"C:\Users\hamza\Downloads\ffmpeg-7.0.1-essentials_build\ffmpeg-7.0.1-essentials_build\bin\ffmpeg.exe"  # Adjust the path to where you extracted ffmpeg

# Check if ffmpeg is available
if not which("ffmpeg"):
    if os.path.isfile(ffmpeg_path):
        os.environ["PATH"] += os.pathsep + os.path.dirname(ffmpeg_path)
    else:
        print("FFmpeg not found. Please ensure it is installed and the path is correct.")
        exit(1)

# Load the Whisper model with GPU support
model = whisper.load_model("medium")

# Transcribe the audio file with language specified and word timestamps
result = model.transcribe("test.mp3", fp16=False, language="ur", word_timestamps=True)

# Write the transcription to a text file with utf-8 encoding
with open("transcription.txt", "w", encoding="utf-8") as f:
    f.write(result["text"])
    # for segment in result["segments"]:
    #     start = segment["start"]
    #     end = segment["end"]
    #     text = segment["text"]
    #     f.write(f"[{start:.2f} - {end:.2f}] {text}\n")


from openai import OpenAI


