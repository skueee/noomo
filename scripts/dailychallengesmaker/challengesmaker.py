# noomo - a llm predictions game
# Copyright (C) 2026  skueee

# Makes a daily challenges file
# You need to have the backend server running locally to execute this

import argparse
import json

import requests


def get_words(sentence: str, words_count: int = 10):
    print("Generating words for " + sentence)
    body = {"words_count": words_count, "sentence": sentence, "prod": False}
    r = requests.post(
        "http://0.0.0.0:8001/predict",
        json=body,
        headers={"content-type": "application/json"},
    )
    return r.json()


def populate(file_input: str, file_output: str):
    with open(file_input, "r") as f:
        j = json.load(f)
    print("Opened JSON !")

    for i in j:
        words = get_words(i["sentence"])
        i.update({"words": words})
    print("Generated words !")

    with open(file_output, "w") as f:
        f.write(json.dumps(j))
    print("Wrote JSON !")


parser = argparse.ArgumentParser(
    prog="challengesmaker", description="Makes a daily challenges file for Noomo"
)

parser.add_argument("file_input")
parser.add_argument("file_output")
args = parser.parse_args()

populate(args.file_input, args.file_output)
