/* ---------- YouTube TV (IFrame Player API) ---------- */
const TV = (() => {
  let player = null, playerReady = null, apiPromise = null, cur = null, loopSet = false;
  const panel = $("tv");
  const list = () => (S.yt = S.yt || []);
  const keyOf = it => (it.v || "") + "|" + (it.list || "");
  const ERR = {
    2: "Link không hợp lệ 🥲",
    5: "Trình duyệt không phát được video này.",
    100: "Video không tồn tại hoặc đã bị ẩn/xoá.",
    101: "Chủ kênh không cho phát video này ngoài YouTube — thử video khác nha.",
    150: "Chủ kênh không cho phát video này ngoài YouTube — thử video khác nha.",
    153: "YouTube từ chối phát vì trang không có địa chỉ web.",
  };

  function say(t, err){ const m = $("tvMsg"); m.textContent = t || ""; m.classList.toggle("err", !!err); }

  function parse(raw){
    raw = raw.trim();
    if (/^[\w-]{11}$/.test(raw)) return {v: raw};
    let u; try { u = new URL(/^https?:\/\//i.test(raw) ? raw : "https://" + raw); } catch { return null; }
    if (!/(^|\.)(youtube\.com|youtu\.be|youtube-nocookie\.com)$/i.test(u.hostname)) return null;
    let v = u.searchParams.get("v"), lst = u.searchParams.get("list");
    if (!v){
      const m = u.pathname.match(/^\/(?:(?:embed|shorts|live|v)\/)?([\w-]{11})\/?$/);
      if (m && (/youtu\.be$/i.test(u.hostname) || u.pathname.split("/").length > 2)) v = m[1];
    }
    if (v && !/^[\w-]{11}$/.test(v)) v = null;
    if (lst && !/^[\w-]+$/.test(lst)) lst = null;
    if (!v && !lst) return null;
    const it = {}; if (v) it.v = v; if (lst) it.list = lst;
    return it;
  }

  function loadApi(){
    if (window.YT && YT.Player) return Promise.resolve();
    if (apiPromise) return apiPromise;
    apiPromise = new Promise((res, rej) => {
      window.onYouTubeIframeAPIReady = res;
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.onerror = () => { apiPromise = null; rej(); };
      document.head.append(s);
    });
    return apiPromise;
  }

  function makePlayer(){
    return new Promise(res => {
      const vars = {playsinline: 1, rel: 0};
      if (/^https?:$/.test(location.protocol)) vars.origin = location.origin;
      player = new YT.Player("tvPlayer", {
        width: "100%", height: "100%", playerVars: vars,
        events: {
          onReady: () => { player.setVolume(S.ytVol ?? 60); res(); },
          onStateChange: onState,
          onError: e => {
            let t = ERR[e.data] || `YouTube báo lỗi (mã ${e.data}).`;
            if (location.protocol === "file:" && [101,150,152,153].includes(e.data))
              t += " Nếu video nào cũng lỗi: app đang mở dạng file:///, hãy mở qua một trang web hoặc server cục bộ (vd. `python -m http.server`).";
            say(t, true); $("tvPlay").textContent = "▶";
          },
        },
      });
    });
  }

  function onState(e){
    const P = YT.PlayerState;
    if (e.data === P.PLAYING){
      $("tvPlay").textContent = "⏸"; say("");
      if (Lofi.isOn()) Lofi.stop();
      if (cur?.list && !loopSet){ player.setLoop(!!S.ytLoop); loopSet = true; }
      const title = player.getVideoData?.().title;
      const saved = cur && list().find(x => keyOf(x) === keyOf(cur));
      if (title && saved && !saved.list && saved.title !== title){ saved.title = title; save(); render(); }
      if (title && saved && saved.list && !saved.title){ saved.title = "Playlist · " + title; save(); render(); }
    } else if (e.data === P.PAUSED || e.data === P.CUED){
      $("tvPlay").textContent = "▶";
    } else if (e.data === P.ENDED){
      if (S.ytLoop !== false && cur && !cur.list){ player.seekTo(0); player.playVideo(); }
      else $("tvPlay").textContent = "▶";
    }
  }

  async function play(it){
    open(); cur = it; loopSet = false; render();
    if (Lofi.isOn()) Lofi.stop();
    say("Đang tải YouTube…");
    try { await loadApi(); } catch { say("Không tải được YouTube — kiểm tra kết nối mạng nha 📡", true); return; }
    if (!playerReady){ $("tvEmpty").remove(); playerReady = makePlayer(); }
    await playerReady;
    if (cur !== it) return;
    if (it.list) player.loadPlaylist({list: it.list, listType: "playlist", index: 0});
    else player.loadVideoById(it.v);
  }

  function render(){
    $("tvList").replaceChildren(...list().map(it => {
      const li = el("li", cur && keyOf(cur) === keyOf(it) ? "cur" : "");
      const p = el("button", "p", (it.title || (it.list ? "Playlist " + it.list.slice(0, 10) + "…" : "Video " + it.v)));
      p.type = "button"; p.title = p.textContent; p.onclick = () => play(it);
      const x = el("button", "x", "✕"); x.type = "button"; x.title = "Xoá khỏi danh sách";
      x.onclick = () => { S.yt = list().filter(y => keyOf(y) !== keyOf(it)); save(); render(); };
      li.append(p, x); return li;
    }));
    $("tvLoop").classList.toggle("on", S.ytLoop !== false);
  }

  function open(){ panel.classList.remove("hidden"); $("tvBtn").classList.add("on"); render(); }
  function close(){ try { player?.stopVideo(); } catch(e){} panel.classList.add("hidden"); $("tvBtn").classList.remove("on"); }
  function pause(){ try { player?.pauseVideo(); } catch(e){} }

  $("tvBtn").onclick = () => panel.classList.contains("hidden") ? open() : close();
  $("tvClose").onclick = close;
  $("tvMin").onclick = () => panel.classList.toggle("mini");
  $("tvVol").value = S.ytVol ?? 60;
  $("tvVol").oninput = e => { S.ytVol = +e.target.value; try { player?.setVolume(S.ytVol); } catch(_){} save(); };
  $("tvLoop").onclick = () => {
    S.ytLoop = S.ytLoop === false; save(); render();
    try { if (cur?.list) player.setLoop(S.ytLoop); } catch(e){}
  };
  $("tvPlay").onclick = () => {
    if (!player || !cur){ const first = list()[0]; first ? play(first) : say("Dán một link YouTube trước nha ♪"); return; }
    player.getPlayerState() === YT.PlayerState.PLAYING ? player.pauseVideo() : player.playVideo();
  };
  $("tvForm").onsubmit = e => {
    e.preventDefault();
    const it = parse($("tvUrl").value);
    if (!it){ say("Link này không phải link YouTube hợp lệ 🥲", true); return; }
    const exist = list().find(x => keyOf(x) === keyOf(it));
    if (!exist){ list().unshift(it); S.yt = list().slice(0, 15); save(); }
    $("tvUrl").value = "";
    play(exist || it);
  };
  return {pause, render};
})();

