/* ─────────────────────────────────────────────
   Pedro Barbieri Ramin — main.js (enxuto)
   ───────────────────────────────────────────── */

/* ── TOPBAR: borda/sombra ao rolar ───────────── */
(function initTopbar(){
  const bar = document.getElementById('topbar');
  if (!bar) return;
  const onScroll = () => bar.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
})();

/* ── NAV ATIVA ───────────────────────────────── */
(function initActiveNav(){
  const links = [...document.querySelectorAll('.tb-nav a[href^="#"]')];
  const sections = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length) return;

  function onScroll(){
    const mid = window.scrollY + window.innerHeight * 0.35;
    let active = sections[0];
    sections.forEach(sec => { if (sec.offsetTop <= mid) active = sec; });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + active.id);
    });
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
})();

/* ── REVEAL ON SCROLL ────────────────────────── */
(function initReveal(){
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)){
    items.forEach(el => el.classList.add('on'));
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('on');
        io.unobserve(e.target);
      }
    });
  }, { threshold:0.12 });

  items.forEach(el => io.observe(el));
})();

/* ── COPIAR CONTATO (e-mail / whatsapp) ──────── */
(function initCopy(){
  const toast = document.getElementById('copy-toast');
  document.querySelectorAll('.clink[data-copy]').forEach(el => {
    el.addEventListener('click', e => {
      if (!navigator.clipboard) return;          // deixa o link nativo agir
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
