const SESSION_SIZE = 30;
const KEY = "mln111_y2k_v1";
const LETTERS = "ABCDEF";

function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(36)}
/* môn học: câu có m = "122" thuộc MLN122 (Kinh tế chính trị Mác - Lênin), m = "ipr" thuộc IPR102 (Quyền sở hữu trí tuệ, có bản dịch tiếng Việt q.vi); không có m = MLN111 (Triết học Mác - Lênin) */
const SUBJECTS = [["111","MLN111 · Triết học"],["122","MLN122 · KTCT Mác-Lênin"],["ipr","IPR102 · Sở hữu trí tuệ"]];
const SUBJ_CODE = {"111":"MLN111","122":"MLN122","ipr":"IPR102"};
const SUBJ_TXT = {"111":["Triết học Mác–Lênin","triết học"],"122":["Kinh tế chính trị Mác–Lênin","kinh tế chính trị"],"ipr":["Quyền sở hữu trí tuệ (IPR)","sở hữu trí tuệ"]};
let subject = "111";
try{const v=localStorage.getItem("mln111_subject");if(SUBJECTS.some(s=>s[0]===v))subject=v}catch(e){}
const subjOf = q => q.m || "111";
/* r.id cố định (IPR102) thì giữ id đó và nhớ id băm cũ ở q.alt để chuyển tiến trình (migrateIds trong storage.js); câu cũ vẫn dùng id băm nên KHÔNG được sửa chữ câu hỏi/phương án đã phát hành */
const ALLQ = RAW.map(r => { const h = hash(r.q + "|" + r.o.join("|")); return {...r, id: r.id || h, ...(r.id && r.id !== h ? {alt: h} : {})}; });
let Q = ALLQ.filter(q => subjOf(q) === subject); // chỉ gồm câu của môn đang chọn

const $ = id => document.getElementById(id);
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

