# noomo - a llm predictions game
# Copyright (C) 2026  skueee

import asyncio

from contextlib import asynccontextmanager

from fastapi import FastAPI, concurrency
from pydantic import BaseModel
from concurrent.futures import ThreadPoolExecutor

from . import dailychallenges, db, model_script

_predict_executor: ThreadPoolExecutor | None = None

# The request body for /predict
class PredictionsConfig(BaseModel):
    words_count: int
    sentence: str
    prod: bool = False


# Loads the model and the tokenizer, saves it as model and tokenizer
@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, tokenizer, length_bias, _predict_executor
    db.initdb()
    model, tokenizer, length_bias = model_script.load_model()
    _predict_executor = ThreadPoolExecutor(max_workers=1, thread_name_prefix="predict")

    yield

    model_script.clear_model(model, tokenizer)
    _predict_executor.shutdown(wait=True)


app = FastAPI(lifespan=lifespan)


# Predicting words
# Returns an array with dicts containing "word" and "prob" (the word and the probability)
@app.post("/predict")
async def generate_prediction(config: PredictionsConfig):
    if config.prod:
        await concurrency.run_in_threadpool(db.insert_sentence, config.sentence)

    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(
        _predict_executor,
        model_script.predict,
        model,
        tokenizer,
        length_bias,
        config.sentence,
        config.words_count,
    )


# Gets top sentences
# Returns a list with each sentence
@app.get("/top-sentences")
def get_top_sentences(count: int):
    return db.get_top_sentences(count)


# Gets today's daily challenge
# Returns a dict with the data, sentence, and words in the same format as /predict
@app.get("/daily-challenge")
def get_daily_challenge():
    return dailychallenges.get_challenge()
