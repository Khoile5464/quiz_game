/* ---------- «Chạy rừng»: cảnh pixel 2D (canvas 240×120) ----------
   Chỉ vẽ + hoạt ảnh, KHÔNG quyết định gì về thưởng. Giao diện (run-ui.js) ra lệnh: spawnObstacle / resolve(đúng|khiên|ngã) / dropBox / openBox. */
const RunScene = (() => {
  const W = 240, H = 120, GY = 98, RX = 58, STOP_X = 132;
  const OBST = ["log", "rock", "thorn", "stump"];
  let cv, g, raf = 0, last = 0, acc = 0, running = false;
  const st = {v: 0, vTarget: 0, off: 0, t: 0, rs: "idle", rt: 0, ry: 0, obst: null, box: null, parts: [], shield: false, boost: false, shake: 0, flash: 0, pending: null, night: false};

  /* ----- sprite người chạy (khám phá rừng) ----- */
  const PAL = {H: "#8a5a2a", h: "#b07a3a", S: "#f2c9a0", T: "#ff7ac8", t: "#d9558f", B: "#ffd84a", P: "#4b6ad8", z: "#2b1b3d", k: "#2b1b3d", w: "#fffdf5"};
  function runnerRows(f){
    return mkSprite(16, 24, ({P, R, E}) => {
      R(4, 0, 8, 2, "H"); R(3, 2, 11, 1, "h"); E(8, 5.4, 3.2, 2.8, "S"); R(4, 3, 8, 1, "H"); P(10, 5, "k"); P(11, 7, "t");
      R(5, 8, 6, 6, "T"); R(5, 8, 6, 1, "t"); R(2, 9, 3, 5, "B"); R(2, 9, 3, 1, "H");
      if (f === 0){ R(10, 9, 3, 2, "S"); R(3, 10, 2, 1, "S"); R(5, 14, 2, 6, "P"); R(9, 14, 3, 5, "P"); R(10, 19, 4, 2, "z"); R(4, 20, 3, 2, "z"); }
      else if (f === 1){ R(10, 10, 2, 2, "S"); R(4, 9, 2, 2, "S"); R(7, 14, 2, 6, "P"); R(5, 14, 2, 5, "P"); R(8, 20, 3, 2, "z"); R(5, 19, 3, 2, "z"); }
      else if (f === 2){ R(11, 7, 3, 2, "S"); R(3, 8, 2, 2, "S"); R(5, 14, 5, 3, "P"); R(9, 14, 4, 2, "P"); R(10, 16, 3, 2, "z"); R(4, 17, 3, 2, "z"); }
      else { R(10, 11, 2, 3, "S"); R(4, 11, 1, 3, "S"); R(5, 14, 2, 6, "P"); R(9, 14, 2, 6, "P"); R(4, 20, 4, 2, "z"); R(9, 20, 4, 2, "z"); }
    });
  }
  const spriteCache = {};
  function runnerSprite(f){
    if (spriteCache[f]) return spriteCache[f];
    const rows = runnerRows(f), c = document.createElement("canvas"); c.width = 16; c.height = 24; const x = c.getContext("2d");
    rows.forEach((r, y) => { for (let i = 0; i < 16; i++){ const col = PAL[r[i]]; if (r[i] !== "." && col){ x.fillStyle = col; x.fillRect(i, y, 1, 1); } } });
    return spriteCache[f] = c;
  }

  /* ----- nền cuộn nhiều lớp (vẽ sẵn 1 dải rộng W rồi lặp) ----- */
  const strips = {};
  const rnd = (s => () => (s = s * 16807 % 2147483647) / 2147483647)(99);
  function strip(key, build){
    const day = !st.night, k = key + (day ? "d" : "n");
    if (strips[k]) return strips[k];
    const c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
    build(x, day); return strips[k] = c;
  }
  const rect = (x, c, col, X, Y, w, h) => { x.fillStyle = col; x.fillRect(Math.round(X), Math.round(Y), w, h); };
  function farLayer(){
    return strip("far", (x, day) => {
      const sky = day ? ["#bff0d4", "#a8e8c4", "#92dcb4", "#7ccfa3", "#68c192"] : ["#0a1f24", "#0e2a30", "#123438", "#173f3f", "#1c4a44"];
      sky.forEach((c, i) => rect(x, c, c, 0, i * 24, W, 24));
      for (let i = 0; i < W; i++){ const h = 22 + Math.round(10 * Math.sin(i / 19) + 5 * Math.sin(i / 7)); rect(x, 0, day ? "#6fc49a" : "#14393a", i, 96 - h, 1, h); }
    });
  }
  function midLayer(){
    return strip("mid", (x, day) => {
      for (let i = 0; i < 6; i++){ const bx = 14 + i * 40 + ((i * 17) % 9), w = 6 + (i % 3) * 2;
        rect(x, 0, day ? "#6b4a2e" : "#2f2118", bx, 20, w, 80); rect(x, 0, day ? "#8a6a42" : "#3a2a20", bx + w - 2, 20, 1, 80);
        for (let k = 0; k < 4; k++) { const rr = 9 + (k * 5) % 6, cxp = bx + w / 2 + ((k * 13) % 11) - 5, cyp = 18 + k * 3; for (let dy = -rr; dy <= rr; dy++){ const ww = Math.round(Math.sqrt(rr * rr - dy * dy)); rect(x, 0, day ? (k % 2 ? "#2f8f4e" : "#3aa65a") : (k % 2 ? "#1b5a3a" : "#16482f"), cxp - ww, cyp + dy, 2 * ww + 1, 1); } }
        for (let y = 30; y < 98; y += 6) rect(x, 0, day ? "#5a3e26" : "#251a12", bx + 1, y, w - 2, 1); }
    });
  }
  function nearLayer(){
    return strip("near", (x, day) => {
      rect(x, 0, day ? "#4a8a3a" : "#1b3a22", 0, GY, W, H - GY); rect(x, 0, day ? "#66ae4e" : "#245030", 0, GY, W, 2);
      rect(x, 0, day ? "#6a4a2a" : "#2a2018", 0, GY + 8, W, H - GY - 8);
      for (let i = 0; i < W; i += 5){ rect(x, 0, day ? "#82603a" : "#3a2c20", i, GY + 10 + (i * 3) % 8, 3, 1); rect(x, 0, day ? "#3d7a2e" : "#15301c", i, GY + 3 + (i * 7) % 4, 3, 1); }
      for (let i = 0; i < 9; i++){ const fx = 8 + i * 27 + ((i * 11) % 7); for (let k = -3; k <= 3; k++) rect(x, 0, day ? "#4ec06a" : "#2a7a46", fx + k, GY - 3 + Math.abs(k), 1, 3 - (Math.abs(k) >> 1)); }
    });
  }
  const blit = (img, off) => { const o = Math.floor(((off % W) + W) % W); g.drawImage(img, -o, 0); g.drawImage(img, W - o, 0); };

  /* ----- chướng ngại vật (đáy chạm mặt đất GY) ----- */
  function drawObstacle(o){
    const x = Math.round(o.x), y = GY, R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); };
    if (o.kind === "log"){ R(-2, -12, 26, 12, "#7a5a3a"); R(-2, -12, 26, 2, "#9a7a52"); R(-2, -2, 26, 2, "#5a3e26"); R(-4, -11, 4, 10, "#a8845a"); R(-3, -9, 2, 6, "#7a5a3a"); R(14, -14, 6, 3, "#3aa65a"); R(6, -13, 4, 2, "#5ad07a"); }
    else if (o.kind === "rock"){ R(0, -9, 22, 9, "#7a8290"); R(3, -14, 16, 6, "#8e97a6"); R(6, -17, 8, 4, "#a3acba"); R(4, -9, 5, 2, "#5f6672"); R(14, -6, 5, 2, "#5f6672"); R(8, -16, 3, 1, "#c8d0dc"); }
    else if (o.kind === "thorn"){ for (let i = 0; i < 5; i++){ R(i * 5, -8 - (i % 2) * 4, 4, 8 + (i % 2) * 4, "#2f8f4e"); R(i * 5 + 1, -12 - (i % 2) * 4, 2, 4, "#5ad07a"); } R(0, -3, 24, 3, "#1f6a3a"); R(3, -10, 1, 1, "#e8434f"); R(15, -12, 1, 1, "#e8434f"); }
    else { R(2, -10, 18, 10, "#8a6a42"); R(0, -11, 22, 3, "#a8845a"); R(4, -9, 2, 7, "#6b4d31"); R(14, -9, 2, 6, "#6b4d31"); R(7, -13, 8, 2, "#3aa65a"); R(2, -2, 4, 2, "#e8434f"); R(6, -4, 3, 2, "#f4efe8"); }
  }
  function drawBox(b){
    const x = Math.round(b.x), y = Math.round(b.y), R = (a, c, w, h, col) => { g.fillStyle = col; g.fillRect(x + a, y + c, w, h); };
    const lid = b.open ? -Math.min(8, b.open * 1.2) : 0;
    g.globalAlpha = .35 + .25 * Math.sin(st.t / 6); R(-6, -22, 28, 26, "#fff3a3"); g.globalAlpha = 1;
    R(0, -12, 16, 12, "#e8a62a"); R(0, -12, 16, 2, "#ffd84a"); R(6, -12, 4, 12, "#ff7ac8"); R(0, -5, 16, 2, "#b87a1a");
    R(-1, -16 + lid, 18, 5, "#ffd84a"); R(-1, -12 + lid, 18, 1, "#b87a1a"); R(6, -16 + lid, 4, 5, "#ff7ac8");
    if (!b.open){ R(6, -8, 4, 1, "#fffdf5"); R(7, -7, 2, 3, "#fffdf5"); }
    else if (b.open < 18) { g.globalAlpha = 1 - b.open / 18; R(2, -14 - b.open, 12, 4, "#fffdf5"); g.globalAlpha = 1; }
  }

  function burst(x, y, n, cols){ for (let i = 0; i < n; i++) st.parts.push({x, y, vx: (Math.random() - .5) * 3, vy: -Math.random() * 2.6 - .4, g: .13, life: 28 + Math.random() * 16, col: cols[i % cols.length], s: 1 + (Math.random() < .3 ? 1 : 0)}); }

  /* ----- vòng lặp ----- */
  function step(){
    st.t++; st.v += (st.vTarget - st.v) * .08; st.off += st.v;
    if (st.shake > 0) st.shake--; if (st.flash > 0) st.flash--;
    // chướng ngại trôi về phía người chạy rồi dừng ở STOP_X
    const o = st.obst;
    if (o){
      if (o.state === "in"){ o.x -= Math.max(2.4, st.v * 1.15); if (o.x <= STOP_X){ o.x = STOP_X; o.state = "wait"; st.vTarget = 0; if (st.rs === "run") { st.rs = "wait"; st.rt = 0; } if (st.onArrive){ const f = st.onArrive; st.onArrive = null; f(); } } }
      else if (o.state === "past") { o.x -= Math.max(2, st.v); if (o.x < -40) st.obst = null; }
    }
    st.rt++;
    // người chạy
    if (st.rs === "jump"){
      const T = 34, p = st.rt / T; st.ry = -Math.sin(Math.PI * Math.min(1, p)) * 34;
      if (st.rt === 4) st.vTarget = 2.6;
      if (st.rt >= 14 && o && o.state === "wait") o.state = "past";
      if (st.rt >= T){ st.rs = "run"; st.ry = 0; st.rt = 0; done(); }
    } else if (st.rs === "hit"){ // chạy tông vào vật cản
      if (st.rt < 8) st.rx = (st.rx || 0) + 3; else if (st.rt === 8){ st.shake = 8; st.flash = 4; hitBurst(); }
      if (st.hitKind === "shield" && st.rt > 30){ st.rs = "run"; st.rx = 0; st.rt = 0; st.shield = false; if (st.obst) st.obst.state = "past"; st.vTarget = 2.2; done(); }
      else if (st.hitKind === "fall" && st.rt > 58){ st.rs = "down"; st.rt = 0; done(); }
    }
    if (st.rs === "run" || st.rs === "wait" || st.rs === "idle"){ st.rx = (st.rx || 0) * .8; }
    // hộp
    if (st.box){ const b = st.box; if (b.drop) { b.y = Math.min(GY, b.y + 3); if (b.y >= GY) { b.drop = false; } } if (b.open) { b.open++; if (b.open === 2) burst(b.x + 8, b.y - 12, 26, ["#ffd84a", "#ff7ac8", "#9ff0ff", "#fffdf5"]); if (b.open > 40){ st.box = null; if (st.onBoxDone){ const f = st.onBoxDone; st.onBoxDone = null; f(); } } }
    }
    for (let i = st.parts.length - 1; i >= 0; i--){ const p = st.parts[i]; p.x += p.vx; p.y += p.vy; p.vy += p.g; if (--p.life <= 0) st.parts.splice(i, 1); }
    if (st.boost && st.t % 3 === 0) st.parts.push({x: RX - 2, y: GY - 20 + Math.random() * 14, vx: -1.2, vy: -.1, g: 0, life: 14, col: "#ffd84a", s: 1});
  }
  function hitBurst(){ const o = st.obst; burst(o ? o.x + 10 : 140, GY - 10, 18, st.hitKind === "shield" ? ["#9ff0ff", "#fffdf5", "#6ac8ff"] : ["#a8845a", "#7a5a3a", "#e8434f"]); if (o && st.hitKind === "shield") o.x += 0; }
  function done(){ if (st.pending){ const f = st.pending; st.pending = null; f(); } }

  function draw(){
    g.save();
    if (st.shake > 0) g.translate(Math.round((Math.random() - .5) * 4), 0);
    blit(farLayer(), st.off * .12); blit(midLayer(), st.off * .45); blit(nearLayer(), st.off);
    if (st.obst) drawObstacle(st.obst);
    if (st.box) drawBox(st.box);
    // người chạy
    let f = 3, y = GY, x = RX + (st.rx || 0), rot = 0;
    if (st.rs === "run") f = (st.t >> 3) & 1; else if (st.rs === "jump") f = 2; else if (st.rs === "hit") f = st.rt < 8 ? (st.t >> 2) & 1 : 3; else if (st.rs === "down") f = 3; else if (st.rs === "wait") f = ((st.t >> 4) & 1) ? 3 : 3;
    if (st.rs === "run" && st.vTarget === 0) f = 3;
    const spr = runnerSprite(f);
    g.fillStyle = "rgba(0,0,0,.22)"; g.fillRect(Math.round(x - 6 + (st.ry ? 2 : 0)), GY - 1, 14 + (st.ry ? -4 : 0), 2);
    if ((st.rs === "hit" && st.rt >= 8 && st.hitKind === "fall") || st.rs === "down"){ // ngã sấp: xoay nằm xuống
      const p = st.rs === "down" ? 1 : Math.min(1, (st.rt - 8) / 14);
      g.save(); g.translate(Math.round(x + 8), GY); g.rotate(Math.PI / 2 * p); g.drawImage(spr, -8, -24); g.restore();
      if (st.t % 8 < 4) { const sx = x + 6, sy = GY - 22 - (st.rs === "down" ? -8 : 0); g.fillStyle = "#ffd84a"; g.fillRect(sx - 6 + (st.t % 16), sy, 2, 2); g.fillRect(sx + 6 - (st.t % 16) / 2, sy - 2, 2, 2); }
    } else if (st.rs === "hit" && st.hitKind === "shield" && st.rt >= 8){ g.save(); g.translate(Math.round(x + 8), GY); g.rotate(-.18 * Math.sin((st.rt - 8) / 3)); g.drawImage(spr, -8, -24); g.restore(); }
    else g.drawImage(spr, Math.round(x), Math.round(y + st.ry - 24));
    if (st.shield){ g.globalAlpha = .4 + .15 * Math.sin(st.t / 5); g.fillStyle = "#9ff0ff"; for (let dy = -17; dy <= 17; dy++){ const w = Math.round(Math.sqrt(17 * 17 - dy * dy)); g.fillRect(Math.round(x + 8) - w, Math.round(y - 12 + st.ry) + dy, 2 * w + 1, 1); } g.globalAlpha = 1; g.fillStyle = "#fffdf5"; g.fillRect(Math.round(x + 8) - 9, Math.round(y - 12 + st.ry) - 10, 3, 1); }
    for (const p of st.parts){ g.fillStyle = p.col; g.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s); }
    if (st.night){ g.fillStyle = "rgba(6,20,30,.25)"; g.fillRect(0, 0, W, H); }
    if (st.flash > 0){ g.fillStyle = "rgba(255,255,255," + st.flash * .12 + ")"; g.fillRect(0, 0, W, H); }
    g.restore();
  }
  function frame(ts){
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (!last) last = ts; acc += Math.min(100, ts - last); last = ts;
    while (acc >= 16.67){ step(); acc -= 16.67; }
    draw();
  }

  return {
    init(canvas){ cv = canvas; g = cv.getContext("2d"); g.imageSmoothingEnabled = false; },
    start(){ if (running) return; running = true; last = 0; acc = 0; raf = requestAnimationFrame(frame); },
    stop(){ running = false; cancelAnimationFrame(raf); },
    reset(night){ Object.assign(st, {v: 0, vTarget: 1.6, off: 0, t: 0, rs: "run", rt: 0, ry: 0, rx: 0, obst: null, box: null, parts: [], shield: false, boost: false, shake: 0, flash: 0, pending: null, night: !!night, onArrive: null, onBoxDone: null}); },
    setSpeed(v){ st.vTarget = v; },
    setShield(b){ st.shield = !!b; }, setBoost(b){ st.boost = !!b; },
    /* vật cản chạy tới; onArrive gọi khi đã dừng trước mặt người chạy */
    spawnObstacle(onArrive, speed){ st.obst = {x: W + 20, kind: OBST[Math.floor(Math.random() * OBST.length)], state: "in"}; st.vTarget = speed || 1.6; if (st.rs !== "run") { st.rs = "run"; } st.onArrive = onArrive || null; },
    /* kết quả: "jump" (đúng), "shield" (sai nhưng có khiên), "fall" (sai, hết run). Trả Promise khi hoạt ảnh xong */
    resolve(kind){
      return new Promise(res => { st.pending = res; st.rt = 0; st.rx = 0; if (kind === "jump"){ st.rs = "jump"; sfxJump(); } else { st.rs = "hit"; st.hitKind = kind; st.vTarget = 0; }
        setTimeout(done, 2600); }); // dự phòng: tab ẩn thì requestAnimationFrame dừng, luồng chơi vẫn phải đi tiếp (kết quả đã do server chốt)
    },
    dropBox(){ st.box = {x: 150, y: -10, drop: true, open: 0}; st.vTarget = 0; },
    openBox(onDone){ if (st.box){ st.box.open = 1; st.onBoxDone = onDone; setTimeout(() => { if (st.onBoxDone){ const f = st.onBoxDone; st.onBoxDone = null; st.box = null; f(); } }, 1800); } else if (onDone) onDone(); },
    clearBox(){ st.box = null; },
    burst, isRunning: () => running,
    drawIdle(){ draw(); },
  };
  function sfxJump(){ try{ sfx.click && sfx.click(); }catch(e){} }
})();
