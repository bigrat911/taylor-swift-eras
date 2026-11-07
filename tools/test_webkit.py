"""在 WebKit（Safari 内核）里连续滚动换歌，记录每一首是否真的播起来"""
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = sys.argv[1] if len(sys.argv) > 1 else "file://" + ROOT + "/index.html"
async def main():
    async with async_playwright() as p:
        b = await p.webkit.launch(); pg = await b.new_page(viewport={"width": 1440, "height": 900})
        logs = []; pg.on("console", lambda m: logs.append(m.text))
        await pg.add_init_script("""
          const _play = HTMLMediaElement.prototype.play;
          HTMLMediaElement.prototype.play = function () {
            const r = _play.call(this);
            r.catch(e => console.log('PLAY-REJECT ' + e.name + ' ' + (this.src||'').slice(-30)));
            return r; };""")
        await pg.goto(URL); await pg.wait_for_timeout(2500)
        await pg.click("#startSound"); await pg.wait_for_timeout(4000)
        for k in ["fearless", "speaknow", "red", "1989", "reputation"]:
            await pg.evaluate(f"document.getElementById('era-{k}').scrollIntoView({{behavior:'instant'}})")
            await pg.wait_for_timeout(4500)
            st = await pg.evaluate("""() => { const a=[...window.__decks||[]]; return [document.getElementById('playerTitle').textContent, document.body.classList.contains('is-playing')] }""")
            print(k, st)
        print("\n".join(l for l in logs if "PLAY" in l) or "no rejects")
        await b.close()
asyncio.run(main())
