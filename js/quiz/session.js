/* ---------- quiz ---------- */
let run = null;
function show(id){ if (id !== "result") document.querySelectorAll(".brag").forEach(e => e.remove());document.body.classList.toggle("on-home", id === "home"); for (const s of ["home","quiz","result"]) $(s).classList.toggle("hidden", s !== id); scrollTo({top:0,behavior:"smooth"}); }

let lastMode = "new";
function startSession(mode, restart){
  if (mode === "giaide") return startGiaide(restart);
  if (mode === "onsai") return startOnsai();
  if (mode === "review" && !reviewPool().length){ toast("Chưa có câu nào đã học để ôn — làm vài câu trước nha ✦"); return; }
  if (mode === "new" && !newPool().length){ toast("Hết câu mới trong phạm vi này rồi — qua Đền ôn tập nhé 🏛"); return; }
  if (mode === "temple" && !templePool().length){ toast("Chưa có câu nào đã học để vào ngôi đền ✦"); return; }
  lastMode = mode;
  const qs = mode === "review" ? pickReview() : mode === "temple" ? pickTemple() : pickNew();
  run = {mode, review: mode !== "new", x2: mode === "new", qs, i: 0, score: 0, combo: 0, maxCombo: 0, xp: 0, wrong: [], answered: false, picked: new Set()};
  show("quiz"); renderQ();
}
/* giải đề: làm lần lượt toàn bộ câu trong phạm vi, tiến độ lưu sau mỗi câu (S.giaide) nên thoát ra vẫn làm tiếp được */
function startGiaide(restart){
  if (restart || !giaideLeft()){
    if (!pool().length){ toast("Phạm vi này chưa có câu nào ✦"); return; }
    S.giaide = {sc: scope, ids: pickGiaide().map(q => q.id), i: 0, score: 0, combo: 0, maxCombo: 0, xp: 0, wrong: []}; save();
  }
  const g = S.giaide, byId = new Map(Q.map(q => [q.id, q]));
  // câu đã bị bỏ khỏi ngân hàng đề (sửa questions.js) thì bỏ qua, giữ đúng vị trí đang làm
  g.i = g.ids.slice(0, g.i).filter(id => byId.has(id)).length; g.ids = g.ids.filter(id => byId.has(id));
  lastMode = "giaide";
  run = {mode: "giaide", review: false, x2: false, qs: g.ids.map(id => byId.get(id)), i: g.i, score: g.score, combo: g.combo, maxCombo: g.maxCombo, xp: g.xp,
    wrong: g.wrong.filter(([id]) => byId.has(id)).map(([id, picked]) => ({q: byId.get(id), picked})), answered: false, picked: new Set(), sit: 0};
  if (run.i >= run.qs.length) return finish();
  if (run.i) toast(`📖 Giải đề tiếp từ câu ${run.i + 1}/${run.qs.length}`);
  show("quiz"); renderQ();
}
/* ôn câu sai: đi hết kho câu sai của Giải đề theo thứ tự đã sai, đúng thì gỡ khỏi kho, sai thì giữ cho lượt sau; tiến độ lưu sau mỗi câu */
function startOnsai(){
  const byId = new Map(Q.map(q => [q.id, q]));
  S.onsai.ids = S.onsai.ids.filter(id => byId.has(id)); // câu đã bị bỏ khỏi ngân hàng đề
  if (!onsaiLeft()){
    if (!S.onsai.ids.length){ S.onsai.run = null; save(); toast("Kho câu sai trống rồi — giải đề tiếp nhé 📖"); return; }
    S.onsai.run = {ids: [...S.onsai.ids], i: 0, score: 0, combo: 0, maxCombo: 0, xp: 0, wrong: []}; save();
  }
  const o = S.onsai.run;
  o.i = o.ids.slice(0, o.i).filter(id => byId.has(id)).length; o.ids = o.ids.filter(id => byId.has(id));
  lastMode = "onsai";
  run = {mode: "onsai", review: true, x2: false, qs: o.ids.map(id => byId.get(id)), i: o.i, score: o.score, combo: o.combo, maxCombo: o.maxCombo, xp: o.xp,
    wrong: o.wrong.filter(([id]) => byId.has(id)).map(([id, picked]) => ({q: byId.get(id), picked})), answered: false, picked: new Set(), sit: 0};
  if (run.i >= run.qs.length) return finish();
  if (run.i) toast(`📕 Ôn câu sai tiếp từ câu ${run.i + 1}/${run.qs.length}`);
  show("quiz"); renderQ();
}
/* chế độ lưu tiến độ sau từng câu (thoát ra làm tiếp được) */
const resumable = m => m === "giaide" || m === "onsai";
/* số câu trong kho câu sai, hiện trên nhãn câu hỏi ở Giải đề / Ôn câu sai */
const khoEl = () => el("b","kho",String(S.onsai.ids.length));
const updKho = () => document.querySelectorAll("#qTags .kho").forEach(b => b.textContent = S.onsai.ids.length);
/* lượt ôn câu sai đang mở: câu vừa sai ở Giải đề (tab này hoặc tab khác) được thêm vào cuối lượt */
function syncOnsaiRun(){
  if (!run || run.mode !== "onsai" || !S.onsai.run) return;
  const have = new Set(run.qs.map(q => q.id)), byId = new Map(Q.map(q => [q.id, q]));
  const add = S.onsai.run.ids.filter(id => !have.has(id) && byId.has(id));
  if (!add.length) return;
  run.qs.push(...add.map(id => byId.get(id)));
  $("qCount").textContent = `${run.i + 1}/${run.qs.length}`;
  $("qBar").style.width = (run.i / run.qs.length * 100) + "%";
  if (run.answered) $("nextBtn").textContent = "Câu tiếp →";
  toast(`📕 Thêm ${add.length} câu vừa sai vào lượt ôn`);
}

