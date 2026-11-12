"""İzin günü reeli için ses üretir: efektler, ortam sesi, kapanış zemini ve geçici dış ses.

Kullanım:  python3 scripts/ses.py [izin-gunu.json]
Gerekenler: numpy, scipy, espeak-ng (sadece geçici dış ses için)

Çıktılar (out/ses/):
  efektler.wav          titreşim, anahtar, tuşlar, geçişler, ortam, müzik zemini
  gecici-dis-ses.wav    espeak ile kılavuz ses (zamanlama için, yayın kalitesinde değil)
  taslak-miks.wav       efektler + geçici dış ses
  dis-ses/NN-*.wav      her cümle ayrı dosya (CapCut'ta yerine koymak için)

Videolar varsa (npm run render:izin sonrası) sesli MP4'ler de yazılır (out/):
  <ad>-efektli.mp4       altyazılı video + efektler (dış sesi CapCut'ta ekle)
  <ad>-taslak-sesli.mp4  altyazılı video + efektler + geçici dış ses
"""

import json
import math
import os
import subprocess
import sys
import tempfile

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, resample_poly, sosfilt

CFG = json.load(open(sys.argv[1] if len(sys.argv) > 1 else "izin-gunu.json", encoding="utf-8"))
SR = CFG["audio"]["sampleRate"]
DUR = CFG["video"]["durationSeconds"]
S = CFG["scenes"]
OUT = "out/ses"
RNG = np.random.default_rng(7)

N = int(DUR * SR)


def track():
    return np.zeros(N, dtype=np.float64)


def at(t):
    return int(round(t * SR))


