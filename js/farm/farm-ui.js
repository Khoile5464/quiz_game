/* ---------- chọn map ---------- */
const OCEAN_HINT = "🌊 Đại dương Olympus: quay 🎰 Gacha biển để có sinh vật biển ♡ Bấm để vuốt ve, kéo để bế. Thú nông trại vẫn ở map Nông trại.";
const oceanOpen = () => !!S.unl.ocean;
function checkUnlocks(){
  if (!S.unl.ocean && mastered() >= OCEAN_NEED){ S.unl.ocean = true; save(); toast("🔓 Mở khóa map Đại dương Olympus! 🌊"); }
}
function setMap(m){
  if (m === "ocean" && !oceanOpen()){ toast(`🔒 Cần thuộc ${OCEAN_NEED} câu để mở Đại dương Olympus (hiện ${mastered()}/${OCEAN_NEED})`); return; }
  curMap = m; try{ localStorage.setItem("mln111_map", m); }catch(e){}
  selId = null; renderFarmUI(); farmSay(m === "ocean" ? OCEAN_HINT : FARM_HINT);
}
function renderMaps(){
  const open = oceanOpen();
  const mk = (k, label, cls) => { const b = el("button", cls + (curMap === k ? " on" : ""), label); b.type = "button"; b.onclick = () => setMap(k); return b; };
  $("fmaps").replaceChildren(mk("farm", "🌿 Nông trại", ""), mk("ocean", open ? "🌊 Đại dương" : `🔒 Đại dương ${Math.min(mastered(), OCEAN_NEED)}/${OCEAN_NEED}`, open ? "" : "lock"));
}

function renderSel(){
  const a = S.farm.animals.find(x => x.id === selId), f = $("renameForm");
  if (!a || mapOfA(a) !== curMap){ f.classList.add("hidden"); return; }
  f.classList.remove("hidden");
  const sp = SPECIES[a.t], full = a.f >= MAXF, fb = $("feedSel"), sb = $("sellSel");
  fb.textContent = full ? "🌾 No căng" : `🌾 ${vnd(sp.feed)}`; fb.disabled = full || S.coins < sp.feed; fb.title = full ? "Đã no căng" : `Cho ăn · ${sp.feed} xu`;
  $("voiceSel").textContent = a.voice ? "🎙️✓" : "🎙️";
  sb.textContent = sellArm === a.id ? "Chắc chưa? Bấm lại" : `💰 +${vnd(valueOf(a))}`; sb.title = `Bán ${a.name} · nhận ${valueOf(a)} xu`;
}
$("feedSel").onclick = () => { const a = S.farm.animals.find(x => x.id === selId); if (a) feedOne(a); };
$("sellSel").onclick = () => {
  const a = S.farm.animals.find(x => x.id === selId); if (!a) return;
  if (sellArm !== a.id){ sellArm = a.id; renderSel(); clearTimeout(sellT); sellT = setTimeout(() => { sellArm = null; renderSel(); }, 3000); return; }
  clearTimeout(sellT); sellArm = null; sellAnimal(a);
};
function sellAnimal(a){
  const v = valueOf(a), sp = SPECIES[a.t];
  if (a.voice) voiceDrop(a.id);
  S.farm.animals = S.farm.animals.filter(x => x.id !== a.id); delete rtMap[a.id]; S.coins += v; save();
  coinSnd(); farmSay(`💰 Đã bán ${a.name} (${sp.label}) được ${vnd(v)} xu. Tạm biệt nha ${sp.emoji}`); toast(`💰 +${vnd(v)} xu`);
  selId = null; renderFarmUI();
}

