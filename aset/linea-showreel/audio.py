"""Music and sound effects for the 30-second promo, synthesised from scratch
(Python standard library only). Cue times match stage.html (LineaJS showreel).

    python3 audio.py            -> audio.wav (44.1 kHz, 16-bit stereo)
"""
import math
import random
import struct
import wave
from array import array

SR = 44100
DUR = 30.0
N = int(SR * DUR)
L = array('d', bytes(8 * N))
R = array('d', bytes(8 * N))
rng = random.Random(7)
TAU = 2 * math.pi


def put(t0, samples, gain=1.0, pan=0.0, delay_r=0):
    """Mix a list of mono samples in at time t0 (seconds). pan -1..1."""
    i0 = int(t0 * SR)
    gl = gain * math.sqrt((1 - pan) / 2) * math.sqrt(2)
    gr = gain * math.sqrt((1 + pan) / 2) * math.sqrt(2)
    for k, v in enumerate(samples):
        i = i0 + k
        if 0 <= i < N:
            L[i] += v * gl
        j = i + delay_r
        if 0 <= j < N:
            R[j] += v * gr


def env_adsr(n, a, d, s, r, sustain_len):
    """Attack/decay/sustain/release envelope, all times in seconds."""
    out = []
    A, D, S, Rl = int(a * SR), int(d * SR), int(sustain_len * SR), int(r * SR)
    for k in range(n):
        if k < A:
            e = k / max(A, 1)
        elif k < A + D:
            e = 1 - (1 - s) * (k - A) / max(D, 1)
        elif k < A + D + S:
            e = s
        else:
            e = s * max(0.0, 1 - (k - A - D - S) / max(Rl, 1))
        out.append(e)
    return out


def tone(freq, length, harmonics=((1, 1.0),), a=0.01, d=0.1, s=0.7, r=0.3, detune=0.0, vib=0.0):
    n = int((length + r) * SR)
    e = env_adsr(n, a, d, s, r, max(0.0, length - a - d))
    out = []
    ph = [0.0] * len(harmonics)
    for k in range(n):
        f = freq * (1 + detune) * (1 + vib * math.sin(TAU * 5 * k / SR))
        v = 0.0
        for h, (mul, amp) in enumerate(harmonics):
            ph[h] += TAU * f * mul / SR
            v += amp * math.sin(ph[h])
        out.append(v * e[k])
    return out


def pluck(freq, length=0.6, bright=0.5):
    n = int(length * SR)
    out = []
    for k in range(n):
        t = k / SR
        e = math.exp(-t * 7)
        v = math.sin(TAU * freq * t) + bright * math.exp(-t * 18) * math.sin(TAU * freq * 2 * t) + 0.25 * bright * math.exp(-t * 30) * math.sin(TAU * freq * 3 * t)
        out.append(v * e * min(1.0, k / 60))
    return out


def noise(length, lp_from=8000, lp_to=8000, hp=0.0, decay=None, rise=False):
    """Filtered noise burst: one-pole low-pass sweeping lp_from -> lp_to, optional high-pass."""
    n = int(length * SR)
    out = []
    y = 0.0
    lo = 0.0
    for k in range(n):
        x = rng.uniform(-1, 1)
        frac = k / max(n - 1, 1)
        fc = lp_from * (lp_to / lp_from) ** frac
        a = 1 - math.exp(-TAU * fc / SR)
        y += a * (x - y)
        v = y
        if hp:
            ah = 1 - math.exp(-TAU * hp / SR)
            lo += ah * (v - lo)
            v = v - lo
        if decay:
            v *= math.exp(-k / SR * decay)
        if rise:
            v *= frac ** 2
        out.append(v)
    return out


def fade_edges(s, fi=0.01, fo=0.05):
    n = len(s)
    a, b = int(fi * SR), int(fo * SR)
    for k in range(min(a, n)):
        s[k] *= k / a
    for k in range(min(b, n)):
        s[n - 1 - k] *= k / b
    return s


def whoosh(length=0.7, up=True):
    s = noise(length, 400 if up else 5000, 5000 if up else 400, hp=150)
    n = len(s)
    for k in range(n):
        x = k / n
        s[k] *= math.sin(math.pi * x) ** 1.5
    return s


