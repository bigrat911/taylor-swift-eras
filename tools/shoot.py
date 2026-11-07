"""本地截图巡检：开场 + 每个时代 + 各专题，同时收集控制台报错"""
import asyncio, sys, os
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1] if len(sys.argv) > 1 else "/tmp/ts_shots"
W = int(sys.argv[2]) if len(sys.argv) > 2 else 1440
H = int(sys.argv[3]) if len(sys.argv) > 3 else 900
os.makedirs(OUT, exist_ok=True)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": W, "height": H})
        errs = []
        pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
        pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("file://" + ROOT + "/index.html")
        await pg.wait_for_timeout(3500)
        await pg.screenshot(path=f"{OUT}/00_hero.jpg", quality=70, type="jpeg")
        ids = ["prologue"] + [f"era-{k}" for k in ["debut","fearless","speaknow","red","1989","reputation","lover","folklore","evermore","midnights","ttpd","showgirl"]] + ["masters","tour","awards","bracelet"]
        for i, id_ in enumerate(ids, 1):
            await pg.evaluate(f"document.getElementById('{id_}').scrollIntoView({{behavior:'instant'}})")
            await pg.evaluate("window.scrollBy(0, innerHeight*0.12)")
            await pg.wait_for_timeout(1600)
            await pg.screenshot(path=f"{OUT}/{i:02d}_{id_}.jpg", quality=70, type="jpeg")
            if id_.startswith("era-"):
                await pg.evaluate("window.scrollBy(0, innerHeight*0.95)")
                await pg.wait_for_timeout(500)
                await pg.screenshot(path=f"{OUT}/{i:02d}_{id_}_b.jpg", quality=70, type="jpeg")
        print("errors:", errs)
        await b.close()
asyncio.run(main())
