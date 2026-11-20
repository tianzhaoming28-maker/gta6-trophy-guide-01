// Leonida Legend — offline GTA VI trophy guide & tracker.
// Checklist state lives in localStorage; the trophy data is the local
// data/trophies.json file; the app makes no network requests of its own
// beyond that same-origin file (source links open only when clicked).
const KEY = 'leonida-legend-progress-v1';
const POINTS = { platinum: 0, gold: 50, silver: 30, bronze: 15 };
const STAGES = [
  { n: 1, title: 'Stage 1 — Story first (Chapters 1–5)', hours: '≈ 60–80 hours',
    why: 'Play the five chapters and the named story missions in order, taking optional missions as they appear. Scan vehicles and study animals as you travel — progress counts toward the 100% checklist even before it is visible. One warning rules this stage: meditate at home in Chapter 1 (Positive Mental Attitude) before the chapter ends; it is the only permanently missable step, and there is no mission replay. Keep a manual save at the start of every chapter.' },
  { n: 2, title: 'Stage 2 — The 100% checklist', hours: '≈ 100 hours',
    why: 'After the credits, free roam continues and the 100% Completion checklist appears under Progress > Stats. It is lenient — about 60% of true completion (e.g. 200 of 277 vehicles, 100 of 255 animals) — and only 70 of 80 challenges are needed, so skip the hardest. Robberies, underwater discoveries, Shooting Ranges, Drone Races and Bret\u2019s quests must be done in full.' },
  { n: 3, title: 'Stage 3 — Strangers, characters & cleanup', hours: '≈ 10 hours',
    why: 'Finish the 8 Strangers & Freaks strands, the named characters\u2019 final missions (Andy, Kenton, Billy, Randy, Tyrone) and Bret\u2019s hunts, then sweep the one-off miscellaneous trophies — arcade game, showroom smash, VCIA departure, melee drive-by — with the checklist filters.' },
  { n: 4, title: 'Stage 4 — A Long Road, then the Platinum', hours: 'final push',
    why: 'When the 100% checklist closes, the gold A Long Road pops; the platinum Vice Got a Price! follows automatically the moment the 54th other trophy is earned. Nothing here needs a second playthrough.' },
];

const state = {
  earned: new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]')),
  kind: 'all', grade: 'all', query: '', hideEarned: false, spoiler: false,
  view: 'checklist', selected: null,
};
const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const $ = (id) => document.getElementById(id);
const cardsEl = $('cards'), detailEl = $('detail');

function save() { localStorage.setItem(KEY, JSON.stringify([...state.earned])); }
function isSpoilered(t) { return state.spoiler && t.kind === 'story' && !state.earned.has(t.name); }

function visible(t) {
  if (state.kind === 'missable' && !t.missable) return false;
  if (state.kind !== 'all' && state.kind !== 'missable' && t.kind !== state.kind) return false;
  if (state.grade !== 'all' && t.grade !== state.grade) return false;
  if (state.hideEarned && state.earned.has(t.name)) return false;
  if (state.query) {
    const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
    if (!hay.includes(state.query)) return false;
  }
  return true;
}

function badge(text, cls) {
  const s = document.createElement('span');
  s.className = `badge ${cls}`; s.textContent = text; return s;
}

function renderProgress() {
  const total = trophies.length, n = state.earned.size;
  const pts = trophies.filter((t) => state.earned.has(t.name)).reduce((s, t) => s + (POINTS[t.grade] ?? 0), 0);
  $('pct').textContent = `${Math.round((n / total) * 100)}%`;
  $('barfill').style.width = `${(n / total) * 100}%`;
  $('progress').textContent = `${n} of ${total} earned · ${pts} trophy points`;
  const by = {};
  for (const t of trophies) if (state.earned.has(t.name)) by[t.grade] = (by[t.grade] ?? 0) + 1;
  $('gradebreak').textContent = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => `${g}: ${by[g] ?? 0}/${trophies.filter((t) => t.grade === g).length}`).join(' · ');
}