function renderQ(){
  const q = run.qs[run.i], s = S.stats[q.id];
  run.answered = false; run.picked = new Set();
  $("nextBtn").blur(); // nút vừa được focus ở câu trước: Space/Enter sẽ bấm nhầm "Bỏ qua" cho câu mới
  const idx = q.o.map((_, i) => i);
  run.order = q.f ? idx : shuffle(idx); // q.f: đáp án tham chiếu chéo ("A và B", "Tất cả đều đúng") → giữ nguyên thứ tự đề cương
  const multi = q.a.length > 1;
  if (run.mode === "giaide") run.x2 = !learned(q); // câu chưa học xu ×2 như Học mới, câu đã học xu cơ bản như Đền ôn tập

  $("qTitle").textContent = `${run.mode === "giaide" ? "giai_de" : run.mode === "onsai" ? "on_cau_sai" : run.mode === "temple" ? "den_huyen_thoai" : run.review ? "den_on_tap" : "question"}_${String(run.i + 1).padStart(resumable(run.mode) ? 3 : 2,"0")}.exe`;
  $("qCount").textContent = `${run.i + 1}/${run.qs.length}`;
  $("qBar").style.width = (run.i / run.qs.length * 100) + "%";
  $("qScore").textContent = `✓ ${run.score}`;
  $("qXp").textContent = `+${run.xp} xu`;
  updateCombo();

  const tags = $("qTags"); tags.replaceChildren();
  if (run.mode === "giaide"){ const t = el("span","tag giaide",`📖 Giải đề · ${run.x2 ? "xu ×2" : "xu cơ bản"} · 📕 kho câu sai: `); t.append(khoEl()); tags.append(t, document.createTextNode(" ")); }
  else if (run.mode === "onsai"){ const t = el("span","tag onsai","📕 Ôn câu sai · đúng là gỡ khỏi kho · kho còn "); t.append(khoEl()); tags.append(t, document.createTextNode(" ")); }
  else if (run.mode === "temple") tags.append(el("span","tag hard",`🔱 Ngôi đền huyền thoại · HighScore ${S.temple.best}`), document.createTextNode(" "));
  else if (run.review) tags.append(el("span","tag ok","🏛 Đền ôn tập · xu cơ bản"), document.createTextNode(" "));
  if (q.t) tags.append(el("span","tag dvls",`🧭 Phần ${["","I","II","III","IV","V"][q.p]} · ${q.t}`), document.createTextNode(" ")); // phần riêng Hành trình DVLS
  if (!s || !s.n) tags.append(el("span","tag new","✨ câu mới"));
  else if (s.w && s.w / s.n >= .4) tags.append(el("span","tag hard",`🔥 hay sai (${s.w}/${s.n})`));
  else if (s.box >= 3) tags.append(el("span","tag ok","🌸 đã thuộc — ôn lại chút"));
  if (multi) { tags.append(document.createTextNode(" ")); tags.append(el("span","tag multi",`☑ chọn ${q.a.length} đáp án`)); }

  $("qText").textContent = q.q;
  const box = $("opts"); box.replaceChildren();
  run.order.forEach((oi, pos) => {
    const b = el("button","opt"); b.dataset.oi = oi;
    b.append(el("span","k",LETTERS[pos]), el("span","",q.o[oi]));
    b.onclick = () => choose(oi);
    box.append(b);
  });
  $("fb").className = "feedback";
  $("explain").replaceChildren();
  $("nextBtn").textContent = multi ? "Chốt đáp án" : "Bỏ qua →";
  $("nextBtn").disabled = multi;
}

