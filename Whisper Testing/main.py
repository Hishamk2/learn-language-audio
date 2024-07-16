import time

start_time = time.time()
print('Start program.')


import os
import whisper
from shutil import which
from prettify_txt import prettify_txt



# print(whisper.available_models())

# Define the path to the ffmpeg executable
ffmpeg_path = r"C:\Users\hamza\Downloads\ffmpeg-7.0.1-essentials_build\ffmpeg-7.0.1-essentials_build\bin\ffmpeg.exe"  # Adjust the path to where you extracted ffmpeg
# ffmpeg_path = r"C:\Users\hamza\OneDrive - University of Manitoba\Documents\HISHAM\Computer Science\Transcription Project\Whisper Testing\ffmpeg-7.0.1.tar.xz"  # Adjust the path to where you extracted ffmpeg
# C:\Users\hamza\Downloads\ffmpeg-7.0.1-essentials_build\ffmpeg-7.0.1-essentials_build\bin\ffmpeg.exe
# Check if ffmpeg is available
if not which("ffmpeg"):
    if os.path.isfile(ffmpeg_path):
        os.environ["PATH"] += os.pathsep + os.path.dirname(ffmpeg_path)
    else:
        print("FFmpeg not found. Please ensure it is installed and the path is correct.")
        exit(1)

# Load the Whisper model with GPU support
# ['tiny.en', 'tiny', 'base.en', 'base', 'small.en', 'small', 'medium.en', 'medium', 'large-v1', 'large-v2', 'large-v3', 'large']
# TODO: .en means fine-tuned on English data
model_size = "large"
# base model sucks
# small took 22.46 seconds
# medium took 70.64 seconds
# large took 161.56 seconds
model = whisper.load_model(model_size)

# Transcribe the audio file with language specified and word timestamps
result = model.transcribe(r"C:\Users\hamza\OneDrive - University of Manitoba\Documents\HISHAM\Computer Science\Transcription Project\Whisper Testing\test.mp3", fp16=False, language="ur", word_timestamps=True)
# result = model.transcribe(r"C:\Users\hamza\Downloads\test1.mp3", fp16=False, language="ur", word_timestamps=True)

output_file_name = f'transcription-{model_size}.txt'
# Write the transcription to a text file with utf-8 encoding
with open(output_file_name, "w", encoding="utf-8") as f:
    f.write(result["text"])
    # for segment in result["segments"]:
    #     start = segment["start"]
    #     end = segment["end"]
    #     text = segment["text"]
    #     f.write(f"[{start:.2f} - {end:.2f}] {text}\n")

# Prettify the transcription text file
prettify_txt(output_file_name)



end_time = time.time()

# Print the total execution time
print(f"Execution time: {end_time - start_time:.2f} seconds")