/* ---------- giải đề: tìm thẻ Study Guide liên quan tới câu hỏi ----------
   TF-IDF theo âm tiết + cặp âm tiết (từ ghép tiếng Việt), chấm trên từng gạch đầu dòng và cả thẻ.
   Tính lúc chạy nên sửa câu hỏi hay sửa Study Guide (rồi chạy tools/build-guide.js) đều tự khớp lại. */
const Guide = (() => {
  const STOP = new Set("là của và các có những được trong cho với không một đó này nào sau đây đúng sai gì theo thì mà để khi cũng như từ về ra vào do bởi đã đang sẽ rất hay hoặc còn chỉ lại nên vì nó họ ta tại trên dưới ấy hãy chọn câu phương án nhận định ý kiến sau".split(" "));
  /* Study Guide viết tắt nhiều, đề thì viết đủ → bung chữ tắt trước khi tách âm tiết */
  const ABBR = {LLSX:"lực lượng sản xuất", QHSX:"quan hệ sản xuất", TLSX:"tư liệu sản xuất", PTSX:"phương thức sản xuất", TTXH:"tồn tại xã hội", YTXH:"ý thức xã hội",
    HTKT:"hình thái kinh tế", "KT–XH":"kinh tế xã hội", CSHT:"cơ sở hạ tầng", KTTT:"kiến trúc thượng tầng", CNXH:"chủ nghĩa xã hội", XHCN:"xã hội chủ nghĩa", CNTB:"chủ nghĩa tư bản",
    TBCN:"tư bản chủ nghĩa", "CNĐQ":"chủ nghĩa đế quốc", TGQ:"thế giới quan", KTCT:"kinh tế chính trị", "NSLĐ":"năng suất lao động", "VĐCB":"vấn đề cơ bản", NN:"nhà nước", VC:"vật chất"};
  const ABBR_RE = new RegExp("(?<!\\p{L})(" + Object.keys(ABBR).sort((a, b) => b.length - a.length).join("|") + ")(?!\\p{L})", "gu");
  const toks = t => String(t).replace(ABBR_RE, m => ABBR[m]).replace(/Hi Lạp/g, "Hy Lạp").toLowerCase().normalize("NFC")
    .replace(/\*+/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim().split(" ").filter(Boolean);
  /* đặc trưng: âm tiết (trừ hư từ) nặng .5, cặp âm tiết liền nhau nặng 1 */
  function feats(text, w, into = new Map()){
    const t = toks(text);
    t.forEach((x, i) => {
      if (!STOP.has(x) && x.length > 1) into.set(x, (into.get(x) || 0) + .5 * w);
      if (i && !(STOP.has(x) && STOP.has(t[i - 1]))) { const k = t[i - 1] + " " + x; into.set(k, (into.get(k) || 0) + w); }
    });
    return into;
  }
  let idx = null;
  function build(){
    const docs = [];
    GUIDE.forEach((s, si) => s.cards.forEach((c, ci) => {
      const head = feats(c.t, .5);
      c.b.forEach((b, bi) => docs.push({si, ci, bi, f: feats(b, 1, new Map(head))}));
    }));
    // df đếm theo thẻ (không theo gạch đầu dòng): tiêu đề thẻ lặp ở mọi dòng sẽ không bị coi là từ phổ thông
    const df = new Map(), seen = new Set(); let nCards = 0;
    for (const d of docs){ if (!d.bi) nCards++; for (const k of d.f.keys()){ const u = d.si + "|" + d.ci + "|" + k; if (!seen.has(u)){ seen.add(u); df.set(k, (df.get(k) || 0) + 1); } } }
    const idf = k => Math.log(1 + nCards / (df.get(k) || .5));
    const vec = f => { const v = new Map(); let n = 0; for (const [k, x] of f){ const y = x * idf(k); v.set(k, y); n += y * y; } return {v, n: Math.sqrt(n) || 1}; };
    for (const d of docs) Object.assign(d, vec(d.f));
    const cards = new Map(); // gộp gạch đầu dòng thành vector cả thẻ
    for (const d of docs){ const key = d.si + "|" + d.ci; const f = cards.get(key) || new Map(); for (const [k, x] of d.f) f.set(k, (f.get(k) || 0) + x); cards.set(key, f); }
    for (const [key, f] of cards) cards.set(key, vec(f));
    idx = {docs, cards, vec};
  }
  const cos = (a, b) => { let s = 0; const [x, y] = a.v.size < b.v.size ? [a, b] : [b, a]; for (const [k, w] of x.v){ const z = y.v.get(k); if (z) s += w * z; } return s / (a.n * b.n); };

  /* câu hỏi → [{s, c, hits:[chỉ số gạch đầu dòng], score, weak}] (tối đa 2 thẻ), rỗng nếu không đủ liên quan */
  const MIN = .08, cache = new Map();
  function match(q){
    if (cache.has(q)) return cache.get(q);
    if (!idx) build();
    const right = q.a.map(i => q.o[i]);
    // "Cả A và B", "Tất cả đều đúng": nội dung nằm ở các phương án khác
    const ref = right.some(r => /tất cả|cả \S+ (và|lẫn)|đều đúng|^[a-e]\s*(,|và)\s*[a-e]\b/i.test(r));
    const ans = (f, w) => { for (const r of right) feats(r, w, f); if (ref) q.o.forEach((o, i) => { if (!q.a.includes(i)) feats(o, w * .6, f); }); return f; };
    const f = ans(feats(q.q, 1), 1.3); if (q.e) feats(q.e, .35, f);
    const qv = idx.vec(f), av = idx.vec(ans(feats(q.q, .1), 1)); // av bám đáp án: đề tình huống dài dễ làm loãng qv
    const sim = d => Math.max(cos(qv, d), .85 * cos(av, d));
    const per = new Map();
    for (const d of idx.docs){
      const sc = sim(d); if (sc <= 0) continue;
      const key = d.si + "|" + d.ci; (per.get(key) || per.set(key, []).get(key)).push([d.bi, sc]);
    }
    const ranked = [...per].map(([key, bs]) => {
      bs.sort((x, y) => y[1] - x[1]);
      const score = .55 * sim(idx.cards.get(key)) + .45 * bs[0][1];
      const [si, ci] = key.split("|").map(Number);
      const hits = bs.filter(([, sc], k) => k < 3 && sc >= Math.max(.06, bs[0][1] * .6)).map(([bi]) => bi);
      return {s: GUIDE[si], c: GUIDE[si].cards[ci], hits, score, weak: score < .13};
    }).sort((x, y) => y.score - x.score);
    const best = ranked[0], res = [];
    if (best && best.score >= MIN){ res.push(best); const nx = ranked[1]; if (nx && nx.score >= best.score * .8 && nx.score >= MIN) res.push(nx); }
    cache.set(q, res); return res;
  }
  return {match};
})();
