# noomo - a llm predictions game
# Copyright (C) 2026  skueee

import os
import sys

from huggingface_hub import snapshot_download

# Github does not let me upload the model, so you will need to download it with this script
# Please execute this from the root of the project
# You can also use "uv download" if you have uv installed (which is recommended for this project)


def dir_check():
    if not os.path.isfile("main.py"):
        print("Please run this from the root of the project backend")
        sys.exit(1)

    if not os.path.isdir("models"):
        os.mkdir("models")


def download(out):
    snapshot_download(repo_id="Qwen/Qwen2.5-0.5B", repo_type="model", local_dir=out)


if __name__ == "__main__":
    dir_check()
    download("model")
