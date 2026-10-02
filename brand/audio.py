"""Sound for the 3.6-second Linea.js closing animation (Python standard library only).

    python3 audio.py   -> outro.wav (44.1 kHz, 16-bit stereo)
"""
import math
import random
import struct
import wave

SR = 44100
DUR = 3.6
N = int(SR * DUR)
L = [0.0] * N
R = [0.0] * N
rng = random.Random(3)
TAU = 2 * math.pi


def put(t0, s, g=1.0, pan=0.0):
    i0 = int(t0 * SR)
    gl, gr = g * math.sqrt(1 - pan), g * math.sqrt(1 + pan)
    for k, v in enumerate(s):
        if 0 <= i0 + k < N:
            L[i0 + k] += v * gl
            R[i0 + k] += v * gr


def whoosh(length, up=False):
    n = int(length * SR)
    out, y = [], 0.0
    for k in range(n):
        x = k / n
        fc = (500 + 5000 * x) if up else (5000 - 4500 * x)
        a = 1 - math.exp(-TAU * fc / SR)
        y += a * (rng.uniform(-1, 1) - y)
        out.append(y * math.sin(math.pi * x) ** 1.5)
    return out


def bell(f, length=1.8):
    n = int(length * SR)
    return [(math.sin(TAU * f * k / SR) + .4 * math.sin(TAU * f * 2.76 * k / SR) * math.exp(-k / SR * 5)
             + .2 * math.sin(TAU * f * 5.4 * k / SR) * math.exp(-k / SR * 9)) * math.exp(-k / SR * 2.6) * min(1, k / 40) for k in range(n)]


def thump():
    n = int(.5 * SR)
    out, ph = [], 0.0
    for k in range(n):
        t = k / SR
        ph += TAU * (45 + 80 * math.exp(-t * 25)) / SR
        out.append(math.sin(ph) * math.exp(-t * 7))
    return out


def pad(f, length):
    n = int(length * SR)
    return [sum(a * math.sin(TAU * f * m * k / SR) for m, a in ((1, 1), (2, .3), (3, .1))) * min(1, k / (SR * .3)) * min(1, (n - k) / (SR * .6)) for k in range(n)]


put(0.0, whoosh(.55), .25)                      # blue wipe clears
put(.4, thump(), .6)                            # logo lands
for i, f in enumerate((523.25, 659.25, 783.99, 1046.5)):
    put(.45 + i * .07, bell(f, 1.6), .12, (-.4, .4, -.2, .2)[i])
for f in (261.63, 329.63, 392.0):               # warm C major bed
    put(.4, pad(f, 3.2), .05)
for i in range(8):                              # wordmark letters
    put(.95 + i * .05, [math.sin(TAU * (1800 + i * 90) * k / SR) * math.exp(-k / SR * 60) for k in range(int(.05 * SR))], .05, (i / 7) - .5)
put(1.5, whoosh(.7, up=True), .07)
put(1.55, bell(2093.0, 1.4), .06)

for i in range(N):                              # fade out the tail
    g = min(1.0, (DUR - i / SR) / .6)
    L[i] *= g
    R[i] *= g
peak = max(max(map(abs, L)), max(map(abs, R)))
with wave.open('outro.wav', 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(b''.join(struct.pack('<hh', int(math.tanh(a / peak * 1.1) * .85 * 32767), int(math.tanh(b / peak * 1.1) * .85 * 32767)) for a, b in zip(L, R)))
print('outro.wav written')
