**WIP**

# The backend of Noomo !
**Built in python, using Fastapi and UV**

---

### Running
To run the api, you can use the Docker image or the UV project.

#### With Docker

**1. Download the container**
```
docker pull ghcr.io/skueee/noomo:latest
```
**2. Execute it**
```
docker run -d -p 8001:8001 -v noomo:/noomo -e DB_PATH=/noomo/data ghcr.io/skueee/noomo:latest
```
DB_PATH is the place where Python will try to access the sql database. For that, the recommended approach is to use volumes. Change it if you wich to

8001 is the default port.

#### With UV

**1. Install UV : [Installation Guide](https://docs.astral.sh/uv/getting-started/installation/)**
**2. Clone the repo**
```
git clone https://github.com/skueee/noomo.git
```

**3. Go to the noomo directory**

**4. Sync dependencies**
```
uv sync
```

**5. Enter the venv**
```
source .venv/bin/activate
```

**6. Download the model**
```
uv run download
```

**7. Launch the server**
```
uvs server
```
or
```
uvs dev
```

---

### Using

Docs are located at `localhost:8001/docs` and `localhost:8001/redoc`

Changing the DB_PATH environment variable will change the file used for the databse (specify the full path, even if the file does not exists yet)
