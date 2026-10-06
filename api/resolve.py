"""Resolve a public media URL into direct file URLs using gallery-dl.

POST /api/resolve  {"url": "https://..."}
-> {"title": str, "items": [{"url": str, "extension": str, "kind": "video"|"image"|"audio"|"file"}]}

Nothing is downloaded here: gallery-dl only walks the extractor and we return
the direct URLs, which the Next.js route then streams to the browser.
"""
import json
import os
from http.server import BaseHTTPRequestHandler

from gallery_dl import config, extractor
from gallery_dl.extractor.message import Message

MAX_ITEMS = 20
VIDEO_EXT = {"mp4", "webm", "mov", "mkv", "m4v"}
AUDIO_EXT = {"mp3", "m4a", "ogg", "opus", "wav"}
IMAGE_EXT = {"jpg", "jpeg", "png", "webp", "gif"}


def configure():
    config.clear()
    config.set((), "downloader", {"retries": 1})
    config.set(("extractor",), "timeout", 15)
    config.set(("extractor",), "retries", 1)
    # Optional logged-in session (Instagram usually needs one from datacenter IPs).
    session = os.environ.get("INSTAGRAM_SESSIONID")
    if session:
        config.set(("extractor", "instagram"), "cookies", {"sessionid": session})
    config.set(("extractor", "ytdl"), "module", "yt_dlp")


def kind_of(ext):
    ext = (ext or "").lower()
    if ext in VIDEO_EXT:
        return "video"
    if ext in AUDIO_EXT:
        return "audio"
    if ext in IMAGE_EXT:
        return "image"
    return "file"


def resolve(url):
    configure()
    target = url
    if "youtube.com" in url or "youtu.be" in url:
        target = "ytdl:" + url
    ex = extractor.find(target)
    if ex is None:
        raise ValueError("Link não suportado.")

    title = None
    items = []
    for msg in ex:
        if msg[0] == Message.Directory:
            kw = msg[1] or {}
            title = title or kw.get("title") or kw.get("description") or kw.get("fulltitle")
        elif msg[0] == Message.Url:
            file_url, kw = msg[1], (msg[2] if len(msg) > 2 else {}) or {}
            ext = kw.get("extension") or file_url.split("?")[0].rsplit(".", 1)[-1]
            title = title or kw.get("title") or kw.get("description")
            items.append({"url": file_url, "extension": ext, "kind": kind_of(ext)})
            if len(items) >= MAX_ITEMS:
                break
    if not items:
        raise ValueError("Nenhuma mídia encontrada.")
    return {"title": (title or "arquivo")[:200], "items": items}


class handler(BaseHTTPRequestHandler):
    def _send(self, code, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length") or 0)
            data = json.loads(self.rfile.read(length) or b"{}")
            url = str(data.get("url", "")).strip()
            if not url.startswith(("http://", "https://")):
                return self._send(400, {"error": "Link inválido."})
            self._send(200, resolve(url))
        except ValueError as e:
            self._send(422, {"error": str(e)})
        except Exception as e:  # extractor blocked, login required, etc.
            self._send(502, {"error": "Não foi possível acessar esse conteúdo agora.", "detail": type(e).__name__})
