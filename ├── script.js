document.addEventListener('DOMContentLoaded', () => {

  // TYPEWRITER
  const roles = ['Customer Experience Lead','Account Management Specialist','Logistics Tech & Fintech Expert','Fleet Operations Consultant','FASTag & Telematics Specialist','B2B & B2C Growth Driver'];
  const el = document.getElementById('typewriter');
  let ri = 0, ci = 0, del = false;
  function type() {
    const cur = roles[ri];
    el.textContent = del ? cur.substring(0, ci - 1) : cur.substring(0, ci + 1);
    del ? ci-- : ci++;
    let d = del ? 40 : 80;
    if (!del && ci === cur.length) { d = 1800; del = true; }
    else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; d = 400; }
    setTimeout(type, d);
  }
  type();

  // NAV SCROLL
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

  // HAMBURGER
  const ham = document.getElementById('hamburger');
  const links = document.querySelector('.nav__links');
  ham.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  // COUNTERS
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.closest('.metric-card').dataset.count);
      const start = performance.now();
      (function update(now) {
        const p = Math.min((now - start) / 1600, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target).toLocaleString('en-IN');
        if (p < 1) requestAnimationFrame(update);
      })(start);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.counter').forEach(c => counterObs.observe(c));

  // LANG BARS
  const langObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.width + '%'; langObs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll('.lang-bar__fill').forEach(f => langObs.observe(f));

  // FADE UP
  const fadeEls = document.querySelectorAll('.metric-card, .achievement, .product-card, .award-card, .edu-card, .contact-card, .skills__group, .timeline__item');
  fadeEls.forEach(el => el.classList.add('fade-up'));
  document.querySelectorAll('.metrics__grid, .products__grid, .awards__grid, .education__grid, .contact__cards, .skills__grid').forEach(parent => {
    Array.from(parent.children).forEach((c, i) => c.dataset.delay = i);
  });
  const fadeObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      setTimeout(() => e.target.classList.add('visible'), 60 * (e.target.dataset.delay || 0));
      fadeObs.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => fadeObs.observe(el));

  // SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' }); }
    });
  });

  // PARALLAX
  const grid = document.querySelector('.hero__bg-grid');
  if (grid) window.addEventListener('scroll', () => grid.style.transform = `translateY(${window.scrollY * 0.3}px)`);

});
