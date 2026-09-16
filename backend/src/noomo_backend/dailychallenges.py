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


if __name__ == "__main__":
    print(get_challenge())
