/* ---------- sound settings panel ---------- */
(() => {
  const p = $("sset");
  function render(){
    const c = SFX();
    $("ssHover").checked = c.hover; $("ssFx").checked = c.fx; $("ssMeme").checked = c.meme;
    $("ssMemeRow").classList.toggle("hidden", !MEMES.length);
    $("ssVol").value = c.vol; $("ssLofi").value = c.lofiVol;
    $("ssStyles").classList.toggle("off", !c.hover);
    $("ssStyles").replaceChildren(...Object.entries(HOVER_STYLES).map(([k, [label]]) => {
      const b = el("button", k === c.style ? "on" : "", label); b.type = "button";
      b.onclick = () => { c.style = k; save(); render(); blip(1, true); setTimeout(() => blip(3, true), 140); };
      return b;
    }));
  }
  const toggle = () => { p.classList.toggle("hidden"); $("sndBtn").classList.toggle("on", !p.classList.contains("hidden")); render(); };
  $("sndBtn").onclick = toggle;
  $("ssClose").onclick = toggle;
  $("ssHover").onchange = e => { SFX().hover = e.target.checked; save(); render(); if (e.target.checked) blip(2); };
  $("ssFx").onchange = e => { SFX().fx = e.target.checked; save(); if (e.target.checked) sfx.ok(); };
  $("ssMeme").onchange = e => { SFX().meme = e.target.checked; save(); if (e.target.checked) playMeme(); };
  $("ssMemeTry").onclick = () => playMeme(true);
  $("ssVol").oninput = e => { SFX().vol = +e.target.value; save(); };
  $("ssVol").onchange = () => blip(2, true);
  $("ssLofi").oninput = e => { SFX().lofiVol = +e.target.value; save(); Lofi.setVol(); };
  addEventListener("keydown", e => { if (e.key === "Escape" && !p.classList.contains("hidden")) toggle(); });
})();

