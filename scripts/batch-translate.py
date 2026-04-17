#!/usr/bin/env python3
"""Batch translate strings via DeepL API."""
import json
import sys
import urllib.request
import urllib.parse

DEEPL_KEY = "4fba637b-33a0-4508-a9bd-3d548e9e7880"
API_URL = "https://api.deepl.com/v2/translate"

def translate_batch(texts: list[str], target_lang: str) -> list[str]:
    """Translate a batch of texts. DeepL supports up to 50 texts per request."""
    results = []
    for i in range(0, len(texts), 50):
        batch = texts[i:i+50]
        data = urllib.parse.urlencode(
            [("auth_key", DEEPL_KEY), ("target_lang", target_lang), ("source_lang", "EN")]
            + [("text", t) for t in batch]
        ).encode()
        req = urllib.request.Request(API_URL, data=data)
        with urllib.request.urlopen(req) as resp:
            body = json.loads(resp.read())
            results.extend(t["text"] for t in body["translations"])
    return results

if __name__ == "__main__":
    target = sys.argv[1]  # e.g. "ES", "FR", "JA", "PT-PT"
    input_data = json.load(sys.stdin)
    translated = translate_batch(input_data, target)
    json.dump(translated, sys.stdout, ensure_ascii=False, indent=2)
