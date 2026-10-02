/* One continuous animation per highlight: every part of the script plays in a single
 * timeline, joined by a sweeping blue panel, with a background that keeps moving and the
 * Linea.js logo animation at the end. It also records sound cues (window.CUES) so
 * audio.py can score the music and effects to the picture.
 *
 *   stage.html?h=karya          whole highlight
 *   stage.html?cover=karya      highlight cover
 */
'use strict';
const params = new URLSearchParams(location.search);
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rich = (s) => esc(s).replace(/&lt;(\/?)em&gt;/g, '<$1em>');

const I = (p, sw = 2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const ICONS = {
  grid: I('<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>'),
  star: I('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"/>'),
  loop: I('<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/>'),
  chat: I('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" stroke-width="3"/>'),
  rocket: I('<path d="M5 15c-1.5 1.3-2 4-2 4s2.7-.5 4-2"/><path d="M14.5 4.5c3-1.5 5.5-1.5 5.5-1.5s0 2.5-1.5 5.5L12 15l-3-3 5.5-7.5Z"/><path d="M9 12l-3.5-.5L8 8h4M12 15l.5 3.5L16 16v-4"/>'),
  cart: I('<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2"/><circle cx="10" cy="20.5" r="1"/><circle cx="17" cy="20.5" r="1"/>'),
  dash: I('<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 16v-4M12 16V8M17 16v-6"/>'),
  spark: I('<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="M12 8l1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5Z"/>'),
  food: I('<path d="M3 12h18a9 9 0 0 1-18 0Z"/><path d="M8 8c0-1.2 1-1.6 1-3M12 8c0-1.2 1-1.6 1-3M16 8c0-1.2 1-1.6 1-3"/>'),
  pos: I('<rect x="4" y="9" width="16" height="12" rx="2"/><path d="M7 9V3h10v6M8 13h2M12 13h2M16 13h.01M8 17h8"/>'),
  app: I('<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01" stroke-width="2.2"/><path d="M7 13h5M7 16.5h8"/>'),
  court: I('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M12 5v14M3 12h18"/>'),
  pill: I('<rect x="2.5" y="8" width="19" height="8" rx="4" transform="rotate(-35 12 12)"/><path d="M9.2 7.9l5.6 8.2"/>'),
  truck: I('<path d="M3 17V8h10v9M13 11h4l4 3v3h-8"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>'),
  cake: I('<path d="M4 20h16v-7H4Z"/><path d="M4 15c2 1.5 4 1.5 6 0s4-1.5 6 0 3 1 4 0"/><path d="M12 13V9M12 6.5v.01" stroke-width="2.6"/>'),
  moto: I('<circle cx="5.5" cy="16" r="3.5"/><circle cx="18.5" cy="16" r="3.5"/><path d="M5.5 16l4-6h5l4 6M9.5 10l-1-3H6M14.5 10l1.5-3h2.5"/>'),
  screen: I('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>'),
  server: I('<rect x="4" y="3" width="16" height="7" rx="2"/><rect x="4" y="14" width="16" height="7" rx="2"/><path d="M8 6.5h.01M8 17.5h.01" stroke-width="3"/>'),
  db: I('<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'),
  check: I('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 2.8),
  mail: I('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>'),
  insta: I('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01" stroke-width="3"/>'),
  send: I('<path d="M21 3 10 14M21 3l-7 18-4-7-7-4Z"/>'),
};
const MARK = '<img src="assets/linea-mark.png" alt="">';
const MOTO = '<svg viewBox="0 0 120 70" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="50" r="15"/><circle cx="96" cy="50" r="15"/><path d="M24 50l20-26h28l24 26M44 24l-6-12H26M72 24l8-14h12M50 38h22"/></svg>';
const DATA = window.STORIES.highlights;

// Music grid: scene changes land on the beat (100 BPM, scenes in whole 2-beat steps).
const BPM = 100;
const BEAT = 60 / BPM;
const STEP = BEAT * 2;
const quant = (d) => Math.max(2, Math.ceil(d / STEP - 1e-6)) * STEP;
const OUTRO = BEAT * 6;

const lines = (html) => html.split('<br>').map((l) => `<span class="line-wrap"><span>${l}</span></span>`).join('');

if (params.has('cover')) {
  document.body.classList.add('cover');
  const h = DATA.find((x) => x.id === params.get('cover'));
  $('#cover-icon').innerHTML = h.icon === 'x' ? MARK : ICONS[h.icon];
  window.DURATION = 0; window.seek = () => {}; window.CUES = [];
  window.ready = Promise.all([document.fonts.ready, ...$$('img').map((i) => i.decode().catch(() => {}))]);
} else {
  build();
}

// ---------- Scene markup ----------
function sceneHTML(S) {
  const text = (eyebrow, title, sub, extra = '') => `<div id="text" class="abs">${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ''}${title ? `<h1>${rich(title)}</h1>` : ''}${sub ? `<p>${rich(sub)}</p>` : ''}${extra}</div>`;
  const chips = (tags) => `<div class="chips">${tags.map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div>`;
  switch (S.type) {
    case 'logo': return `<div id="mark" class="abs">${MARK}</div>` + text('', S.title, S.sub);
    case 'chain': return text('', S.title, S.sub) + `<div id="art" class="abs"><svg id="chainline" viewBox="0 0 940 400"><path id="cl" d="M135 170 H805" stroke="#2231f6" stroke-width="8" stroke-linecap="round" stroke-dasharray="4 26" fill="none"/></svg>
      ${S.nodes.map((n, i) => `<div class="node" style="left:${i * 335}px"><div class="ic ${i === 1 ? '' : 'soft'}">${ICONS[['screen', 'server', 'db'][i]]}</div><b>${esc(n)}</b></div>`).join('')}</div>`;
    case 'crossed': return text('', S.title, '') + `<div id="art" class="abs" style="top:860px">${S.items.map((t) => `<div class="row"><div class="ic">${ICONS.check}</div>${esc(t)}</div>`).join('')}</div>`;
    case 'stats': return text('', S.title, '') + `<div id="art" class="abs"><div class="stats">${S.stats.map(([v, l]) => `<div class="stat"><b data-v="${esc(v)}">${esc(v)}</b><span>${esc(l)}</span></div>`).join('')}</div></div>`;
    case 'intro': return text('', S.title, S.sub) + `<div id="art" class="abs" style="top:${S.cards.length > 4 ? 960 : 1010}px">${S.cards.map((t, i) => `<div class="card"><div class="ic">${ICONS[S.cardIcons[i]]}</div>${esc(t)}<em>${String(i + 1).padStart(2, '0')}</em></div>`).join('')}</div>`;
    case 'service': return `<div class="big-n">${esc(S.n)}</div>` + text('Layanan ' + S.n, S.title, S.body, chips(S.tags)) + `<div id="sv-icon" class="abs" style="top:1180px"><div id="sv-ring"></div><div class="ic">${ICONS[S.icon]}</div></div>`;
    case 'project': return `<div id="device" class="abs"><div class="bar"><i></i><i></i><i></i><b>${esc(S.name)}</b></div><div class="body">${mock(S.mock)}</div></div><div class="note-ill">ilustrasi tampilan</div>`
      + `<div id="text" class="abs"><span class="kind">${esc(S.kind)}</span><h1>${esc(S.name)}</h1><p>${esc(S.body)}</p>${chips(S.tags)}</div>`;
    case 'statement': return text('', S.title, S.sub) + `<svg id="dots" class="abs" viewBox="0 0 940 260"><path id="dl" d="M60 130 C 200 20, 300 240, 470 130 S 760 20, 880 130" stroke="#2231f6" stroke-width="8" fill="none" stroke-linecap="round"/>${[60, 265, 470, 675, 880].map((x) => `<g class="dot"><circle cx="${x}" cy="130" r="34" fill="#fff" stroke="#2231f6" stroke-width="8"/></g>`).join('')}</svg>`;
    case 'steps': return text('', S.title, '') + `<div id="art" class="abs" style="top:1000px"><div class="tl">${S.items.map((t, i) => `<div class="it"><b>${String(i + 1).padStart(2, '0')}</b>${esc(t)}</div>`).join('')}</div></div>`;
    case 'step': return `<div class="big-n">${esc(S.n)}</div>` + text('Langkah ' + S.n, S.title, S.body) + `<div id="scene" class="abs">${stepScene(S.scene)}</div>`;
    case 'faq': return text('Tanya jawab', '', '') + `<div id="chat" class="abs"><div class="bub me q">${esc(S.q)}</div><div class="ans"><div class="bub them a">${esc(S.a)}</div><div class="typing"><i></i><i></i><i></i></div></div></div>`;
    case 'cta': return text('', S.title, '') + `<div id="cta" class="abs"><div id="cta-btn"><span class="glow"></span>${ICONS.send.replace('<svg', '<svg style="width:54px;height:54px"')}${esc(S.button)}</div>
      ${S.contacts.map((t) => `<div class="contact"><i>${t.startsWith('@') ? ICONS.insta : ICONS.mail}</i>${esc(t)}</div>`).join('')}</div>`;
  }
  return '';
}

function mock(kind) {
  if (kind === 'booking') {
    const rows = ['16.00', '17.00', '18.00', '19.00', '20.00'];
    const bk = ['0-1', '0-3', '1-0', '1-1', '2-2', '3-0', '3-1', '3-3', '4-2'];
    return `<div class="fchips" style="margin-bottom:18px"><span class="on">Sabtu</span><span>Minggu</span><span>Kuota member 3/4</span></div><div class="slots"><div class="h"></div>${[1, 2, 3, 4].map((n) => `<div class="h" style="justify-content:center">Lap ${n}</div>`).join('')}
      ${rows.map((r, ri) => `<div class="h">${r}</div>${[0, 1, 2, 3].map((ci) => `<div class="${bk.includes(ri + '-' + ci) ? 'bk' : ''} ${ri === 2 && ci === 3 ? 'sel' : ''}">${bk.includes(ri + '-' + ci) ? 'Terisi' : (ri === 2 && ci === 3 ? 'Dipilih' : 'Kosong')}</div>`).join('')}`).join('')}</div>`;
  }
  if (kind === 'pos') return `<div class="mrow"><span>Paracetamol 500 mg <small>× 2</small></span><small>F2 cari</small></div><div class="mrow"><span>Vitamin C <small>× 1</small></span><small>stok 48</small></div><div class="mrow"><span>Minyak kayu putih <small>× 1</small></span><small>stok 12</small></div>
    <div class="alert"><b style="font-size:30px">✕</b> Obat batuk sirup · kedaluwarsa · ditolak</div><div class="okbar"><span>F9 Bayar</span><span>Riwayat stok ✓</span><span>Backup otomatis ✓</span></div>`;
  if (kind === 'fleet') return `<div class="tiles"><div class="tile"><small>Excavator EX-07 · jam mesin</small><b>1.248 jam</b></div><div class="tile"><small>Efisiensi BBM · 7 hari</small><div class="bars">${[60, 72, 55, 80, 66, 95, 70].map((h, i) => `<i class="${i === 5 ? 'hl' : ''}" style="height:${h}%"></i>`).join('')}</div></div></div>
    <div class="alert amber"><b style="font-size:30px">!</b> 3 jam mesin tidak tercatat di laporan</div><div class="okbar"><span>Laporan lapangan: dicek</span><span>Siap ditagih</span></div>`;
  if (kind === 'order') return `<div class="stepper"><span class="on">1</span><i class="on"></i><span class="on">2</span><i class="on"></i><span class="on">3</span><i></i><span>4</span></div>
    <div class="prod"><div class="pic"></div><div><b style="font-size:32px">Brownies panggang</b><br><small style="color:#56618a">Ambil Sabtu · 10.00</small></div></div>
    <div class="cap"><small style="color:#56618a;font-weight:600">Kapasitas dapur Sabtu · 14 / 20</small><div class="track"><i></i></div></div><div class="okbar"><span>Pembayaran dicek ✓</span><span>Kirim ke WhatsApp</span></div>`;
  if (kind === 'catalog') return `<div class="fchips"><span class="on">Matic</span><span class="on">2018+</span><span>Honda</span><span>Yamaha</span></div><div class="mgrid">
    ${[['Matic 125', '2019 · 21 rb km', 1], ['Sport 150', '2018 · 34 rb km', 0], ['Matic 150', '2020 · 15 rb km', 1], ['Bebek 110', '2018 · 40 rb km', 0]].map(([n, d, ck]) => `<div class="moto">${ck ? '<span class="ck">✓</span>' : ''}${MOTO}${n}<small>${d}</small></div>`).join('')}</div>`;
  return '';
}

function stepScene(kind) {
  if (kind === 'brief') return `<div class="paper"><div class="ln b"></div><div class="ln" style="width:92%"></div><div class="ln" style="width:70%"></div><div class="ln" style="width:84%"></div><div class="ln" style="width:55%"></div><div class="chips" style="margin-top:28px"><span class="chip amber">Kebutuhan</span><span class="chip">Budget</span><span class="chip">Tenggat</span></div></div>`;
  if (kind === 'reply') return `<div class="bub me" style="top:0">Halo, mau bikin sistem pemesanan.</div><div class="bub them" style="top:150px">Siap! Ada 3 pertanyaan dulu ya:<br>1. Siapa yang pakai?<br>2. Bayarnya lewat apa?<br>3. Kapan harus jadi?</div>`;
  if (kind === 'call') return `<div class="call" style="height:420px"><div class="p"><i></i></div><div class="p"><i></i></div><div class="timer">30:00</div></div>`;
  if (kind === 'plan') return `<div class="paper"><div class="tick"><i>✓</i>Ruang lingkup</div><div class="tick"><i>✓</i>Jadwal</div><div class="tick"><i>✓</i>Harga pasti</div><div class="tick"><i>✓</i>Milestone pertama</div><div class="stamp">SIAP</div></div>`;
  return '';
}

// ---------- Build the whole highlight ----------
function build() {
  gsap.config({ nullTargetWarn: false });
  gsap.defaults({ ease: 'power3.out' });
  const H = DATA.find((x) => x.id === params.get('h')) || DATA[0];
  const tl = gsap.timeline({ paused: true });
  const CUES = [];
  const cue = (t, k, v) => CUES.push({ t: +t.toFixed(3), k, v });

  // Scene start times, all on the 2-beat grid
  const starts = [];
  let t = 0;
  H.stories.forEach((S) => { starts.push(t); t += quant(S.d); });
  const T_END = t;
  const DURATION = T_END + OUTRO;

  // Persistent tag with an odometer counter
  const n = H.stories.length;
  $('#tag').innerHTML = `<i>${H.icon === 'x' ? '<img src="assets/linea-mark.png" style="width:22px;filter:brightness(10)">' : ICONS[H.icon].replace('<svg', '<svg style="width:20px;height:20px;color:#fff"')}</i>${esc(H.title)} <span class="cnt"><span class="roll">${H.stories.map((_, i) => `<b>${i + 1}/${n}</b>`).join('')}</span></span>`;

  // Background: two flowing lines that draw on and keep drifting, light and dark copies
  const seed = H.id.length * 31 + 7;
  const r = (k) => ((Math.sin(seed * k) + 1) / 2);
  const d1 = `M-60 ${320 + r(1) * 260} C 300 ${120 + r(2) * 400}, 720 ${820 + r(3) * 420}, 1140 ${620 + r(4) * 360}`;
  const d2 = `M-60 ${1480 + r(5) * 200} C 380 ${1280 + r(6) * 300}, 780 ${1760 + r(7) * 120}, 1140 ${1440 + r(8) * 280}`;
  $$('.fp').forEach((p, i) => p.setAttribute('d', i % 2 ? d2 : d1));
  $$('.fp').forEach((p) => { const len = p.getTotalLength(); gsap.set(p, { strokeDasharray: `${len * .55} ${len * .45}`, strokeDashoffset: len }); tl.to(p, { strokeDashoffset: -len * 2, duration: DURATION, ease: 'none' }, 0); });
  tl.fromTo('#flow, #darkbg svg', { y: 0 }, { y: -60, duration: DURATION / 4, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 0);
  // Glow breathes with the bar
  for (let b = 0; b < DURATION; b += BEAT * 4) tl.fromTo('#glow, #darkbg .dglow', { opacity: .75 }, { opacity: 1, duration: BEAT * 2, yoyo: true, repeat: 1, ease: 'sine.inOut', immediateRender: false }, b);

  // Tag + watermark in
  gsap.set('#tag', { y: -40, opacity: 0 });
  tl.to('#tag', { y: 0, opacity: 1, duration: .6, ease: 'back.out(1.8)' }, .35);
  gsap.set('#wm', { opacity: 0 });
  tl.to('#wm', { opacity: 1, duration: .5 }, .35);

  // Sweep panel: opening reveal, between scenes, and into the logo
  gsap.set('#sweep', { visibility: 'visible', y: 0 });
  const sweepAt = (T, kind) => {
    tl.fromTo('#sweep', { y: 2300, visibility: 'visible' }, { y: -2300, duration: .8, ease: 'power2.inOut', immediateRender: false }, T - .4);
    tl.fromTo('#sweep img', { rotation: -30 }, { rotation: 40, duration: .8, ease: 'none', immediateRender: false }, T - .4);
    cue(T - .45, 'whoosh'); cue(T, kind || 'hit');
  };
  tl.fromTo('#sweep', { y: 0 }, { y: -2300, duration: .55, ease: 'power2.in', immediateRender: false }, 0);
  cue(0, 'open');

  H.stories.forEach((S, i) => {
    const T = starts[i];
    const L = quant(S.d);
    const root = document.createElement('div');
    root.className = `scene t-${S.type}${['stats', 'cta'].includes(S.type) ? ' dark' : ''}`;
    root.innerHTML = sceneHTML(S);
    $('#scenes').appendChild(root);
    $$('#text h1', root).forEach((h) => { h.innerHTML = lines(h.innerHTML.replace(/\. (?=<em>|[A-Z])/g, '.<br>')); });

    if (i > 0) sweepAt(T);
    tl.set(root, { visibility: 'visible' }, T);
    tl.set('#darkbg', { opacity: root.classList.contains('dark') ? 1 : 0 }, T);
    if (i > 0) tl.to('#tag .roll', { yPercent: -100 * i / n, duration: .5, ease: 'back.out(2)' }, T + .1);
    enter(S, root, tl, T + (i === 0 ? .2 : .25), L, cue);

    // Exit: everything lifts away just before the next sweep
    const out = T + L - .55;
    tl.to($$('.line-wrap > span', root), { yPercent: -110, duration: .4, stagger: .04, ease: 'power3.in' }, out)
      .to([...root.children], { y: -90, opacity: 0, duration: .45, stagger: .04, ease: 'power2.in' }, out + .05)
      .set(root, { visibility: 'hidden' }, T + L);
  });

  // Logo ending (same look as brand/outro.html)
  sweepAt(T_END, 'end');
  $('#end .ename').innerHTML = [...'Linea.js'].map((c) => `<span>${c}</span>`).join('');
  gsap.set('#end .emark img', { scale: .3, rotation: -120, opacity: 0, clipPath: 'circle(0% at 50% 50%)' });
  gsap.set('#end .ering', { scale: .4, opacity: 0 });
  gsap.set('#end .ename span', { yPercent: 120, opacity: 0 });
  tl.set('#endbg, #end', { visibility: 'visible' }, T_END)
    .set('#tag, #wm', { opacity: 0 }, T_END)
    .to('#end .emark img', { scale: 1, rotation: 0, opacity: 1, clipPath: 'circle(75% at 50% 50%)', duration: 1.0, ease: 'back.out(1.5)' }, T_END + .25)
    .to('#end .ering', { scale: 1.25, opacity: 1, duration: .25, ease: 'power2.out' }, T_END + .95)
    .to('#end .ering', { scale: 1.6, opacity: 0, duration: .7, ease: 'power2.out' }, T_END + 1.2)
    .to('#end .ename span', { yPercent: 0, opacity: 1, duration: .6, stagger: .05, ease: 'back.out(1.8)' }, T_END + .85)
    .to('#end .eline', { width: 260, duration: .7, ease: 'power2.inOut' }, T_END + 1.4)
    .to('#end .emark', { y: -8, duration: .9, yoyo: true, repeat: 1, ease: 'sine.inOut' }, T_END + 1.8)
    .to('#end', { opacity: 0, duration: .4, ease: 'power2.in' }, DURATION - .45);
  cue(T_END + .3, 'logo'); cue(T_END + .9, 'letters'); cue(T_END + 1.45, 'shimmer');
  tl.to({}, { duration: .01 }, DURATION);

  window.DURATION = DURATION;
  window.CUES = CUES.sort((a, b) => a.t - b.t);
  window.MUSIC = { bpm: BPM, cuts: starts.slice(1), end: T_END, duration: DURATION, dark: H.stories.map((S, i) => (['stats', 'cta'].includes(S.type) ? [starts[i], starts[i] + quant(S.d)] : null)).filter(Boolean) };
  window.seek = (x) => { tl.seek(x, false); };
  window.ready = Promise.all([document.fonts.ready, ...$$('img').map((i) => i.decode().catch(() => {}))]);
  if (!params.has('render')) { tl.play(0); tl.eventCallback('onComplete', () => setTimeout(() => tl.play(0), 800)); }
}

// ---------- Entrance animation for one scene, starting at time B ----------
function enter(S, root, tl, B, L, cue) {
  const q = (s) => $$(s, root);
  const at = (x) => B + x;
  const h1 = q('#text h1 .line-wrap > span');
  gsap.set(h1, { yPercent: 110 });
  gsap.set(q('#text .eyebrow, #text .kind'), { y: 20, opacity: 0 });
  gsap.set(q('#text p, #text .chips .chip'), { y: 30, opacity: 0 });
  const tS = S.type === 'logo' ? 1.0 : S.type === 'project' ? .7 : .15;
  tl.to(q('#text .eyebrow, #text .kind'), { y: 0, opacity: 1, duration: .5 }, at(tS))
    .to(h1, { yPercent: 0, duration: .7, stagger: .12, ease: 'power4.out' }, at(tS + .1))
    .to(q('#text p'), { y: 0, opacity: 1, duration: .6 }, at(tS + .45))
    .to(q('#text .chips .chip'), { y: 0, opacity: 1, duration: .45, stagger: .08, ease: 'back.out(2)' }, at(tS + .75));
  if (h1.length) cue(at(tS + .1), 'swish');
  q('#text .chips .chip').forEach((_, k) => cue(at(tS + .75 + k * .08), 'tick'));

  const t = S.type;
  if (t === 'logo') {
    gsap.set(q('#mark img'), { scale: .3, rotation: -120, opacity: 0, clipPath: 'circle(0% at 50% 50%)' });
    tl.to(q('#mark img'), { scale: 1, rotation: 0, opacity: 1, clipPath: 'circle(75% at 50% 50%)', duration: 1.1, ease: 'back.out(1.5)' }, at(.1))
      .to(q('#mark'), { y: -14, duration: 1.4, yoyo: true, repeat: 2, ease: 'sine.inOut' }, at(1.3));
    cue(at(.15), 'logo');
  }
  if (t === 'chain') {
    gsap.set(q('.node'), { y: 60, opacity: 0, scale: .8 });
    gsap.set(q('#cl'), { opacity: 0 });
    tl.to(q('.node'), { y: 0, opacity: 1, scale: 1, duration: .6, stagger: .3, ease: 'back.out(1.7)' }, at(1.0))
      .to(q('#cl'), { opacity: 1, duration: .3 }, at(1.7))
      .fromTo(q('#cl'), { strokeDashoffset: 0 }, { strokeDashoffset: -300, duration: L - 1.7, ease: 'none' }, at(1.7));
    [0, 1, 2].forEach((k) => cue(at(1.0 + k * .3), 'pop', k));
    cue(at(1.7), 'data');
  }
  if (t === 'crossed') {
    gsap.set(q('.row'), { x: -80, opacity: 0 });
    gsap.set(q('.row .ic'), { scale: 0 });
    tl.to(q('.row'), { x: 0, opacity: 1, duration: .55, stagger: .4 }, at(.9))
      .to(q('.row .ic'), { scale: 1, duration: .45, stagger: .4, ease: 'back.out(3)' }, at(1.15));
    q('.row').forEach((_, k) => { cue(at(.9 + k * .4), 'slide'); cue(at(1.2 + k * .4), 'check', k); });
  }
  if (t === 'stats') {
    gsap.set(q('.stat'), { y: 60, opacity: 0, scale: .92 });
    tl.to(q('.stat'), { y: 0, opacity: 1, scale: 1, duration: .6, stagger: .2, ease: 'back.out(1.6)' }, at(.7));
    q('.stat').forEach((_, k) => cue(at(.7 + k * .2), 'pop', k));
    q('.stat b').forEach((b, k) => {
      const m = b.dataset.v.match(/^(\d+)(.*)$/);
      if (!m) return;
      const o = { n: 0 };
      tl.to(o, { n: +m[1], duration: 1.2, ease: 'power2.out', onUpdate: () => { b.textContent = Math.round(o.n) + m[2]; } }, at(.8 + k * .2));
      cue(at(.8 + k * .2), 'count');
    });
  }
  if (t === 'intro') {
    gsap.set(q('.card'), { x: 140, opacity: 0 });
    tl.to(q('.card'), { x: 0, opacity: 1, duration: .55, stagger: .18, ease: 'back.out(1.4)' }, at(.8));
    q('.card').forEach((_, k) => cue(at(.8 + k * .18), 'pop', k));
  }
  if (t === 'service' || t === 'step') {
    gsap.set(q('.big-n'), { x: 160, opacity: 0 });
    tl.to(q('.big-n'), { x: 0, opacity: 1, duration: .9 }, at(.1));
  }
  if (t === 'service') {
    gsap.set(q('#sv-icon .ic'), { scale: 0, rotation: -40 });
    gsap.set(q('#sv-ring'), { scale: .5, opacity: 0 });
    tl.to(q('#sv-icon .ic'), { scale: 1, rotation: 0, duration: .9, ease: 'back.out(1.8)' }, at(.9))
      .to(q('#sv-ring'), { scale: 1, opacity: 1, duration: .8 }, at(1.1))
      .to(q('#sv-ring'), { rotation: 90, duration: L - 1.1, ease: 'none' }, at(1.1))
      .to(q('#sv-icon .ic'), { y: -16, duration: 1.2, yoyo: true, repeat: 2, ease: 'sine.inOut' }, at(1.9));
    cue(at(.95), 'boom');
  }
  if (t === 'project') {
    gsap.set(q('#device'), { y: 140, opacity: 0, rotationX: 18, transformPerspective: 1600 });
    gsap.set(q('#device .body > *'), { y: 24, opacity: 0 });
    gsap.set(q('.note-ill'), { opacity: 0 });
    tl.to(q('#device'), { y: 0, opacity: 1, rotationX: 0, duration: .9 }, at(.05))
      .to(q('#device .body > *'), { y: 0, opacity: 1, duration: .45, stagger: .1 }, at(.4))
      .to(q('.note-ill'), { opacity: 1, duration: .4 }, at(1.1));
    cue(at(.05), 'rise');
    q('#device .body > *').forEach((_, k) => cue(at(.4 + k * .1), 'tick'));
    if (q('.slots .sel').length) { tl.fromTo(q('.slots .sel'), { scale: .6 }, { scale: 1, duration: .5, ease: 'back.out(3)' }, at(2.1)); cue(at(2.1), 'pop', 2); }
    if (q('.alert').length) { tl.fromTo(q('.alert'), { x: -20 }, { x: 0, duration: .08, repeat: 5, yoyo: true }, at(2.3)); cue(at(2.3), q('.alert.amber').length ? 'warn' : 'deny'); }
    if (q('.cap .track i').length) { tl.fromTo(q('.cap .track i'), { width: '0%' }, { width: '70%', duration: 1.2, ease: 'power2.out' }, at(1.5)); cue(at(1.5), 'fill'); }
    if (q('.bars i').length) { tl.from(q('.bars i'), { scaleY: 0, transformOrigin: '50% 100%', duration: .5, stagger: .06 }, at(1.3)); cue(at(1.3), 'fill'); }
    if (q('.moto .ck').length) { tl.from(q('.moto .ck'), { scale: 0, duration: .4, stagger: .3, ease: 'back.out(3)' }, at(2.1)); q('.moto .ck').forEach((_, k) => cue(at(2.1 + k * .3), 'check', k)); }
  }
  if (t === 'statement') {
    const dl = q('#dl')[0]; const len = dl.getTotalLength();
    gsap.set(dl, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(q('.dot'), { scale: 0, transformOrigin: 'center', transformBox: 'fill-box' });
    tl.to(dl, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, at(.9))
      .to(q('.dot'), { scale: 1, duration: .4, stagger: .25, ease: 'back.out(3)' }, at(1.0));
    q('.dot').forEach((_, k) => cue(at(1.0 + k * .25), 'pop', k));
  }
  if (t === 'steps') {
    gsap.set(q('.tl .it'), { x: -60, opacity: 0 });
    tl.to(q('.tl .it'), { x: 0, opacity: 1, duration: .5, stagger: .35, ease: 'back.out(1.5)' }, at(.9));
    q('.tl .it').forEach((_, k) => cue(at(.9 + k * .35), 'pop', k));
  }
  if (t === 'step') {
    gsap.set(q('#scene > *'), { y: 60, opacity: 0 });
    tl.to(q('#scene > *'), { y: 0, opacity: 1, duration: .6, stagger: .55, ease: 'back.out(1.4)' }, at(.9));
    q('#scene > *').forEach((_, k) => cue(at(.9 + k * .55), q('.bub').length ? 'bubble' : 'paper', k));
    if (q('.paper .ln').length) { tl.from(q('.paper .ln'), { width: 0, duration: .6, stagger: .15 }, at(1.3)); cue(at(1.3), 'type'); }
    if (q('.paper .tick').length) { tl.from(q('.paper .tick'), { x: -30, opacity: 0, duration: .35, stagger: .25 }, at(1.3)); q('.paper .tick').forEach((_, k) => cue(at(1.35 + k * .25), 'check', k)); }
    if (q('.stamp').length) { tl.fromTo(q('.stamp'), { scale: 2.6, opacity: 0 }, { scale: 1, opacity: 1, duration: .35, ease: 'power4.in' }, at(2.7)); cue(at(3.05), 'stamp'); }
    if (q('.call .p').length) { tl.fromTo(q('.call .p i'), { scale: .85 }, { scale: 1, duration: .5, yoyo: true, repeat: 5, stagger: .25, ease: 'sine.inOut' }, at(1.5)); cue(at(1.0), 'ring'); }
  }
  if (t === 'faq') {
    gsap.set(q('#chat .q'), { scale: .4, opacity: 0, transformOrigin: '100% 100%' });
    gsap.set(q('#chat .typing'), { opacity: 0, scale: .6, transformOrigin: '0% 100%' });
    gsap.set(q('#chat .a'), { scale: .4, opacity: 0, transformOrigin: '0% 0%' });
    tl.to(q('#chat .q'), { scale: 1, opacity: 1, duration: .5, ease: 'back.out(1.8)' }, at(.4))
      .to(q('#chat .typing'), { opacity: 1, scale: 1, duration: .3 }, at(1.1))
      .to(q('#chat .typing i'), { y: -10, duration: .25, yoyo: true, repeat: 3, stagger: .1, ease: 'sine.inOut' }, at(1.2))
      .to(q('#chat .typing'), { opacity: 0, duration: .15 }, at(2.05))
      .to(q('#chat .a'), { scale: 1, opacity: 1, duration: .55, ease: 'back.out(1.5)' }, at(2.1));
    cue(at(.45), 'send'); cue(at(1.15), 'type'); cue(at(2.15), 'receive');
  }
  if (t === 'cta') {
    gsap.set(q('#cta-btn'), { scale: .5, opacity: 0 });
    gsap.set(q('.contact'), { x: -40, opacity: 0 });
    tl.to(q('#cta-btn'), { scale: 1, opacity: 1, duration: .7, ease: 'back.out(2)' }, at(1.0))
      .fromTo(q('#cta-btn .glow'), { scale: 1, opacity: .9 }, { scale: 1.12, opacity: 0, duration: 1.1, repeat: 3, ease: 'power1.out' }, at(1.7))
      .to(q('.contact'), { x: 0, opacity: 1, duration: .5, stagger: .2 }, at(1.5));
    cue(at(1.0), 'boom'); cue(at(1.7), 'shimmer');
    q('.contact').forEach((_, k) => cue(at(1.5 + k * .2), 'tick'));
  }
}
