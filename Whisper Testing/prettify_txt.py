# Assuming the txt file has all text on one line, this program will
# prettify the text by adding a newline character after every 100 characters.

def prettify_txt(file_path: str) -> None:
    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()
    
    prettified_text = ""
    for i in range(0, len(text), 100):
        prettified_text += text[i:i+100] + "\n"
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(prettified_text)