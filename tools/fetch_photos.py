"""按 Commons 文件名下载照片（1400px 宽），并把授权/作者写进 data/credits.json"""
import json, urllib.request, urllib.parse, os, re, time, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {"User-Agent": "SwiftieFanSite/1.0 (personal fan project)"}
PICKS = json.load(open(os.path.join(ROOT, "tools/photo_picks.json")))
def api(params):
    params.update(format="json")
    req = urllib.request.Request("https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params), headers=UA)
    return json.loads(urllib.request.urlopen(req, timeout=30).read())
cpath = os.path.join(ROOT, "data/credits.json")
credits = json.load(open(cpath)) if os.path.exists(cpath) else {}
for key, title in PICKS.items():
    dest = f"assets/photos/{key}.jpg"
    if key in credits and credits[key]["title"] == title and os.path.exists(os.path.join(ROOT, dest)): continue
    time.sleep(3)
    d = api(dict(action="query", titles="File:" + title, prop="imageinfo", iiprop="url|extmetadata", iiurlwidth=1400))
    p = next(iter(d["query"]["pages"].values()))
    if "imageinfo" not in p: print("MISS", key, title); continue
    ii = p["imageinfo"][0]; m = ii["extmetadata"]
    g = lambda k: re.sub(r"\s+", " ", re.sub("<[^>]+>", "", m.get(k, {}).get("value", ""))).strip()
    for i in range(4):
        try:
            data = urllib.request.urlopen(urllib.request.Request(ii["thumburl"], headers=UA), timeout=60).read(); break
        except Exception as e:
            print("retry", key, e); time.sleep(8)
    open(os.path.join(ROOT, dest), "wb").write(data)
    credits[key] = {"title": title, "file": dest, "author": g("Artist")[:80], "license": g("LicenseShortName"),
                    "page": ii["descriptionurl"]}
    print("ok", key, len(data)//1024, "KB", credits[key]["license"], credits[key]["author"][:30])
json.dump(credits, open(cpath, "w"), ensure_ascii=False, indent=1)
