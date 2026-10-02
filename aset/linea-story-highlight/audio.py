"""Scores one continuous track per highlight from cues/<highlight>.json (written by
`node render.js cues`). Python standard library only.

    python3 audio.py              -> audio/<highlight>.wav for every highlight
    python3 audio.py tentang      -> just one

The music is a 100 BPM groove (kick, snare, clap, hats, bass, electric piano, pad and
a plucked hook) whose bars line up with the scene changes. Every cut gets a drum fill,
a riser and a hit, and the sound effects come from the animation itself (text sweeps,
pops, checks, counters, typing, stamps). Everything shares one reverb and the keys
duck under the kick.
"""
import json
import math
import os
import random
import struct
import sys
import wave
from array import array

SR = 44100
TAU = 2 * math.pi
HERE = os.path.dirname(os.path.abspath(__file__))
KEYS = {'tentang': 0, 'layanan': 2, 'karya': 3, 'bedanya': 4, 'proses': 5, 'kontak': 7}  # semitones above A


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


class Mix:
    def __init__(self, dur):
        self.n = int(dur * SR) + SR
        self.bus = {k: (array('d', bytes(8 * self.n)), array('d', bytes(8 * self.n))) for k in ('drums', 'bass', 'keys', 'lead', 'sfx', 'send')}
        self.rng = random.Random(11)

    def put(self, bus, t, samples, gain=1.0, pan=0.0, send=0.0):
        L, R = self.bus[bus]
        SL, SR_ = self.bus['send']
        gl, gr = gain * math.sqrt((1 - pan) / 2) * 1.414, gain * math.sqrt((1 + pan) / 2) * 1.414
        i0 = int(t * SR)
        n = self.n
        for k, v in enumerate(samples):
            i = i0 + k
            if 0 <= i < n:
                L[i] += v * gl
                R[i] += v * gr
                if send:
                    SL[i] += v * gl * send
                    SR_[i] += v * gr * send


# ---------- instruments ----------
def env(n, a, r):
    A, Rl = max(1, int(a * SR)), max(1, int(r * SR))
    return [min(1.0, k / A) * (1.0 if k < n - Rl else max(0.0, (n - k) / Rl)) for k in range(n)]


def kick():
    n = int(.42 * SR)
    out, ph = [], 0.0
    for k in range(n):
        t = k / SR
        ph += TAU * (46 + 110 * math.exp(-t * 32)) / SR
        out.append(math.tanh(1.6 * math.sin(ph) * math.exp(-t * 7.5)) + .25 * math.exp(-t * 400) * math.sin(TAU * 3000 * t))
    return out


def noise(n, rng, hp=0.0, lp=20000.0):
    out, lo, y = [], 0.0, 0.0
    a_lp = 1 - math.exp(-TAU * lp / SR)
    a_hp = 1 - math.exp(-TAU * hp / SR) if hp else 0
    for _ in range(n):
        y += a_lp * (rng.uniform(-1, 1) - y)
        if hp:
            lo += a_hp * (y - lo)
            out.append(y - lo)
        else:
            out.append(y)
    return out


def snare(rng):
    n = int(.3 * SR)
    nz = noise(n, rng, hp=1200, lp=9000)
    return [nz[k] * math.exp(-k / SR * 16) * .9 + .5 * math.sin(TAU * 190 * k / SR) * math.exp(-k / SR * 28) for k in range(n)]


def clap(rng):
    n = int(.25 * SR)
    nz = noise(n, rng, hp=900, lp=6000)
    out = []
    for k in range(n):
        t = k / SR
        e = math.exp(-t * 20) + (.6 if t < .012 else 0) * math.exp(-(t % .006) * 600)
        out.append(nz[k] * e * .8)
    return out


def hat(rng, open_=False):
    n = int((.32 if open_ else .07) * SR)
    nz = noise(n, rng, hp=7000)
    d = 9 if open_ else 55
    return [nz[k] * math.exp(-k / SR * d) for k in range(n)]


