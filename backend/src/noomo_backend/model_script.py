# noomo - a llm predictions game
# Copyright (C) 2026  skueee

import gc
import os
from pathlib import Path

import regex as re
import torch
import transformers


def load_model():
    print("Loading model")
    parent_dir = Path(__file__).resolve().parent
    model_path = os.path.join(parent_dir, "model")
    tokenizer = transformers.AutoTokenizer.from_pretrained(model_path, local_files_only=True)
    model = transformers.AutoModelForCausalLM.from_pretrained(model_path, device_map="auto", local_files_only=True)
    print("Finished loading model")
    return model, tokenizer

def predict(model, tokenizer, text, words_count):
    inputs = tokenizer(text, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)

    next_token_logits = outputs.logits[
        0, -1, :
    ]

    bad_words_ids = [
        tokenizer.eos_token_id,
        tokenizer.pad_token_id,
        tokenizer.unk_token_id,
        tokenizer.sep_token_id,
        tokenizer.encode("\n", add_special_tokens=False)[0]
    ]

    for bad_id in bad_words_ids:
        if bad_id is not None:
            next_token_logits[bad_id] = float('-inf')

    probabilities = torch.softmax(next_token_logits, dim=-1)

    top_probs, top_indices = torch.topk(probabilities, 50)

    candidates = []
    for i in range(50):
        token_text = tokenizer.decode([top_indices[i]])
        prob = top_probs[i].item() * 100
        candidates.append({"word":token_text, "prob":prob})

    response = []
    words = []
    for i in candidates:
        choose = True

        pattern = re.compile(r"\s[A-Za-z0-9]+", re.IGNORECASE)
        if pattern.match(i["word"]):
            curr_word = i["word"][1:]
        else:
            curr_word = i["word"]

        if curr_word in words:
            choose = False

        pattern = re.compile(r"^\p{Script=Latin}+$")
        if not pattern.match(curr_word):
            choose = False

        if choose:
            response.append({"word":curr_word, "prob":i["prob"]})
            words.append(curr_word)

    return response[:words_count]

def clear_model(model, tokenizer):
    del model
    del tokenizer
    gc.collect()
    torch.cuda.empty_cache()

if __name__ == "__main__":
    model, tokenizer = load_model()
    predict(model, tokenizer, "Lorem Ipsum", 5)