def kick():
    n = int(0.28 * SR)
    out, ph = [], 0.0
    for k in range(n):
        t = k / SR
        f = 48 + 90 * math.exp(-t * 28)
        ph += TAU * f / SR
        out.append(math.sin(ph) * math.exp(-t * 11) + 0.08 * math.exp(-t * 300) * rng.uniform(-1, 1))
    return out


def hat():
    return noise(0.06, 9000, 9000, hp=6000, decay=60)


def clap():
    s = noise(0.18, 2500, 1500, hp=700, decay=22)
    for k in range(min(len(s), int(0.02 * SR))):  # little double-hit
        if int(0.008 * SR) < k < int(0.011 * SR):
            s[k] *= 0.2
    return s


def ding(freq, length=1.2):
    n = int(length * SR)
    out = []
    for k in range(n):
        t = k / SR
        out.append((math.sin(TAU * freq * t) + 0.45 * math.sin(TAU * freq * 2.76 * t) * math.exp(-t * 6) + 0.2 * math.sin(TAU * freq * 5.4 * t) * math.exp(-t * 12)) * math.exp(-t * 4.5) * min(1.0, k / 40))
    return out


def blip(f0, f1, length=0.09):
    n = int(length * SR)
    out, ph = [], 0.0
    for k in range(n):
        x = k / n
        f = f0 + (f1 - f0) * x
        ph += TAU * f / SR
        out.append(math.sin(ph) * math.sin(math.pi * x) ** 0.6)
    return out


def bubble_pop():
    n = int(0.22 * SR)
    out, ph = [], 0.0
    for k in range(n):
        t = k / SR
        f = 300 + 1500 * math.exp(-t * 35)
        ph += TAU * f / SR
        out.append(math.sin(ph) * math.exp(-t * 22) + 0.35 * rng.uniform(-1, 1) * math.exp(-t * 90))
    return out


# ---------------------------------------------------------------------------
# 0 – 3.6 s: type slams. A hit on every line, a ticking hat, a riser into the drop.
for f, g in ((55.0, 0.10), (82.41, 0.06)):
    put(0.0, fade_edges(tone(f, 3.4, ((1, 1), (2, .35)), a=0.3, d=0.2, s=1.0, r=0.2), 0.2, 0.2), g, 0.0, 300)
for i in range(5):
    t = 0.15 + i * 0.32
    put(t, kick(), 0.45)
    put(t, noise(0.12, 4000, 1500, hp=300, decay=30), 0.12, (-0.3, 0.3)[i % 2])
t = 0.0
while t < 3.4:
    put(t, hat(), 0.06, 0.25)
    t += 0.136
put(2.4, noise(1.2, 300, 8000, hp=120, rise=True), 0.2, 0.0, 500)
put(3.1, whoosh(0.5), 0.18)

