# noomo - a llm predictions game
# Copyright (C) 2026  skueee

import gc
import math
import os
from pathlib import Path

import regex as re
import torch
import transformers


# Push the model towards longer words
def create_length_bias_vector(tokenizer, device, vocab_size):
    length_bias = torch.zeros(vocab_size, device=device)
    latin_pattern = re.compile(r"^\p{Script=Latin}+$")

    for token, token_id in tokenizer.get_vocab().items():
        if token_id < vocab_size:
            clean_token = token.lstrip("Ġ ##").strip()

            if latin_pattern.match(clean_token):
                length_bias[token_id] = math.log1p(len(clean_token))

    return length_bias

# Loads the model in memory. Should be executed only one time.
def load_model():
    print("Loading model")
    parent_dir = Path(__file__).resolve().parent
    model_path = os.path.join(parent_dir, "model")
    tokenizer = transformers.AutoTokenizer.from_pretrained(model_path, local_files_only=True)
    model = transformers.AutoModelForCausalLM.from_pretrained(model_path, device_map="auto", local_files_only=True)
    length_bias = create_length_bias_vector(tokenizer, model.device, model.config.vocab_size)
    print("Finished loading model")
    return model, tokenizer, length_bias

# Prediction thing
def predict(model, tokenizer, length_bias, text, words_count, temperature=10, alpha=2):
    inputs = tokenizer(text, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)

    next_token_logits = outputs.logits[
        0, -1, :
    ]

    # Tokens that should not be generated
    bad_words_ids = [
        tokenizer.eos_token_id,
        tokenizer.pad_token_id,
        tokenizer.unk_token_id,
        tokenizer.sep_token_id,
        tokenizer.encode("\n", add_special_tokens=False)[0]
    ]

    # Put the probability of bad tokens to -infinity (they should not appear ig)
    for bad_id in bad_words_ids:
        if bad_id is not None:
            next_token_logits[bad_id] = float('-inf')

    bias = length_bias.to(next_token_logits.device)
    scaled_logits = (next_token_logits + (alpha * bias)) / temperature
    probabilities = torch.softmax(scaled_logits, dim=-1)

    top_probs, top_indices = torch.topk(probabilities, 50)

    # Saves 50 candidates to sort
    candidates = []
    for i in range(50):
        token_text = tokenizer.decode([top_indices[i]])
        prob = top_probs[i].item() * 100
        candidates.append({"word":token_text, "prob":prob})

    # Eliminates bad candidates
    response = []
    words = []
    for i in candidates:
        choose = True

        # Delete space at the start of a word (if any)
        pattern = re.compile(r"\s[A-Za-z0-9]+", re.IGNORECASE)
        if pattern.match(i["word"]):
            curr_word = i["word"][1:]
        else:
            curr_word = i["word"]

        # Check if the word does not exists yet
        if curr_word in words:
            choose = False

        # Checks if every character in the word is a latin letter (no number, kanji, special character...)
        pattern = re.compile(r"^\p{Script=Latin}+$")
        if not pattern.match(curr_word):
            choose = False

        if choose:
            response.append({"word":curr_word, "prob":i["prob"]})
            words.append(curr_word)

    current_index = 1
    for i in response:
        i["index"] = current_index
        current_index += 1

    return response[:words_count]

def clear_model(model, tokenizer):
    del model
    del tokenizer
    gc.collect()
    torch.cuda.empty_cache()

if __name__ == "__main__":
    model, tokenizer, length_bias = load_model()
    predict(model, tokenizer, length_bias, "Lorem Ipsum", 5)
