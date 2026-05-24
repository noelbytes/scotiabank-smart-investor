
/* ============ Nav scrolled state ============ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ============ Reveal on scroll ============ */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ============ Sparkline generator ============ */
function sparkline(values, w = 100, h = 32, color = '#23B574') {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => [i * step, h - ((v - min) / range) * (h - 4) - 2]);
  const d = pts.map((p, i) => (i === 0 ? `M${p[0].toFixed(1)},${p[1].toFixed(1)}` : `L${p[0].toFixed(1)},${p[1].toFixed(1)}`)).join(' ');
  const area = `${d} L${w},${h} L0,${h} Z`;
  const idStr = 'sg' + Math.random().toString(36).slice(2,7);
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <defs>
      <linearGradient id="${idStr}" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="${color}" stop-opacity="0.22"/>
        <stop offset="1" stop-color="${color}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="${area}" fill="url(#${idStr})"/>
    <path d="${d}" fill="none" stroke="${color}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`;
}

/* ============ Portfolio data ============ */
const products = [
  { id: 'tfsa', name: 'TFSA Growth Portfolio', sub: 'Diversified · Medium risk', icon: 'T', cls: '', alloc: 6200, pct: 4.2,
    spark: [40,42,41,43,44,42,45,46,45,47,49,48,50,52] },
  { id: 'sp500', name: 'S&P 500 ETF', sub: 'VFV.TO · Equity', icon: 'S', cls: 'etf', alloc: 4800, pct: 1.8,
    spark: [30,31,29,32,33,32,34,33,35,36,35,36,37,38] },
  { id: 'gic', name: '1-Year GIC', sub: 'Guaranteed · No risk', icon: 'G', cls: 'gic', alloc: 1840, pct: 0.4,
    spark: [20,20,20.1,20.1,20.2,20.2,20.3,20.3,20.4,20.4,20.5,20.5,20.6,20.6] },
  { id: 'bal', name: 'CDN Balanced Portfolio', sub: 'Bonds + equity · Low risk', icon: 'B', cls: 'bal', alloc: 0, pct: -0.6,
    spark: [35,36,34,33,34,33,32,33,32,31,32,31,30,30] },
];

function renderPortfolio() {
  const grid = document.getElementById('port-grid');
  grid.innerHTML = products.map(p => {
    const up = p.pct >= 0;
    const color = up ? '#23B574' : '#FF3B48';
    return `
      <div class="invest-card">
        <div class="invest-card-head">
          <div class="asset-icon ${p.cls}">${p.icon}</div>
          <div>
            <div class="invest-card-name">${p.name}</div>
            <div class="invest-card-sub">${p.sub}</div>
          </div>
        </div>
        <div class="invest-card-mid">
          <div class="invest-card-alloc">${p.alloc.toLocaleString()}<small>pts</small></div>
          <span class="pct ${up ? 'up' : 'dn'}">${up ? '▲' : '▼'} ${Math.abs(p.pct).toFixed(1)}%</span>
        </div>
        ${sparkline(p.spark, 240, 36, color)}
      </div>
    `;
  }).join('');
}
renderPortfolio();

/* ============ Tabs ============ */
function switchTab(id) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === id));
  document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.dataset.panel === id));
}
document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));

/* ============ Invest sliders ============ */
const TOTAL_PTS = 14320;
const sliders = [
  { id: 'tfsa',  name: 'TFSA Growth Portfolio', risk: 'Medium', riskCls: 'med', ret: '5.4%', initial: 4000, max: 14320, icon: 'T', cls: '' },
  { id: 'sp500', name: 'S&P 500 ETF (VFV)',     risk: 'Medium', riskCls: 'med', ret: '7.8%', initial: 3200, max: 14320, icon: 'S', cls: 'etf' },
  { id: 'gic',   name: '1-Year GIC',            risk: 'None',   riskCls: 'none', ret: '4.5%', initial: 2000, max: 14320, icon: 'G', cls: 'gic' },
  { id: 'bal',   name: 'CDN Balanced Portfolio',risk: 'Low',    riskCls: 'low',  ret: '4.1%', initial: 1500, max: 14320, icon: 'B', cls: 'bal' },
];

