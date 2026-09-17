import datetime
import json
import os
from pathlib import Path

challenges_path = os.getenv(
    "CHALLENGES_PATH",
    os.path.join(Path(__file__).resolve().parent, "data/dailychallenges.json"),
)


def get_challenge():
    with open(challenges_path) as f:
        data = json.load(f)

    for i in data:
        if i["date"] == datetime.datetime.now(tz=datetime.UTC).strftime("%Y-%m-%d"):
            return i


# Creates a file with challenges
# file in is the input, file out is the output
def populate_challenges(file_in, file_out):
    with open(file_out) as f:
        data = json.load(f)

    from . import model_script

    model, tokenizer, length_bias = model_script.load_model()

    out_data = []
    for i in data:
        words = model_script.predict(model, tokenizer, length_bias, i.sentence, 10)
        out_data.append({"date": i.date, "sentence": i.sentence, "words": words})

    model_script.clear_model(model, tokenizer)

    with open(challenges_path, "w") as f:
        json.dump(out_data, f, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    print(get_challenge())
