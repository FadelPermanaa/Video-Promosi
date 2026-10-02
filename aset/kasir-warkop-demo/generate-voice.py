"""Generates the Kasir Warkop voice-over with the ElevenLabs API, then mixes it into the videos.

    python3 generate-voice.py                  # 11 lines → vo/01.mp3 … vo/11.mp3 → mix-voice.py
    python3 generate-voice.py --list-voices    # voices on the account (id, name, language)
    python3 generate-voice.py --only 4,6       # regenerate some lines only, then mix again

The API key is read from ELEVENLABS_API_KEY and sent as the `xi-api-key` header. When the
key is instead injected by a proxy (cloud environment "API credentials"), leave
ELEVENLABS_API_KEY unset and the request goes out without its own key header.
Voice and model can be changed with ELEVENLABS_VOICE_ID and ELEVENLABS_MODEL.
"""
import json
import os
import subprocess
import sys
import urllib.error
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from importlib import import_module

LINES = [text for _, _, text in import_module('mix-voice').LINES]

API = 'https://api.elevenlabs.io/v1'
KEY = os.environ.get('ELEVENLABS_API_KEY', '').strip()
VOICE = os.environ.get('ELEVENLABS_VOICE_ID', '')
MODEL = os.environ.get('ELEVENLABS_MODEL', 'eleven_multilingual_v2')
SETTINGS = {'stability': 0.5, 'similarity_boost': 0.75, 'style': 0.1, 'use_speaker_boost': True, 'speed': 1.0}


def call(path, body=None, accept='application/json'):
    headers = {'Accept': accept}
    if KEY:
        headers['xi-api-key'] = KEY
    data = None
    if body is not None:
        data = json.dumps(body).encode()
        headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(API + path, data=data, headers=headers, method='POST' if data else 'GET')
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.read()
    except urllib.error.HTTPError as e:
        sys.exit(f'ElevenLabs {e.code} on {path}: {e.read()[:300].decode(errors="replace")}')


def voices():
    return json.loads(call('/voices'))['voices']


def pick_voice():
    if VOICE:
        return VOICE
    vs = voices()
    # Prefer the user's own / library voices labelled Indonesian, then any multilingual premade voice.
    def lang(v):
        return ' '.join(str(x) for x in (v.get('labels') or {}).values()).lower() + ' ' + str(v.get('verified_languages') or '').lower()
    for v in vs:
        if 'indonesia' in lang(v) or ' id' in lang(v):
            return v['voice_id']
    own = [v for v in vs if v.get('category') in ('cloned', 'professional', 'generated')]
    return (own or vs)[0]['voice_id']


def main():
    if '--list-voices' in sys.argv:
        for v in voices():
            labels = ', '.join(f'{k}: {x}' for k, x in (v.get('labels') or {}).items())
            print(f"{v['voice_id']}  {v['name']:<24} {v.get('category', ''):<12} {labels}")
        return
    only = None
    if '--only' in sys.argv:
        only = {int(x) for x in sys.argv[sys.argv.index('--only') + 1].split(',')}

    voice = pick_voice()
    print('voice', voice, 'model', MODEL)
    os.makedirs(os.path.join(HERE, 'vo'), exist_ok=True)
    files = []
    for i, text in enumerate(LINES, 1):
        out = os.path.join(HERE, 'vo', f'{i:02d}.mp3')
        files.append(out)
        if only and i not in only and os.path.exists(out):
            continue
        body = {
            'text': text,
            'model_id': MODEL,
            'voice_settings': SETTINGS,
            # Neighbouring lines keep the delivery consistent from one line to the next.
            'previous_text': LINES[i - 2] if i > 1 else None,
            'next_text': LINES[i] if i < len(LINES) else None,
        }
        audio = call(f'/text-to-speech/{voice}?output_format=mp3_44100_192', body, accept='audio/mpeg')
        with open(out, 'wb') as f:
            f.write(audio)
        print(f'{i:02d}  {len(audio) // 1024} KB  {text}')
    subprocess.run([sys.executable, os.path.join(HERE, 'mix-voice.py'), *files], check=True)


if __name__ == '__main__':
    main()
