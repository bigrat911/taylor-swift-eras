import sys, glob
from PIL import Image
src, out, per = sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 6
fs = sorted(glob.glob(src + "/*.jpg"))
for n in range(0, len(fs), per):
    ims = [Image.open(f) for f in fs[n:n+per]]
    w = 760; h = int(ims[0].height * w / ims[0].width)
    sheet = Image.new("RGB", (w * 2 + 10, (h + 10) * ((len(ims) + 1) // 2)), "white")
    for i, im in enumerate(ims):
        sheet.paste(im.resize((w, h)), ((i % 2) * (w + 10), (i // 2) * (h + 10)))
    sheet.save(f"{out}_{n//per}.jpg", quality=78)
    print(f"{out}_{n//per}.jpg", [f.split('/')[-1] for f in fs[n:n+per]])
