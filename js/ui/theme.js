/* ---------- theme ---------- */
function isNight(){ return document.documentElement.dataset.theme === "night"; }
function applyTheme(t){
  document.documentElement.dataset.theme = t;
  $("themeBtn").textContent = t === "night" ? "☀ cute day" : "🌙 neon city";
  $("mq").textContent = (t === "night" ? NIGHT_QUOTES : QUOTES).join(t === "night" ? "     ▪     " : "     ★     ");
  t === "night" ? City.start() : City.stop();
}

