/* ---------- theme ---------- */
function isNight(){ return document.documentElement.dataset.theme === "night"; }
function applyTheme(t){
  document.documentElement.dataset.theme = t;
  $("themeBtn").textContent = t === "night" ? "☀ cute day" : "🌙 neon city";
  t === "night" ? City.start() : City.stop();
}

