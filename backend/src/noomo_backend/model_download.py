import os
import sys

from huggingface_hub import snapshot_download

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
