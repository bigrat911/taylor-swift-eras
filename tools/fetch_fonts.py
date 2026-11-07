"""把各时期用到的 Google Fonts 下载到本地（只取 latin 子集），生成 assets/fonts/fonts.css"""
import urllib.request, re, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FAM = ["Homemade+Apple", "Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600", "Parisienne", "Abril+Fatface",
       "Permanent+Marker", "UnifrakturMaguntia", "Old+Standard+TT:ital,wght@0,400;0,700;1,400", "Yellowtail",
       "IM+Fell+English:ital@0;1", "Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900", "Courier+Prime:ital,wght@0,400;0,700;1,400",
       "Limelight", "Caveat:wght@500;700", "Josefin+Sans:wght@300;600"]
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36"}
css_out = []
for fam in FAM:
    css = urllib.request.urlopen(urllib.request.Request("https://fonts.googleapis.com/css2?family=" + fam + "&display=swap", headers=UA)).read().decode()
    for block in re.findall(r"/\* (.*?) \*/\s*(@font-face \{.*?\})", css, re.S):
        subset, face = block
        if subset.strip() != "latin": continue
        url = re.search(r"url\((.*?)\)", face).group(1)
        name = re.sub(r"[^a-z0-9]", "", fam.split(":")[0].lower()) + "_" + url.split("/")[-1]
        path = os.path.join(ROOT, "assets/fonts", name)
        if not os.path.exists(path) or os.path.getsize(path) == 0:
            for i in range(5):
                try:
                    data = urllib.request.urlopen(url, timeout=30).read(); break
                except Exception as e:
                    print("retry", name, e)
            open(path, "wb").write(data)
        css_out.append(face.replace(url, name))
open(os.path.join(ROOT, "assets/fonts/fonts.css"), "w").write("\n".join(css_out))
print(len(css_out), "faces")