function choose(oi){
  if (run.answered) return;
  const q = run.qs[run.i];
  if (q.a.length > 1){
    run.picked.has(oi) ? run.picked.delete(oi) : run.picked.add(oi);
    document.querySelectorAll(".opt").forEach(b => b.classList.toggle("sel", run.picked.has(+b.dataset.oi)));
    $("nextBtn").disabled = run.picked.size === 0;
    return;
  }
  run.picked = new Set([oi]); submit();
}

const GOOD = ["Đỉnh chóp! ✦","Siêu ghê luôn 💖","Chuẩn không cần chỉnh!","Mác & Ăngghen tự hào về bạn 🥹","Biện chứng quá trời ✿","Yeahhh đúng rồi! 🌈"];
const BAD = [
  "Ối giời ơi, câu dễ thế mà cũng sai được, tài thật đấy!",
  "Học hành kiểu này thì về quê chăn vịt cho nhanh 🦆",
  "Mác với Ăngghen mà nhìn thấy chắc tức quá đội mồ sống dậy mất.",
  "Giỏi quá cơ, chọn sai mà tự tin thế cơ chứ.",
  "Thôi xong, lại hỏng! Cứ đà này thì học lại là cái chắc.",
  "Đọc đề bằng mắt hay bằng chân thế hả?",
  "Ôi dào, tưởng thế nào, hoá ra cũng chỉ đến thế thôi à.",
  "Con nhà người ta làm đúng hết rồi kia kìa 🙄",
  "Thế mà cũng đòi qua môn, nghe mà buồn cười.",
  "Chán chẳng buồn nói, thôi đọc giải thích bên dưới đi cho khôn ra.",
  "Học thì lười, sai thì nhanh, giỏi nhất cái khoản đấy.",
  "Lượng còn chưa tích đủ mà đã đòi nhảy vọt về chất à? 😏",
  "Thực tiễn vừa kiểm nghiệm xong: kiến thức này là chân lý… sai.",
  "Đấy, cứ ngồi lướt điện thoại nữa đi rồi biết tay.",
  "Mất combo rồi nhé, tiếc chưa, cho chừa!",
  "Chà chà, trình độ này thì đúng là hiếm có khó tìm đấy nhỉ.",
  "Giỏi lắm, giỏi lắm, sai mà vẫn cười được mới ghê chứ.",
  "Ôi, thông minh thế này thì nhà trường phải tự hào lắm đây.",
  "Bái phục, đáp án đúng nằm ngay đấy mà vẫn né được, có tài thật.",
  "Học xong chắc để quên ở nhà rồi, đúng không em?",
  "Nhanh nhẹn phết, nhanh đến mức chưa kịp đọc đề đã sai.",
  "Thôi không sao, ai chả có lúc… nhưng sao lúc nào của bạn cũng thế?",
];
/* chê đểu theo chủ đề câu hỏi (khớp từ khoá trong đề, không khớp thì dùng BAD) */
const BAD_TOPIC = [
  [/vật chất/i, "Vật chất có trước ý thức, còn kiến thức của bạn thì chắc… chưa có."],
  [/ý thức/i, "Ý thức quyết định cái gì không biết, nhưng ý thức học bài thì rõ là đang vắng mặt."],
  [/thực tiễn/i, "Thực tiễn là tiêu chuẩn của chân lý, và thực tiễn vừa chấm bạn rớt."],
  [/lượng|chất/i, "Lượng chưa đủ thì chất chưa đổi, bạn cứ thế này thì điểm cũng chẳng đổi đâu."],
  [/phủ định/i, "Phủ định biện chứng đâu không thấy, chỉ thấy bạn tự phủ định đáp án đúng."],
  [/mâu thuẫn/i, "Mâu thuẫn là động lực phát triển, vậy chắc đáp án của bạn đang phát triển… theo hướng ngược lại."],
  [/nhận thức/i, "Từ trực quan sinh động đến tư duy trừu tượng, mà bạn mới dừng ở khâu… đoán mò."],
  [/biện chứng|siêu hình/i, "Nhìn sự vật phiến diện thế này thì đúng là siêu hình chính hiệu rồi."],
  [/duy tâm/i, "Chọn đáp án kiểu này thì đúng là duy tâm: tin là đúng nên cứ chọn."],
  [/quy luật/i, "Quy luật khách quan là thế, còn việc bạn sai thì có vẻ cũng thành quy luật rồi."],
];
const badFor = q => { const t = BAD_TOPIC.find(([re]) => re.test(q.q)); return t && Math.random() < .6 ? t[1] : pick(BAD); };

