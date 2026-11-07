"""功能测试：开始演出 → 有声；滚到 Red → 自动换成 Red 的歌；点曲目 → 切歌；彩蛋与手链下载"""
import asyncio, os
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATE = """() => { const a=[...document.querySelectorAll('audio')]; return {
  title: document.getElementById('playerTitle').textContent, album: document.getElementById('playerAlbum').textContent,
  playerHidden: document.getElementById('player').hidden, playing: document.body.classList.contains('is-playing') } }"""
async def main():
    async with async_playwright() as p:
        try: b = await p.chromium.launch(channel="chrome")
        except Exception: b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1440, "height": 900})
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.add_init_script("""addEventListener('DOMContentLoaded',()=>new MutationObserver(()=>{const t=document.getElementById('toast'); if(t.textContent) console.log('TOAST '+t.textContent)}).observe(document.getElementById('toast'),{childList:true,characterData:true,subtree:true}));""")
        pg.on("console", lambda m: "TOAST" in m.text and print("   ", m.text))
        await pg.goto("file://" + ROOT + "/index.html"); await pg.wait_for_timeout(2500)
        await pg.click("#startSound"); await pg.wait_for_timeout(5000)
        print("开始演出:", await pg.evaluate(STATE))
        await pg.evaluate("document.getElementById('era-red').scrollIntoView({behavior:'instant'})"); await pg.wait_for_timeout(5000)
        print("滚到 Red:", await pg.evaluate(STATE))
        await pg.click('.track[data-era="red"][data-idx="0"]'); await pg.wait_for_timeout(4000)
        print("点 All Too Well:", await pg.evaluate(STATE))
        await pg.screenshot(path="/tmp/ts_red_playing.jpg", quality=70, type="jpeg")
        await pg.keyboard.press("1"); await pg.keyboard.press("3"); await pg.wait_for_timeout(700)
        print("彩蛋提示:", await pg.evaluate("document.getElementById('toast').textContent"))
        await pg.screenshot(path="/tmp/ts_egg.jpg", quality=70, type="jpeg")
        await pg.evaluate("document.getElementById('bracelet').scrollIntoView({behavior:'instant'})")
        async with pg.expect_download() as dl:
            await pg.click("#braceletSave")
        d = await dl.value; await d.save_as("/tmp/ts_bracelet.png"); print("手链下载:", os.path.getsize("/tmp/ts_bracelet.png"), "bytes")
        print("errors:", errs)
        await b.close()
asyncio.run(main())
