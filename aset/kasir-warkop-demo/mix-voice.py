"""Adds an ElevenLabs voice-over to the finished Kasir Warkop videos.

    python3 mix-voice.py                 # uses vo/naskah.mp3 (all lines in one file)
    python3 mix-voice.py vo/01.mp3 ...   # or one file per line, in order

One file: the lines are found by the pauses between them (generate with an empty line
between sentences). Each line is placed at the start of its scene (LINES below), the
music ducks under the voice, and the result is loudness-normalised to -14 LUFS.
Output: output/kasir-warkop-demo-vo-16x9.mp4 and output/kasir-warkop-demo-vo-9x16.mp4
(the picture is copied, not re-encoded). Needs ffmpeg (set FFMPEG=... if not on PATH).
"""
import json
import os
import re
import subprocess
import sys

FF = os.environ.get('FFMPEG', 'ffmpeg')
HERE = os.path.dirname(os.path.abspath(__file__))
VIDEOS = os.environ.get('VIDEO_DIR', os.path.join(HERE, '..', '..', 'video', 'kasir-warkop-demo'))
OUT = os.path.join(HERE, 'output')
SR = 44100

# (scene start, scene end, line) — the script in VOICEOVER.md, same order.
LINES = [
    (0.0, 5.5, 'Internet warung putus pas lagi ramai? Tenang, kasirnya tetap jalan.'),
    (5.5, 10.0, 'Kenalin, Kasir Warkop. Sistem kasir untuk warkop dan kedai kopi.'),
    (10.0, 14.0, 'Cukup laptop dan Wi-Fi warung. Internet? Nggak wajib.'),
    (14.0, 21.0, 'Pesanan meja tiga: dua kopi susu, pisang goreng, teh manis. Catatan gula sedikit juga ikut tercatat.'),
    (21.0, 26.8, 'Bayar tunai lima puluh ribu, kembaliannya langsung dihitung, struk langsung keluar.'),
    (26.8, 37.0, 'Pelanggan juga bisa pesan sendiri dari HP di mejanya. Pesanan langsung masuk ke kasir, sekali klik diterima, dan pelanggan langsung dapat kabar.'),
    (37.0, 42.6, 'Semua meja kelihatan. Bon bisa dipindah, digabung, atau dipisah.'),
    (42.6, 46.8, 'Stok mau habis? Langsung ketahuan.'),
    (46.8, 51.8, 'Tutup kas tiap malam. Selisih dua ribu pun kelihatan.'),
    (51.8, 56.4, 'Laporan bulanan, dari menu terlaris sampai jam paling ramai.'),
    (56.4, 62.0, 'Kasir Warkop. Internet putus, kasir tetap jalan. Minta demonya sekarang.'),
]
LEAD = 0.25        # voice starts this long after the scene cut
MAX_TEMPO = 1.12   # a line that is too long for its scene is sped up at most this much


def run(args, **kw):
    return subprocess.run([FF, '-hide_banner', '-nostdin', '-y', *args], check=True, capture_output=True, text=True, **kw)


def duration(path):
    out = subprocess.run([FF, '-hide_banner', '-nostdin', '-i', path], capture_output=True, text=True).stderr
    h, m, s = re.search(r'Duration: (\d+):(\d+):([\d.]+)', out).groups()
    return int(h) * 3600 + int(m) * 60 + float(s)


def split_by_pauses(path, n):
    """Return n (start, end) speech spans, cutting at the n-1 longest pauses."""
    total = duration(path)
    err = subprocess.run([FF, '-hide_banner', '-nostdin', '-i', path, '-af', 'silencedetect=noise=-38dB:d=0.35', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', err)]
    ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', err)]
    pairs = list(zip(starts, ends)) + ([(starts[-1], total)] if len(starts) > len(ends) else [])
    head = next((e for s, e in pairs if s <= 0.1), 0.0)            # silence before the first line
    tail = next((s for s, e in pairs if e >= total - 0.3), total)  # silence after the last line
    gaps = [(e - s, s, e) for s, e in pairs if s > 0.1 and e < total - 0.3]
    if len(gaps) < n - 1:
        sys.exit(f'Found {len(gaps) + 1} lines in {path}, expected {n}. Leave a clear pause (an empty line) between sentences, '
                 'or export one file per line.')
    cuts = sorted(sorted(gaps, reverse=True)[:n - 1], key=lambda g: g[1])
    spans, at = [], head
    for _, s, e in cuts:
        spans.append((at, s))
        at = e
    spans.append((at, tail))
    return [(path, s, e) for s, e in spans]


def main():
    files = sys.argv[1:] or [os.path.join(HERE, 'vo', 'naskah.mp3')]
    if len(files) == 1:
        parts = split_by_pauses(files[0], len(LINES))
    elif len(files) == len(LINES):
        parts = [(f, 0.0, duration(f)) for f in files]
    else:
        sys.exit(f'Give one file with all {len(LINES)} lines, or {len(LINES)} files in order.')

    os.makedirs(OUT, exist_ok=True)
    inputs, chains, labels, report = [], [], [], []
    for i, ((src, s, e), (t0, t1, text)) in enumerate(zip(parts, LINES)):
        length = e - s
        room = t1 - t0 - LEAD - 0.15
        tempo = min(MAX_TEMPO, max(1.0, length / room)) if room > 0 else MAX_TEMPO
        fits = length / tempo <= room + 0.01
        report.append({'line': i + 1, 'at': round(t0 + LEAD, 2), 'length': round(length, 2), 'room': round(room, 2),
                       'tempo': round(tempo, 3), 'fits': fits, 'text': text})
        inputs += ['-ss', f'{s:.3f}', '-t', f'{length:.3f}', '-i', src]
        delay = int((t0 + LEAD) * 1000)
        chains.append(f'[{i}:a]aresample={SR},aformat=channel_layouts=mono,atempo={tempo:.4f},'
                      f'afade=t=in:d=0.02,afade=t=out:st={max(0, length / tempo - 0.06):.3f}:d=0.06,'
                      f'adelay={delay}|{delay}[v{i}]')
        labels.append(f'[v{i}]')
    n = len(parts)
    voice = ';'.join(chains) + f';{"".join(labels)}amix=inputs={n}:normalize=0,pan=stereo|c0=c0|c1=c0,volume=1.0[vo]'

    for fmt in ('16x9', '9x16'):
        video = os.path.join(VIDEOS, f'kasir-warkop-demo-{fmt}.mp4')
        out = os.path.join(OUT, f'kasir-warkop-demo-vo-{fmt}.mp4')
        graph = (voice + f';[{n}:a]aresample={SR}[mus];[vo]apad=whole_dur={duration(video):.3f},asplit=2[vo1][vo2];'
                 '[mus][vo1]sidechaincompress=threshold=0.02:ratio=10:attack=15:release=350:makeup=1[duck];'
                 '[duck][vo2]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=9[a]')
        run([*inputs, '-i', video, '-filter_complex', graph, '-map', f'{n}:v:0', '-map', '[a]',
             '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', str(SR), '-shortest', '-movflags', '+faststart', out])
        print('written', os.path.relpath(out, HERE))

    with open(os.path.join(OUT, 'voice-timing.json'), 'w') as f:
        json.dump(report, f, indent=1, ensure_ascii=False)
    for r in report:
        flag = '' if r['fits'] else '  <- terlalu panjang, persingkat kalimatnya'
        print(f"{r['line']:>2}  {r['at']:>5}s  {r['length']:>5}s / {r['room']:>5}s  x{r['tempo']}{flag}")


if __name__ == '__main__':
    main()
