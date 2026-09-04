# noomo - a llm predictions game
# Copyright (C) 2026  skueee

import uvicorn

from contextlib import asynccontextmanager

from fastapi import FastAPI
from pydantic import BaseModel

from . import model_script


class PredictionsConfig(BaseModel):
    words_count: int
    sentence: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, tokenizer
    model, tokenizer = model_script.load_model()

    yield

    model_script.clear_model(model, tokenizer)

app = FastAPI(lifespan=lifespan)

@app.post("/predict")
def generate_prediction(config: PredictionsConfig):
    return model_script.predict(model, tokenizer, config.sentence, config.words_count)
