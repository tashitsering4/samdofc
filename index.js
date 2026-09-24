/* Samdo FC — homepage & Our Story interactions (no external libraries). */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* opening intro: plays once per visit, then fades away (skip with the button, a click or Esc) */
  const intro = document.getElementById('siteIntro');
  if (intro && !document.documentElement.classList.contains('no-intro')) {
    document.body.classList.add('intro-open');
    const skip = document.getElementById('skipIntro');
    skip.tabIndex = 0;
    let closed = false;
    const close = () => {
      if (closed) return; closed = true;
      intro.classList.add('done');
      document.body.classList.remove('intro-open');
      try { sessionStorage.setItem('samdoIntroSeen', '1'); } catch (e) {}
      setTimeout(() => intro.remove(), 800);
      document.removeEventListener('keydown', onKey);
    };
    const onKey = e => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') close(); };
    skip.addEventListener('click', close);
    intro.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    setTimeout(close, 6300);
  } else if (intro) { intro.remove(); }

  /* nav turns solid once the page scrolls past the top */
  const nav = document.getElementById('chapterNav');
  const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* squad rail, built from squad-data.js (web-sized images, original as fallback) */
  const rail = document.getElementById('squadRail');
  const squad = window.SAMDO_SQUAD || [];
  if (rail && squad.length) {
    const webSrc = p => p.image;
    rail.innerHTML = squad.map(p => {
      const detail = !p.number ? 'Coach' : p.role === 'Goalkeeper' ? `No. ${p.number} · Goalkeeper` : `No. ${p.number}`;
      return `<a class="player" href="people.html"><img src="${webSrc(p)}" data-fallback="${p.image}" alt="${p.name}" width="560" height="700" loading="lazy"><strong>${p.name}</strong><span>${detail}</span></a>`;
    }).join('');
    rail.querySelectorAll('img').forEach(img => img.addEventListener('error', () => {
      if (img.dataset.fallback && !img.src.includes(img.dataset.fallback)) img.src = img.dataset.fallback;
    }, { once: true }));
    document.querySelectorAll('.arrow').forEach(btn => btn.addEventListener('click', () => {
      const card = rail.querySelector('.player');
      const by = card ? (card.offsetWidth + 19) * 2 : 440;
      rail.scrollBy({ left: by * Number(btn.dataset.dir), behavior: reduce ? 'auto' : 'smooth' });
    }));
  }

  /* gentle fade-in as sections enter the screen */
  const targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { targets.forEach(el => el.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  targets.forEach(el => io.observe(el));
})();