function renderCards() {
  cardsEl.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (!visible(t)) continue;
    shown++;
    const li = document.createElement('li');
    li.className = 'card' + (state.earned.has(t.name) ? ' earned' : '') + (state.selected === t.name ? ' selected' : '');
    if (isSpoilered(t)) li.classList.add('spoilered');
    const top = document.createElement('div'); top.className = 'card-top';
    const box = document.createElement('input');
    box.type = 'checkbox'; box.checked = state.earned.has(t.name);
    box.setAttribute('aria-label', `Earned: ${t.name}`);
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => toggle(t.name, box.checked));
    const h = document.createElement('h3');
    h.textContent = isSpoilered(t) ? 'Hidden story trophy' : t.name;
    top.append(box, h);
    const d = document.createElement('p'); d.className = 'desc';
    d.textContent = isSpoilered(t) ? 'Spoiler mode: name and description stay hidden until you earn this trophy.' : t.description;
    const badges = document.createElement('div'); badges.className = 'badges';
    badges.append(badge(t.grade, t.grade), badge(t.kind === 'story' ? 'story' : t.kind, ''));
    if (t.missable) badges.append(badge('⚠ missable', 'missable'));
    if (t.hidden) badges.append(badge('hidden on PSN', 'hiddenb'));
    badges.append(badge(`stage ${t.stage}`, ''));
    li.append(top, d, badges);
    li.addEventListener('click', () => { state.selected = t.name; renderCards(); renderDetail(); });
    cardsEl.append(li);
  }
  $('showing').textContent = `Showing ${shown} of ${trophies.length} trophies · ${state.earned.size} earned overall. Click any card for its guide, steps and sources.`;
  if (!cardsEl.children.length) {
    const li = document.createElement('li'); li.className = 'note';
    li.textContent = state.kind === 'online'
      ? 'No online trophies exist in the official list — all 55 are single-player.'
      : 'No trophies match the current filters.';
    cardsEl.append(li);
  }
}

function renderDetail() {
  const t = trophies.find((x) => x.name === state.selected);
  if (!t) { detailEl.innerHTML = '<p class="detail-empty">Select a trophy to read its full guide, steps and sources.</p>'; return; }
  detailEl.replaceChildren();
  const badges = document.createElement('div'); badges.className = 'badges';
  badges.append(badge(t.grade, t.grade), badge(t.kind, ''), badge(`roadmap stage ${t.stage}`, ''));
  if (t.missable) badges.append(badge('⚠ missable', 'missable'));
  const h = document.createElement('h2');
  h.textContent = isSpoilered(t) ? 'Hidden story trophy' : t.name;
  const off = document.createElement('p'); off.className = 'official';
  off.textContent = isSpoilered(t) ? 'Earn it to reveal its official name and description.' : `Official description: “${t.description}”`;
  detailEl.append(badges, h, off);
  if (t.missable) {
    const w = document.createElement('p'); w.className = 'warn';
    w.textContent = '⚠ MISSABLE: the Chapter 1 meditation at home disappears after Chapter 1 and there is no mission replay (PowerPyx roadmap). Do it in Chapter 1, or keep a Chapter 1 manual save.';
    detailEl.append(w);
  }
  const gh = document.createElement('h4'); gh.textContent = 'Guide (own words, sources cited below)';
  const g = document.createElement('p'); g.className = 'guide'; g.textContent = t.guide;
  const sh = document.createElement('h4'); sh.textContent = 'Steps';
  const ol = document.createElement('ol');
  for (const s of t.steps) { const li = document.createElement('li'); li.textContent = s; ol.append(li); }
  const srch = document.createElement('h4'); srch.textContent = 'Sources';
  const ul = document.createElement('ul'); ul.className = 'sources';
  for (const s of t.sources) {
    const li = document.createElement('li');
    const a = document.createElement('a'); a.href = s.url; a.textContent = s.name; a.rel = 'noopener';
    li.append(a); ul.append(li);
  }
  const label = document.createElement('label'); label.className = 'earnline';
  const box = document.createElement('input'); box.type = 'checkbox'; box.checked = state.earned.has(t.name);
  box.addEventListener('change', () => toggle(t.name, box.checked));
  label.append(box, document.createTextNode(' I earned this trophy'));
  detailEl.append(gh, g, sh, ol, srch, ul, label);
}

