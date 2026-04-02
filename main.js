/* ─────────────────────────────────────────────
   PBR-SYS // main.js
   ───────────────────────────────────────────── */

/* ── CURSOR ──────────────────────────────────── */
(function initCursor() {
  const cur = document.getElementById('cur');
  const ring = document.getElementById('cur-ring');
  if (!cur || !ring) return;

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  });

  // ring follows with lag
  function animateRing() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // hover state
  document.querySelectorAll('a,button,[data-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
  });
})();

/* ── CURSOR TRAIL ────────────────────────────── */
(function initTrail() {
  const TRAIL = 6;
  const dots = [];
  for (let i = 0; i < TRAIL; i++) {
    const d = document.createElement('div');
    d.className = 'cur-trail';
    d.style.opacity = (1 - i / TRAIL) * 0.35;
    d.style.width = d.style.height = (4 - i * 0.5) + 'px';
    document.body.appendChild(d);
    dots.push({ el: d, x: 0, y: 0 });
  }

  let head = { x: 0, y: 0 };
  document.addEventListener('mousemove', e => {
    head.x = e.clientX;
    head.y = e.clientY;
  });

  function tick() {
    let px = head.x, py = head.y;
    dots.forEach((dot, i) => {
      dot.x += (px - dot.x) * (0.35 - i * 0.04);
      dot.y += (py - dot.y) * (0.35 - i * 0.04);
      dot.el.style.left = dot.x + 'px';
      dot.el.style.top  = dot.y + 'px';
      dot.el.style.opacity = (1 - i / dots.length) * 0.28;
      px = dot.x; py = dot.y;
    });
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ── LOADER ──────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  const pct    = document.querySelector('.ld-pct');
  if (!loader) return;

  let n = 0;
  const total = 1200;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    n = Math.min(100, Math.round((elapsed / total) * 100));
    if (pct) pct.textContent = n + '%';
    if (n < 100) {
      requestAnimationFrame(tick);
    } else {
      setTimeout(() => {
        loader.classList.add('done');
        setTimeout(() => loader.remove(), 700);
      }, 100);
    }
  }
  requestAnimationFrame(tick);
})();

/* ── SCROLL PROGRESS ─────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ── ACTIVE NAV ──────────────────────────────── */
(function initActiveNav() {
  const navLinks = document.querySelectorAll('.tb-nav[href^="#"]');
  const sections = [...navLinks].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  function onScroll() {
    const mid = window.scrollY + window.innerHeight * 0.4;
    let active = sections[0];
    sections.forEach(sec => { if (sec.offsetTop <= mid) active = sec; });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + active.id);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── HERO PARALLAX ───────────────────────────── */
(function initParallax() {
  const grid = document.querySelector('.h-grid');
  const glow = document.querySelector('.h-glow');
  if (!grid || !glow) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      grid.style.transform = `translateY(${y * 0.15}px)`;
      glow.style.transform = `translateY(${y * 0.08}px)`;
      ticking = false;
    });
  }, { passive: true });
})();

/* ── REVEAL ON SCROLL ────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .reveal-scale, .reveal-blur');
  if (!items.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('on');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => io.observe(el));
})();

/* ── SECTION LABEL LINE-DRAW ────────────────── */
(function initSectionLabels() {
  const labels = document.querySelectorAll('.sec-label');
  if (!labels.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('on');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  labels.forEach(el => io.observe(el));
})();

/* ── SKILL BARS ──────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.sk-bar');
  if (!bars.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('anim');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => io.observe(bar));
})();

/* ── METRIC COUNTER ANIMATION ────────────────── */
(function initCounters() {
  const vals = document.querySelectorAll('.metric-val[data-count]');
  if (!vals.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el    = e.target;
      const end   = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur   = 1200;
      const start = performance.now();
      const isInt = Number.isInteger(end);

      function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        const cur  = end * ease;
        el.textContent = (isInt ? Math.round(cur) : cur.toFixed(1)) + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = end + suffix;
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  vals.forEach(el => io.observe(el));
})();

/* ── COPY TO CLIPBOARD (contact links) ──────── */
(function initCopy() {
  const toast = document.getElementById('copy-toast');
  document.querySelectorAll('.clink[data-copy]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const val = el.dataset.copy;
      navigator.clipboard.writeText(val).then(() => {
        if (!toast) return;
        toast.textContent = 'Copiado: ' + val;
        toast.classList.add('show');
        clearTimeout(toast._t);
        toast._t = setTimeout(() => toast.classList.remove('show'), 2200);
      });
    });
  });
})();

/* ── LIVE CLOCK in topbar / footer ──────────── */
(function initClock() {
  const el = document.getElementById('live-time');
  if (!el) return;
  function update() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    el.textContent = hh + ':' + mm + ':' + ss;
  }
  update();
  setInterval(update, 1000);
})();
