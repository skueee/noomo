FROM python:3.14-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

COPY . /app
ENV UV_NO_DEV=1

WORKDIR /app
RUN uv sync --locked

CMD ["uv", "run", "fastapi", "run", "src/noomo_backend/main.py", "--host", "0.0.0.0"]

EXPOSE 8000
