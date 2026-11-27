import { METRICS, GROUPS, classify, LEVEL_ORDER } from './metrics.js';
import { t, pick } from './i18n.js';

/* ── State ───────────────────────────────────────────────────────── */
let DATA = null;
let lang = localStorage.getItem('hd-lang') || 'th';
let memberIdx = 0;

const LIPID_KEYS = ['ldl', 'hdl', 'tgl', 'tcho'];
const DIABETES_KEYS = ['hba1c', 'glucose_fasting', 'glucose_random'];
const VITALS_KEYS = ['sbp', 'dbp', 'weight', 'bmi', 'waist', 'creatinine', 'egfr', 'ast', 'alt', 'urate', 'hemoglobin'];
const FLAG_ORDER = ['critical', 'bad', 'warn'];

/* ── Helpers ─────────────────────────────────────────────────────── */
const $ = (id) => document.getElementById(id);

function fmtDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  if (lang === 'th') return `${Number(d)} ${months[Number(m) - 1]} ${Number(y) + 543}`;
  const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${Number(d)} ${mon[Number(m) - 1]} ${y}`;
}

function fmtNum(n) {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function levelClass(level) {
  return level ? `status-${level}` : 'status-neutral';
}

function levelColor(level) {
  const map = {
    good: '#a7d9b9', ok: '#b7cde6', warn: '#ecd39a',
    bad: '#f0c2ae', critical: '#f0b3b0', neutral: '#dde2ea'
  };
  return map[level] || map.neutral;
}

function dotColor(level) {
  const map = {
    good: '#3aa86a', ok: '#5b86bd', warn: '#d99b2b',
    bad: '#cf6b45', critical: '#c9453f', neutral: '#9aa5b3'
  };
  return map[level] || map.neutral;
}

/* ── Data access ─────────────────────────────────────────────────── */
function currentMember() {
  return DATA?.members?.[memberIdx] || null;
}

function latestRecord() {
  const m = currentMember();
  if (!m || !m.records.length) return null;
  return m.records[m.records.length - 1];
}

function previousRecord() {
  const m = currentMember();
  if (!m || m.records.length < 2) return null;
  return m.records[m.records.length - 2];
}

function lastN(n) {
  const m = currentMember();
  if (!m) return [];
  return m.records.slice(-n);
}

/** Records for charts: last 5, oldest → newest (chart order). */
function trendRecords() {
  return lastN(5);
}

/* ── Render: static labels ───────────────────────────────────────── */
function applyStaticLabels() {
  document.documentElement.lang = lang;
  document.body.dataset.lang = lang;

  $('appTitle').textContent = t(lang, 'appTitle');
  $('subtitle').textContent = t(lang, 'subtitle');
  $('hOverview').textContent = t(lang, 'overview');
  $('hLipid').textContent = t(lang, 'lipid');
  $('hDiabetes').textContent = t(lang, 'diabetes');
  $('hVitals').textContent = t(lang, 'groupBody');
  $('hFlagged').textContent = t(lang, 'flagged');
  $('hTrends').textContent = t(lang, 'trends');
  $('footnote').textContent = t(lang, 'footnote');
  $('lblLastCheck').textContent = t(lang, 'lastCheck');
  $('lblRecordCount').textContent = t(lang, 'recordCount');
  $('lblUpdated').textContent = t(lang, 'updated');
  $('demoBadge').textContent = t(lang, 'demoBadge');
  $('demoNote').textContent = t(lang, 'demoNote');
  $('memberLabel').textContent = t(lang, 'member');
  $('trendSub').textContent = t(lang, 'trendSub');
  $('overviewSub').textContent = t(lang, 'overviewSub');

  document.querySelectorAll('.lang-switch button').forEach((b) => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
}

/* ── Render: meta strip ──────────────────────────────────────────── */
function renderMeta() {
  const m = currentMember();
  const latest = latestRecord();

  $('lastCheckDate').textContent = m?.lastDate ? fmtDate(m.lastDate) : '—';
  $('recordCount').textContent = m?.recordCount ?? '—';
  $('updatedAt').textContent = DATA?.generatedAt ? fmtDate(DATA.generatedAt.slice(0, 10)) : '—';

  const banner = $('demoBanner');
  banner.hidden = !DATA?.isDemo;

  if (DATA?.members?.length > 1) {
    $('memberPickerWrap').hidden = false;
    const sel = $('memberSelect');
    if (sel.options.length !== DATA.members.length) {
      sel.innerHTML = '';
      DATA.members.forEach((mm, i) => {
        const o = document.createElement('option');
        o.value = String(i);
        o.textContent = pick(mm.member.name, lang) || mm.member.id;
        sel.appendChild(o);
      });
    }
    sel.value = String(memberIdx);
  }
}

/* ── Render: overview (latest first, swipe left for older) ───────── */
function renderOverview() {
  const wrap = $('overviewGrid');
  wrap.innerHTML = '';
  const visits = lastN(3);

  if (!visits.length) {
    wrap.innerHTML = `<p class="trend-empty">${t(lang, 'noData')}</p>`;
    return;
  }

  const highlight = ['ldl', 'hdl', 'tgl', 'hba1c', 'sbp', 'dbp'];

  // newest first so the current check-up is the leftmost card
  visits.slice().reverse().forEach((rec, i) => {
    const isLatest = i === 0;
    const card = document.createElement('div');
    card.className = 'visit-card' + (isLatest ? ' is-latest' : '');

    const head = document.createElement('div');
    head.className = 'visit-head';
    head.innerHTML = `
      <span class="visit-date">${fmtDate(rec.date)}</span>
      ${isLatest ? `<span class="visit-tag">${t(lang, 'lastCheck')}</span>` : ''}
    `;
    card.appendChild(head);

    const mini = document.createElement('div');
    mini.className = 'visit-mini';

    let shown = 0;
    for (const key of highlight) {
      const v = rec.values[key];
      if (v === undefined || v === null) continue;
      const band = classify(key, v);
      const row = document.createElement('div');
      row.className = 'mini-row';
      row.innerHTML = `
        <span class="mini-name">${pick(METRICS[key].label, lang)}</span>
        <span class="mini-val">
          <span class="dot" style="background:${dotColor(band?.level)}"></span>
          ${fmtNum(v)} <span style="color:var(--text-faint);font-weight:400">${METRICS[key].unit}</span>
        </span>`;
      mini.appendChild(row);
      shown++;
    }

    if (!shown) {
      mini.innerHTML = `<span style="color:var(--text-faint);font-size:.82rem">${t(lang, 'noData')}</span>`;
    }

    card.appendChild(mini);
    wrap.appendChild(card);
  });
}

/* ── Render: metric cards ────────────────────────────────────────── */
function metricCard(key) {
  const meta = METRICS[key];
  const latest = latestRecord();
  const prev = previousRecord();
  if (!latest) return null;

  const v = latest.values[key];
  if (v === undefined || v === null) return null;

  const band = classify(key, v);
  const prevVal = prev?.values?.[key];

  const card = document.createElement('div');
  card.className = 'metric-card ' + levelClass(band?.level);

  // delta vs previous
  let deltaHtml = '';
  if (typeof prevVal === 'number' && Number.isFinite(prevVal)) {
    const diff = v - prevVal;
    if (Math.abs(diff) < 0.05) {
      deltaHtml = `<span class="metric-delta">${t(lang, 'same')}</span>`;
    } else {
      const arrow = diff > 0 ? '▲' : '▼';
      // colour the arrow by whether the direction is good for this metric
      const better = meta.direction === 'high-is-good' ? diff > 0 : diff < 0;
      const col = better ? 'var(--good-fg)' : 'var(--bad-fg)';
      deltaHtml = `<span class="metric-delta" style="color:${col}">${arrow} ${fmtNum(Math.abs(diff))}</span>`;
    }
  }

  // normal range text — low-is-good shows an upper bound, high-is-good a lower bound
  let rangeText = '';
  if (meta.direction === 'high-is-good') {
    const warnBand = meta.bands.find((b) => b.level === 'warn');
    if (warnBand && Number.isFinite(warnBand.max)) {
      rangeText = `${t(lang, 'normalRange')}: ≥ ${fmtNum(warnBand.max + 1)} ${meta.unit}`;
    }
  } else {
    const goodBand = meta.bands.find((b) => b.level === 'good');
    if (goodBand && Number.isFinite(goodBand.max)) {
      rangeText = `${t(lang, 'normalRange')}: ≤ ${fmtNum(goodBand.max)} ${meta.unit}`;
    }
  }

  // band bar: map value onto the bands
  const bar = buildBandBar(key, v);

  card.innerHTML = `
    <div class="metric-head">
      <div>
        <div class="metric-name">${pick(meta.label, lang)}</div>
        <div class="metric-unit">${meta.unit}</div>
      </div>
    </div>
    <div class="metric-value-row">
      <span class="metric-value">${fmtNum(v)}</span>
      ${deltaHtml}
    </div>
    ${band?.label ? `<span class="metric-status-pill">${pick(band.label, lang)}</span>` : ''}
    ${bar}
    ${rangeText ? `<div class="metric-range">${rangeText}</div>` : ''}
  `;

  return card;
}

function buildBandBar(key, value) {
  const meta = METRICS[key];
  const finite = meta.bands.map((b) => b.max).filter((m) => Number.isFinite(m));
  if (!finite.length) return '';
  const maxScale = Math.max(finite[finite.length - 1] * 1.2, value * 1.15);

  const wrap = document.createElement('div');
  wrap.className = 'band-bar';

  let prev = 0;
  for (const band of meta.bands) {
    const upper = Number.isFinite(band.max) ? band.max : maxScale;
    const width = Math.max(0, ((upper - prev) / maxScale) * 100);
    if (width <= 0) { prev = upper; continue; }
    const seg = document.createElement('div');
    seg.className = 'band-fill';
    seg.style.left = `${(prev / maxScale) * 100}%`;
    seg.style.width = `${width}%`;
    seg.style.background = levelColor(band.level);
    seg.title = `${band.level}: ≤ ${Number.isFinite(band.max) ? band.max : '∞'}`;
    wrap.appendChild(seg);
    prev = upper;
    if (prev >= maxScale) break;
  }

  const marker = document.createElement('div');
  marker.className = 'band-marker';
  marker.style.left = `${Math.min(100, Math.max(0, (value / maxScale) * 100))}%`;
  wrap.appendChild(marker);

  return wrap.outerHTML;
}

function renderGrid(targetId, keys) {
  const wrap = $(targetId);
  wrap.innerHTML = '';
  let count = 0;
  for (const k of keys) {
    const card = metricCard(k);
    if (card) { wrap.appendChild(card); count++; }
  }
  if (!count) {
    wrap.innerHTML = `<p class="trend-empty">${t(lang, 'noData')}</p>`;
  }
}

/* ── Render: flagged ─────────────────────────────────────────────── */
function renderFlagged() {
  const wrap = $('flaggedList');
  wrap.innerHTML = '';
  const latest = latestRecord();

  if (!latest) {
    wrap.innerHTML = `<p class="trend-empty">${t(lang, 'noData')}</p>`;
    return;
  }

  const flags = [];
  for (const [key, v] of Object.entries(latest.values)) {
    const meta = METRICS[key];
    if (!meta) continue;
    const band = classify(key, v);
    if (!band) continue;
    if (FLAG_ORDER.includes(band.level)) flags.push({ key, v, band });
  }

  flags.sort((a, b) => LEVEL_ORDER[b.band.level] - LEVEL_ORDER[a.band.level]);

  if (!flags.length) {
    wrap.innerHTML = `<div class="all-normal">✓ ${t(lang, 'allNormal')}</div>`;
    return;
  }

  for (const f of flags) {
    const meta = METRICS[f.key];
    const el = document.createElement('div');
    el.className = `flag-item lvl-${f.band.level}`;
    const icon = f.band.level === 'critical' || f.band.level === 'bad' ? '⚠' : '•';
    el.innerHTML = `
      <span class="flag-icon">${icon}</span>
      <span class="flag-name">${pick(meta.label, lang)}</span>
      <span class="flag-detail">
        <strong>${fmtNum(f.v)} ${meta.unit}</strong> · ${pick(f.band.label, lang)}
      </span>`;
    wrap.appendChild(el);
  }
}

/* ── Render: trends ──────────────────────────────────────────────── */
function renderTrends() {
  const wrap = $('trendGrid');
  wrap.innerHTML = '';
  const m = currentMember();
  const records = trendRecords();

  if (!m || records.length < 2) {
    wrap.innerHTML = `<p class="trend-empty">${t(lang, 'noTrend')}</p>`;
    return;
  }

  // one chart per metric that has at least 2 data points within the last 5 checks
  for (const key of Object.keys(METRICS)) {
    const points = records
      .map((r) => ({ date: r.date, value: r.values[key] }))
      .filter((p) => typeof p.value === 'number' && Number.isFinite(p.value));

    if (points.length < 2) continue;

    const meta = METRICS[key];
    const card = document.createElement('div');
    card.className = 'trend-card';

    const first = points[0].value;
    const last = points[points.length - 1].value;
    const diff = last - first;

    card.innerHTML = `
      <div class="trend-title">
        <span>${pick(meta.label, lang)}</span>
        <span>${meta.unit} · ${diff === 0 ? t(lang, 'same') : (diff > 0 ? '▲' : '▼') + ' ' + fmtNum(Math.abs(diff))}</span>
      </div>
      ${svgChart(points, key)}
    `;
    wrap.appendChild(card);
  }

  if (!wrap.children.length) {
    wrap.innerHTML = `<p class="trend-empty">${t(lang, 'noTrend')}</p>`;
  }
}

function svgChart(points, key) {
  const W = 320, H = 120, PAD_L = 6, PAD_R = 6, PAD_T = 10, PAD_B = 22;
  const vals = points.map((p) => p.value);
  let min = Math.min(...vals);
  let max = Math.max(...vals);

  // pad the range so a flat line doesn't sit on the axis
  const span = max - min;
  if (span < 1e-6) { max = max + 1; min = min - 1; }
  else { max += span * 0.15; min -= span * 0.15; }
  if (min < 0) min = 0;

  const x = (i) => PAD_L + (i / (points.length - 1)) * (W - PAD_L - PAD_R);
  const y = (v) => PAD_T + (1 - (v - min) / (max - min)) * (H - PAD_T - PAD_B);

  // area + line path
  let line = '';
  points.forEach((p, i) => {
    line += `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)} `;
  });
  const area = `${line} L${x(points.length - 1).toFixed(1)},${H - PAD_B} L${x(0).toFixed(1)},${H - PAD_B} Z`;

  // target band shading (good zone) if the metric has one
  const meta = METRICS[key];
  const goodBand = meta.bands.find((b) => b.level === 'good');
  let bandRect = '';
  if (goodBand && Number.isFinite(goodBand.max)) {
    const lo = meta.direction === 'high-is-good' ? (meta.bands[0]?.max ?? min) : min;
    const hi = goodBand.max;
    const yy1 = y(Math.min(hi, max));
    const yy2 = y(Math.max(lo, min));
    if (yy2 > yy1) {
      bandRect = `<rect x="${PAD_L}" y="${yy1.toFixed(1)}" width="${W - PAD_L - PAD_R}" height="${(yy2 - yy1).toFixed(1)}" fill="#e7f6ec" opacity=".75" rx="3"/>`;
    }
  }

  // dots
  let dots = '';
  points.forEach((p, i) => {
    const band = classify(key, p.value);
    dots += `<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="4" fill="#fff" stroke="${dotColor(band?.level)}" stroke-width="2.5"/>`;
  });

  // x labels: first and last only (keep it clean)
  const label = (i, anchor) =>
    `<text x="${x(i).toFixed(1)}" y="${H - 6}" font-size="8.5" fill="#8b95a4" text-anchor="${anchor}">${shortDate(points[i].date)}</text>`;

  return `