function rich(text){
  const frag = document.createDocumentFragment(); let last = 0;
  for (const m of String(text).matchAll(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)){
    frag.append(document.createTextNode(text.slice(last, m.index)));
    const a = el("a", "", m[1]); a.href = m[2]; a.target = "_blank"; a.rel = "noopener noreferrer"; frag.append(a);
    last = m.index + m[0].length;
  }
  frag.append(document.createTextNode(text.slice(last))); return frag;
}
function explainEl(q, picked, openWrong){
  const box = el("div","exp");
  const h = el("div","eh"); h.append(el("span","","💡"), el("span","","Vì sao đúng?")); box.append(h);
  { const eb = el("div","eb"); eb.append(rich(q.e || "Chưa có giải thích cho câu này.")); box.append(eb); }
  const others = q.o.map((t, i) => ({t, i, why: q.w?.[i]})).filter(x => !q.a.includes(x.i) && x.why);
  if (others.length){
    const d = el("details"); d.open = openWrong;
    d.append(el("summary","",`Vì sao các phương án khác sai? (${others.length})`));
    const ul = el("ul");
    for (const x of others){
      const li = el("li", picked.includes(x.i) ? "mine" : "");
      const b = el("b","", "✗ " + x.t);
      if (picked.includes(x.i)) b.append(el("span","you","bạn chọn"));
      li.append(b, document.createTextNode(x.why));
      ul.append(li);
    }
    d.append(ul); box.append(d);
  }
  if (q.k) box.append(el("div","warn","⚠️ Lưu ý về đáp án: " + q.k.replace(/^nghi vấn:\s*/i, "") + " — Khi thi vẫn nên chọn theo đáp án của đề."));
  if (q.s) { const sd = el("div","src","📖 "); sd.append(rich(q.s)); box.append(sd); }
  return box;
}

