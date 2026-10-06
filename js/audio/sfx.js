/* ---------- sound ---------- */
let AC;
function beep(notes){
  if(!SFX().fx || !SFX().vol) return;
  try{
    AC = AC || new (window.AudioContext||window.webkitAudioContext)();
    let t = AC.currentTime;
    for (const [f,d] of notes){
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = "square"; o.frequency.value = f;
      g.gain.setValueAtTime(.06 * SFX().vol / 70, t); g.gain.exponentialRampToValueAtTime(.0005, t + d);
      o.connect(g).connect(AC.destination); o.start(t); o.stop(t + d); t += d * .8;
    }
  }catch(e){}
}
const sfx = {
  ok: () => {
    if (!CORRECT_SND) return beep([[880,.08],[1320,.14]]);
    const c = SFX(); if (!c.fx || !c.vol) return;
    const a = sfx._ok || (sfx._ok = new Audio(CORRECT_SND));
    a.pause(); a.currentTime = 0; a.volume = Math.min(1, c.vol / 80); a.play().catch(() => {});
  },
  bad: () => beep([[300,.12],[220,.18]]),
  win: () => beep([[660,.1],[880,.1],[1100,.1],[1320,.25]]),
};

/* ---------- hover blips ---------- */
function SFX(){
  if (!S.sfx){
    const off = S.sound === false;
    S.sfx = {hover: !off, style: "tick", fx: !off, vol: 70, lofiVol: 80};
  }
  if (S.sfx.meme === undefined) S.sfx.meme = true;
  return S.sfx;
}
const memeAudio = [];
let lastMeme = -1;
function playMeme(force){
  const c = SFX();
  if ((!c.meme && !force) || !MEMES.length || !c.vol) return false;
  let i = Math.floor(Math.random() * MEMES.length);
  if (MEMES.length > 1 && i === lastMeme) i = (i + 1) % MEMES.length;
  lastMeme = i;
  const a = memeAudio[i] || (memeAudio[i] = new Audio(MEMES[i].s));
  a.pause(); a.currentTime = 0; a.volume = Math.min(1, c.vol / 80);
  a.play().catch(() => {});
  return true;
}
let clickBuf = null;
function osc(type, f0, f1, glide, vol, dur, t){
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t);
  if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + glide);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .004);
  g.gain.exponentialRampToValueAtTime(.0003, t + dur);
  o.connect(g).connect(AC.destination); o.start(t); o.stop(t + dur + .02);
}
const HOVER_STYLES = {
  tick:   ["🖱 click nhẹ", (i, v, t) => {
    if (!clickBuf){ clickBuf = AC.createBuffer(1, AC.sampleRate * .03, AC.sampleRate); const d = clickBuf.getChannelData(0); for (let k = 0; k < d.length; k++) d[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / d.length, 6); }
    const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
    s.buffer = clickBuf; f.type = "bandpass"; f.frequency.value = 2600 + i * 350; f.Q.value = 1.2; g.gain.value = .5 * v;
    s.connect(f).connect(g).connect(AC.destination); s.start(t);
  }],
  bubble: ["🫧 bong bóng", (i, v, t) => osc("sine", 380 + i * 60, 900 + i * 120, .07, .09 * v, .1, t)],
  wood:   ["🪵 mõ gỗ", (i, v, t) => osc("triangle", 820 + i * 90, 640 + i * 70, .04, .11 * v, .07, t)],
  chime:  ["🎐 chuông gió", (i, v, t) => { const f = [1047,1175,1319,1568,1760,2093][i] || 1319; osc("sine", f, 0, 0, .03 * v, .45, t); osc("sine", f * 2.01, 0, 0, .008 * v, .25, t); }],
  pixel:  ["👾 8-bit", (i, v, t) => osc("square", 392 + i * 50, 560 + i * 70, .04, .025 * v, .07, t)],
};
/* tiếng kêu con vật (tổng hợp bằng oscillator, tôn trọng cài đặt âm thanh) */
const SND = {
  quack: (v, t, j) => [0, .16].forEach(d => osc("sawtooth", 520 * j, 340 * j, .07, .06 * v, .11, t + d)),
  squeak: (v, t, j) => [0, .1, .2].forEach(d => osc("sine", 2000 * j, 2800 * j, .04, .07 * v, .06, t + d)),
  baa: (v, t, j) => { osc("sawtooth", 330 * j, 240 * j, .5, .04 * v, .55, t); osc("triangle", 335 * j, 245 * j, .5, .07 * v, .55, t); },
  meow: (v, t, j) => { osc("triangle", 520 * j, 880 * j, .15, .1 * v, .2, t); osc("triangle", 880 * j, 480 * j, .3, .1 * v, .35, t + .18); },
  heehaw: (v, t, j) => { osc("sawtooth", 480 * j, 320 * j, .2, .05 * v, .28, t); osc("sawtooth", 300 * j, 520 * j, .25, .05 * v, .3, t + .3); },
  hoot: (v, t, j) => { osc("sine", 420 * j, 380 * j, .2, .12 * v, .28, t); osc("sine", 380 * j, 340 * j, .2, .12 * v, .3, t + .34); },
  ribbit: (v, t, j) => [0, .14].forEach(d => osc("square", 160 * j, 110 * j, .08, .05 * v, .1, t + d)),
  growl: (v, t, j) => { osc("sawtooth", 95 * j, 70 * j, .5, .07 * v, .6, t); osc("square", 100 * j, 72 * j, .5, .03 * v, .6, t); },
  crow: (v, t, j) => { osc("sawtooth", 650 * j, 420 * j, .12, .07 * v, .2, t); osc("sawtooth", 800 * j, 380 * j, .35, .07 * v, .5, t + .2); },
  chirp: (v, t, j) => [0, .07, .14, .21].forEach(d => osc("sine", 1800 * j, 3000 * j, .04, .06 * v, .06, t + d)),
  blub: (v, t, j) => [0, .12].forEach((d, i) => osc("sine", (500 + i * 150) * j, (900 + i * 200) * j, .06, .08 * v, .1, t + d)),
  snip: (v, t) => [0, .09, .18].forEach(d => osc("square", 1800, 900, .02, .04 * v, .03, t + d)),
  pop: (v, t, j) => osc("sine", 900 * j, 180, .1, .11 * v, .14, t),
  ut: (v, t, j) => [0, .22].forEach(d => osc("sawtooth", 150 * j, 95, .12, .07 * v, .16, t + d)),
  honk: (v, t, j) => [0, .18].forEach(d => osc("sawtooth", 420 * j, 360 * j, .1, .06 * v, .15, t + d)),
  whistle: (v, t, j) => { osc("sine", 1500 * j, 2500 * j, .15, .07 * v, .25, t); osc("sine", 2500 * j, 1700 * j, .2, .07 * v, .3, t + .2); },
  dolphin: (v, t, j) => [0, .1, .2, .3].forEach((d, i) => osc("sine", (1700 + i * 250) * j, (2800 + i * 250) * j, .05, .06 * v, .07, t + d)),
  whale: (v, t, j) => { osc("sine", 170 * j, 330, .7, .12 * v, 1.2, t); osc("sine", 175 * j, 335, .7, .05 * v, 1.2, t + .01); osc("sine", 330, 210, .6, .1 * v, 1, t + .7); },
  sing: (v, t) => [880, 988, 1175, 988, 1319].forEach((f, i) => osc("sine", f, 0, 0, .05 * v, .35, t + i * .16)),
  yip: (v, t, j) => [0, .12].forEach(d => osc("triangle", 700 * j, 1100 * j, .06, .09 * v, .1, t + d)),
  snore: (v, t, j) => { osc("sawtooth", 110 * j, 85 * j, .4, .06 * v, .45, t); osc("sawtooth", 100 * j, 80 * j, .4, .05 * v, .45, t + .5); },
  chime: (v, t) => [1047, 1319, 1568, 2093].forEach((f, i) => osc("sine", f, 0, 0, .05 * v, .5, t + i * .07)),
  magic: (v, t) => [1319, 1568, 1976, 2349, 3136].forEach((f, i) => { osc("sine", f, 0, 0, .045 * v, .55, t + i * .06); osc("triangle", f * 2, 0, 0, .012 * v, .3, t + i * .06); }),
  dragon: (v, t, j) => { osc("sawtooth", 160 * j, 60, .7, .08 * v, .85, t); osc("sawtooth", 80, 200, .3, .05 * v, .5, t); [1568, 2093, 2637, 3136].forEach((f, i) => osc("sine", f, 0, 0, .04 * v, .6, t + .35 + i * .07)); },
};
function animalSnd(type){
  const c = SFX();
  if (!c.fx || !c.vol || !AC) return;
  if (AC.state !== "running"){ AC.resume().catch(() => {}); return; }
  const v = c.vol / 70, t = AC.currentTime, j = 1 + (Math.random() - .5) * .12, sp = SPECIES[type], k = (sp && sp.snd) || type;
  if (k === "chicken") for (let i = 0; i < 3; i++) osc("sine", 1500 * j, 2300 * j, .05, .09 * v, .07, t + i * .1);
  else if (k === "pig"){ osc("sawtooth", 270 * j, 170, .12, .05 * v, .17, t); osc("sawtooth", 310 * j, 180, .1, .05 * v, .15, t + .2); }
  else if (k === "cow"){ osc("sawtooth", 190 * j, 120, .6, .035 * v, .75, t); osc("triangle", 190 * j, 120, .6, .09 * v, .75, t); }
  else if (k === "dog"){ osc("sawtooth", 430 * j, 210, .09, .07 * v, .14, t); osc("sawtooth", 450 * j, 220, .09, .07 * v, .14, t + .22); }
  else if (SND[k]) SND[k](v, t, j);
}
function coinSnd(){
  const c = SFX(); if (!c.fx || !c.vol || !AC || AC.state !== "running") return;
  const v = c.vol / 70, t = AC.currentTime; osc("square", 988, 0, 0, .04 * v, .09, t); osc("square", 1319, 0, 0, .04 * v, .3, t + .08);
}
function gachaSnd(kind){
  const c = SFX(); if (!c.fx || !c.vol || !AC) return;
  if (AC.state !== "running"){ AC.resume().catch(() => {}); return; }
  const v = c.vol / 70, t = AC.currentTime;
  if (kind === "shake"){ for (let i = 0; i < 9; i++) osc("square", 260 + Math.random() * 260, 0, 0, .03 * v, .05, t + i * .13); return; }
  const seq = [[523, 659], [523, 659, 784], [523, 659, 784, 1047, 1319], [523, 659, 784, 1047, 1319, 1568, 2093]][kind];
  seq.forEach((f, i) => osc("triangle", f, 0, 0, .08 * v, .45, t + i * .09));
  if (kind === 3) [2093, 2637, 3136, 3951].forEach((f, i) => osc("sine", f, 0, 0, .04 * v, .7, t + .7 + i * .08));
}
function blip(i, force){
  const c = SFX();
  if ((!c.hover && !force) || !c.vol || !AC) return;
  if (AC.state !== "running"){ if (force) AC.resume().then(() => blip(i, true)); return; }
  (HOVER_STYLES[c.style] || HOVER_STYLES.tick)[1](i, c.vol / 70, AC.currentTime);
}
addEventListener("pointerdown", () => {
  try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state !== "running") AC.resume(); } catch(e){}
}, {capture: true});
let hoverEl = null, lastBlip = 0;
document.addEventListener("pointerover", e => {
  if (e.pointerType !== "mouse") return;
  const b = e.target.closest(".opt, .btn, .tbtn, .tvlist button, .dots i[id], .exp summary");
  if (b === hoverEl) return;
  hoverEl = b;
  if (!b || b.disabled || e.timeStamp - lastBlip < 35) return;
  lastBlip = e.timeStamp;
  blip(b.classList.contains("opt") ? [...b.parentNode.children].indexOf(b) : 2);
});

