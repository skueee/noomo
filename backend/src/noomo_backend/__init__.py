# noomo - a llm predictions game
# Copyright (C) 2026  skueee

import os
from pathlib import Path

from . import dailychallenges, model_download


def download():
    dir = Path(__file__).resolve().parent
    model_download.download(Path(os.path.join(dir, "model")))


def populate_challenges():
    file_in = input("Input : ")
    file_out = input("Output : ")
    dailychallenges.populate_challenges(file_in, file_out)
    print("Done !")
