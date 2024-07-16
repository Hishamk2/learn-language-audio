import time

start_time = time.time()

from googletrans import Translator
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

MODEL_NAME = "facebook/nllb-200-distilled-600m"
MODEL = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)


def compare_language_codes(model, src_tgt_list: list, input_text: str) -> None:
    """
    Compare the translation of the same text between different language codes.

    Args:
    -----------
        model: The model to use for translation. Should be from facebook nllb pretty sure
        
        src_tgt_list: A list of tuples containing the source and target language codes to compare. Each tuple should be in the format (source_language_code, target_language_code)
        
        input_text: The text to translate. Has to be a String format (maybe changes this so a .txt file will suffice?) <- TODO

    """
    for key, value in src_tgt_list:
        SRC_LANG = key
        TARGET_LANG = value
        
        sub_start_time = time.time()
        print('\n----------------------------------------------------------')
        print('Start sub program.')
        print(f"Model: {MODEL_NAME} | Source Language: {SRC_LANG} | Target Language: {TARGET_LANG}\n")

        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, src_lang=SRC_LANG)

        inputs = tokenizer(input_text, return_tensors="pt")

        # Define the forced_bos_token_id manually
        # The bos token ID for the target language
        forced_bos_token_id = tokenizer.convert_tokens_to_ids(TARGET_LANG)

        # Generate the translation
        translated_tokens = model.generate(**inputs, forced_bos_token_id=forced_bos_token_id)
        translated_text = tokenizer.batch_decode(translated_tokens, skip_special_tokens=True)[0]

        print(f"Translated Text: {translated_text}")

        sub_end_time = time.time()
        print(f"\nExecution time for this model: {sub_end_time - sub_start_time:.2f} seconds")
        print('----------------------------------------------------------')

def translate_text(model, src_lang: str, tgt_lang: str, input_text: str) -> str:
    """
    Translate the input text from the source language to the target language.

    Args:
    -----------
        model: The model to use for translation. Should be from facebook nllb pretty sure
        
        src_lang: The source language code.
        
        tgt_lang: The target language code.
        
        input_text: The text to translate. Has to be a String format (maybe changes this so a .txt file will suffice?) <- TODO

    Returns:
    -----------
        The translated text.
    """
    print(f"Model: {MODEL_NAME} | Source Language: {src_lang} | Target Language: {tgt_lang}")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, src_lang=src_lang)

    inputs = tokenizer(input_text, return_tensors="pt")

    # Define the forced_bos_token_id manually
    # The bos token ID for the target language
    forced_bos_token_id = tokenizer.convert_tokens_to_ids(tgt_lang)

    # Generate the translation
    translated_tokens = model.generate(**inputs, forced_bos_token_id=forced_bos_token_id)
    translated_text = tokenizer.batch_decode(translated_tokens, skip_special_tokens=True)[0]

    return translated_text

def get_text_from_file(file_path: str) -> str:
    """
    Read the text from a file and return it as a string.

    Args:
    -----------
        file_path: The path to the file to read.

    Returns:
    -----------
        The text from the file as a string.
    """
    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()
    return text

# urd and urd_Arab suck
# ur is good

#TODO should i print stuff in my functions or use returns instead?

def translate_text_ggl(text: str, src_lang: str, tgt_lang: str) -> str:
    translator = Translator()
    translated_text = translator.translate(text, src=src_lang, dest=tgt_lang)
    return translated_text.text

def split_text(text, max_length=5000):
    for i in range(0, len(text), max_length):
        yield text[i:i + max_length]


def main():
    src_tgt_list = [
        ('ur', 'en'),
        ('ur', 'eng'),
        ('ur', 'eng_Latn'),
        ('urd', 'en'),
        ('urd', 'eng'),
        ('urd', 'eng_Latn'),
        ('urd_Arab', 'en'),
        ('urd_Arab', 'eng'),
        ('urd_Arab', 'eng_Latn')
    ]
    input_text = """جب اللہ تعالیٰ فرمایا کہ سب لوگ سجدہ کرو تمام ملائکہ اور جنات تھے تو وہ پہلے پیدا ہو چکے تھے یعنی فرشتہ اور جنات لیکن ہمارے پاس جو دلائل ہیں قرآن اور حدیث ان سے یہ     پتا نہیں چلتا کہ اس زمین پر فرشتہ اور جنات حضرت آدم علیہ السلام کے تصفیف لانے سے پہلے موجود تھے یا ن    ہیں"""
    # input_text= """ اسلام علیکم ورحمت اللہ وبرکاتہ جدہ میں ترید تھے ماشاءاللہ اللہ تعالیٰ درجات برند کہیں مورانا عبد الرحمن مظاہری رحمت اللہ علیہ یہ استاذ تھے حدیث کے تفسیر کے نازم اول تھے مجلس علمیہ کے حضبات دکن کے اور حضرت شاہ عبدالرحفظ صاحب رحمت اللہ علیہ کے خلیفہ تھے اور ان کا انتقال ہو گیا چند سال پہلے لیکن جدہ م"""
    # input_text = get_text_from_file(r"D:\Transcription Project\Whisper Testing\transcription.txt")
    
    # has to be list because we join it later
    splitted_text = list(split_text(input_text))
    
    SRC_LANG = 'ur'
    TGT_LANG = 'eng'
    # print(f'Translated text: {translate_text(MODEL, SRC_LANG, TGT_LANG, input_text)}')
    # compare_language_codes(MODEL, src_tgt_list, input_text)
    translated_chunks = [translate_text_ggl(chunk, 'ur', 'en') for chunk in splitted_text]


    # Combine the translations
    translated_text = ' '.join(translated_chunks)
    print(f"Translated text: {translated_text}")




if __name__ == "__main__":
    print('Start program.')
    
    main()    

    end_time = time.time()
    print(f"Execution time: {end_time - start_time:.2f} seconds")

