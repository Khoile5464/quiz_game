/* ---------- fx ---------- */
function burst(x, y, n = 18){
  const em = isNight() ? ["▪","✦","♪","⚡","☂","▪","♫"] : ["✦","♡","★","✿","💖","✨","🌸"];
  for (let i = 0; i < n; i++){
    const s = el("span","burst",em[i % em.length]);
    const a = Math.random() * Math.PI * 2, r = 80 + Math.random() * 140;
    s.style.left = x + "px"; s.style.top = y + "px";
    s.style.setProperty("--dx", Math.cos(a) * r + "px");
    s.style.setProperty("--dy", Math.sin(a) * r + "px");
    s.style.setProperty("--r", (Math.random() * 720 - 360) + "deg");
    document.body.append(s); setTimeout(() => s.remove(), 1200);
  }
}
function toast(msg){
  const t = el("div","toast",msg); document.body.append(t); setTimeout(() => t.remove(), 2200);
}
(function floaty(){
  const f = $("floaty"), em = ["✦","♡","☆","✿","☁","💿","🦋"];
  for (let i = 0; i < 14; i++){
    const s = el("span","",em[i % em.length]);
    s.style.left = Math.random() * 100 + "%";
    s.style.animationDuration = 18 + Math.random() * 22 + "s";
    s.style.animationDelay = -Math.random() * 40 + "s";
    s.style.fontSize = 14 + Math.random() * 20 + "px";
    f.append(s);
  }
  let last = 0;
  addEventListener("pointermove", e => {
    if (e.timeStamp - last < 60 || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    last = e.timeStamp;
    const s = el("span","spark",isNight() ? "▪" : "✦"); s.style.left = e.clientX + 6 + "px"; s.style.top = e.clientY + 6 + "px";
    s.style.color = pick(isNight() ? ["#ff3fa4","#27e6ff","#ffcf5c"] : ["#ff8fd0","#b07bff","#5cc8ff"]);
    document.body.append(s); setTimeout(() => s.remove(), 700);
  });
})();
const QUOTES = ["Lượng đổi → chất đổi: mỗi câu đúng là một bước nhảy ✦","Thực tiễn là tiêu chuẩn của chân lý — luyện là nhớ ♡","Phủ định của phủ định: sai hôm nay, đúng ngày mai 🌈","Hôm nay học 30 câu, mai đi thi tự tin 💖","Ý thức là sự phản ánh — phản ánh thật nhiều lần vào nha ✿"];
const NIGHT_QUOTES = ["♪ now playing: lofi_bien_chung.mp3","☂ ngoài trời mưa, trong đầu là lượng đổi chất đổi","▪ 2:00 AM — thực tiễn là tiêu chuẩn của chân lý","♫ chill beats · 30 câu · một tách trà","⚡ phủ định của phủ định: sai hôm nay, đúng ngày mai"];