def place(buf, sig, t, gain=1.0):
    i = at(t)
    if i >= N:
        return
    j = min(N, i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def filt(sig, kind, f):
    sos = butter(4, f, btype=kind, fs=SR, output="sos")
    return sosfilt(sos, sig)


def env(n, attack=0.005, release=0.05):
    e = np.ones(n)
    a = min(n // 2, max(1, int(attack * SR)))
    r = min(n - a, max(1, int(release * SR)))
    e[:a] = np.linspace(0, 1, a)
    e[-r:] *= np.linspace(1, 0, r)
    return e


def noise(sec):
    return RNG.standard_normal(int(sec * SR))


def db(x):
    return 10 ** (x / 20)


# ---------- efekt sentezleri ----------

def vibration(sec, surface="table"):
    """Telefon titreşim motoru: ~170 Hz gövde + yüzeyde tıkırtı."""
    n = int(sec * SR)
    t = np.arange(n) / SR
    f = 168 + 6 * np.sin(2 * math.pi * 3 * t)
    phase = 2 * math.pi * np.cumsum(f) / SR
    body = np.sign(np.sin(phase)) * 0.35 + np.sin(phase) * 0.65
    body += 0.3 * np.sin(2 * phase) + 0.15 * np.sin(3 * phase)
    rattle = filt(noise(sec), "bandpass", [1200, 4200]) * (0.5 + 0.5 * np.sin(phase)) ** 4
    sig = body * 0.55 + rattle * (0.5 if surface == "table" else 0.12)
    if surface == "soft":  # koltuk: boğuk
        sig = filt(sig, "lowpass", 900)
    return sig * env(n, 0.01, 0.04)


def buzz_pattern(buf, start, end, surface="table", gain=1.0):
    """Videodaki buzz() ile aynı ritim: 1,1 sn'de bir 0,55 sn titreşim."""
    t = start
    while t < end:
        length = min(0.55, end - t)
        if length > 0.05:
            place(buf, vibration(length, surface), t, gain)
        t += 1.1


def keys_jingle(sec=0.6):
    n = int(sec * SR)
    out = np.zeros(n)
    for k in range(9):
        t0 = RNG.uniform(0, sec * 0.55)
        i = int(t0 * SR)
        m = n - i
        tt = np.arange(m) / SR
        tone = np.zeros(m)
        base = RNG.uniform(2600, 6800)
        for ratio in (1, 2.76, 5.4):
            tone += np.sin(2 * math.pi * base * ratio * tt) / ratio
        out[i:] += tone * np.exp(-tt * RNG.uniform(18, 30)) * RNG.uniform(0.3, 1)
    return filt(out, "highpass", 1800) * 0.25


def click(level=1.0, bright=4000, dur=0.03):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    c = filt(noise(dur), "bandpass", [bright * 0.5, min(bright * 1.6, SR / 2 - 100)]) * np.exp(-tt * 180)
    return c * level


def key_tap():
    n = int(0.05 * SR)
    tt = np.arange(n) / SR
    thump = np.sin(2 * math.pi * 210 * tt) * np.exp(-tt * 90) * 0.5
    return thump + click(0.6, 3200, 0.05)


def whoosh(sec=0.35, up=True):
    n = int(sec * SR)
    x = noise(sec)
    out = np.zeros(n)
    steps = 24
    for s in range(steps):
        a, b = s * n // steps, (s + 1) * n // steps
        fr = s / steps if up else 1 - s / steps
        fc = 400 + 5000 * fr ** 2
        out[a:b] = filt(x, "bandpass", [fc * 0.7, min(fc * 1.3, SR / 2 - 100)])[a:b]
    shape = np.sin(np.linspace(0, math.pi, n)) ** 2
    return out * shape * 0.6


def impact(sec=0.9):
    n = int(sec * SR)
    tt = np.arange(n) / SR
    f = 70 * np.exp(-tt * 3) + 38
    boom = np.sin(2 * math.pi * np.cumsum(f) / SR) * np.exp(-tt * 4.5)
    hit = np.zeros(n)
    c = click(0.35, 1500, 0.04)
    hit[: len(c)] = c
    return boom * 0.9 + hit


def blip(f0=880, f1=1320, sec=0.12):
    n = int(sec * SR)
    tt = np.arange(n) / SR
    f = np.linspace(f0, f1, n)
    return np.sin(2 * math.pi * np.cumsum(f) / SR) * env(n, 0.003, 0.06) * 0.35


def sent_sound():
    w = whoosh(0.22, up=True) * 0.7
    b = blip(700, 1400, 0.1)
    i = int(0.08 * SR)
    w[i: i + len(b)] += b[: len(w) - i]
    return w


def room_tone(sec, color=500):
    return filt(noise(sec), "lowpass", color) * 0.035


def line_hiss(sec):
    return filt(noise(sec), "bandpass", [300, 3400]) * 0.015


def pad(sec, chords):
    """Yumuşak sentezleyici zemini (testere dalga + alçak geçiren)."""
    n = int(sec * SR)
    out = np.zeros(n)
    per = n // len(chords)
    for ci, chord in enumerate(chords):
        a = ci * per
        b = n if ci == len(chords) - 1 else (ci + 1) * per
        tt = np.arange(b - a) / SR
        seg = np.zeros(b - a)
        for midi in chord:
            f = 440 * 2 ** ((midi - 69) / 12)
            for det in (-0.12, 0.12):
                ph = 2 * math.pi * f * (1 + det / 100) * tt
                seg += sum(np.sin(k * ph) / k for k in range(1, 6))
        seg *= env(len(seg), 0.25, 0.25)
        out[a:b] += seg
    out = filt(out, "lowpass", 1400)
    return out / (np.max(np.abs(out)) + 1e-9) * 0.3 * env(n, 0.8, 1.2)


# ---------- dış ses (espeak) ----------

def espeak(text, voice, rate):
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        path = f.name
    subprocess.run(["espeak-ng", "-v", voice, "-s", str(rate), "-p", "42", "-w", path, text], check=True)
    sr, x = wavfile.read(path)
    os.unlink(path)
    x = x.astype(np.float64) / 32768
    g = math.gcd(SR, sr)
    x = resample_poly(x, SR // g, sr // g)
    # baştaki ve sondaki sessizliği kırp
    idx = np.where(np.abs(x) > 0.01)[0]
    if len(idx):
        x = x[max(0, idx[0] - 200): idx[-1] + 400]
    return x


def line_audio(sub):
    caller = sub.get("voice") == "caller"
    voice = CFG["audio"]["callerVoice" if caller else "narratorVoice"]
    window = sub["end"] - sub["start"] - 0.15
    rate = 150
    x = espeak(sub["text"], voice, rate)
    # pencereye sığmıyorsa hızlandırarak yeniden üret
    while len(x) / SR > window and rate < 260:
        rate = int(rate * (len(x) / SR) / window) + 4
        x = espeak(sub["text"], voice, rate)
    if caller:  # telefon hattı rengi
        x = filt(x, "bandpass", [320, 3300])
        x = np.tanh(x * 2.2) / 2.2
    peak = np.max(np.abs(x)) + 1e-9
    return x / peak * (0.5 if caller else 0.7)


def to_stereo(x):
    return np.stack([x, x], axis=1)


def write(path, x):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    y = np.clip(x, -1, 1)
    wavfile.write(path, SR, (to_stereo(y) * 32767).astype(np.int16))


# ---------- miks ----------

def build_effects():
    fx = track()
    h, c, fb, ch, fin, lp = S["hallway"], S["call"], S["flashbacks"], S["chat"], S["finale"], S["loop"]

    # ortam: koridor, yakın plan, mesaj sahnesi
    place(fx, room_tone(c["end"]), 0)
    place(fx, room_tone(ch["end"] - ch["start"], 700), ch["start"])
    place(fx, room_tone(lp["end"] - lp["start"]), lp["start"])

    # koridor: anahtar şıngırtısı ve masadaki titreşim
    place(fx, keys_jingle(0.5), 0.0, 0.8)
    buzz_pattern(fx, h["buzzAt"], h["end"], "table", 0.3)
    # yakın plan: titreşim yanıtlanana kadar sürer
    buzz_pattern(fx, c["start"], c["acceptAt"], "table", 0.38)
    place(fx, click(0.9, 2500, 0.04), c["acceptAt"] - 0.02)
    place(fx, blip(660, 990, 0.09), c["acceptAt"] + 0.05, 0.6)
    place(fx, line_hiss(c["end"] - c["acceptAt"]), c["acceptAt"])

    # geçmiş izin günleri: sert kesmeler ve titreşimler
    shots = fb["shots"]
    for i, sh in enumerate(shots):
        place(fx, whoosh(0.28), sh["start"] - 0.22, 0.6)
        surface = "table" if sh["kind"] == "breakfast" else "soft"
        end = sh["end"] if i < len(shots) - 1 else fb["questionAt"] + 0.4
        buzz_pattern(fx, sh["start"] + 0.05, end, surface, 0.42 if surface == "table" else 0.6)
        if sh["kind"] == "breakfast":  # tabak/çay bardağı tıkırtısı
            place(fx, keys_jingle(0.25) * 0.5, sh["start"] + 0.3)
    place(fx, impact(), fb["questionAt"], 0.55)

    # mesaj: tuş sesleri, gönderme
    msg_len = len(ch["message"])
    for k in range(msg_len):
        if ch["message"][k] == " " and RNG.random() < 0.5:
            continue
        tk = ch["typeFrom"] + (ch["typeTo"] - ch["typeFrom"]) * k / msg_len
        place(fx, key_tap(), tk + RNG.uniform(-0.01, 0.01), RNG.uniform(0.7, 1.0))
    place(fx, sent_sound(), ch["sendAt"], 0.8)
    place(fx, blip(1200, 1200, 0.05), ch["seenAt"], 0.25)

    # kapanış: geçiş, müzik zemini, "3" tuşu ve gönderme
    place(fx, whoosh(0.4), fin["start"] - 0.3, 0.7)
    # La minör - Fa - Do - Sol, sakin ve ciddi
    chords = [[57, 60, 64], [53, 57, 60], [48, 55, 60], [55, 59, 62]]
    place(fx, pad(fin["end"] - fin["start"] + 0.3, chords), fin["start"])
    place(fx, key_tap(), fin["answerTypeAt"], 1.0)
    place(fx, sent_sound(), fin["answerAt"], 0.9)
    place(fx, blip(988, 1480, 0.14), fin["answerAt"] + 0.12, 0.6)

    # döngü kuyruğu: başa bağlanan anahtar sesi
    place(fx, keys_jingle(0.5) * 0.5, lp["start"] + 0.35)
    return fx


def build_voice():
    vo = track()
    os.makedirs(f"{OUT}/dis-ses", exist_ok=True)
    for i, sub in enumerate(CFG["subtitles"], 1):
        x = line_audio(sub)
        place(vo, x, sub["start"] + 0.05)
        slug = "arayan" if sub.get("voice") == "caller" else "anlatici"
        write(f"{OUT}/dis-ses/{i:02d}-{slug}.wav", x)
    return vo


def duck(fx, vo):
    """Konuşma varken efektleri biraz kıs."""
    e = np.abs(vo)
    win = int(0.15 * SR)
    e = np.convolve(e, np.ones(win) / win, mode="same")
    g = 1 - 0.45 * np.clip(e / 0.05, 0, 1)
    return fx * g


def normalize(x, peak_db=-1.0):
    return x / (np.max(np.abs(x)) + 1e-9) * db(peak_db)


if __name__ == "__main__":
    fx = build_effects()
    vo = build_voice()
    fx_n = normalize(fx, -3)
    write(f"{OUT}/efektler.wav", fx_n)
    write(f"{OUT}/gecici-dis-ses.wav", normalize(vo, -1.5))
    write(f"{OUT}/taslak-miks.wav", normalize(duck(fx_n, vo) * 0.8 + normalize(vo, -1.5), -1))
    print("Yazıldı:", OUT)

    # sesli videolar: Instagram için -14 LUFS civarına normalize, AAC
    name = CFG["output"]["name"]
    video = f"out/{name}-altyazili.mp4"
    if os.path.exists(video):
        for audio, suffix in ((f"{OUT}/efektler.wav", "efektli"), (f"{OUT}/taslak-miks.wav", "taslak-sesli")):
            dst = f"out/{name}-{suffix}.mp4"
            subprocess.run(
                ["ffmpeg", "-v", "error", "-y", "-i", video, "-i", audio,
                 "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                 "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", str(SR),
                 "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", dst],
                check=True,
            )
            print("Yazıldı:", dst)
    else:
        print(f"{video} yok, önce: npm run render:izin")
