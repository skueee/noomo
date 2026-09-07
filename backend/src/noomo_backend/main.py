# noomo - a llm predictions game
# Copyright (C) 2026  skueee

from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel

from . import model_script


# The request body for /predict
class PredictionsConfig(BaseModel):
    words_count: int
    sentence: str
    prod: bool = False

# Loads the model and the tokenizer, saves it as model and tokenizer
@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, tokenizer, length_bias
    model, tokenizer, length_bias = model_script.load_model()

    yield

    model_script.clear_model(model, tokenizer)

app = FastAPI(lifespan=lifespan)

# Predicting words
# Returns an array with dicts containing "word" and "prob" (the word and the probability)
@app.post("/predict")
def generate_prediction(config: PredictionsConfig):
    return model_script.predict(model, tokenizer, length_bias, config.sentence, config.words_count)
