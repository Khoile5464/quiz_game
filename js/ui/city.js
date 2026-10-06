/* ---------- pixel neon city + rain ---------- */
const City = (() => {
  const cv = $("city"), ctx = cv.getContext("2d");
  const PX = 3;
  let W, H, bg, signs = [], raf = 0, last = 0, t0 = 0;
  const still = () => matchMedia("(prefers-reduced-motion:reduce)").matches;
  const rnd = (a, b) => a + Math.random() * (b - a);

  function build(){
    W = Math.ceil(innerWidth / PX); H = Math.ceil(innerHeight / PX);
    cv.width = W; cv.height = H;
    bg = document.createElement("canvas"); bg.width = W; bg.height = H;
    const g = bg.getContext("2d");
    const sky = g.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#06041a"); sky.addColorStop(.55, "#170a3a"); sky.addColorStop(.85, "#4a1450"); sky.addColorStop(1, "#7a1f5c");
    g.fillStyle = sky; g.fillRect(0, 0, W, H);
    for (let i = 0; i < W * H / 900; i++){ g.fillStyle = `rgba(255,255,255,${rnd(.2,.7)})`; g.fillRect(rnd(0,W)|0, rnd(0,H*.45)|0, 1, 1); }
    const mx = W * .82 | 0, my = H * .16 | 0;
    g.fillStyle = "rgba(255,200,230,.08)"; for (let r = 14; r > 7; r -= 2){ g.beginPath(); g.arc(mx, my, r, 0, 7); g.fill(); }
    g.fillStyle = "#ffe9c4"; for (let y = -6; y <= 6; y++) for (let x = -6; x <= 6; x++) if (x*x + y*y <= 36) g.fillRect(mx + x, my + y, 1, 1);
    g.fillStyle = "#f0d3a8"; g.fillRect(mx - 2, my - 1, 2, 2); g.fillRect(mx + 2, my + 2, 1, 1);

    signs = [];
    const layer = (col, minH, maxH, winA, near) => {
      let x = -2;
      while (x < W){
        const w = rnd(8, near ? 22 : 16) | 0, h = rnd(H * minH, H * maxH) | 0, top = H - h;
        g.fillStyle = col; g.fillRect(x, top, w, h);
        if (near && Math.random() < .5){ g.fillRect(x + (w / 2 | 0), top - rnd(3, 8) | 0, 1, 8); }
        for (let wy = top + 3; wy < H - 4; wy += 3)
          for (let wx = x + 2; wx < x + w - 2; wx += 3)
            if (Math.random() < winA){
              g.fillStyle = pick(["#ffcf5c","#ffcf5c","#ffb070","#7ff6ff","#ff8fd0"]);
              g.globalAlpha = rnd(.35, .9); g.fillRect(wx, wy, 1 + (Math.random() < .3), 1); g.globalAlpha = 1;
            }
        if (near && w > 12 && Math.random() < .55)
          signs.push({x: x + 2, y: top + rnd(4, Math.min(20, h * .4)) | 0, w: w - 4, h: rnd(2, 4) | 0, c: pick(["#ff3fa4","#27e6ff","#c77dff","#2bff9e"]), ph: rnd(0, 6), sp: rnd(.6, 2.2), vert: Math.random() < .3});
        g.fillStyle = col; x += w + (rnd(0, 3) | 0);
      }
    };
    layer("#1a1140", .35, .7, .18, false);
    layer("#0b0820", .18, .48, .28, true);
    g.fillStyle = "#05030f"; g.fillRect(0, H - 3, W, 3);
  }

  function frame(ts){
    raf = requestAnimationFrame(frame);
    if (ts - last < 33) return;
    last = ts; const t = (ts - t0) / 1000;
    ctx.drawImage(bg, 0, 0);
    for (const s of signs){
      const on = Math.sin(t * s.sp + s.ph) > -.85 || Math.random() < .3;
      if (!on) continue;
      ctx.fillStyle = s.c; ctx.shadowColor = s.c; ctx.shadowBlur = 6;
      if (s.vert) ctx.fillRect(s.x, s.y, 2, s.w * .8 | 0);
      else { ctx.fillRect(s.x, s.y, s.w, 1); ctx.fillRect(s.x, s.y + s.h, s.w, 1); ctx.fillRect(s.x, s.y, 1, s.h + 1); ctx.fillRect(s.x + s.w - 1, s.y, 1, s.h + 1); }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = .18; ctx.fillRect(s.x, H - 3, s.w, 1); ctx.globalAlpha = 1;
    }
    if (still()) { cancelAnimationFrame(raf); raf = 0; }
  }
  let rs;
  addEventListener("resize", () => { clearTimeout(rs); rs = setTimeout(() => { if (isNight()) { build(); } }, 150); });
  document.addEventListener("visibilitychange", () => { if (!isNight()) return; document.hidden ? stop() : start(); });
  function start(){ if (raf) return; if (!bg || bg.width !== Math.ceil(innerWidth / PX)) build(); t0 = performance.now(); raf = requestAnimationFrame(frame); }
  function stop(){ cancelAnimationFrame(raf); raf = 0; }
  return {start, stop};
})();

