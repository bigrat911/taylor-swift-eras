(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 每个时代的底色与特效。底色同时用于相邻时代之间的渐变过渡。
  const THEME = {
    debut:      { bg: "#cfe7dc", fx: "fireflies", pal: ["#2f8f83", "#9fd8c6", "#f6e7b0", "#e9a3a3", "#ffffff"] },
    fearless:   { bg: "#f1dcae", fx: "glitter",   pal: ["#c9a14a", "#f6e3a8", "#8a6a2d", "#fff6dc", "#d8b46a"] },
    speaknow:   { bg: "#2b1446", fx: "fairy",     pal: ["#7b3fa0", "#c9a2ea", "#f1d7ff", "#4a1d6e", "#e6c3ff"] },
    red:        { bg: "#7d1015", fx: "leaves",    pal: ["#b3121b", "#f5e9d8", "#e65a2e", "#3b0a0d", "#ffffff"] },
    "1989":     { bg: "#cfe5f2", fx: "gulls",     pal: ["#7cc3e8", "#ffffff", "#f6b4a4", "#1d3557", "#f9e79f"] },
    reputation: { bg: "#000000", fx: "rain",      pal: ["#000000", "#bfbfbf", "#4c7a4c", "#ffffff", "#2b2b2b"] },
    lover:      { bg: "#fbd6e8", fx: "hearts",    pal: ["#ff8fc7", "#a7d8ff", "#fff1a8", "#c9a8ff", "#ffffff"] },
    folklore:   { bg: "#d6d6d2", fx: "mist",      pal: ["#8a8a85", "#e9e9e4", "#4a4a47", "#b7b7b0", "#ffffff"] },
    evermore:   { bg: "#e7d7c3", fx: "snow",      pal: ["#c4622d", "#5b3a29", "#e9dccb", "#8c5a3c", "#f4a259"] },
    midnights:  { bg: "#141a3a", fx: "stars",     pal: ["#1b1f4b", "#b8a1e3", "#e2c178", "#6f7fd1", "#ffffff"] },
    ttpd:       { bg: "#efebe2", fx: "letters",   pal: ["#ffffff", "#1a1a1a", "#d9d4c7", "#7a7a7a", "#efebe2"] },
    showgirl:   { bg: "#ef6a1f", fx: "sequins",   pal: ["#ff7a1a", "#8fd9c4", "#ffd36b", "#fff3e0", "#e0457b"] },
  };
  const SECTION_FX = { top: "none", prologue: "fireflies", masters: "glitter", tour: "sequins", awards: "glitter", bracelet: "hearts", credits: "none" };

  const ERAS = window.ERAS, MUSIC = window.MUSIC;
  const SHORT = { ttpd: "TTPD", showgirl: "Showgirl", debut: "Debut" };
  const short = (e) => SHORT[e.key] || e.title;
  const coverOf = (k) => MUSIC[k].cover;
  const cleanTitle = (t) => {
    const tv = /Taylor[’']s Version/.test(t);
    const vault = /From The Vault/.test(t);
    const base = t.replace(/\s*\((Taylor[’']s Version|From The Vault)\)/g, "").replace(/\s*\[.*?\]/g, "");
    return { base, tv, vault };
  };

  /* ---------------- 开场光幕 ---------------- */
  const curtain = $("#curtain");
  curtain.innerHTML = ERAS.map((e, i) => `
    <a class="panel panel--${e.key}" href="#era-${e.key}" style="--i:${i};--bg:${THEME[e.key].bg}">
      <span class="panel__img" style="background-image:url('${coverOf(e.key)}')"></span>
      <span class="panel__label"><b>${esc(e.title)}</b><i>${e.year}</i></span>
    </a>`).join("");

  /* ---------------- 前传 ---------------- */
  $("#prologueList").innerHTML = window.PROLOGUE.map((p) => `<li><time>${p.date}</time><p>${esc(p.text)}</p></li>`).join("");

  /* ---------------- 十二个时代 ---------------- */
  const factHTML = (f) => `<div class="fact"><dt><span class="count" data-to="${f[0]}">${f[0]}</span><small>${esc(f[1])}</small></dt><dd>${esc(f[2])}</dd></div>`;
  $("#eras").innerHTML = ERAS.map((e, i) => {
    const prev = i === 0 ? "#fbf3e4" : THEME[ERAS[i - 1].key].bg;
    const tracks = MUSIC[e.key].tracks.map((t, j) => {
      const c = cleanTitle(t.title);
      return `<li><button type="button" class="track" data-era="${e.key}" data-idx="${j}">
          <span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="track__name">${esc(c.base)}</span>${c.tv ? '<span class="tag">Taylor\'s Version</span>' : ""}${c.vault ? '<span class="tag">From The Vault</span>' : ""}
        </button><a class="track__link" href="${t.url}" target="_blank" rel="noopener" aria-label="在 Apple Music 听完整版 ${esc(c.base)}">完整版</a></li>`;
    }).join("");
    const photo = e.photo
      ? `<figure class="era__photo"><div class="frame"><img src="assets/photos/${e.photo}.jpg" alt="${esc(e.photoCap)}" width="${window.PHOTO_SIZE[e.photo][0]}" height="${window.PHOTO_SIZE[e.photo][1]}" loading="lazy"></div><figcaption>${esc(e.photoCap)}</figcaption></figure>`
      : `<figure class="era__photo era__photo--marquee"><div class="frame"><img src="${coverOf(e.key)}" alt="《${esc(e.title)}》专辑封面" width="1200" height="1200" loading="lazy"></div><figcaption>专辑封面</figcaption></figure>`;
    return `
    <section class="era era--${e.key}" id="era-${e.key}" data-era="${e.key}" style="--prev:${prev};--bg:${THEME[e.key].bg}" aria-labelledby="t-${e.key}">
      <div class="era__inner">
        <header class="era__head">
          <p class="era__num"><span>Era ${String(i + 1).padStart(2, "0")}</span><time>${e.date}</time></p>
          <h2 class="era__title" id="t-${e.key}">${esc(e.title)}</h2>
          <p class="era__cn">《${esc(e.cn)}》</p>
          <p class="era__tagline">${esc(e.tagline)}</p>
        </header>
        ${photo}
        <div class="era__body">
          <div class="era__story">${e.story.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
          <dl class="era__facts">${e.facts.map(factHTML).join("")}</dl>
        </div>
        <blockquote class="era__lyric"><p>${esc(e.lyric)}</p><cite>${esc(e.lyricSrc)}</cite></blockquote>
        <div class="era__record">
          <div class="sleeve"><span class="vinyl"><span class="vinyl__label" style="background-image:url('${coverOf(e.key)}')"></span></span><img src="${coverOf(e.key)}" alt="《${esc(e.title)}》封面" width="1200" height="1200" loading="lazy"></div>
          <ol class="tracks">${tracks}</ol>
        </div>
        <ol class="era__moments">${e.moments.map((m) => `<li><time>${m[0]}</time><span>${esc(m[1])}</span></li>`).join("")}</ol>
      </div>
    </section>`;
  }).join("");
  $("#masters").style.setProperty("--prev", THEME.showgirl.bg);

  /* ---------------- 曲目单导航 ---------------- */
  const setlist = $("#setlist");
  setlist.innerHTML = `<ol>${ERAS.map((e) => `<li><a href="#era-${e.key}" data-era="${e.key}" style="--c:${THEME[e.key].pal[0]}"><i></i><span>${esc(short(e))}</span></a></li>`).join("")}</ol>`;

  /* ---------------- 夺回母带 ---------------- */
  const masterKeys = ["debut", "fearless", "speaknow", "red", "1989", "reputation"];
  $("#mastersShelf").innerHTML = masterKeys.map((k, i) => {
    const e = ERAS.find((x) => x.key === k);
    const tv = ["fearless", "speaknow", "red", "1989"].includes(k);
    return `<div class="master" style="--i:${i}"><img src="${coverOf(k)}" alt="《${esc(e.title)}》${tv ? "（Taylor's Version）" : ""}封面" width="1200" height="1200" loading="lazy"><span class="master__lock" aria-hidden="true"></span><p>${esc(e.title)}${tv ? "<small>已重录</small>" : ""}</p></div>`;
  }).join("");
  $("#mastersList").innerHTML = window.MASTERS.map((m) => `<li><time>${m[0]}</time><p>${esc(m[1])}</p></li>`).join("");

  /* ---------------- 巡演与奖项 ---------------- */
  $("#tourStats").innerHTML = `<dl>${window.TOUR.stats.map(factHTML).join("")}</dl>`;
  $("#tourStory").innerHTML = window.TOUR.story.map((p) => `<p>${esc(p)}</p>`).join("");
  const gramophone = `<svg viewBox="0 0 120 150" aria-hidden="true" fill="currentColor">
    <path d="M56 96 C 56 64, 42 40, 22 20 L 98 20 C 78 40, 64 64, 64 96 Z"/>
    <ellipse cx="60" cy="20" rx="38" ry="9"/><ellipse cx="60" cy="20" rx="30" ry="5.5" fill="rgba(0,0,0,.35)"/>
    <ellipse cx="60" cy="104" rx="40" ry="7"/>
    <path d="M22 106 h76 v10 h-76 z"/>
    <path d="M30 116 h60 l5 26 h-70 z"/>
    <path d="M20 142 h80 v6 h-80 z"/></svg>`;
  $("#aoty").innerHTML = window.AWARDS.aoty.map((a, i) => `
    <button type="button" class="trophy" aria-expanded="false" style="--i:${i}">
      <span class="trophy__front">${gramophone}<b>${a[0]}</b></span>
      <span class="trophy__back"><img src="${coverOf(ERAS.find((e) => e.title === a[1]).key)}" alt=""><b>${esc(a[1])}</b><small>${esc(a[2])}</small></span>
    </button>`).join("");
  $$(".trophy").forEach((b) => b.addEventListener("click", () => {
    const open = b.getAttribute("aria-expanded") !== "true";
    b.setAttribute("aria-expanded", open);
  }));
  $("#awardsMore").innerHTML = window.AWARDS.others.map((o) => `<div class="plaque"><b>${esc(o[0])}</b><span>${esc(o[1])}</span><small>${esc(o[2])}</small></div>`).join("");

  /* ---------------- 署名 ---------------- */
  const usedPhotos = new Set([...ERAS.map((e) => e.photo).filter(Boolean), "eras_london"]);
  $("#creditsList").innerHTML = Object.entries(window.CREDITS).filter(([k]) => usedPhotos.has(k))
    .map(([, c]) => `<li><a href="${c.page}" target="_blank" rel="noopener">${esc(c.title.replace(/\.(jpg|png)$/i, ""))}</a>，摄影 ${esc(c.author)}，${esc(c.license)}</li>`).join("");

  /* ---------------- 提示条 ---------------- */
  let toastTimer;
  function toast(msg, ms = 3800) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("is-on");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("is-on"), ms);
  }

  /* ================= 播放器 ================= */
  // 只用一个 <audio>：Safari、iOS 和微信要求每个音频元素都先经过一次用户点击才能出声，
  // 两台交替淡入淡出时，没被点过的那台会被静默拦截。所以这里改成同一台机器先淡出、换歌、再淡入。
  const audio = new Audio();
  audio.preload = "auto";
  let soundOn = false;          // 用户是否已经允许出声
  let now = null;               // {era, idx}
  let token = 0;                // 每次切歌加一，用来丢弃过期的回调
  let watchdog;
  const flat = ERAS.flatMap((e) => MUSIC[e.key].tracks.map((_, j) => ({ era: e.key, idx: j })));
  const player = $("#player"), btnToggle = $("#playerToggle"), auto = $("#playerAuto");
  const nameOf = (era, idx) => cleanTitle(MUSIC[era].tracks[idx].title).base;

  function fade(to, ms, done) {
    const from = audio.volume, t0 = performance.now();
    cancelAnimationFrame(audio._fade);
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / ms);
      audio.volume = Math.min(1, Math.max(0, from + (to - from) * k));
      if (k < 1) audio._fade = requestAnimationFrame(tick); else done && done();
    };
    audio._fade = requestAnimationFrame(tick);
  }

  // 试听链接偶尔会失效，失效时用 iTunes 的 JSONP 接口按曲目 ID 重新拿一次
  function refreshPreview(track) {
    return new Promise((resolve) => {
      if (!track.id) return resolve(null);
      const cb = "it" + Date.now();
      const s = document.createElement("script");
      const timer = setTimeout(() => { cleanup(); resolve(null); }, 6000);
      const cleanup = () => { clearTimeout(timer); delete window[cb]; s.remove(); };
      window[cb] = (d) => { cleanup(); resolve(d.results && d.results[0] && d.results[0].previewUrl); };
      s.src = `https://itunes.apple.com/lookup?id=${track.id}&callback=${cb}`;
      s.onerror = () => { cleanup(); resolve(null); };
      document.body.appendChild(s);
    });
  }

  function tryPlay() {
    return audio.play().then(() => true).catch((e) => {
      if (e.name === "NotAllowedError") toast("浏览器拦截了自动播放。点一下左下角的播放键，就能继续听。", 5200);
      return false;
    });
  }

  // 12 秒还没开始出声，就当作加载失败；但如果还在缓冲、已经下到一部分，再多等 10 秒（弱网下常见）
  function armWatchdog(my, patience = 1) {
    clearTimeout(watchdog);
    watchdog = setTimeout(() => {
      if (my !== token || audio.paused || audio.currentTime > 0) return;
      const buffering = audio.networkState === HTMLMediaElement.NETWORK_LOADING && audio.buffered.length > 0;
      if (buffering && patience > 0) armWatchdog(my, patience - 1); else fail(my);
    }, patience > 0 ? 12000 : 10000);
  }

  // 失败后依次尝试：原地重试同一链接 → 找 Apple 重新拿试听链接 → 跳到下一首
  async function fail(my) {
    if (my !== token || !now) return;
    const track = MUSIC[now.era].tracks[now.idx];
    audio._tries = (audio._tries || 0) + 1;
    if (audio._tries === 1) { audio.load(); tryPlay(); armWatchdog(my); return; }
    if (audio._tries === 2) {
      const fresh = await refreshPreview(track);
      if (my !== token) return;
      if (fresh) { track.preview = fresh; audio.src = fresh; audio.volume = 1; tryPlay(); armWatchdog(my); return; }
    }
    toast(`《${nameOf(now.era, now.idx)}》的试听加载不出来，已跳到下一首。可以稍后再点它试试。`);
    step(1);
  }

  function play(era, idx, { crossfade = true } = {}) {
    const track = MUSIC[era].tracks[idx];
    const my = ++token;
    now = { era, idx };
    soundOn = true;
    player.hidden = false;
    const start = () => {
      if (my !== token) return;
      audio.src = track.preview;
      audio._tries = 0;
      audio.volume = crossfade ? 0 : 1;
      tryPlay().then((ok) => { if (ok && crossfade && my === token) fade(1, 1000); });
      armWatchdog(my);
      updateUI();
    };
    // 正在放就先淡出再换；否则直接换（点击触发时必须同步调用 play，才算用户手势）
    if (crossfade && !audio.paused && audio.volume > 0) fade(0, 600, start); else start();
    updateUI();
  }

  function updateUI() {
    $$(".track.is-playing").forEach((b) => b.classList.remove("is-playing"));
    if (!now) return;
    $(`.track[data-era="${now.era}"][data-idx="${now.idx}"]`)?.classList.add("is-playing");
    $("#playerArt").src = MUSIC[now.era].cover;
    $("#playerTitle").textContent = nameOf(now.era, now.idx);
    $("#playerAlbum").textContent = ERAS.find((e) => e.key === now.era).title;
    player.dataset.era = now.era;
    const paused = audio.paused;
    btnToggle.textContent = paused ? "▶" : "❚❚";
    btnToggle.setAttribute("aria-label", paused ? "播放" : "暂停");
    player.classList.toggle("is-playing", !paused);
    document.body.classList.toggle("is-playing", !paused);
  }

  audio.addEventListener("play", updateUI);
  audio.addEventListener("pause", updateUI);
  audio.addEventListener("timeupdate", () => {
    if (audio.duration) $("#playerProgress").style.width = (audio.currentTime / audio.duration) * 100 + "%";
  });
  audio.addEventListener("ended", () => {
    if (!now) return;
    play(now.era, (now.idx + 1) % MUSIC[now.era].tracks.length, { crossfade: false });
  });
  audio.addEventListener("error", () => { if (audio.getAttribute("src")) fail(token); });

  function step(d) {
    if (!now) return play(ERAS[0].key, 0);
    const i = flat.findIndex((f) => f.era === now.era && f.idx === now.idx);
    const n = flat[(i + d + flat.length) % flat.length];
    play(n.era, n.idx, { crossfade: false });
  }

  btnToggle.addEventListener("click", () => {
    if (!now) return play(currentEra || ERAS[0].key, 0, { crossfade: false });
    if (audio.paused) { cancelAnimationFrame(audio._fade); audio.volume = 1; tryPlay(); } else audio.pause();
  });
  $("#playerPrev").addEventListener("click", () => step(-1));
  $("#playerNext").addEventListener("click", () => step(1));
  document.addEventListener("click", (ev) => {
    const b = ev.target.closest(".track");
    if (!b) return;
    const era = b.dataset.era, idx = +b.dataset.idx;
    if (now && now.era === era && now.idx === idx) {
      if (audio.paused) { audio.volume = 1; tryPlay(); } else audio.pause();
      return;
    }
    play(era, idx, { crossfade: false });
  });

  /* ---------------- 开场按钮 ---------------- */
  function enter(withSound) {
    document.body.classList.add("has-entered");
    if (withSound) play("debut", 0, { crossfade: false });
    $("#prologue").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }
  $("#startSound").addEventListener("click", () => enter(true));
  $("#startSilent").addEventListener("click", () => { auto.checked = false; enter(false); });

  /* ================= 滚动：当前时代 ================= */
  let currentEra = null;
  const fx = createFX($("#fx"));
  const watched = [$("#top"), $("#prologue"), ...$$(".era"), $("#masters"), $("#tour"), $("#awards"), $("#bracelet"), $("#credits")];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const era = el.dataset.era || null;
      document.body.dataset.section = el.id;
      fx.mode(era ? THEME[era].fx : SECTION_FX[el.id] || "none", era ? THEME[era].pal : null);
      setlist.classList.toggle("is-on", el.id !== "top");
      $$("a", setlist).forEach((a) => a.classList.toggle("is-active", a.dataset.era === era));
      if (era && era !== currentEra) {
        currentEra = era;
        if (soundOn && auto.checked && (!now || now.era !== era)) play(era, 0);
      }
    });
  }, { rootMargin: "-48% 0px -48% 0px" });
  watched.forEach((el) => io.observe(el));

  // 数字只在第一次进入视野时滚动一次
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      countIO.unobserve(en.target);
      const el = en.target, raw = el.dataset.to;
      if (reduceMotion || !/^[\d.]+$/.test(raw)) return;
      const to = parseFloat(raw), dec = (raw.split(".")[1] || "").length, t0 = performance.now(), dur = 1400;
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / dur), v = to * (1 - Math.pow(1 - k, 3));
        el.textContent = v.toFixed(dec);
        if (k < 1) requestAnimationFrame(tick); else el.textContent = raw;
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  $$(".count").forEach((c) => countIO.observe(c));

  // 母带书架：进入视野时依次“解锁”
  new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-free"); obs.disconnect(); } });
  }, { threshold: 0.5 }).observe($("#mastersShelf"));

  /* ================= 友谊手链 ================= */
  const palettes = ERAS.map((e) => ({ key: e.key, name: short(e), pal: THEME[e.key].pal }));
  let palKey = "lover";
  $("#braceletPalettes").innerHTML = palettes.map((p) => `
    <button type="button" role="radio" aria-checked="${p.key === palKey}" data-key="${p.key}" title="${esc(p.name)}">
      ${p.pal.slice(0, 3).map((c) => `<i style="background:${c}"></i>`).join("")}<span>${esc(p.name)}</span></button>`).join("");
  $("#braceletPalettes").addEventListener("click", (ev) => {
    const b = ev.target.closest("button"); if (!b) return;
    palKey = b.dataset.key;
    $$("#braceletPalettes button").forEach((x) => x.setAttribute("aria-checked", x === b));
    drawBracelet();
  });
  $("#braceletForm").addEventListener("submit", (e) => e.preventDefault());
  $("#braceletText").addEventListener("input", drawBracelet);

  function drawBracelet() {
    const svg = $("#braceletSvg");
    const text = ($("#braceletText").value || "13").toUpperCase().replace(/[^A-Z0-9 ♥!?.']/g, "").slice(0, 14) || "13";
    const pal = THEME[palKey].pal;
    // 字母珠居中，两侧用彩色圆珠补足，整串排在一条下垂的弧线上
    const beads = [];
    const side = Math.max(4, Math.round((22 - text.length) / 2));
    for (let i = 0; i < side; i++) beads.push({ c: pal[i % pal.length] });
    [...text].forEach((ch) => beads.push({ ch }));
    for (let i = 0; i < side; i++) beads.push({ c: pal[(i + 2) % pal.length] });
    const n = beads.length, cx = 450, cy = -520, R = 760;
    const span = Math.min(0.9, n * 0.042), a0 = Math.PI / 2 + span / 2;
    let out = `<rect width="900" height="360" fill="${THEME[palKey].bg}"/>`;
    out += `<path d="M ${cx + R * Math.cos(a0 + 0.06)} ${cy + R * Math.sin(a0 + 0.06)} A ${R} ${R} 0 0 0 ${cx + R * Math.cos(a0 - span - 0.06)} ${cy + R * Math.sin(a0 - span - 0.06)}" stroke="rgba(0,0,0,.35)" stroke-width="3" fill="none"/>`;
    beads.forEach((b, i) => {
      const a = a0 - (span * (i + 0.5)) / n;
      const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      const rot = (a - Math.PI / 2) * -180 / Math.PI;
      if (b.ch) {
        out += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(-rot).toFixed(1)})">
          <rect x="-17" y="-17" width="34" height="34" rx="6" fill="#fffdf7" stroke="rgba(0,0,0,.25)"/>
          <text y="8" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="22" fill="#1a1a1a">${esc(b.ch === " " ? "·" : b.ch)}</text></g>`;
      } else {
        out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="14" fill="${b.c}" stroke="rgba(0,0,0,.2)"/>
          <circle cx="${(x - 4).toFixed(1)}" cy="${(y - 5).toFixed(1)}" r="4" fill="rgba(255,255,255,.55)"/>`;
      }
    });
    svg.innerHTML = out;
  }
  drawBracelet();
  $("#braceletSave").addEventListener("click", () => {
    const svg = $("#braceletSvg");
    const xml = new XMLSerializer().serializeToString(svg).replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="720"');
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = 1800; c.height = 720;
      c.getContext("2d").drawImage(img, 0, 0, 1800, 720);
      const a = document.createElement("a");
      a.download = "friendship-bracelet.png"; a.href = c.toDataURL("image/png"); a.click();
      toast("手链已保存。记得送给身边的 Swiftie。");
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
  });

  /* ================= 彩蛋：按 1 再按 3 ================= */
  let last = { k: "", t: 0 };
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input")) return;
    if (e.key === "3" && last.k === "1" && Date.now() - last.t < 1200) {
      fx.burst();
      toast("13 是她的幸运数字。她生在 13 号，早年每次登台前都会在手背上写一个 13。", 5200);
    }
    last = { k: e.key, t: Date.now() };
  });

  /* ================= 粒子特效 ================= */
  function createFX(canvas) {
    const ctx = canvas.getContext("2d");
    let W, H, dpr, mode = "none", pal = ["#fff"], parts = [], last = performance.now(), acc = 0;
    const resize = () => {
      dpr = Math.min(2, devicePixelRatio || 1);
      W = innerWidth; H = innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize(); addEventListener("resize", resize);
    const R = (a, b) => a + Math.random() * (b - a);
    const pick = (arr) => arr[(Math.random() * arr.length) | 0];
    const RATE = { fireflies: 3, glitter: 6, fairy: 6, leaves: 2.2, gulls: 0.35, rain: 26, hearts: 2.6, mist: 0.8, snow: 9, stars: 4, letters: 1.6, sequins: 7, none: 0 };
    const MAX = { rain: 140, snow: 120, stars: 120, sequins: 110 };

    function spawn(m) {
      const p = { m, life: 0, max: R(6, 12), x: R(0, W), y: R(0, H), vx: 0, vy: 0, r: R(1, 3), rot: R(0, 6.28), vr: R(-1, 1), c: pick(pal), a: 0 };
      switch (m) {
        case "fireflies": p.c = pick(["#fff6a8", "#d9ffb0", "#ffffff"]); p.vx = R(-12, 12); p.vy = R(-14, 4); p.r = R(1.5, 3); break;
        case "glitter": p.y = R(-20, H * 0.7); p.vy = R(8, 22); p.r = R(1.5, 4); p.c = pick(["#fff4c2", "#e8c066", "#ffffff"]); break;
        case "fairy": p.y = H + 10; p.vy = R(-40, -16); p.vx = R(-8, 8); p.c = pick(["#e6c3ff", "#ffffff", "#c48cf0"]); p.max = R(8, 14); break;
        case "leaves": p.y = -20; p.vy = R(30, 60); p.vx = R(-20, 20); p.r = R(7, 13); p.c = pick(["#b3121b", "#d9481f", "#e8892b", "#8a1015"]); p.max = 20; break;
        case "gulls": p.x = -40; p.y = R(H * 0.08, H * 0.5); p.vx = R(50, 90); p.vy = R(-6, 6); p.r = R(8, 16); p.max = 30; break;
        case "rain": p.y = R(-200, 0); p.vy = R(500, 800); p.vx = -90; p.r = R(10, 22); p.max = 3; p.c = "#9a9a9a"; break;
        case "hearts": p.y = H + 20; p.vy = R(-50, -24); p.vx = R(-10, 10); p.r = R(6, 12); p.kind = Math.random() < 0.3 ? "fly" : "heart"; p.max = 18; break;
        case "mist": p.r = R(80, 220); p.vx = R(-8, 8); p.vy = R(-3, 3); p.max = R(14, 22); p.c = "#ffffff"; break;
        case "snow": p.y = -10; p.vy = R(20, 55); p.vx = R(-12, 12); p.r = R(1.2, 3.5); p.c = "#ffffff"; p.max = 26; break;
        case "stars": p.r = R(0.6, 2); p.c = pick(["#ffffff", "#e2c178", "#cbbcff"]); p.max = R(4, 9); if (Math.random() < 0.04) { p.kind = "shoot"; p.x = R(W * 0.3, W); p.y = R(0, H * 0.3); p.vx = -R(400, 600); p.vy = R(140, 220); p.max = 1.3; } break;
        case "letters": p.ch = pick("ABCDEFGHIJKLMNOPQRSTUVWXYZ"); p.vy = R(-10, -4); p.r = R(14, 30); p.c = "#1a1a1a"; p.max = R(8, 14); break;
        case "sequins": p.y = R(-40, -10); p.vy = R(40, 90); p.vx = R(-20, 20); p.r = R(3, 6); p.vr = R(-6, 6); break;
      }
      return p;
    }

    function draw(p, alpha) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.c; ctx.strokeStyle = p.c;
      switch (p.m) {
        case "fireflies": {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
          g.addColorStop(0, p.c); g.addColorStop(1, "rgba(255,255,200,0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 6, 0, 6.28); ctx.fill(); break;
        }
        case "glitter": case "fairy": {
          const s = p.r * (0.6 + 0.4 * Math.sin(p.life * 6 + p.rot));
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - s * 3); ctx.quadraticCurveTo(p.x, p.y, p.x + s * 3, p.y);
          ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + s * 3); ctx.quadraticCurveTo(p.x, p.y, p.x - s * 3, p.y);
          ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - s * 3); ctx.fill(); break;
        }
        case "leaves": {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * 0.5, 0, 0, 6.28); ctx.fill();
          ctx.globalAlpha = alpha * 0.5; ctx.strokeStyle = "#3b0a0d"; ctx.beginPath(); ctx.moveTo(-p.r, 0); ctx.lineTo(p.r, 0); ctx.stroke();
          ctx.restore(); break;
        }
        case "gulls": {
          const f = Math.sin(p.life * 7) * p.r * 0.35;
          ctx.strokeStyle = "#1d3557"; ctx.lineWidth = 2; ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(p.x - p.r, p.y - f); ctx.quadraticCurveTo(p.x - p.r * 0.4, p.y - p.r * 0.4 - f * 0.3, p.x, p.y);
          ctx.quadraticCurveTo(p.x + p.r * 0.4, p.y - p.r * 0.4 - f * 0.3, p.x + p.r, p.y - f); ctx.stroke(); break;
        }
        case "rain": ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + p.vx * 0.03, p.y - p.r); ctx.stroke(); break;
        case "hearts": {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.sin(p.life * 2 + p.rot) * 0.3);
          if (p.kind === "fly") {
            const w = Math.abs(Math.sin(p.life * 9)) * p.r;
            ctx.beginPath(); ctx.ellipse(-w * 0.6, 0, w * 0.6 + 1, p.r * 0.7, -0.3, 0, 6.28); ctx.ellipse(w * 0.6, 0, w * 0.6 + 1, p.r * 0.7, 0.3, 0, 6.28); ctx.fill();
          } else {
            const s = p.r / 10;
            ctx.beginPath(); ctx.moveTo(0, 3 * s);
            ctx.bezierCurveTo(-10 * s, -4 * s, -5 * s, -12 * s, 0, -6 * s); ctx.bezierCurveTo(5 * s, -12 * s, 10 * s, -4 * s, 0, 3 * s); ctx.fill();
          }
          ctx.restore(); break;
        }
        case "mist": {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          g.addColorStop(0, "rgba(255,255,255,.35)"); g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill(); break;
        }
        case "snow": ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill(); break;
        case "stars":
          if (p.kind === "shoot") { ctx.lineWidth = 1.5; const g = ctx.createLinearGradient(p.x, p.y, p.x - p.vx * 0.25, p.y - p.vy * 0.25); g.addColorStop(0, "#fff"); g.addColorStop(1, "rgba(255,255,255,0)"); ctx.strokeStyle = g; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.25, p.y - p.vy * 0.25); ctx.stroke(); }
          else { ctx.globalAlpha = alpha * (0.5 + 0.5 * Math.sin(p.life * 4 + p.rot)); ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill(); }
          break;
        case "letters": ctx.globalAlpha = alpha * 0.18; ctx.font = `${p.r}px "Courier Prime", monospace`; ctx.fillText(p.ch, p.x, p.y); break;
        case "sequins": {
          ctx.save(); ctx.translate(p.x, p.y); ctx.scale(Math.cos(p.rot), 1);
          ctx.beginPath(); ctx.arc(0, 0, p.r, 0, 6.28); ctx.fill();
          ctx.globalAlpha = alpha * 0.7; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-p.r * 0.3, -p.r * 0.3, p.r * 0.3, 0, 6.28); ctx.fill();
          ctx.restore(); break;
        }
        case "burst": ctx.font = `700 ${p.r}px "Bodoni Moda", serif`; ctx.fillText("13", p.x, p.y); break;
      }
    }

    function frame(t) {
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      ctx.clearRect(0, 0, W, H);
      if (!document.hidden) {
        acc += (RATE[mode] || 0) * dt;
        const cap = MAX[mode] || 70;
        while (acc >= 1) { acc -= 1; if (parts.filter((p) => p.m === mode).length < cap) parts.push(spawn(mode)); }
      }
      parts = parts.filter((p) => {
        p.life += dt;
        if (p.m === "burst") p.vy += 380 * dt;
        if (p.m === "fireflies") { p.vx += R(-20, 20) * dt; p.vy += R(-20, 20) * dt; }
        if (p.m === "leaves" || p.m === "snow") p.vx += Math.sin(p.life * 1.5 + p.rot) * 20 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
        // 换时代时，旧粒子在一秒内淡出
        if (p.m !== mode && p.m !== "burst") p.fade = (p.fade || 1) - dt;
        const fin = Math.min(1, p.life / 0.8), fout = Math.min(1, (p.max - p.life) / 1.2);
        const alpha = Math.max(0, Math.min(fin, fout, p.fade == null ? 1 : p.fade));
        if (alpha <= 0 && p.life > 0.8) return false;
        if (p.y > H + 60 || p.y < -260 || p.x < -260 || p.x > W + 260) return false;
        draw(p, alpha);
        return true;
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }
    if (!reduceMotion) requestAnimationFrame(frame);

    return {
      mode(m, p) { mode = m; if (p) pal = p; },
      burst() {
        if (reduceMotion) return;
        const colors = ["#ff8fc7", "#e2c178", "#8fd9c4", "#b8a1e3", "#ff7a1a", "#7cc3e8"];
        for (let i = 0; i < 40; i++) parts.push({ m: "burst", life: 0, max: 3.2, x: W / 2 + R(-60, 60), y: H * 0.55, vx: R(-320, 320), vy: R(-520, -240), r: R(18, 46), rot: 0, vr: 0, c: pick(colors) });
      },
    };
  }
})();