<svg class="trend-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img">
  ${bandRect}
  <path d="${area}" fill="rgba(75,123,236,.10)"/>
  <path d="${line}" fill="none" stroke="#4b7bec" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>
  ${dots}
  ${label(0, 'start')}
  ${label(points.length - 1, 'end')}
</svg>`;
}

function shortDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${Number(d)}/${Number(m)}/${y.slice(2)}`;
}

/* ── Master render ───────────────────────────────────────────────── */
function render() {
  applyStaticLabels();
  renderMeta();
  renderOverview();
  renderGrid('lipidGrid', LIPID_KEYS);
  renderGrid('diabetesGrid', DIABETES_KEYS);
  renderGrid('vitalsGrid', VITALS_KEYS);
  renderFlagged();
  renderTrends();
}

/* ── Events ──────────────────────────────────────────────────────── */
function bindEvents() {
  document.querySelectorAll('.lang-switch button').forEach((btn) => {
    btn.addEventListener('click', () => {
      lang = btn.dataset.lang;
      localStorage.setItem('hd-lang', lang);
      render();
    });
  });

  $('memberSelect')?.addEventListener('change', (e) => {
    memberIdx = Number(e.target.value) || 0;
    render();
  });

  // metadata panel is collapsed behind the ⓘ button
  $('infoToggle')?.addEventListener('click', () => {
    const panel = $('metaPanel');
    const open = panel.hidden;
    panel.hidden = !open;
    $('infoToggle').setAttribute('aria-expanded', String(open));
  });
}

/* ── Boot ────────────────────────────────────────────────────────── */
async function boot() {
  try {
    const res = await fetch('data/members.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    DATA = await res.json();
  } catch (err) {
    document.getElementById('app').innerHTML =
      `<div class="card"><h2>โหลดข้อมูลไม่ได้</h2>
       <p style="color:var(--text-soft);font-size:.9rem">
       ไม่พบไฟล์ <code>data/members.json</code> — รันสคริปต์นี้ก่อน:<br>
       <code>node scripts/build-data.mjs</code></p></div>`;
    console.error(err);
    return;
  }

  if (!DATA.members?.length) {
    document.getElementById('app').innerHTML =
      `<div class="card"><p class="trend-empty">${t(lang, 'noData')}</p></div>`;
    return;
  }

  bindEvents();
  render();
}

boot();
