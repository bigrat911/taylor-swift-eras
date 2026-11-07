"""在 Wikimedia Commons 检索开放授权的照片，列出候选（标题/授权/作者/尺寸/日期）"""
import json, urllib.request, urllib.parse, sys, re
def api(params):
    params.update(format="json")
    req = urllib.request.Request("https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params),
                                 headers={"User-Agent": "SwiftieFanSite/1.0 (personal fan project)"})
    return json.loads(urllib.request.urlopen(req, timeout=30).read())
import time
for q in sys.argv[1:]:
    time.sleep(6)
    d = api(dict(action="query", generator="search", gsrsearch=f"filetype:bitmap {q}", gsrnamespace=6, gsrlimit=14,
                 prop="imageinfo", iiprop="url|size|extmetadata", iiurlwidth=1400))
    print("=== ", q)
    for p in sorted(d.get("query", {}).get("pages", {}).values(), key=lambda p: p.get("index", 0)):
        ii = p["imageinfo"][0]; m = ii.get("extmetadata", {})
        g = lambda k: re.sub("<[^>]+>", "", m.get(k, {}).get("value", ""))[:40]
        print(f"{p['title'][5:][:70]:70s} {ii['width']}x{ii['height']} | {g('LicenseShortName')} | {g('Artist')} | {g('DateTimeOriginal')[:10]}")
