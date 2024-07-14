import time

start_time = time.time()
print('Start program.')

from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

MODEL_NAME = "facebook/nllb-200-distilled-600m"

model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)


src_tgt_dictionary = {
    'ur': 'en',
    'ur': 'eng',
    'ur': 'eng_Latn',
    'urd': 'en',
    'urd': 'eng',
    'urd': 'eng_Latn',
    'urd_Arab': 'en',
    'urd_Arab': 'eng',
    'urd_Arab': 'eng_Latn'
}

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

for key, value in src_tgt_list:
    SRC_LANG = key
    TARGET_LANG = value
    
    sub_start_time = time.time()
    print('\n----------------------------------------------------------')
    print('Start sub program.')
    print(f"Model: {MODEL_NAME} | Source Language: {SRC_LANG} | Target Language: {TARGET_LANG}\n")

    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, src_lang=SRC_LANG)

    input_text = """جب اللہ تعالیٰ روح پھونکی اور آدم علیہ السلام تو فرمایا کہ سب لوگ سجدہ کرو تمام ملائکہ اور جنات تھ
ے تو وہ پہلے پیدا ہو چکے تھے یعنی فرشتہ اور جنات لیکن ہمارے پاس جو دلائل ہیں قرآن اور حدیث ان سے یہ 
پتا نہیں چلتا کہ اس زمین پر فرشتہ اور جنات حضرت آدم علیہ السلام کے تصفیف لانے سے پہلے موجود تھے یا ن
ہیں"""
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
    


# # Load model and tokenizer
# MODEL_NAME = "facebook/nllb-200-distilled-600m"
# SRC_LANG = "ur"
# TARGET_LANG = "en"
# # Do ur-en, ur-eng, ur-eng_Latn, urd-en, urd-eng, urd-eng_Latn, urd_Arab-en, urd_Arab-eng, urd_Arab-eng_Latn


# print(f"Model: {MODEL_NAME} | Source Language: {SRC_LANG} | Target Language: {TARGET_LANG}")
# tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, src_lang=SRC_LANG)
# model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)
# # urd and urd_Arab suck
# # ur is good

# # Prepare the input text
# input_text = """جب اللہ تعالیٰ روح پھونکی اور آدم علیہ السلام تو فرمایا کہ سب لوگ سجدہ کرو تمام ملائکہ اور جنات تھ
# ے تو وہ پہلے پیدا ہو چکے تھے یعنی فرشتہ اور جنات لیکن ہمارے پاس جو دلائل ہیں قرآن اور حدیث ان سے یہ 
# پتا نہیں چلتا کہ اس زمین پر فرشتہ اور جنات حضرت آدم علیہ السلام کے تصفیف لانے سے پہلے موجود تھے یا ن
# ہیں"""
# inputs = tokenizer(input_text, return_tensors="pt")

# # Define the forced_bos_token_id manually
# # The bos token ID for the target language
# forced_bos_token_id = tokenizer.convert_tokens_to_ids(TARGET_LANG)

# # Generate the translation
# translated_tokens = model.generate(**inputs, forced_bos_token_id=forced_bos_token_id)
# translated_text = tokenizer.batch_decode(translated_tokens, skip_special_tokens=True)[0]

# print(f"Translated Text: {translated_text}")


end_time = time.time()

# Print the total execution time
print(f"Execution time: {end_time - start_time:.2f} seconds")