def bass_note(f, length):
    n = int(length * SR)
    out, ph = [], 0.0
    e = env(n, .006, .06)
    for k in range(n):
        ph += f / SR
        t = k / SR
        bright = 2 + 5 * math.exp(-t * 9)
        v = sum(math.sin(TAU * ph * h) / h * (1 if h <= bright else .2) for h in range(1, 6))
        out.append(math.tanh(v * 1.2) * e[k])
    return out


def epiano(f, length, vel=1.0):
    n = int((length + .5) * SR)
    out = []
    for k in range(n):
        t = k / SR
        rel = 1.0 if t < length else math.exp(-(t - length) * 9)
        trem = 1 + .12 * math.sin(TAU * 4.5 * t)
        v = (math.sin(TAU * f * t) + .32 * math.sin(TAU * 2 * f * t) * math.exp(-t * 3)
             + .18 * math.sin(TAU * 7.03 * f * t) * math.exp(-t * 16))
        out.append(v * math.exp(-t * 1.4) * rel * trem * vel * min(1, k / 30))
    return out


def pad(fs, length):
    n = int(length * SR)
    e = env(n, .6, .8)
    out = [0.0] * n
    for f in fs:
        for det in (-.004, .004):
            ff = f * (1 + det)
            w = TAU * ff / SR
            for k in range(n):
                p = w * k
                out[k] += (math.sin(p) + .3 * math.sin(2 * p) + .12 * math.sin(3 * p)) * e[k]
    return [v / (len(fs) * 2) for v in out]


def pluck(f, length, rng, bright=.5):
    """Karplus-Strong plucked string."""
    period = max(2, int(SR / f))
    buf = [rng.uniform(-1, 1) for _ in range(period)]
    n = int(length * SR)
    out = []
    i = 0
    for _ in range(n):
        cur = buf[i]
        nxt = .5 * (cur + buf[(i + 1) % period]) * .996
        buf[i] = nxt * (1 - bright) + cur * bright * .996
        out.append(cur)
        i = (i + 1) % period
    return [v * min(1, k / 40) for k, v in enumerate(out)]


# ---------- sound effects ----------
def whoosh(length, rng, up=True):
    n = int(length * SR)
    out, y = [], 0.0
    for k in range(n):
        x = k / n
        fc = 400 + 7000 * (x if up else 1 - x) ** 1.6
        y += (1 - math.exp(-TAU * fc / SR)) * (rng.uniform(-1, 1) - y)
        out.append(y * math.sin(math.pi * x) ** 1.4)
    return out


def boom(f0=60, length=.9, punch=1.0):
    n = int(length * SR)
    out, ph = [], 0.0
    for k in range(n):
        t = k / SR
        ph += TAU * (f0 + 70 * math.exp(-t * 18)) / SR
        out.append(math.tanh(2 * math.sin(ph)) * math.exp(-t * 4.2) * punch)
    return out


def bell(f, length=1.2, bright=1.0):
    n = int(length * SR)
    return [(math.sin(TAU * f * k / SR) + .45 * bright * math.sin(TAU * f * 2.76 * k / SR) * math.exp(-k / SR * 6)
             + .2 * bright * math.sin(TAU * f * 5.4 * k / SR) * math.exp(-k / SR * 12)) * math.exp(-k / SR * 4) * min(1, k / 30) for k in range(n)]


def blip(f0, f1, length):
    n = int(length * SR)
    out, ph = [], 0.0
    for k in range(n):
        x = k / n
        ph += TAU * (f0 + (f1 - f0) * x) / SR
        out.append(math.sin(ph) * math.sin(math.pi * x) ** .7)
    return out


def drop(f, length=.18, up=True):
    """Water-drop pop used for chat bubbles and cards."""
    n = int(length * SR)
    out, ph = [], 0.0
    for k in range(n):
        t = k / SR
        ff = f * (1 + (1.8 if up else -.45) * (1 - math.exp(-t * 40)))
        ph += TAU * ff / SR
        out.append(math.sin(ph) * math.exp(-t * 26))
    return out


