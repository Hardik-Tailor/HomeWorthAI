/* ─── PARTICLES ───────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COLORS = ['#a78bfa','#f472b6','#38bdf8','#fb923c','#4ade80','#fbbf24'];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  function rand(a, b) { return Math.random() * (b - a) + a; }

  for (let i = 0; i < 55; i++) {
    particles.push({
      x: rand(0, W), y: rand(0, H),
      r: rand(1.5, 4),
      dx: rand(-0.3, 0.3), dy: rand(-0.5, -0.1),
      color: COLORS[Math.floor(rand(0, COLORS.length))],
      alpha: rand(0.3, 0.7)
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.y < -10) { p.y = H + 10; p.x = rand(0, W); }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();


/* ─── NAVBAR SCROLL EFFECT ────────────────────────────────── */
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  nav.style.background = window.scrollY > 60
    ? 'rgba(15,7,32,0.95)'
    : 'rgba(15,7,32,0.7)';
});


/* ─── TIER SELECTOR ──────────────────────────────────────── */
document.querySelectorAll('.tier-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.tier-opt span').forEach(s => s.style.transform = '');
    opt.querySelector('span').style.transform = 'scale(1.04)';
  });
});


/* ─── FORM SUBMIT → PREDICT ──────────────────────────────── */
const form       = document.getElementById('priceForm');
const btnText    = document.querySelector('.btn-text');
const btnLoader  = document.querySelector('.btn-loader');
const resultPanel= document.getElementById('resultPanel');
const resultPrice= document.getElementById('resultPrice');
const resultTags = document.getElementById('resultTags');
const resetBtn   = document.getElementById('resetBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const tierEl = document.querySelector('input[name="tier"]:checked');
  if (!tierEl) { flashError('Please select a Location Tier.'); return; }

  const body = {
    area:      parseFloat(document.getElementById('area').value),
    bedrooms:  parseInt(document.getElementById('bedrooms').value),
    bathrooms: parseInt(document.getElementById('bathrooms').value),
    floors:    parseInt(document.getElementById('floors').value),
    year:      parseInt(document.getElementById('year').value),
    tier:      parseInt(tierEl.value)
  };

  // Show loader
  btnText.classList.add('hidden');
  btnLoader.classList.add('visible');
  btnLoader.style.display = 'inline-flex';
  resultPanel.classList.add('hidden');

  try {
    const res  = await fetch('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();

    if (!data.success) throw new Error(data.error || 'Prediction failed');

    showResult(data.price, body);
  } catch (err) {
    flashError(err.message);
  } finally {
    btnText.classList.remove('hidden');
    btnLoader.classList.remove('visible');
    btnLoader.style.display = 'none';
  }
});


/* ─── SHOW RESULT ─────────────────────────────────────────── */
function showResult(price, params) {
  resultPanel.classList.remove('hidden');
  resultPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Animate number count-up
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    resultPrice.innerHTML = `₹ ${(eased * price).toFixed(2)} <span>Lakhs</span>`;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);

  // Tags summary
  const tierLabels = { 1: '🏙️ Tier 1 - Metro', 2: '🏛️ Tier 2 - Urban', 3: '🌳 Tier 3 - Semi-Urban' };
  resultTags.innerHTML = [
    `<span class="result-tag">📐 ${params.area} sqft</span>`,
    `<span class="result-tag">🛏️ ${params.bedrooms} Beds</span>`,
    `<span class="result-tag">🚿 ${params.bathrooms} Baths</span>`,
    `<span class="result-tag">🏢 ${params.floors} Floors</span>`,
    `<span class="result-tag">📅 Built ${params.year}</span>`,
    `<span class="result-tag">${tierLabels[params.tier]}</span>`,
  ].join('');

  // Mini confetti burst
  launchConfetti();
}


/* ─── CONFETTI ────────────────────────────────────────────── */
function launchConfetti() {
  const canvas = document.getElementById('confetti');
  const ctx    = canvas.getContext('2d');
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const pieces = [];
  const colors = ['#a78bfa','#f472b6','#fb923c','#4ade80','#38bdf8','#fbbf24'];

  for (let i = 0; i < 90; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 4,
      h: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      r: Math.random() * Math.PI,
      dr: (Math.random() - 0.5) * 0.15,
      dy: Math.random() * 3 + 2,
      alpha: 1
    });
  }

  let start = null;
  function tick(ts) {
    if (!start) start = ts;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const elapsed = ts - start;
    const fade = Math.max(0, 1 - elapsed / 2500);

    for (const p of pieces) {
      ctx.save();
      ctx.globalAlpha = fade * p.alpha;
      ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
      ctx.rotate(p.r);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      p.y  += p.dy;
      p.r  += p.dr;
      p.x  += Math.sin(p.r) * 1.5;
    }
    if (fade > 0) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(tick);
}


/* ─── RESET ───────────────────────────────────────────────── */
resetBtn.addEventListener('click', () => {
  resultPanel.classList.add('hidden');
  form.reset();
  document.querySelectorAll('.tier-opt span').forEach(s => s.style.transform = '');
  document.getElementById('area').focus();
  document.querySelector('.estimator').scrollIntoView({ behavior: 'smooth' });
});


/* ─── ERROR FLASH ─────────────────────────────────────────── */
function flashError(msg) {
  const old = document.querySelector('.flash-error');
  if (old) old.remove();

  const div = document.createElement('div');
  div.className = 'flash-error';
  div.style.cssText = `
    position:fixed; bottom:28px; left:50%; transform:translateX(-50%);
    background:linear-gradient(135deg,#7f1d1d,#991b1b);
    color:#fecaca; padding:14px 28px; border-radius:14px;
    font-size:0.9rem; font-weight:600; z-index:9999;
    box-shadow:0 8px 32px rgba(0,0,0,0.4);
    border:1px solid rgba(254,202,202,0.2);
    animation:fadeUp 0.3s ease;
  `;
  div.textContent = '⚠️  ' + msg;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}


/* ─── INTERSECTION OBSERVER – fade-in feature cards ──────── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.animation = 'fadeUp 0.5s ease forwards';
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.feature-card').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.animationDelay = `${i * 0.1}s`;
  io.observe(card);
});
