#!/bin/bash
# Usage: ./scripts/translate.sh "text to translate" "TARGET_LANG"
# Example: ./scripts/translate.sh "Hello world" "ES"
# Supported: ES (Spanish), FR (French), JA (Japanese), PT-PT (Portuguese)

DEEPL_KEY="4fba637b-33a0-4508-a9bd-3d548e9e7880"
TEXT="$1"
TARGET="$2"

curl -s -X POST 'https://api.deepl.com/v2/translate' \
  -H "Authorization: DeepL-Auth-Key $DEEPL_KEY" \
  -d "text=$TEXT" \
  -d "target_lang=$TARGET" \
  -d "source_lang=EN" | python3 -c "import sys,json; print(json.load(sys.stdin)['translations'][0]['text'])"
