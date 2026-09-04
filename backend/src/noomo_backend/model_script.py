# noomo - a llm predictions game
# Copyright (C) 2026  skueee

import gc
import torch
import transformers
from pathlib import Path
import os

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
    probabilities = torch.softmax(next_token_logits, dim=-1)

    top_probs, top_indices = torch.topk(probabilities, words_count)

    response = []
    for i in range(words_count):
        token_text = tokenizer.decode([top_indices[i]])
        prob = top_probs[i].item() * 100
        response.append({"word":token_text, "prob":prob})

    return response

def clear_model(model, tokenizer):
    del model
    del tokenizer
    gc.collect()
    torch.cuda.empty_cache()

if __name__ == "__main__":
    model, tokenizer = load_model()
    predict(model, tokenizer, "Lorem Ipsum", 5)