def click(rng, f=2600):
    n = int(.03 * SR)
    return [(math.sin(TAU * f * k / SR) * .6 + rng.uniform(-1, 1) * .5) * math.exp(-k / SR * 260) for k in range(n)]


# ---------- reverb (Schroeder: four damped combs, two all-passes) ----------
def reverb(x, delays, decay=.84, damp=.35):
    n = len(x)
    out = array('d', bytes(8 * n))
    for d in delays:
        buf = [0.0] * d
        idx = 0
        lp = 0.0
        for i in range(n):
            y = buf[idx]
            lp = y * (1 - damp) + lp * damp
            buf[idx] = x[i] + lp * decay
            out[i] += y
            idx += 1
            if idx == d:
                idx = 0
    for d, g in ((225, .5), (556, .5)):
        buf = [0.0] * d
        idx = 0
        for i in range(n):
            b = buf[idx]
            y = -out[i] + b
            buf[idx] = out[i] + b * g
            out[i] = y
            idx += 1
            if idx == d:
                idx = 0
    return out


# ---------- score one highlight ----------
def score(hid, info):
    dur = info['duration']
    beat = 60 / info['bpm']
    bar = beat * 4
    end = info['end']
    cuts = info['cuts']
    key = 57 + KEYS.get(hid, 0)          # A3 + offset
    m = Mix(dur)
    rng = m.rng
    prog = [(0, 3, 7), (-4, 0, 3), (3, 7, 10), (-2, 2, 5)]   # i - VI - III - VII
    roots = [0, -4, 3, -2]
    scale = [0, 3, 5, 7, 10]                                 # minor pentatonic for hooks and sfx

    def tone(i, octv=0):
        return midi(key + 12 + scale[i % 5] + 12 * (octv + i // 5))

    K, SN, CL = kick(), snare(rng), clap(rng)
    HC, HO = hat(rng), hat(rng, True)
    kicks = []

    def near_cut(t):
        return any(c - beat <= t < c + beat * .25 for c in cuts + [end])

    b = 0
    while b * bar < end:
        t0 = b * bar
        ch = b % 4
        notes = [midi(key + 12 + x) for x in prog[ch]]
        intro = b == 0
        # pad (whole bar) and electric piano (downbeat + offbeat stabs)
        m.put('keys', t0, pad([f / 2 for f in notes], min(bar + .3, end - t0 + .6)), .3, 0, .4)
        for f in notes:
            m.put('keys', t0, epiano(f, beat * 1.6, .9), .08, rng.uniform(-.3, .3), .35)
            if not intro:
                for off in (2.5, 3.5):
                    if t0 + off * beat < end:
                        m.put('keys', t0 + off * beat, epiano(f, beat * .4, .55), .055, rng.uniform(-.4, .4), .35)
        # bass
        r = midi(key - 12 + roots[ch])
        if not intro:
            for off, mult, ln in ((0, 1, .7), (.75, 1, .2), (1.5, 1, .4), (2, 2, .3), (2.5, 1, .4), (3.5, 1, .4)):
                tt = t0 + off * beat
                if tt < end:
                    m.put('bass', tt, bass_note(r * mult, ln * beat * 1.6), .26)
        # drums
        for k8 in range(8):
            tt = t0 + k8 * beat / 2
            if tt >= end:
                break
            if intro:
                if k8 >= 4:
                    m.put('drums', tt, HC, .05 + .01 * k8, .3)
                continue
            if k8 in (0, 3, 4):
                m.put('drums', tt, K, .72)
                kicks.append(tt)
            if k8 in (2, 6):
                m.put('drums', tt, SN, .24, .05, .2)
                m.put('drums', tt, CL, .2, -.1, .25)
            m.put('drums', tt, HO if k8 % 2 else HC, .065 if k8 % 2 else .09, .3)
            if k8 % 2 and rng.random() < .35:
                m.put('drums', tt + beat / 4, HC, .045, .35)
        # plucked hook from bar 2 on, two-bar phrase
        if b >= 1:
            phrase = [(0, 4), (1, 3), (1.5, 2), (2.5, 4), (3, 5)] if b % 2 else [(0, 2), (.5, 3), (1.5, 4), (2, 3), (3, 1)]
            for off, deg in phrase:
                tt = t0 + off * beat
                if tt < end and not near_cut(tt):
                    m.put('lead', tt, pluck(tone(deg + ch % 2), .9, rng), .15, rng.uniform(-.25, .25), .45)
        b += 1

    # cuts: snare fill, riser and a hit on the downbeat
    for c in cuts + [end]:
        for k16 in range(4):
            m.put('drums', c - beat + k16 * beat / 4, SN, .08 + .05 * k16, rng.uniform(-.2, .2), .2)
        m.put('sfx', c - bar / 2, whoosh(bar / 2, rng, True), .13, 0, .3)
        m.put('drums', c, K, .8)
        m.put('sfx', c, boom(52, 1.0, .9), .32, 0, .3)
        m.put('sfx', c, hat(rng, True), .15, .2, .5)

    # ending: tonic chord and bells under the logo
    tonic = [midi(key + 12 + x) for x in prog[0]]
    m.put('keys', end, pad([f / 2 for f in tonic], dur - end + .5), .4, 0, .6)
    for i, f in enumerate(tonic + [tonic[0] * 2]):
        m.put('keys', end + .25 + i * .09, epiano(f, 2.4, .8), .1, (-.4, .4, -.2, .2)[i], .6)
    m.put('bass', end, bass_note(midi(key - 12), 2.4), .28)

    # sound effects from the animation
    for c in info['cues']:
        t, k, v = c['t'], c['k'], c.get('v') or 0
        if k == 'whoosh':
            m.put('sfx', t, whoosh(.8, rng), .28, -.3 + .6 * rng.random(), .25)
        elif k in ('hit', 'end'):
            m.put('sfx', t, click(rng, 1800), .22, 0, .4)
        elif k == 'open':
            m.put('sfx', 0, whoosh(.6, rng, False), .25, 0, .3)
            for i in range(4):
                m.put('sfx', .05 + i * .05, bell(tone(i + 3), .9), .06, (-.5, .5, -.2, .2)[i], .6)
        elif k == 'swish':
            nz = noise(int(.28 * SR), rng, hp=3500)
            m.put('sfx', t, [x * math.sin(math.pi * i / len(nz)) ** 1.5 for i, x in enumerate(nz)], .13, .2, .3)
        elif k == 'tick':
            m.put('sfx', t, click(rng), .13, rng.uniform(-.4, .4), .2)
        elif k == 'pop':
            m.put('sfx', t, drop(tone(v + 2) / 2, .16), .2, -.3 + .2 * v, .3)
        elif k == 'check':
            m.put('sfx', t, bell(tone(v + 4), .5), .075, .2, .4)
            m.put('sfx', t + .07, bell(tone(v + 6), .6), .065, .2, .4)
        elif k == 'count':
            tt, step = 0.0, .035
            while tt < 1.1:
                m.put('sfx', t + tt, click(rng, 3200), .055, .3, .1)
                tt += step
                step *= 1.12
        elif k == 'slide':
            m.put('sfx', t, whoosh(.35, rng), .1, -.4, .2)
        elif k == 'boom':
            m.put('sfx', t, boom(70, .8, .8), .28, 0, .4)
            m.put('sfx', t + .05, bell(tone(5), 1.0), .065, .3, .6)
        elif k == 'rise':
            m.put('sfx', t, whoosh(.6, rng, True), .12, .3, .3)
        elif k == 'deny':
            for i in range(2):
                m.put('sfx', t + i * .16, blip(220, 200, .12), .11, 0, .2)
        elif k == 'warn':
            for i in range(2):
                m.put('sfx', t + i * .2, blip(880, 880, .1), .07, 0, .3)
        elif k == 'fill':
            m.put('sfx', t, blip(400, 1200, 1.0), .045, .2, .4)
        elif k == 'data':
            for i in range(6):
                m.put('sfx', t + i * .09, blip(1800 + 300 * (i % 3), 2400, .04), .045, rng.uniform(-.5, .5), .3)
        elif k == 'paper':
            nz = noise(int(.35 * SR), rng, hp=1500, lp=7000)
            m.put('sfx', t, [x * (.4 + .6 * rng.random()) * math.sin(math.pi * i / len(nz)) for i, x in enumerate(nz)], .12, -.2, .3)
        elif k == 'type':
            for i in range(9):
                m.put('sfx', t + i * .085 + rng.uniform(0, .02), click(rng, 2200 + rng.uniform(-300, 300)), .065, rng.uniform(-.3, .3), .15)
        elif k == 'stamp':
            m.put('sfx', t, boom(90, .4, 1), .38, 0, .3)
            m.put('sfx', t, noise(int(.08 * SR), rng, hp=500, lp=4000), .18, 0, .3)
        elif k == 'ring':
            for i in range(6):
                m.put('sfx', t + i * .07, blip(1320 if i % 2 else 1760, 1320 if i % 2 else 1760, .06), .045, .2, .4)
        elif k in ('bubble', 'send'):
            m.put('sfx', t, drop(900 if v % 2 == 0 else 700), .2, .35, .3)
        elif k == 'receive':
            m.put('sfx', t, drop(600, .2, False), .2, -.35, .3)
            m.put('sfx', t + .06, bell(tone(4), .5), .05, -.35, .4)
        elif k == 'logo':
            m.put('sfx', t, boom(48, 1.2, 1), .42, 0, .4)
            for i in range(4):
                m.put('sfx', t + .05 + i * .07, bell(tone(i * 2), 1.6), .065, (-.4, .4, -.2, .2)[i], .7)
        elif k == 'letters':
            for i in range(8):
                m.put('sfx', t + i * .05, pluck(tone(i), .5, rng, .7), .075, (i / 7) - .5, .4)
        elif k == 'shimmer':
            for i in range(6):
                m.put('sfx', t + i * .045, bell(tone(i + 5), .9), .033, (i / 5) - .5, .8)

    # ---------- mix ----------
    n = m.n
    duck = array('d', [1.0]) * n
    for kt in kicks:
        i0 = int(kt * SR)
        for k in range(int(.3 * SR)):
            i = i0 + k
            if i < n:
                duck[i] = min(duck[i], 1 - .45 * math.exp(-k / SR / .09))
    rl = reverb(m.bus['send'][0], [1557, 1617, 1491, 1422])
    rr = reverb(m.bus['send'][1], [1277, 1356, 1188, 1116])
    gains = {'drums': 1.0, 'bass': .9, 'keys': .9, 'lead': .85, 'sfx': 1.0}
    out = []
    fade_from = int((dur - .8) * SR)
    stop = int(dur * SR)
    buses = [(m.bus[name][0], m.bus[name][1], g, name in ('keys', 'lead')) for name, g in gains.items()]
    for i in range(stop):
        l = rl[i] * .22
        r = rr[i] * .22
        for bl, br, g, ducked in buses:
            d = g * duck[i] if ducked else g
            l += bl[i] * d
            r += br[i] * d
        fade = 1.0 if i < fade_from else max(0.0, (stop - i) / (stop - fade_from))
        out.append((l * fade, r * fade))
    peak = max(max(abs(a), abs(b)) for a, b in out) or 1
    drive = 1.6 / peak
    return [(math.tanh(a * drive) * .9, math.tanh(b * drive) * .9) for a, b in out]


os.makedirs(os.path.join(HERE, 'audio'), exist_ok=True)
only = sys.argv[1] if len(sys.argv) > 1 else None
for f in sorted(os.listdir(os.path.join(HERE, 'cues'))):
    hid = f[:-5]
    if only and hid != only:
        continue
    info = json.load(open(os.path.join(HERE, 'cues', f)))
    frames = score(hid, info)
    with wave.open(os.path.join(HERE, 'audio', hid + '.wav'), 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(b''.join(struct.pack('<hh', int(a * 32767), int(b * 32767)) for a, b in frames))
    print('audio', hid, f"{info['duration']:.1f}s")
