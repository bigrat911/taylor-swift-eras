"""把 data/music.json 与 data/credits.json 转成 js/generated.js，让 file:// 直接打开也能读到"""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
music = json.load(open(os.path.join(ROOT, "data/music.json")))
for era in music.values():
    for t in era["tracks"]:
        m = re.search(r"[?&]i=(\d+)", t["url"]); t["id"] = m.group(1) if m else None
credits = json.load(open(os.path.join(ROOT, "data/credits.json")))
with open(os.path.join(ROOT, "js/generated.js"), "w") as f:
    f.write("// 由 tools/build_data.py 生成，请勿手改\n")
    f.write("window.MUSIC = " + json.dumps(music, ensure_ascii=False) + ";\n")
    f.write("window.CREDITS = " + json.dumps(credits, ensure_ascii=False) + ";\n")
print("ok")
