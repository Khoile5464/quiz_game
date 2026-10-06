/* ---------- lofi radio (WebAudio, no files) ---------- */
const Lofi = (() => {
  let ac, master, lp, timer, step = 0, nextT = 0, on = false, noise, wob;
  const BPM = 74, E = 60 / BPM / 2;
  const PROG = [[53,57,60,64],[52,55,59,62],[50,53,57,60],[48,52,55,59]];
  const BASS = [41,40,38,36];
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  function white(){
    const b = ac.createBuffer(1, ac.sampleRate, ac.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  function tone(t, f, type, vol, dur, det = 0){
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.value = f; o.detune.value = det;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .03); g.gain.exponentialRampToValueAtTime(.0008, t + dur);
    o.connect(g).connect(lp); o.start(t); o.stop(t + dur + .05);
  }
  function hit(t, vol, freq, type, dur){
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noise; f.type = type; f.frequency.value = freq;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0008, t + dur);
    s.connect(f).connect(g).connect(master); s.start(t, Math.random() * .5); s.stop(t + dur);
  }
  function kick(t){
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(42, t + .14);
    g.gain.setValueAtTime(.55, t); g.gain.exponentialRampToValueAtTime(.001, t + .32);
    o.connect(g).connect(master); o.start(t); o.stop(t + .35);
  }
  function sched(){
    while (nextT < ac.currentTime + .35){
      const s = step % 8, bar = Math.floor(step / 8) % 4, swing = step % 2 ? E * .18 : 0, t = nextT + swing;
      if (s === 0){ PROG[bar].forEach((m, i) => { tone(t + i * .025, hz(m), "triangle", .045, E * 7.5, rnd2()); tone(t + i * .025, hz(m + 12), "sine", .012, E * 6, rnd2()); }); }
      if (s === 0 || s === 4) tone(t, hz(BASS[bar]), "sine", .16, E * 3.5);
      if (s === 0 || s === 5) kick(t);
      if (s === 2 || s === 6) hit(t, .16, 1800, "bandpass", .18);
      hit(t, s % 2 ? .025 : .04, 7000, "highpass", .05);
      if (bar === 3 && s === 6 && Math.random() < .6) tone(t, hz(pick([72,74,76,79])), "sine", .03, E * 3);
      if (Math.random() < .5) hit(nextT + Math.random() * E, .05 * Math.random(), 3000, "highpass", .01);
      nextT += E; step++;
    }
  }
  const rnd2 = () => Math.random() * 10 - 5;
  function start(){
    try{
      ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume();
      noise = noise || white();
      master = ac.createGain(); master.gain.value = 0; master.connect(ac.destination);
      master.gain.linearRampToValueAtTime(SFX().lofiVol / 100, ac.currentTime + 2);
      lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1500; lp.Q.value = .3; lp.connect(master);
      wob = ac.createOscillator(); const wg = ac.createGain(); wob.frequency.value = .25; wg.gain.value = 220; wob.connect(wg).connect(lp.frequency); wob.start();
      TV.pause();
      step = 0; nextT = ac.currentTime + .15; timer = setInterval(sched, 90); on = true;
    }catch(e){ on = false; }
  }
  function stop(){
    if (!on) return; on = false; clearInterval(timer);
    const m = master; m.gain.cancelScheduledValues(ac.currentTime); m.gain.setValueAtTime(m.gain.value, ac.currentTime);
    m.gain.linearRampToValueAtTime(0, ac.currentTime + .8);
    const w = wob;
    setTimeout(() => { try { w.stop(); m.disconnect(); } catch(e){} }, 900);
    $("lofiBtn").textContent = "📻 lofi: off"; $("lofiBtn").classList.remove("on");
  }
  function toggle(){
    on ? stop() : start();
    $("lofiBtn").textContent = on ? "📻 lofi: on ♪" : "📻 lofi: off";
    $("lofiBtn").classList.toggle("on", on);
  }
  function setVol(){
    if (!on) return;
    master.gain.cancelScheduledValues(ac.currentTime);
    master.gain.setTargetAtTime(SFX().lofiVol / 100, ac.currentTime, .08);
  }
  return {toggle, stop, setVol, isOn: () => on};
})();