# ---------------------------------------------------------------------------
# 4.6 – 30 s: bright, friendly loop at 110 BPM — C G Am F.
BPM = 110
BEAT = 60 / BPM
BAR = 4 * BEAT
START = 3.6
CHORDS = {
    'C': ((261.63, 329.63, 392.00), 65.41),
    'G': ((246.94, 293.66, 392.00), 98.00),
    'Am': ((261.63, 329.63, 440.00), 110.00),
    'F': ((261.63, 349.23, 440.00), 87.31),
}
PROG = ['C', 'G', 'Am', 'F', 'C', 'G', 'Am', 'F', 'C', 'G', 'Am', 'F', 'C']
PAD_H = ((1, 1.0), (2, 0.28), (3, 0.12), (4, 0.05))
ARP = [0, 1, 2, 1, 2, 1, 0, 1]
for b, name in enumerate(PROG):
    t0 = START + b * BAR
    if t0 >= DUR:
        break
    notes, bass = CHORDS[name]
    last = b == len(PROG) - 1
    length = min(BAR + (1.6 if last else 0.0), DUR - t0)
    for i, f in enumerate(notes):
        put(t0, tone(f, length, PAD_H, a=0.25, d=0.4, s=0.75, r=0.6 if not last else 0.2, detune=(-0.002, 0.0, 0.002)[i]), 0.055, (-0.4, 0.0, 0.4)[i], 400)
    # bass: root on 1 and the "and" of 2, octave pop on 3
    for off, mul, ln in ((0, 1, 0.45), (1.5, 1, 0.25), (2, 2, 0.35), (3, 1, 0.4)):
        if last and off > 0:
            break
        put(t0 + off * BEAT, tone(bass * mul, ln if not last else 1.4, ((1, 1), (2, .3)), a=0.005, d=0.12, s=0.6, r=0.12), 0.2)
    # pluck arpeggio in eighths (sparser in the first bar)
    if not last:
        for k, idx in enumerate(ARP):
            if b == 0 and k % 2:
                continue
            put(t0 + k * BEAT / 2, pluck(notes[idx] * 2, 0.5), 0.085, (-0.35, 0.35)[k % 2])
    # drums
    for beat in range(4):
        tb = t0 + beat * BEAT
        if last and beat > 0:
            break
        put(tb, kick(), 0.42)
        if b >= 1 and not last:
            put(tb + BEAT / 2, hat(), 0.09, 0.25)
            if beat in (1, 3):
                put(tb, clap(), 0.1, -0.1, 200)
    if b in (4, 8):  # little lift into the next section
        put(t0 + 3 * BEAT, noise(BEAT, 800, 9000, hp=400, rise=True), 0.09)

# ---------------------------------------------------------------------------
# Sound effects on the visual cues
for t in (3.95, 8.4, 14.0, 19.0, 24.05):          # big moves
    put(t, whoosh(0.7), 0.2, 0.0, 600)
put(4.5, whoosh(0.5), 0.1, 0.4, 300)              # phone slides in
for t in (5.1, 6.3, 25.9):                        # stickers / button
    put(t, bubble_pop(), 0.22)
for t in (6.2, 7.4):                              # browser pages
    put(t, blip(900, 1200, 0.05), 0.08, 0.3)
for i in range(6):                                # project cards land
    put(9.5 + i * 0.55, kick(), 0.2)
    put(9.55 + i * 0.55, pluck(523.25 * (1, 1.12, 1.26, 1.5, 1.68, 2)[i], 0.4), 0.12, (-0.4, 0.4)[i % 2])
for i in range(4):                                # service rows light up
    put(16.2 + i * 0.55, blip(700 + i * 120, 1000 + i * 120, 0.08), 0.12, 0.2)
for i in range(5):                                # price cards
    put(20.0 + i * 0.2, pluck(784 * (1, 1.12, 1.26, 1.5, 2)[i], 0.35), 0.12, (-0.3, 0.3)[i % 2])
put(22.0, ding(1568, 0.9), 0.1, 0.3)              # best value
put(24.6, kick(), 0.4)                            # LINEA JS lands
put(25.3, blip(500, 900, 0.08), 0.14, 0.3)        # cat
for i in range(7):                                # sparkle under the CTA
    f = (2093, 2637, 3136, 3520, 4186)[i % 5]
    put(26.4 + i * 0.07, ding(f, 0.5), 0.04, (-0.6, -0.2, 0.2, 0.6)[i % 4])

# ---------------------------------------------------------------------------
# Master: gentle fade out, soft clip, normalise, write.
fo0 = int(28.9 * SR)
for i in range(fo0, N):
    g = 1 - (i - fo0) / (N - fo0)
    L[i] *= g
    R[i] *= g
for i in range(int(0.02 * SR)):
    L[i] *= i / (0.02 * SR)
    R[i] *= i / (0.02 * SR)
peak = max(max(abs(x) for x in L), max(abs(x) for x in R))
drive = 1.15 / peak
with wave.open('audio.wav', 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    frames = bytearray()
    for i in range(N):
        a = math.tanh(L[i] * drive) * 0.89
        b = math.tanh(R[i] * drive) * 0.89
        frames += struct.pack('<hh', int(a * 32767), int(b * 32767))
    w.writeframes(bytes(frames))
print('audio.wav written, peak before drive %.3f' % peak)
