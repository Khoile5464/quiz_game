/* ---------- Câu chuyện KTCT (MLN122): story reader + interactions ----------
   Content: js/data/story-mln122.js (STORY). Formulas: js/story/formulas.js (StoryMath).
   Gate quizzes reuse the normal quiz screen (run.mode = "story", see session.js), so answers feed the review algorithm and coins as usual.
   Progress: S.story = {done: {sceneId: score}, cards: {guideKey: true}, acts: {actId: true}} */
const Story = (() => {
  const SCENE_COINS = 40, PASS = 2 / 3;
  let cur = null; // {act, scene, i, ready}
  const actOf = id => STORY.acts.find(a => a.id === id);
  const sceneKey = (a, s) => `${a.id}.${s.id}`;
  const byN = n => Q.find(q => q.n === n);
  const guideCard = k => { for (const s of GUIDE122) for (const c of s.cards) if (c.k === k) return {s, c}; return null; };
  const vnd = x => (Math.round(x * 100) / 100).toLocaleString("vi-VN");

  /* ---------- map: 6 acts, scenes of open acts ---------- */
  function open(){ if (run) return; cur = null; renderMap(); show("story"); }
  function renderMap(){
    const box = $("storyBody"); box.replaceChildren();
    box.append(el("p", "st-intro", "Đi qua 6 hồi theo đúng 6 chương của môn. Mỗi cảnh: gặp tình huống, tự thử, rồi Athena mới gọi tên thuật ngữ. Qua quiz chốt (đúng từ 2/3) để mở thẻ thuật ngữ và nhận xu."));
    for (const a of STORY.acts){
      const card = el("div", "st-act" + (a.scenes.length ? "" : " soon"));
      const done = a.scenes.filter(s => S.story.done[sceneKey(a, s)] != null).length;
      const head = el("div", "st-act-h");
      head.append(el("b", "", a.title), el("small", "", a.sub));
      head.append(el("span", "st-prog", a.scenes.length ? `${done}/${a.scenes.length} cảnh` + (S.story.acts[a.id] ? " · ✔ hoàn thành" : "") : "đang viết"));
      card.append(head);
      if (a.scenes.length){
        const list = el("div", "st-scenes");
        a.scenes.forEach((s, i) => {
          const sc = S.story.done[sceneKey(a, s)];
          const b = el("button", "st-scene" + (sc != null ? " done" : ""));
          b.append(el("span", "st-no", String(i + 1)), el("span", "st-tt", s.title), el("small", "", s.sub));
          if (sc != null) b.append(el("span", "st-score", `✔ ${sc}`));
          b.onclick = () => startScene(a, s);
          list.append(b);
        });
        card.append(list);
      }
      box.append(card);
    }
    const back = el("button", "btn small lav", "← Về trang chủ"); back.onclick = () => { renderHome(); show("home"); };
    box.append(back);
  }

  /* ---------- scene reader: steps stay on screen like a chat log ---------- */
  function startScene(a, s){ cur = {act: a, scene: s, i: 0}; renderScene(); scrollTo({top: 0}); }
  function renderScene(){
    const {act, scene} = cur, box = $("storyBody"); box.replaceChildren();
    const h = el("div", "st-scene-h");
    const back = el("button", "linkbtn", "← Bản đồ"); back.onclick = () => { cur = null; renderMap(); };
    h.append(back, el("b", "", `${act.title.split("·")[0].trim()} · Cảnh ${act.scenes.indexOf(scene) + 1}: ${scene.title}`));
    box.append(h, el("div", "st-log", ""));
    cur.i = 0; stepIn();
  }
  function stepIn(){
    const log = $("storyBody").querySelector(".st-log"), step = cur.scene.steps[cur.i];
    log.querySelector(".st-next")?.remove();
    let node, failed = false;
    try { node = RENDER[step.type](step); }
    catch (e){ console.error("Story step failed", cur.act.id, cur.scene.id, cur.i, e); failed = true; node = el("p", "st-fb bad", "⚠️ Bước này bị lỗi hiển thị, bấm Tiếp để đi tiếp."); }
    node.classList.add("st-step");
    log.append(node);
    if (step.type !== "gate") log.append(nextBtn(failed || !BLOCKING.has(step.type)));
    node.scrollIntoView({behavior: "smooth", block: "nearest"});
  }
  const BLOCKING = new Set(["choice", "sort", "order", "sim", "balance"]);
  function nextBtn(enabled){
    const b = el("button", "btn small st-next", "Tiếp ▸"); b.disabled = !enabled;
    b.onclick = () => { cur.i++; stepIn(); };
    return b;
  }
  const unlock = () => { const b = $("storyBody").querySelector(".st-next"); if (b){ b.disabled = false; b.focus({preventScroll: true}); } };

  /* ---------- step renderers ---------- */
  const RENDER = {
    say(s){ const who = STORY.cast[s.who] || {ic: "📜", name: ""}; const d = el("div", "st-say " + s.who);
      d.append(el("span", "st-ic", who.ic)); const b = el("div", "st-bub"); b.append(el("b", "", who.name), el("p", "", s.text)); d.append(b); return d; },
    choice(s){ const d = el("div", "st-box"); d.append(el("p", "st-q", s.prompt));
      const fb = el("p", "st-fb hidden");
      shuffle(s.options).forEach(o => { const b = el("button", "st-opt", o.t);
        b.onclick = () => { fb.textContent = o.fb; fb.className = "st-fb " + (o.ok ? "good" : "bad"); b.classList.add(o.ok ? "right" : "wrong");
          if (o.ok){ d.querySelectorAll(".st-opt").forEach(x => x.disabled = true); sfx.ok(); unlock(); } else sfx.bad(); };
        d.append(b); });
      d.append(fb); return d; },
    sort(s){ const d = el("div", "st-box"); d.append(el("p", "st-q", s.prompt));
      let left = s.items.length;
      for (const [t, bin] of shuffle(s.items)){ const row = el("div", "st-sort"); row.append(el("span", "st-item", t));
        const btns = el("span", "st-bins");
        s.bins.forEach((name, j) => { const b = el("button", "st-bin", name);
          b.onclick = () => { if (j === bin){ btns.querySelectorAll("button").forEach(x => x.disabled = true); b.classList.add("right"); row.classList.add("ok"); sfx.ok(); if (!--left) unlock(); }
            else { b.classList.add("wrong"); sfx.bad(); setTimeout(() => b.classList.remove("wrong"), 600); } };
          btns.append(b); });
        row.append(btns); d.append(row); }
      return d; },
    order(s){ const d = el("div", "st-box"); d.append(el("p", "st-q", s.prompt));
      const done = el("ol", "st-ordered"), pool = el("div", "st-pool"); let k = 0;
      for (const t of shuffle(s.items)){ const b = el("button", "st-opt", t);
        b.onclick = () => { if (t === s.items[k]){ k++; b.remove(); done.append(el("li", "", t)); sfx.ok(); if (k === s.items.length) unlock(); }
          else { b.classList.add("wrong"); sfx.bad(); setTimeout(() => b.classList.remove("wrong"), 600); } };
        pool.append(b); }
      d.append(done, pool); return d; },
    /* picture step: flow (boxes + arrows), stack (proportional bars), timeline. Pure data, no interaction. */
    viz(s){ const d = el("div", "st-box st-viz"); d.append(el("p", "st-q", "🎨 " + s.title)); let n = 0;
      const delay = x => { x.style.setProperty("--i", n++); return x; };
      if (s.kind === "flow"){
        for (const row of s.rows || [s.nodes]){ const r = el("div", "st-flow");
          row.forEach((nd, i) => { if (i) r.append(delay(el("span", "st-arrow", "➜")));
            const b = delay(el("div", "st-node")); b.append(el("b", "", nd[0])); if (nd[1]) b.append(el("small", "", nd[1])); r.append(b); });
          d.append(r); }
      } else if (s.kind === "stack"){
        const seen = new Map();
        for (const [name, segs] of s.rows){ const r = el("div", "st-stack"), bar = el("div", "st-stackbar");
          r.append(el("span", "st-stack-n", name));
          for (const [l, v, c] of segs){ const g = delay(el("i", "seg " + c, `${vnd(v)}`)); g.style.flexGrow = v; g.title = `${l}: ${vnd(v)}${s.unit || ""}`; bar.append(g); if (!seen.has(c)) seen.set(c, [c, l]); }
          r.append(bar); d.append(r); }
        const lg = el("div", "st-keys");
        for (const [c, l] of seen.values()){ const k = el("span", "st-key"); k.append(el("i", "seg " + c), l); lg.append(k); }
        d.append(lg);
      } else if (s.kind === "timeline"){
        const ol = el("ol", "st-timeline");
        for (const [t, txt] of s.items){ const li = delay(el("li")); li.append(el("b", "", t), el("span", "", txt)); ol.append(li); }
        d.append(ol);
      }
      if (s.note) d.append(el("p", "st-legend", s.note));
      return d; },
    term(s){ const d = el("div", "st-term");
      d.append(el("div", "st-term-h", "🦉 Athena gọi tên"));
      const tb = el("table", "st-trans"); tb.append(rowOf(["Trong truyện", "Thuật ngữ giáo trình"], "th"));
      s.trans.forEach(r => tb.append(rowOf(r, "td"))); d.append(tb);
      const g = el("div", "st-gt"); g.append(el("div", "st-gt-h", "📖 Theo giáo trình (Study Guide)"));
      for (const k of s.guide){ const m = guideCard(k); if (!m) continue;
        const c = el("div", "st-gt-card"); c.append(el("b", "", m.c.t));
        const ul = el("ul"); m.c.b.forEach(t => { const li = el("li", t[0] === "!" ? "warn" : ""); li.append(guideText(t.replace(/^[!+]/, ""))); ul.append(li); }); c.append(ul);
        const a = el("a", "sg-open", "mở trong Study Guide ↗"); a.href = "study-guide-mln122.html#" + k; a.target = "_blank"; a.rel = "noopener"; c.append(a);
        g.append(c); }
      d.append(g);
      if (s.caveat) d.append(el("p", "st-caveat", "⚠️ Ẩn dụ dừng ở đây: " + s.caveat));
      return d; },
    gate(s){ const d = el("div", "st-box st-gate");
      d.append(el("p", "st-q", `⚔️ Quiz chốt cảnh: ${s.qs.length} câu. Đúng từ ${Math.ceil(s.qs.length * PASS)} câu để mở thẻ thuật ngữ` + (S.story.done[sceneKey(cur.act, cur.scene)] == null ? ` và nhận ${SCENE_COINS} xu.` : ".")));
      const b = el("button", "btn", "Vào quiz chốt ✦"); b.onclick = () => gateStart(s); d.append(b); return d; },
    sim: s => SIM[s.mode](s),
    /* policy rounds with interest bars: a wrong choice shows who loses, then the bars bounce back for a retry */
    balance(s){ const d = el("div", "st-box st-sim"); d.append(el("p", "st-q", s.prompt));
      const val = s.groups.map(() => 50), bars = el("div", "st-bars"), stage = el("div", "st-box st-round"), log = el("ul", "st-missions"); let k = 0;
      const drawBars = (v = val) => bars.replaceChildren(...s.groups.map((g, i) => { const r = el("div", "st-barrow"), bar = el("span", "st-bar"), b = el("i");
        b.style.width = Math.max(0, Math.min(100, v[i])) + "%"; bar.append(b); r.append(el("span", "", g), bar, el("b", "", String(Math.round(v[i])))); return r; }));
      const round = () => { if (k === s.rounds.length){ stage.replaceChildren(el("p", "st-fb good", s.done)); unlock(); return; }
        const R = s.rounds[k], fb = el("p", "st-fb hidden");
        stage.replaceChildren(el("p", "st-q", `Tình huống ${k + 1}/${s.rounds.length}: ${R.sit}`), ...shuffle(R.options).map(o => { const b = el("button", "st-opt", o.t);
          b.onclick = () => { const tried = val.map((x, i) => x + o.eff[i]); drawBars(tried); fb.textContent = o.fb; fb.className = "st-fb " + (o.ok ? "good" : "bad");
            if (o.ok){ tried.forEach((x, i) => val[i] = x); stage.querySelectorAll(".st-opt").forEach(x => x.disabled = true); sfx.ok();
              log.append(el("li", "ok", `✅ ${R.role}`)); k++; setTimeout(round, 1400); }
            else { b.classList.add("wrong"); sfx.bad(); setTimeout(() => drawBars(), 1400); } };
          return b; }), fb); };
      d.append(bars, stage, log); drawBars(); round(); return d; },
  };
  const rowOf = (cells, tag) => { const tr = el("tr"); cells.forEach(c => tr.append(el(tag, "", c))); return tr; };

  /* ---------- simulations (numbers from StoryMath only) ---------- */
  function slider(label, min, max, step, val, fmt, onInput, locked){
    const w = el("label", "st-sl" + (locked ? " locked" : "")); const span = el("b", "", fmt(val));
    const r = el("input"); Object.assign(r, {type: "range", min, max, step, value: val, disabled: !!locked});
    r.oninput = () => { span.textContent = fmt(+r.value); onInput(+r.value); };
    w.append(el("span", "", label), r, span); return w;
  }
  function statTable(rows){ const t = el("table", "st-stats"); rows.forEach(([k, v, cls]) => { const tr = rowOf([k, v], "td"); if (cls) tr.className = cls; t.append(tr); }); return t; }
  /* missions: tick when check(state) is true once; unlock "Tiếp" when all done */
  function missions(s, ul){
    const done = new Set();
    return st => { for (const m of s.missions) if (!done.has(m.id) && m.check(st)){ done.add(m.id); sfx.ok(); }
      ul.replaceChildren(...s.missions.map(m => el("li", done.has(m.id) ? "ok" : "", (done.has(m.id) ? "✅ " : "⬜ ") + m.t + (done.has(m.id) ? ` → ${m.done}` : ""))));
      if (done.size === s.missions.length) unlock(); };
  }
  const SIM = {
    day(s){ const d = el("div", "st-box st-sim"); d.append(el("p", "st-q", s.prompt));
      const st = {hours: 12}, out = el("div");
      const draw = () => { const r = StoryMath.millDay(st), H = st.hours;
        const bar = el("div", "st-daybar"); for (let h = 0; h < H; h++){ const seg = el("i", h < r.t ? "nec" : "sur"); seg.title = `Giờ ${h + 1}`; bar.append(seg); }
        out.replaceChildren(bar, el("p", "st-legend", `🟦 ${vnd(r.t)} giờ đầu: làm ra đủ tiền công  ·  🟥 ${vnd(r.tSurplus)} giờ sau: làm không công`),
          statTable([["Sợi làm ra", vnd(r.kg) + " kg"], ["Bông + hao mòn máy (giá trị cũ chuyển sang)", vnd(r.c) + " đồng"], ["Tiền công trả Lyra", vnd(r.v) + " đồng"],
            ["Giá trị mới Lyra tạo ra", vnd(r.newValue) + " đồng"], ["Phần dôi ra cho xưởng", vnd(r.m) + " đồng", "hl"], ["Giá trị cả mẻ sợi", vnd(r.W) + " đồng"]])); };
      d.append(slider("Giờ làm mỗi ngày", 6, 16, 1, 12, x => x + " giờ", x => { st.hours = x; draw(); unlock(); }), out);
      draw(); return d; },
    methods(s){ const d = el("div", "st-box st-sim"); d.append(el("p", "st-q", s.prompt));
      const st = {hours: 12, tech: 1, wageGoods: 1}, out = el("div"), ms = el("ul", "st-missions"), tick = missions(s, ms);
      const draw = () => { const r = StoryMath.millDay(st); tick(st);
        out.replaceChildren(statTable([["Thời gian tất yếu t", vnd(r.t) + " giờ"], ["Thời gian thặng dư t′", vnd(r.tSurplus) + " giờ"], ["Giá trị sức lao động (= tiền công)", vnd(r.v) + " đồng"],
          ["Giá trị thặng dư m", vnd(r.m) + " đồng", "hl"], ["   trong đó siêu ngạch", vnd(r.mExcess) + " đồng"], ["Tỷ suất m′ = m/v", Math.round(r.rate * 100) + "%", "hl"]])); };
      d.append(ms,
        slider("Giờ làm mỗi ngày", 8, 16, 1, 12, x => x + " giờ", x => { st.hours = x; draw(); }),
        slider("Năng suất ngành làm đồ sinh hoạt", 1, 2, .25, 1, x => "×" + x, x => { st.wageGoods = x; draw(); }),
        slider("Máy của xưởng so với mức chung", 1, 2, .5, 1, x => "×" + x, x => { st.tech = x; draw(); }), out);
      draw(); return d; },
    accum(s){ const d = el("div", "st-box st-sim"); d.append(el("p", "st-q", s.prompt));
      const base = StoryMath.millDay({workers: 10}), DAYS = 300;
      const st = {c: base.c * DAYS, v: base.v * DAYS, year: 1, share: .5, organic: base.organic * 1.5}, hist = el("table", "st-stats"), out = el("div");
      const lpv = StoryMath.MILL.laborPowerValue * DAYS;
      hist.append(rowOf(["Năm", "Tư bản c + v", "c/v", "Số thợ"], "th"));
      const log = () => hist.append(rowOf([String(st.year), Math.round(st.c + st.v).toLocaleString("vi-VN"), vnd(st.c / st.v), String(Math.round(st.v / lpv))], "td"));
      log();
      const go = el("button", "btn small blue", "Sang năm ▸");
      go.onclick = () => { const m = st.v; /* m′ = 100% */ const r = StoryMath.accumulate({...st, m});
        Object.assign(st, {c: r.c, v: r.v, year: st.year + 1}); log();
        const R = x => Math.round(x).toLocaleString("vi-VN");
        out.textContent = `Năm ${st.year - 1}: GTTD ${R(m)} đồng, đem tích lũy ${R(m - r.consumed)}, tiêu dùng ${R(r.consumed)}.`;
        if (st.year > s.goal.years) unlock(); };
      d.append(slider("Tỷ lệ GTTD đem tích lũy", 0, 1, .1, .5, x => Math.round(x * 100) + "%", x => st.share = x),
        slider("Đầu tư mới nghiêng về máy (c/v của phần đầu tư)", 4, 20, 2, Math.round(st.organic), x => "c/v = " + x, x => st.organic = x), go, out, hist,
        el("p", "st-legend", "Giữ m′ = 100% cho dễ theo dõi. Thử đặt tích lũy 0% để thấy tái sản xuất giản đơn: quy mô đứng yên."));
      return d; },
    market(s){ const d = el("div", "st-box st-sim"); d.append(el("p", "st-q", s.prompt));
      const st = {myHours: 10, productivity: 1, intensity: 1, complexity: 1}, ms = el("ul", "st-missions"), tick = missions(s, ms), sale = el("div"), day = el("div");
      const draw = () => { const r = StoryMath.weaverSale({myHours: st.myHours}), w = StoryMath.laborDay(st), base = StoryMath.laborDay();
        sale.replaceChildren(statTable([["Thời gian lao động xã hội cần thiết / tấm", "2 giờ"], ["Thời gian của bạn / tấm", vnd(st.myHours) + " giờ"],
          ["Chợ trả theo giá trị xã hội", vnd(r.value) + " đồng"], ["Công sức bạn bỏ ra (quy ra đồng)", vnd(r.cost) + " đồng"],
          [r.gain >= 0 ? "Bạn được thêm" : "Bạn bị lỗ", vnd(Math.abs(r.gain)) + " đồng", "hl"]]));
        day.replaceChildren(el("p", "st-legend", "Một ngày 8 giờ của bạn, khi dệt đúng mức chung 2 giờ/tấm:"), statTable([["Số tấm vải làm ra", vnd(w.units) + " tấm (lúc đầu " + base.units + ")"],
          ["Giá trị 1 tấm", vnd(w.unit) + " đồng", "hl"], ["Tổng giá trị tạo ra trong ngày", vnd(w.total) + " đồng", "hl"]]));
        tick(st); };
      d.append(ms, slider("Thời gian bạn dệt 1 tấm", 1, 3.5, .5, 2, x => vnd(x) + " giờ", x => { st.myHours = x; draw(); }), sale,
        slider("Năng suất lao động (khung cửi tốt hơn)", 1, 2, .5, 1, x => "×" + x, x => { st.productivity = x; draw(); }),
        slider("Cường độ lao động (làm khẩn trương hơn)", 1, 1.5, .25, 1, x => "×" + x, x => { st.intensity = x; draw(); }),
        slider("Độ phức tạp của lao động (thợ lành nghề)", 1, 2, 1, 1, x => x > 1 ? "phức tạp ×" + x : "giản đơn", x => { st.complexity = x; draw(); }), day);
      draw(); return d; },
    supply(s){ const d = el("div", "st-box st-sim"); d.append(el("p", "st-q", s.prompt));
      const VALUE = 2, DEMAND = 50, out = el("div"), seen = new Set(); // same cloth as scene 3: 2 h of socially necessary labour = 2 đồng
      const draw = q => { const p = StoryMath.marketPrice(VALUE, DEMAND, q), rel = Math.abs(p - VALUE) < 1e-9 ? "=" : p > VALUE ? ">" : "<";
        seen.add(rel);
        out.replaceChildren(statTable([["Cầu (người có tiền muốn mua)", DEMAND + " tấm"], ["Cung (vải đem ra chợ)", q + " tấm"], ["Giá trị 1 tấm", VALUE + " đồng"],
          ["Giá bán ở chợ", vnd(p) + " đồng", "hl"], ["So với giá trị", rel === "=" ? "giá cả = giá trị" : rel === ">" ? "giá cả CAO hơn giá trị" : "giá cả THẤP hơn giá trị"]]),
          el("p", "st-legend", seen.size >= 3 ? "Bạn đã thấy cả ba trường hợp: giá cả lên xuống, nhưng luôn xoay quanh giá trị 2 đồng." : "Thử cả lúc cung thiếu, cung thừa và cung vừa đủ."));
        if (seen.size >= 3) unlock(); };
      d.append(slider("Số vải đem ra chợ", 20, 80, 10, 50, x => x + " tấm", draw), out); draw(50); return d; },
    money(s){ const d = el("div", "st-box st-sim"); d.append(el("p", "st-q", s.prompt));
      const PRICES = 1000, V = 5, need = StoryMath.moneyNeeded(PRICES, V), out = el("div");
      const draw = m => { const lv = StoryMath.priceLevel(m, need);
        out.replaceChildren(statTable([["Lượng tiền cần cho lưu thông M = P·Q / V", vnd(need) + " đồng"], ["Lượng tiền Hermes phát hành", m + " đồng"],
          ["Mức giá so với ban đầu", "×" + vnd(lv), "hl"], ["Giá 1 tấm vải (ban đầu 2 đồng)", vnd(2 * lv) + " đồng", "hl"]]),
          el("p", "st-legend", lv > 1 ? "Tiền nhiều hơn mức cần thiết: hàng không nhiều thêm, chỉ giá cả tăng. Đó là lạm phát." : lv < 1 ? "Tiền ít hơn mức cần thiết: thiếu tiền cho lưu thông, giá cả bị kéo xuống." : "Vừa đủ tiền cho lưu thông, giá cả ổn định."));
        if (m >= 2 * need) unlock(); };
      d.append(slider("Tiền phát hành", 100, 600, 50, 200, x => x + " đồng", draw), el("p", "st-legend", "Thử in gấp đôi (400) hoặc hơn nữa."), out); draw(200); return d; },
    compete(s){ const d = el("div", "st-box st-sim"); d.append(el("p", "st-q", s.prompt));
      const names = ["Hephaestus", "Ares", "Hestia", "Iris", "Echo"]; let shares = [30, 25, 20, 15, 10], year = 0;
      const bars = el("div", "st-bars"), out = el("p", "st-legend");
      const draw = () => { const alive = shares.filter(x => x > 0).length, top = Math.max(...shares);
        bars.replaceChildren(...names.map((n, i) => { const r = el("div", "st-barrow" + (shares[i] ? "" : " gone"));
          const b = el("i"); b.style.width = shares[i] + "%"; r.append(el("span", "", n), el("span", "st-bar", ""), el("b", "", shares[i] ? shares[i] + "%" : "bị thâu tóm"));
          r.children[1].append(b); return r; }));
        out.textContent = `Năm ${year}: còn ${alive} xưởng, xưởng lớn nhất nắm ${top}% thị trường.` + (top >= 60 ? " Một xưởng đã đủ sức chi phối giá: đó là mầm mống độc quyền." : "");
        if (top >= 60) unlock(); };
      const go = el("button", "btn small blue", "Một năm cạnh tranh ▸"); go.onclick = () => { shares = StoryMath.competeYear(shares); year++; draw(); };
      d.append(bars, go, out); draw(); return d; },
    forms(s){ const d = el("div", "st-box st-sim"); d.append(el("p", "st-q", s.prompt));
      const LADDER = [["Cạnh tranh tự do", "✔", "✔", "Mỗi xưởng tự lo mọi thứ"], ["Cartel", "✔", "✔", "Chỉ thỏa thuận giá cả, sản lượng, chia thị trường"],
        ["Syndicate", "✔", "✘", "Một ban quản trị chung lo mua nguyên liệu, bán hàng"], ["Trust", "✘", "✘", "Gộp thành một công ty, chủ xưởng thành cổ đông"],
        ["Consortium", "✘", "✘", "Khối nhiều ngành (sợi, mỏ, tàu, ngân hàng), ngân hàng lớn đứng đầu"]];
      let lv = 0; const t = el("table", "st-stats"), go = el("button", "btn small blue", "Nâng liên minh lên nấc tiếp ▸");
      const draw = () => { t.replaceChildren(rowOf(["Nấc", "Tự sản xuất", "Tự mua bán", "Thỏa thuận"], "th"),
        ...LADDER.slice(0, lv + 1).map((r, i) => { const tr = rowOf(r, "td"); if (i === lv) tr.className = "hl"; return tr; }));
        if (lv === LADDER.length - 1){ go.disabled = true; unlock(); } };
      go.onclick = () => { lv++; draw(); };
      d.append(t, go); draw(); return d; },
    monopoly(s){ const d = el("div", "st-box st-sim"); d.append(el("p", "st-q", s.prompt));
      const out = el("div");
      const draw = x => { const r = StoryMath.monopoly({share: x});
        out.replaceChildren(statTable([["Giá trị 1 lô sợi / 1 lô bông", "30 đồng"], ["Liên minh bán sợi giá", vnd(r.sellP) + " đồng", "hl"], ["Liên minh mua bông của nông dân giá", vnd(r.buyP) + " đồng", "hl"],
          ["Lợi nhuận độc quyền thêm (trên phần của liên minh)", vnd(r.extra) + " đồng", "hl"], ["   người mua sợi trả thêm", vnd(r.fromBuyers) + " đồng"], ["   nông dân trồng bông bị thiệt", vnd(r.fromSuppliers) + " đồng"]]),
          el("p", "st-legend", x ? "Phần liên minh được thêm đúng bằng phần người mua và nông dân mất: giá trị chỉ đổi chủ, không sinh thêm." : "Chưa có độc quyền: mua bán theo giá trị."));
        if (x >= .6) unlock(); };
      d.append(slider("Thị phần liên minh nắm", 0, 1, .1, 0, x => Math.round(x * 100) + "%", draw), out); draw(0); return d; },
    avgprofit(s){ const d = el("div", "st-box st-sim"); d.append(el("p", "st-q", s.prompt));
      const ind = [{name: "Cơ khí", c: 80, v: 20}, {name: "Dệt", c: 70, v: 30}, {name: "Da", c: 60, v: 40}], r = StoryMath.averageProfit(ind, 1);
      const t = el("table", "st-stats"); let moved = false;
      const draw = () => { t.replaceChildren(rowOf(["Ngành", "c + v", "m", "Giá trị", "p′ riêng", moved ? "Giá cả SX" : "", moved ? "p′ sau cạnh tranh" : ""], "th"),
        ...r.rows.map(x => rowOf([x.name, `${x.c}c + ${x.v}v`, String(x.m), String(x.value), Math.round(x.p1 * 100) + "%", moved ? String(x.price) : "", moved ? Math.round(r.avg * 100) + "%" : ""], "td"))); };
      const go = el("button", "btn small blue", "Cho vốn chạy ▸");
      go.onclick = () => { moved = true; draw(); go.disabled = true; note.textContent = "Vốn rời ngành Cơ khí (lãi 20%) sang ngành Da (lãi 40%) cho tới khi mọi ngành cùng lãi 30%. Mỗi hàng bán theo giá cả sản xuất 130 = k + p̄. Tổng giá cả vẫn bằng tổng giá trị (390)."; unlock(); };
      const note = el("p", "st-legend", "Ví dụ số trong slide Session 11.");
      draw(); d.append(t, go, note); return d; },
  };

  /* ---------- gate quiz: reuse the quiz screen ---------- */
  function gateStart(s){
    const qs = s.qs.map(byN).filter(Boolean);
    run = {mode: "story", review: true, x2: false, qs: shuffle(qs), i: 0, score: 0, combo: 0, maxCombo: 0, xp: 0, wrong: [], answered: false, picked: new Set(), story: {...cur}};
    show("quiz"); renderQ();
  }
  /* called by session.js finish() / quit() for run.mode === "story" */
  function afterGate(r, quitted){
    cur = r.story; show("story");
    if (quitted){ renderScene(); toast("Quiz chốt chưa xong. Đọc lại cảnh rồi thử lại nhé"); return; }
    const key = sceneKey(cur.act, cur.scene), n = r.qs.length, pass = r.score >= Math.ceil(n * PASS), first = S.story.done[key] == null;
    let msg = `Quiz chốt: đúng ${r.score}/${n}. `;
    if (pass){
      if (first){ S.coins += SCENE_COINS; msg += `Mở thẻ thuật ngữ, +${SCENE_COINS} xu ✦`; }
      else msg += "Đã qua cảnh này rồi, ôn lại tốt lắm ✦";
      S.story.done[key] = Math.max(S.story.done[key] ?? 0, r.score);
      for (const st of cur.scene.steps) if (st.type === "term") st.guide.forEach(k => S.story.cards[k] = true);
      const act = cur.act;
      if (!S.story.acts[act.id] && act.scenes.every(sc => S.story.done[sceneKey(act, sc)] != null)){
        S.story.acts[act.id] = true; S.coins += act.reward || 0; msg += ` · 🏆 Hoàn thành ${act.title.split("·")[0].trim()}, thưởng ${act.reward || 0} xu!`;
        setTimeout(() => burst(innerWidth / 2, innerHeight / 3, 50), 200);
      }
      sfx.win();
    } else msg += `Cần đúng ít nhất ${Math.ceil(n * PASS)} câu. Các câu sai đã vào ôn tập, đọc lại khung «Theo giáo trình» rồi thử lại nhé.`;
    save(); cur = null; renderMap(); toast(msg);
  }

  $("storyBtn").onclick = open;
  return {open, afterGate, renderMap};
})();
