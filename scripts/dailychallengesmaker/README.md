# Challenges maker

This script takes a JSON file path input, a file output, and will add generated words to the output.

The JSON input format must be the same as a daily challenge, but without the words.

Ex :
```
[
  {
    "date": "2026-10-11",
    "sentence": "Lorem Ipsum"
  },
  {
    "date": "2026-10-12",
    "sentence": "I love to"
  }
]
```

You need to run the backend server at `http://0.0.0.0:8001/` for the script to work.