/* trích thẻ Study Guide liên quan sau mỗi câu, ở mọi chế độ (Guide.match ở js/quiz/guide-match.js) */
function guideText(text){ // **đậm**, *nghiêng* như trong Study Guide
  const frag = document.createDocumentFragment();
  for (const part of String(text).split(/(\*{1,3}[^*]+\*{1,3})/)){
    const m = part.match(/^(\*{1,3})([^*]+)\1$/);
    if (m) frag.append(el(m[1].length === 1 ? "i" : "b", "", m[2])); else if (part) frag.append(part);
  }
  return frag;
}
function guideEl(q){
  const box = el("div","sg");
  const h = el("div","sg-h"); h.append(el("span","","📚"), el("span","","Giải đề · trích Study Guide")); box.append(h);
  const ms = Guide.match(q).filter((m, k) => !k || m.hits.length); // thẻ phụ chỉ hiện khi có dòng liên quan
  if (!ms.length){ box.append(el("div","sg-none","Study Guide chưa có thẻ riêng cho câu này — đọc kỹ phần giải thích phía trên nhé.")); return box; }
  ms.forEach((m, k) => {
    const card = el("div","sg-card" + (k ? " more" : ""));
    const t = el("div","sg-t");
    t.append(el("span","sg-sec",`${m.s.ic} ${m.s.t}`), el("b","",m.c.t));
    if (m.weak) t.append(el("span","sg-weak","gợi ý gần nhất"));
    const ul = el("ul");
    for (const i of k ? m.hits : m.c.b.keys()){ // thẻ chính: cả thẻ, tô sáng dòng liên quan · thẻ phụ: chỉ dòng liên quan
      let tx = m.c.b[i], cls = m.hits.includes(i) ? "hit" : "";
      if (tx[0] === "!" || tx[0] === "+"){ cls += tx[0] === "!" ? " trap" : " sure"; tx = tx.slice(1); }
      const li = el("li", cls.trim()); li.append(guideText(tx)); ul.append(li);
    }
    const a = el("a","sg-open","mở trong Study Guide ↗"); a.href = "study-guide.html#" + m.c.k; a.target = "_blank"; a.rel = "noopener";
    card.append(t, ul, a); box.append(card);
  });
  return box;
}

function submit(){
  const q = run.qs[run.i], s = st(q.id);
  run.answered = true;
  const right = run.picked.size === q.a.length && q.a.every(a => run.picked.has(a));
  s.n++; S.answered++;
  if (right){
    s.box = Math.min(5, s.box + 1); s.lastWrong = false;
    run.score++; run.combo++; S.correct++;
    const gain = xpGain(run.combo);
    run.xp += gain; S.xp += gain; S.coins += gain;
    run.maxCombo = Math.max(run.maxCombo, run.combo);
    S.maxCombo = Math.max(S.maxCombo, run.combo);
    sfx.ok();
  } else {
    s.w++; s.box = 0; s.lastWrong = true;
    if (run.combo >= 3) toast(`💔 Mất chuỗi combo ×${run.combo}!`);
    const cons = run.x2 ? 4 : 2; run.combo = 0; run.xp += cons; S.xp += cons; S.coins += cons;
    run.wrong.push({q, picked: [...run.picked]});
    if (!playMeme()) sfx.bad();
  }
  // S có thể vừa được nạp lại từ tab khác (app.js, sự kiện storage) nên kiểm tra S.giaide / S.onsai.run trước khi ghi
  if (run.mode === "giaide"){
    if (S.giaide) Object.assign(S.giaide, {i: run.i + 1, score: run.score, combo: run.combo, maxCombo: run.maxCombo, xp: run.xp});
    if (!right){ // câu sai vào kho ôn ngay, kể cả lượt ôn đang làm dở (thêm vào cuối lượt)
      S.giaide?.wrong.push([q.id, [...run.picked]]);
      if (!S.onsai.ids.includes(q.id)) S.onsai.ids.push(q.id);
      if (S.onsai.run && !S.onsai.run.ids.includes(q.id)) S.onsai.run.ids.push(q.id);
    }
  } else if (run.mode === "onsai"){
    if (S.onsai.run) Object.assign(S.onsai.run, {i: run.i + 1, score: run.score, combo: run.combo, maxCombo: run.maxCombo, xp: run.xp});
    if (right) S.onsai.ids = S.onsai.ids.filter(id => id !== q.id); else S.onsai.run?.wrong.push([q.id, [...run.picked]]);
  }
  updKho();
  if (resumable(run.mode) && ++run.sit === 10) touchStreak(); // buổi giải đề / ôn câu sai rất dài: làm đủ 10 câu là tính đã học hôm nay
  save();

  document.querySelectorAll(".opt").forEach(b => {
    const oi = +b.dataset.oi; b.disabled = true; b.classList.remove("sel");
    if (q.a.includes(oi)) b.classList.add("right");
    else if (run.picked.has(oi)) b.classList.add("wrong");
  });
  const fb = $("fb");
  fb.className = "feedback show " + (right ? "good" : "bad");
  $("fbE").textContent = right ? pick(["🎉","🌟","💖","🦄","✨"]) : pick(["🙄","😮‍💨","🤦","😏","🫠"]);
  $("fbT").textContent = right ? `${pick(GOOD)}  +${xpGain(run.combo)} xu` + (comboMult(run.combo) > 1 ? ` (×${comboMult(run.combo)})` : "") : badFor(q);
  if (right && run.combo >= 3){
    comboFx(run.combo);
  }
  $("explain").replaceChildren(explainEl(q, [...run.picked], !right));
  $("explain").append(guideEl(q));
  $("qScore").textContent = `✓ ${run.score}`;
  $("qXp").textContent = `+${run.xp} xu`;
  updateCombo();
  $("nextBtn").disabled = false;
  $("nextBtn").textContent = run.i + 1 < run.qs.length ? "Câu tiếp →" : "Xem kết quả ✦";
  $("nextBtn").focus({preventScroll:true});
}

