# noomo - a llm predictions game
# Copyright (C) 2026  skueee

import gc
import math
import os
from collections import Counter
from pathlib import Path

import regex as re
import torch
import transformers


def check_language(text, threshold=0.10):
    _SCRIPT_RE = re.compile(
        r"(?P<Hiragana>\p{Hiragana})|"
        r"(?P<Katakana>\p{Katakana})|"
        r"(?P<Han>\p{Han})|"
        r"(?P<Hangul>\p{Hangul})|"
        r"(?P<Latin>\p{Latin})|"
        r"(?P<Cyrillic>\p{Cyrillic})|"
        r"(?P<Greek>\p{Greek})|"
        r"(?P<Arabic>\p{Arabic})|"
        r"(?P<Hebrew>\p{Hebrew})"
    )

    GROUP = {
        "Hiragana": "Japanese",
        "Katakana": "Japanese",
        "Han": "Japanese",
        "Hangul": "Korean",
        "Latin": "Latin",
        "Cyrillic": "Cyrillic",
        "Greek": "Greek",
        "Arabic": "Arabic",
        "Hebrew": "Hebrew",
    }

    counts = Counter()
    for m in _SCRIPT_RE.finditer(text):
        script_name = m.lastgroup
        if script_name:
            counts[GROUP.get(script_name, script_name)] += 1

    if not counts:
        return {"Latin"}

    total = sum(counts.values())
    allowed = {g for g, n in counts.items() if n / total >= threshold}
    return allowed or {max(counts, key=counts.get)}


# Push the model towards longer words
def create_length_bias_vector(tokenizer, device, vocab_size):
    length_bias = torch.zeros(vocab_size, device=device)

    for token, token_id in tokenizer.get_vocab().items():
        if token_id < vocab_size:
            clean_token = token.lstrip("Ġ ##").strip()  # noqa: B005
            length_bias[token_id] = math.log1p(len(clean_token))

    return length_bias


# Loads the model in memory. Should be executed only one time.
def load_model():
    print("Loading model")
    parent_dir = Path(__file__).resolve().parent
    model_path = os.path.join(parent_dir, "model")
    tokenizer = transformers.AutoTokenizer.from_pretrained(
        model_path, local_files_only=True
    )
    model = transformers.AutoModelForCausalLM.from_pretrained(
        model_path, device_map="auto", local_files_only=True
    )
    length_bias = create_length_bias_vector(
        tokenizer, model.device, model.config.vocab_size
    )
    print("Finished loading model")
    return model, tokenizer, length_bias


# Prediction thing
def predict(model, tokenizer, length_bias, text, words_count, temperature=5, alpha=2):
    clean_text = text if text.endswith(" ") else text + " "

    inputs = tokenizer(clean_text, return_tensors="pt").to(model.device)

    with torch.no_grad():
        outputs = model(**inputs)

    next_token_logits = outputs.logits[0, -1, :]

    # Tokens that should not be generated
    bad_words_ids = [
        tokenizer.eos_token_id,
        tokenizer.pad_token_id,
        tokenizer.unk_token_id,
        tokenizer.sep_token_id,
        tokenizer.encode("\n", add_special_tokens=False)[0],
    ]

    # Put the probability of bad tokens to -infinity (they should not appear ig)
    for bad_id in bad_words_ids:
        if bad_id is not None:
            next_token_logits[bad_id] = float("-inf")

    bias = length_bias.to(next_token_logits.device)
    scaled_logits = (next_token_logits + (alpha * bias)) / temperature
    probabilities = torch.softmax(scaled_logits, dim=-1)

    top_probs, top_indices = torch.topk(probabilities, 50)

    # Saves 50 candidates to sort
    candidates = []
    for i in range(50):
        token_text = tokenizer.decode([top_indices[i]])
        prob = top_probs[i].item() * 100
        candidates.append({"word": token_text, "prob": prob})

    # ALready compute the right languages because optimizatiooon
    patterns = {
        "japanese": r"^[\p{Hiragana}\p{Katakana}\p{Han}]+$",
        "korean": r"^\p{Hangul}+$",
        "latin": r"^\p{Script=Latin}+$",
        "cyrillic": r"^\p{Cyrillic}+$",
        "greek": r"^\p{Greek}+$",
        "arabic": r"^\p{Arabic}+$",
        "hebrew": r"^\p{Hebrew}+$",
    }
    languages = check_language(text)
    language_patterns = []
    for i in languages:
        language_patterns.append(re.compile(patterns[i.lower()]))

    # Already define regex patterns because of optimization
    _RE_CASE = re.compile(r"\s[A-Za-z0-9]+", re.IGNORECASE)

    # Eliminates bad candidates
    response = []
    words = []
    for i in candidates:
        choose = True

        # Delete space at the start of a word (if any)
        if _RE_CASE.match(i["word"]):
            curr_word = i["word"][1:]
        else:
            curr_word = i["word"]

        # Check if the word does not exists yet
        for j in words:
            if curr_word.lower() == j.lower():
                choose = False

        # Check if the word is in the right language
        language_good = False
        for j in language_patterns:
            if j.match(curr_word):
                language_good = True
                break
        if not language_good:
            choose = False

        # Check if the word is minimum 3 characters
        if len(curr_word) < 3:
            choose = False

        if choose:
            response.append({"word": curr_word, "prob": i["prob"]})
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
