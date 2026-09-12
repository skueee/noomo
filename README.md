# Noomo
A game where you need to guess words that an LLM generates

![hackatime-stats](https://hackatime.hackclub.com/api/v1/badge/U0BQF6EGX0V/skueee/noomo)
![GitHub commit activity](https://img.shields.io/github/commit-activity/t/skueee/noomo?label=total%20commits)
![GitHub language count](https://img.shields.io/github/languages/count/skueee/noomo)
![GitHub Issues](https://img.shields.io/github/issues/skueee/noomo)
![GitHub Repo stars](https://img.shields.io/github/stars/skueee/noomo?style=flat&color=yellow)


## How to play ?

1. Open the site : (not deployed yet)
2. Enter a sentence, click on the button
3. Enjoy !

To submit a word, just type it and click enter

---

## Running locally

### **The website**

You need pnpm and node installed

1. Clone the repo
```
git clone https://github.com/skueee/noomo.git
cd noomo
```
2. Go to the frontend directory
```
cd frontend/noomo-frontend
```
3. Download the dependencies
```
pnpm install
```
4. Launch the server
```
pnpm start
```

### The backend

#### **With Docker**

1. Download the container
```
docker pull ghcr.io/skueee/noomo:latest
```
2. Execute it
```
docker run -d -p 8001:8001 -v noomo:/noomo -e DB_PATH=/noomo/data ghcr.io/skueee/noomo:latest
```
DB_PATH is the place where Python will try to access the sql database. For that, the recommended approach is to use volumes. Change it if you wich to

8001 is the default port.

#### **With UV**

1. Install UV : [Installation Guide](https://docs.astral.sh/uv/getting-started/installation/)
2. Clone the repo
```
git clone https://github.com/skueee/noomo.git
```

3. Go to the noomo directory
```
cd noomo
```

4. Sync dependencies
```
uv sync
```

5. Enter the venv
```
source .venv/bin/activate
```

6. Download the model
```
uv run download
```

7. Launch the server
```
uvs server
```
or
```
uvs dev
```

---

## Credits

**Model used :** [Qwen2.5-0.5B](https://huggingface.co/Qwen/Qwen2.5-0.5B)