/* combo >= 3: xu nhân theo combo (tối đa ×10); sai là mất chuỗi */
const comboMult = c => c >= 3 ? Math.min(c, 10) : 1;
const xpGain = c => (10 + Math.min(10, c - 1)) * comboMult(c) * (run && run.x2 ? 2 : 1);
function comboFx(c){
  const tier = c >= 10 ? 3 : c >= 5 ? 2 : 1;
  const pop = el("div","combo-pop t" + tier);
  pop.append(el("b","",`${c}× COMBO!`), el("span","pixel",`xu ×${comboMult(c)}`));
  document.body.append(pop); setTimeout(() => pop.remove(), 1000);
  const fl = el("div","combo-flash");
  fl.style.setProperty("--cf", ["#ffcf5c","#ff7ac8","#27e6ff"][tier - 1]);
  document.body.append(fl); setTimeout(() => fl.remove(), 700);
  if (tier > 1){ const w = document.querySelector(".wrap"); w.classList.remove("shake"); void w.offsetWidth; w.classList.add("shake"); }
  burst(innerWidth / 2, innerHeight * .38, 12 + tier * 10);
}
function updateCombo(){
  const m = $("qMult"), mv = comboMult(run.combo);
  m.textContent = `xu ×${mv}`; m.classList.toggle("on", mv > 1);
  const c = $("combo");
  c.textContent = run.combo >= 3 ? `🔥 combo ×${run.combo}` : `combo ×${run.combo}`;
  c.classList.toggle("hot", run.combo >= 3);
}

function next(){
  if (!run) return;
  if (!run.answered){
    const q = run.qs[run.i];
    if (q.a.length > 1 && run.picked.size) return submit();
    run.picked = new Set(); return submit();
  }
  run.i++;
  run.i < run.qs.length ? renderQ() : finish();
}

