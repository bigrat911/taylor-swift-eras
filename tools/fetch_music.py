"""抓取每个 Era 代表曲的 iTunes 30 秒官方试听与专辑封面，输出 data/music.json"""
import json, urllib.request, urllib.parse, os, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PICKS = {
  "debut":    ("Taylor Swift", ["Tim McGraw", "Our Song", "Teardrops On My Guitar"]),
  "fearless": ("Fearless (Taylor's Version)", ["Love Story", "You Belong With Me", "Fifteen"]),
  "speaknow": ("Speak Now (Taylor's Version)", ["Enchanted", "Mine", "Long Live"]),
  "red":      ("Red (Taylor's Version)", ["All Too Well (10 Minute Version)", "State Of Grace", "22"]),
  "1989":     ("1989 (Taylor's Version)", ["Blank Space", "Style", "Shake It Off"]),
  "reputation": ("reputation", ["...Ready For It?", "Delicate", "Look What You Made Me Do"]),
  "lover":    ("Lover", ["Cruel Summer", "Lover", "The Archer"]),
  "folklore": ("folklore", ["cardigan", "august", "exile"]),
  "evermore": ("evermore", ["willow", "champagne problems", "marjorie"]),
  "midnights": ("Midnights", ["Anti-Hero", "Lavender Haze", "Karma"]),
  "ttpd":     ("THE TORTURED POETS DEPARTMENT", ["Fortnight", "So Long, London", "I Can Do It With a Broken Heart"]),
  "showgirl": ("The Life of a Showgirl", ["The Fate of Ophelia", "Opalite", "Elizabeth Taylor"]),
}

def get(url):
    for i in range(3):
        try:
            with urllib.request.urlopen(url, timeout=20) as r:
                return r.read()
        except Exception as e:
            print("retry", url[:80], e, file=sys.stderr); time.sleep(2)
    raise RuntimeError(url)

def norm(s):
    return "".join(c for c in s.lower().replace("’", "'") if c.isalnum())

out = {}
for era, (album, songs) in PICKS.items():
    out[era] = {"album": album, "tracks": []}
    for song in songs:
        q = urllib.parse.urlencode({"term": f"Taylor Swift {song}", "entity": "song", "limit": 50, "country": "us"})
        res = json.loads(get("https://itunes.apple.com/search?" + q))["results"]
        res = [r for r in res if "Taylor Swift" in r.get("artistName", "") and r.get("previewUrl")]
        def score(r):
            s = 0
            if norm(r["trackName"]).startswith(norm(song)): s += 10
            if norm(r["collectionName"]) == norm(album): s += 8
            elif norm(r["collectionName"]).startswith(norm(album)): s += 5
            if "deluxe" in r["collectionName"].lower() or "anthology" in r["collectionName"].lower(): s -= 1
            if any(k in r["trackName"].lower() for k in ["remix", "acoustic", "live", "demo", "piano", "voice memo", "instrumental"]) and not any(k in song.lower() for k in ["minute"]): s -= 6
            return s
        res.sort(key=score, reverse=True)
        if not res:
            print("MISS", era, song, file=sys.stderr); continue
        r = res[0]
        print(f"{era:10s} {song:35s} -> {r['trackName']} | {r['collectionName']} | {score(r)}")
        out[era]["tracks"].append({"title": r["trackName"], "album": r["collectionName"], "preview": r["previewUrl"],
                                   "url": r["trackViewUrl"], "art": r["artworkUrl100"].replace("100x100bb", "1200x1200bb")})
    if out[era]["tracks"]:
        art = out[era]["tracks"][0]["art"]
        path = f"assets/covers/{era}.jpg"
        with open(os.path.join(ROOT, path), "wb") as f: f.write(get(art))
        out[era]["cover"] = path

os.makedirs(os.path.join(ROOT, "data"), exist_ok=True)
with open(os.path.join(ROOT, "data/music.json"), "w") as f: json.dump(out, f, ensure_ascii=False, indent=1)
