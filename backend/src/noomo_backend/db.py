# noomo - a llm predictions game
# Copyright (C) 2026  skueee

import os
import sqlite3
import sys
import time
from contextlib import contextmanager
from pathlib import Path
from sqlite3 import Error

db_path = os.getenv(
    "DB_PATH", os.path.join(Path(__file__).resolve().parent, "data/noomo.db")
)


# Creates the connection to sqlite and closes it when the request is finished
@contextmanager
def create_connection(path=db_path):
    connection = None
    try:
        connection = sqlite3.connect(path)
    except Error as e:
        print(f"The error '{e}' occurred when trying to connect to the SQL database")
        sys.exit(1)

    try:
        yield connection
    finally:
        connection.close()


# Creates the db if needed and cleans it
def initdb(path=db_path):
    with create_connection(path) as connection:
        create_top_sentences_table = """
        CREATE TABLE IF NOT EXISTS top_sentences(
        sentence TEXT NOT NULL UNIQUE,
        occurence INTEGER DEFAULT 1,
        last_use DATE NOT NULL
        );
        """

        cursor = connection.cursor()
        cursor.execute(create_top_sentences_table)
        connection.commit()

        cleanup_sentences()


# Adds a sentence to the top sentences
def insert_sentence(sentence):
    with create_connection() as connection:
        request = """
        INSERT INTO top_sentences (sentence, occurence, last_use)
        VALUES (?, 1, ?)
        ON CONFLICT(sentence) DO UPDATE SET
            occurence = occurence + 1,
            last_use = excluded.last_use;
        """

        cursor = connection.cursor()
        cursor.execute(request, (sentence, time.strftime("%Y-%m-%d")))
        connection.commit()


# Search a sentence in the top sentences
def search_for_sentence(sentence):
    with create_connection() as connection:
        cursor = connection.cursor()

        cursor.execute(
            "SELECT EXISTS(SELECT 1 FROM top_sentences WHERE sentence = ? COLLATE NOCASE)",
            (sentence,),
        )
        return bool(cursor.fetchone()[0])


# Deletes old sentences from to top sentences
def cleanup_sentences():
    with create_connection() as connection:
        cleanup_query = """
        DELETE FROM top_sentences
        WHERE
            (occurence = 1 AND last_use <= date('now', '-14 days'))
            OR
            (occurence = 2 AND last_use <= date('now', '-28 days'))
            OR
            (occurence = 3 AND last_use <= date('now', '-42 days'))
            OR
            (last_use <= date('now', '-100 days'));
        """

        cursor = connection.cursor()
        cursor.execute(cleanup_query)
        connection.commit()
        print(f"Deleted {cursor.rowcount} inactive sentences.")


# Gets the top sentences
def get_top_sentences(elements_count):
    with create_connection() as connection:
        query = """
        SELECT *
        FROM top_sentences
        ORDER BY occurence DESC
        LIMIT ?;
        """

        cursor = connection.cursor()
        cursor.execute(
            query,
            (elements_count,),
        )
        response = cursor.fetchall()

        list = []
        for i in response:
            list.append(i[0])

        return list
