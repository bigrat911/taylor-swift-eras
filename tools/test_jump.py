"""跳转测试：直接跳到相隔很远的时代，确认落点和播放的歌都正确（检查懒加载图片导致的错位）"""
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = sys.argv[1] if len(sys.argv) > 1 else "file://" + ROOT + "/index.html"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome"); pg = await b.new_page(viewport={"width": 1440, "height": 900})
        await pg.goto(URL); await pg.wait_for_timeout(2500)
        await pg.click("#startSound"); await pg.wait_for_timeout(3000)
        ok = True
        for k in ["lover", "midnights", "1989", "showgirl", "fearless", "ttpd", "reputation"]:
            await pg.click(f'#setlist a[data-era="{k}"]', force=True); await pg.wait_for_timeout(4000)
            sec, album = await pg.evaluate("[document.body.dataset.section, document.getElementById('playerAlbum').textContent]")
            good = sec == f"era-{k}"; ok &= good
            print(("OK  " if good else "BAD "), k, "→", sec, "|", album)
        print("全部正确" if ok else "有错位")
        await b.close()
asyncio.run(main())