function renderRoadmap() {
  const el = $('stages'); el.replaceChildren();
  for (const st of STAGES) {
    const li = document.createElement('li'); li.className = 'stage';
    const h = document.createElement('h3'); h.textContent = `${st.title} · ${st.hours}`;
    const p = document.createElement('p'); p.className = 'why'; p.textContent = st.why;
    const ul = document.createElement('ul');
    for (const t of trophies.filter((x) => x.stage === st.n)) {
      const item = document.createElement('li');
      item.textContent = `${state.earned.has(t.name) ? '☑' : '☐'} ${t.name} (${t.grade})${t.missable ? ' — ⚠ MISSABLE' : ''}`;
      ul.append(item);
    }
    li.append(h, p, ul); el.append(li);
  }
}

function renderMissables() {
  const el = $('missable-list'); el.replaceChildren();
  for (const t of trophies.filter((x) => x.missable)) {
    const d = document.createElement('div'); d.className = 'misscard';
    const h = document.createElement('h3'); h.textContent = `⚠ ${t.name} (${t.grade})`;
    const p = document.createElement('p'); p.textContent = t.guide;
    d.append(h, p); el.append(d);
  }
  const safe = document.createElement('div'); safe.className = 'safe';
  safe.textContent = 'Everything else is safe: PowerPyx\u2019s roadmap confirms free roam after the story with all 100%-checklist content still accessible, and no other trophy is flagged missable. Story trophies cannot be skipped on a normal playthrough — but with no mission replay, chapter-start manual saves are cheap insurance.';
  el.append(safe);
}

function render() { renderProgress(); renderCards(); renderDetail(); renderRoadmap(); renderMissables(); }
function toggle(name, on) {
  if (on) state.earned.add(name); else state.earned.delete(name);
  save(); render();
}

document.querySelectorAll('.chip').forEach((c) => c.addEventListener('click', () => {
  document.querySelectorAll('.chip').forEach((x) => x.classList.remove('active'));
  c.classList.add('active'); state.kind = c.dataset.kind;
  $('online-note').hidden = state.kind !== 'online';
  renderCards();
}));
document.querySelectorAll('.viewbtn').forEach((b) => b.addEventListener('click', () => {
  document.querySelectorAll('.viewbtn').forEach((x) => x.classList.remove('active'));
  b.classList.add('active'); state.view = b.dataset.view;
  for (const v of ['checklist', 'roadmap', 'missables']) $('view-' + v).hidden = v !== state.view;
  if (state.view === 'roadmap') renderRoadmap();
  if (state.view === 'missables') renderMissables();
}));
$('grade').addEventListener('change', (e) => { state.grade = e.target.value; renderCards(); });
$('search').addEventListener('input', (e) => { state.query = e.target.value.trim().toLowerCase(); renderCards(); });
$('hideearned').addEventListener('change', (e) => { state.hideEarned = e.target.checked; renderCards(); });
$('spoiler').addEventListener('change', (e) => { state.spoiler = e.target.checked; render(); });
$('export').addEventListener('click', () => {
  const payload = JSON.stringify({ app: 'leonida-legend', earned: [...state.earned] }, null, 2);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json'; a.click();
  URL.revokeObjectURL(a.href);
});
$('import').addEventListener('change', async (e) => {
  const file = e.target.files[0]; if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    state.earned = new Set(names.filter((n) => trophies.some((t) => t.name === n)));
    save(); render();
  } catch { alert('That file is not a valid progress export.'); }
});
$('reset').addEventListener('click', () => { state.earned.clear(); save(); render(); });

// Deep-link helpers used by the screenshot views: ?select=<id>&view=<v>&spoiler=1&earned=<ids>
const q = new URLSearchParams(location.search);
if (q.get('earned')) {
  for (const id of q.get('earned').split(',').map(Number)) {
    const t = trophies.find((x) => x.id === id); if (t) state.earned.add(t.name);
  }
  save();
}
if (q.get('spoiler') === '1') { state.spoiler = true; $('spoiler').checked = true; }
if (q.get('select')) {
  const t = trophies.find((x) => x.id === Number(q.get('select')));
  if (t) state.selected = t.name;
}
if (q.get('view')) document.querySelector(`.viewbtn[data-view="${q.get('view')}"]`)?.click();
render();