function finish(){
  const n = run.qs.length;
  S.sessions++;
  const temple = run.mode === "temple", giaide = run.mode === "giaide", onsai = run.mode === "onsai";
  let newHigh = false;
  if (temple){ S.temple.runs++; if (run.score > S.temple.best){ S.temple.best = run.score; newHigh = true; } }
  else if (giaide) S.giaide = null; // điểm giải đề không tính vào "điểm cao nhất /30"
  else if (onsai) S.onsai.run = null;
  else { S.best = Math.max(S.best, run.score); if (run.score === n && (!run.review || n >= SESSION_SIZE)) S.perfect++; }
  touchStreak();
  const got = checkBadges();
  save();
  if (got.length) setTimeout(() => { if (!$("result").classList.contains("hidden")) showBadge(got); }, 400);

  const pct = run.score / n;
  $("rNum").textContent = `${run.score}/${n}`;
  const [stk, msg] = pct === 1 ? ["💯 PERFECT!!","Không sai câu nào — bạn là huyền thoại ✦"]
    : pct >= .8 ? ["🌟 Xuất sắc","Gần như hoàn hảo, giữ phong độ nha!"]
    : pct >= .6 ? ["💖 Ổn áp","Đang tiến bộ rõ rệt, thêm vài lượt là thuộc!"]
    : pct >= .4 ? ["😮‍💨 Lưng lửng","Nửa đúng nửa sai, học kiểu ăn may à? Câu sai sẽ quay lại hỏi tội đấy."]
    : ["🤦 Thôi xong","Điểm thế này thì về quê nuôi lợn cho lành. Đùa thôi, làm thêm lượt nữa đi!"];
  $("rSticker").textContent = stk; $("rMsg").textContent = msg;
  if (temple){
    $("rSticker").textContent = newHigh ? "🔱 KỶ LỤC MỚI!" : stk;
    $("rMsg").textContent = `Điểm ngôi đền: ${run.score} · 🏆 HighScore: ${S.temple.best}` + (newHigh ? " — bạn vừa phá kỷ lục!" : ` (còn thiếu ${S.temple.best - run.score} để vượt kỷ lục)`);
  }
  if (giaide) $("rMsg").textContent = `Giải xong ${n} câu · đúng ${run.score} (${Math.round(pct * 100)}%). ` + (run.wrong.length ? `Xem lại ${run.wrong.length} câu sai bên dưới nhé ✦` : "Không sai câu nào, quá đỉnh ✦");
  const left = S.onsai.ids.length;
  if (onsai) $("rMsg").textContent = `Ôn xong ${n} câu sai · gỡ được ${run.score} câu khỏi kho. ` + (left ? `Kho còn ${left} câu — sai lần này thì lượt sau gặp lại nhé ✦` : "Kho câu sai trống trơn, quá đỉnh ✦");
  else if (giaide && left) $("rMsg").textContent += ` Kho câu sai đang có ${left} câu — bấm 📕 để ôn lại.`;
  $("onsaiAgain").classList.toggle("hidden", !giaide || !left);
  $("onsaiAgain").textContent = `📕 Ôn ${left} câu sai`;
  $("rXp").textContent = `+${run.xp} xu`;
  $("rCombo").textContent = `combo max ×${run.maxCombo}`;
  $("rStreak").textContent = `🔥 ${S.streak.count} ngày`;
  $("rBadges").replaceChildren(...got.map(id => badgeEl(BADGES.find(b => b[0] === id), false)));

  $("reviewWin").classList.toggle("hidden", !run.wrong.length);
  $("review").replaceChildren(...run.wrong.map(({q, picked}) => {
    const d = el("div","it");
    d.append(el("div","q",q.q));
    d.append(el("div","y", "Bạn chọn: " + (picked.length ? picked.map(i => q.o[i]).join(" · ") : "(bỏ qua)")));
    d.append(el("div","a", "✓ " + q.a.map(i => q.o[i]).join(" · ")));
    d.append(explainEl(q, picked, false));
    return d;
  }));
  $("againBtn").textContent = giaide ? "Giải đề lại từ đầu 📖" : onsai ? (left ? `Ôn tiếp ${left} câu còn sai 📕` : "Kho câu sai trống 🎉") : temple ? "Thử lại ngôi đền 🔱" : run.review ? "Ôn thêm đợt nữa 🏛" : "Thêm 30 câu mới nữa ✦";
  $("againBtn").disabled = lastMode === "new" && !newPool().length || onsai && !left;
  show("result");
  if (pct >= .6){ sfx.win(); setTimeout(() => burst(innerWidth / 2, innerHeight / 3, 40), 200); }
  run = null;
}

function touchStreak(){
  const t = today();
  if (S.streak.last !== t){ S.streak.count = S.streak.last === yesterday() ? S.streak.count + 1 : 1; S.streak.last = t; }
}

function quit(){
  if (run && resumable(run.mode)){ // tiến độ đã lưu sau từng câu: thoát không cần hỏi
    const sat = run.sit, m = run.mode; run = null;
    const got = checkBadges(); save(); renderHome(); show("home");
    if (sat) toast(m === "onsai" ? "📕 Đã lưu tiến độ ôn câu sai — lúc nào quay lại cũng làm tiếp được" : "📖 Đã lưu tiến độ giải đề — lúc nào quay lại cũng làm tiếp được");
    if (got.length) showBadge(got);
    return;
  }
  if (run && (run.i > 0 || run.answered) && !confirm("Thoát giữa chừng? Các câu đã làm vẫn được lưu vào thống kê ♡")) return;
  run = null; renderHome(); show("home");
}