function renderFarmUI(){
  if (curMap === "ocean" && !oceanOpen()) curMap = "farm";
  if (selId && !S.farm.animals.some(a => a.id === selId)) selId = null;
  $("coins").textContent = `🪙 ${vnd(S.coins)} xu`;
  const total = countMap(curMap);
  $("farmCount").textContent = `${total}/${MAX_ANIMALS} con`;
  $("mapName").textContent = curMap === "ocean" ? "🌊 Đại dương Olympus" : "🏛 Nông trại Olympus";
  renderMaps();
  document.querySelectorAll("[data-ft]").forEach(b => b.classList.toggle("on", b.dataset.ft === ftab));
  const tab = curMap === "ocean" ? "gacha" : ftab;
  document.querySelectorAll("[data-ft]").forEach(b => { b.classList.toggle("on", b.dataset.ft === tab); if (b.dataset.ft === "shop") b.classList.toggle("hidden", curMap === "ocean"); });
  $("farmShop").classList.toggle("hidden", tab !== "shop"); $("gachaShop").classList.toggle("hidden", tab !== "gacha");
  if (tab === "shop") renderShop(total); else renderGacha(total);
  renderSel(); drawFarm();
}
function renderShop(total){
  $("farmShop").replaceChildren(...Object.entries(SPECIES).filter(([, sp]) => !sp.gacha).map(([t, sp]) => {
    const mine = S.farm.animals.filter(a => a.t === t), hungry = mine.filter(a => a.f < MAXF).length;
    const d = el("div", "fcard");
    const hd = el("div", "fc-h"); hd.append(el("span", "e", sp.emoji), el("b", "", sp.label));
    d.append(hd, el("div", "hint", sp.unique ? (mine.length ? "Đã có · bấm vào bé để cho ăn" : "Chỉ nuôi được 1 bé") : `Đang nuôi ${mine.length} con`));
    const buy = el("button", "btn small", sp.unique && mine.length ? "Đã sở hữu ✓" : `Mua · ${vnd(sp.price)} xu`);
    buy.disabled = S.coins < sp.price || total >= MAX_ANIMALS || (sp.unique && mine.length > 0); buy.onclick = () => buyAnimal(t);
    d.append(buy);
    return d;
  }));
}
function renderGacha(total){
  $("gachaShop").replaceChildren(...GACHA.map((m, mi) => ({m, mi})).filter(o => o.m.map === curMap).map(({m, mi}) => {
    const own = m.animals.filter(an => S.farm.dex[an.k]).length;
    const d = el("div", "gcard"); d.style.setProperty("--g1", m.bg[0]); d.style.setProperty("--g2", m.bg[1]);
    const gi = el("div", "gi"); gi.append(el("b", "", `${m.icon} ${m.name}`), el("small", "", m.pity ? `${own}/10 · bảo hiểm ${S.farm.pity[m.id] || 0}/${m.pity}` : `${own}/10 đã sưu tầm`));
    d.append(spriteCv(machineRows(m), Object.assign({Z: "#cfeeff"}, m.pal), 2), gi);
    const bt = el("div", "gbtns");
    const q = el("button", "btn small", `🎰 Quay · ${vnd(m.price)} xu`);
    q.disabled = S.coins < m.price || total >= MAX_ANIMALS; q.title = total >= MAX_ANIMALS ? "Chuồng đầy — bán bớt một bé" : ""; q.onclick = () => pullGacha(mi);
    const v = el("button", "btn small lav", "📖 Xem"); v.onclick = () => openDex(mi);
    bt.append(q, v); d.append(bt);
    return d;
  }));
}
function newAnimal(t){
  const used = new Set(S.farm.animals.map(a => a.name)), free = NAMES.filter(n => !used.has(n));
  const name = t === "dog" ? "Cerberus" : (free.length ? free : NAMES)[Math.floor(Math.random() * (free.length || NAMES.length))];
  return {id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), t, name, f: 0};
}
function buyAnimal(t){
  const sp = SPECIES[t];
  if (sp.unique && S.farm.animals.some(a => a.t === t)){ toast("Chỉ nuôi được 1 bé thôi nha 🐶"); return; }
  if (countMap("farm") >= MAX_ANIMALS){ toast(`Chuồng đầy rồi (${MAX_ANIMALS} con) 🥲`); return; }
  if (S.coins < sp.price){ toast("Chưa đủ xu — làm thêm vài câu quiz nha ✦"); return; }
  const a = newAnimal(t), name = a.name;
  S.coins -= sp.price; S.farm.animals.push(a); save();
  const m = rt(a); m.sleep = false; addParts(m.x, m.y - 8, "heart", 4);
  farmSay(`${sp.emoji} ${name} vừa về nông trại Olympus! Bạn có thể đặt tên lại bên dưới.`); toast(`${sp.emoji} ${name} đã về nông trại!`);
  selectAnimal(a);
  try{ sfx.ok(); }catch(e){}
  renderFarmUI();
}
function feedOne(a){
  const sp = SPECIES[a.t], before = stageOf(a.f);
  if (a.f >= MAXF){ toast(`${a.name} no căng rồi 😋`); return; }
  if (S.coins < sp.feed){ toast("Chưa đủ xu mua thức ăn 🥲"); return; }
  S.coins -= sp.feed; a.f++; save();
  const m = rt(a); m.hop = 3; m.wait = 6; addParts(m.x, m.y - 6 - altOf(a), "grain", 6); animalVoice(a);
  const now = stageOf(a.f);
  farmSay(now > before ? `${sp.emoji} ${a.name} lớn lên: ${STAGE_NAME[now]}!` : `${sp.emoji} ${a.name} ăn ngon lành — ${a.f}/${MAXF} bữa`);
  if (now > before) { toast(`${sp.emoji} ${a.name} lớn thành "${STAGE_NAME[now]}"!`); addParts(m.x, m.y - 10, "heart", 5); }
  try{ sfx.ok(); }catch(e){}
  renderFarmUI();
}

