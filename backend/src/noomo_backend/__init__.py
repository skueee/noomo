# noomo - a llm predictions game
# Copyright (C) 2026  skueee

import os
from pathlib import Path

from . import model_download


def download():
    dir = Path(__file__).resolve().parent
    model_download.download(Path(os.path.join(dir, "model")))
