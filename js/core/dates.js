/* ---------- dates ---------- */
const dkey = d => d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const today = () => dkey(new Date());
const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dkey(d); };
function liveStreak(){ return (S.streak.last === today() || S.streak.last === yesterday()) ? S.streak.count : 0; }