function renderSliders() {
  const grid = document.getElementById('slider-grid');
  grid.innerHTML = sliders.map(s => `
    <div class="slider-card">
      <div class="slider-card-head">
        <div style="display:flex;align-items:center;gap:10px;min-width:0">
          <div class="asset-icon ${s.cls}" style="width:30px;height:30px;font-size:14px;border-radius:9px">${s.icon}</div>
          <div class="slider-card-name">${s.name}</div>
        </div>
        <span class="badge ${s.riskCls}">${s.risk}</span>
      </div>
      <div class="slider-card-sub">Est. annual return <b>${s.ret}</b></div>
      <div class="slider-row">
        <input type="range" min="0" max="${s.max}" step="100" value="${s.initial}" data-id="${s.id}" />
        <div class="slider-val"><span class="num" data-val="${s.id}">${s.initial.toLocaleString()}</span><small>pts</small></div>
      </div>
    </div>
  `).join('');
  grid.querySelectorAll('input[type="range"]').forEach(input => {
    input.addEventListener('input', () => updateAllocation());
  });
  updateAllocation();
}
function updateAllocation() {
  let total = 0;
  document.querySelectorAll('#slider-grid input[type="range"]').forEach(input => {
    const v = parseInt(input.value, 10);
    total += v;
    const valEl = document.querySelector(`[data-val="${input.dataset.id}"]`);
    if (valEl) valEl.textContent = v.toLocaleString();
  });
  const rem = TOTAL_PTS - total;
  document.getElementById('alloc-cur').textContent = total.toLocaleString();
  document.getElementById('alloc-rem').textContent = rem.toLocaleString();
  const pct = Math.min((total / TOTAL_PTS) * 100, 100);
  document.getElementById('alloc-bar').style.width = pct + '%';
  const over = total > TOTAL_PTS;
  document.getElementById('alloc-summary').classList.toggle('over', over);
  document.getElementById('warn-bar').classList.toggle('show', over);
}
renderSliders();

/* ============ Learn ============ */
const lessons = [
  { reward: 150, complete: false, started: false },
  { reward: 200, complete: false, started: false },
  { reward: 150, complete: false, started: false },
];
let totalEarned = 0;

function startLesson(idx) {
  const card = document.querySelector(`.lesson[data-lesson="${idx}"]`);
  if (!card || card.classList.contains('locked') || lessons[idx].complete) return;
  lessons[idx].started = true;
  const progress = card.querySelector('.lesson-progress');
  const fill = card.querySelector('.lesson-progress-fill');
  const content = card.querySelector('.lesson-content');
  const cta = card.querySelector('.lesson-cta');
  progress.classList.add('show');
  // partial progress visual
  requestAnimationFrame(() => fill.style.width = '35%');
  content.classList.add('open');
  cta.textContent = 'Reading…';
  cta.disabled = true;
  card.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

function completeLesson(idx) {
  const card = document.querySelector(`.lesson[data-lesson="${idx}"]`);
  if (!card || lessons[idx].complete) return;
  lessons[idx].complete = true;
  card.classList.add('done');
  card.querySelector('.lesson-progress-fill').style.width = '100%';
  // swap CTA
  const ctaWrap = card.querySelector('.lesson-row');
  const oldCta = card.querySelector('.lesson-cta');
  const newCta = document.createElement('button');
  newCta.className = 'lesson-cta done';
  newCta.innerHTML = `<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l3 3 7-7"/></svg> +${lessons[idx].reward} pts`;
  oldCta.replaceWith(newCta);
  // hide expanded content
  card.querySelector('.lesson-content').classList.remove('open');
  // unlock next
  const next = document.querySelector(`.lesson[data-lesson="${idx + 1}"]`);
  if (next && next.classList.contains('locked')) {
    next.classList.remove('locked');
    const nextCta = next.querySelector('.lesson-cta');
    nextCta.className = 'lesson-cta start';
    nextCta.disabled = false;
    nextCta.innerHTML = 'Start →';
    nextCta.setAttribute('onclick', `startLesson(${idx + 1})`);
  }
  // animate counter
  animateCounter(totalEarned, totalEarned + lessons[idx].reward, 700);
  totalEarned += lessons[idx].reward;
}

function animateCounter(from, to, dur) {
  const el = document.getElementById('learn-counter');
  const t0 = performance.now();
  function step(now) {
    const t = Math.min((now - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const v = Math.round(from + (to - from) * eased);
    el.textContent = v.toLocaleString();
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ============ Phone subtle parallax on mouse move ============ */
const phoneWrap = document.querySelector('.phone-wrap');
if (phoneWrap && window.matchMedia('(pointer:fine)').matches) {
  const hero = document.querySelector('.hero');
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    phoneWrap.style.transform = `translate(${x * -8}px, ${y * -6}px)`;
  });
  hero.addEventListener('mouseleave', () => phoneWrap.style.transform = '');
}
