/* Samdo FC gallery: season filter, masonry grid and a full-screen viewer. Data comes from gallery-data.js. */
(() => {
  const seasons = window.SAMDO_GALLERY || [];
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const big = (s, p) => `images/gallery/${s.id}/${p[0]}.jpg`;
  const small = (s, p) => `images/gallery/${s.id}/${p[0]}-t.jpg`;
  const all = [];
  seasons.forEach(s => s.photos.forEach(p => all.push({ s, p })));

  /* hero: count badges and a drifting mosaic of photos */
  const titles = seasons.filter(s => s.tag === 'Champions').length;
  document.getElementById('gCount').innerHTML =
    `<span><b>${all.length}</b> photos</span><span><b>${seasons.length}</b> seasons</span><span><b>${titles}</b> title years</span>`;
  const mosaic = document.getElementById('heroMosaic');
  const picks = all.filter((_, i) => i % 2 === 0).slice(0, 18);
  mosaic.innerHTML = picks.map(x => `<img src="${small(x.s, x.p)}" alt="" loading="lazy">`).join('');

  /* season chips */
  const filter = document.getElementById('gFilter');
  filter.innerHTML = `<button type="button" class="g-chip" role="tab" aria-selected="true" data-id="all">All <small>${all.length}</small></button>` +
    seasons.map(s => `<button type="button" class="g-chip" role="tab" aria-selected="false" data-id="${s.id}">${s.tag === 'Champions' ? '<span class="star" aria-hidden="true">★</span>' : ''}${esc(s.label)} <small>${s.photos.length}</small></button>`).join('');

  /* year sections */
  const years = document.getElementById('gYears');
  let idx = 0;
  years.innerHTML = seasons.map(s => `
    <section class="g-year wrap" id="y${s.id}" data-id="${s.id}" aria-labelledby="h${s.id}">
      <div class="g-year-head">
        <h2 class="g-year-big" id="h${s.id}">${esc(s.label)}</h2>
        <div class="g-year-meta"><span class="g-badge${s.tag === 'Champions' ? '' : ' plain'}">${s.tag === 'Champions' ? '★ ' : ''}${esc(s.tag)}</span><p>${esc(s.sub)}</p></div>
        <span class="g-year-count">${s.photos.length} photo${s.photos.length > 1 ? 's' : ''}</span>
      </div>
      <div class="g-grid">
        ${s.photos.map(p => `<button type="button" class="g-item" data-i="${idx++}" aria-label="Open photo: ${esc(p[1])}">
          <img src="${small(s, p)}" alt="${esc(p[1])}" width="${p[2]}" height="${p[3]}" loading="lazy">
          <span class="g-cap">${esc(p[1])}</span></button>`).join('')}
      </div>
    </section>`).join('') +
    `<section class="g-end"><h2>Have a photo we're missing?</h2><p>Send it to us on WhatsApp and help us complete the story of Samdo FC.</p><a class="btn" href="https://wa.me/9779843738367" target="_blank" rel="noopener">Share a photo</a></section>`;

  /* filter behaviour: All shows everything; a season shows only that season */
  const chips = [...filter.querySelectorAll('.g-chip')];
  const sections = [...years.querySelectorAll('.g-year')];
  function show(id, scroll) {
    chips.forEach(c => c.setAttribute('aria-selected', String(c.dataset.id === id)));
    sections.forEach(sec => { sec.hidden = id !== 'all' && sec.dataset.id !== id; });
    sections.forEach(sec => sec.querySelectorAll('.g-item').forEach(el => el.classList.add('in')));
    if (scroll) {
      const top = filter.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
    }
    try { history.replaceState(null, '', id === 'all' ? location.pathname : '#y' + id); } catch (e) {}
  }
  chips.forEach(c => c.addEventListener('click', () => {
    show(c.dataset.id, true);
    filter.scrollTo({ left: c.offsetLeft - (filter.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' });
  }));
  const start = (location.hash.match(/^#y(.+)$/) || [])[1];
  if (start && seasons.some(s => s.id === start)) show(start, false);

  /* fade photos in as they appear */
  const items = [...years.querySelectorAll('.g-item')];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -30px 0px' });
    items.forEach(el => io.observe(el));
  } else items.forEach(el => el.classList.add('in'));

  /* lightbox */
  const lb = document.getElementById('lightbox'), img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCap'), yr = document.getElementById('lbYear'), num = document.getElementById('lbNum');
  let cur = 0, opener = null, list = all.map((x, i) => i);
  function visibleList() { return items.filter(el => !el.closest('.g-year').hidden).map(el => +el.dataset.i); }
  function render() {
    const { s, p } = all[list[cur]];
    img.src = big(s, p); img.alt = p[1];
    cap.textContent = p[1]; yr.textContent = s.label; num.textContent = `${cur + 1} / ${list.length}`;
    [list[cur + 1], list[cur - 1]].forEach(k => { if (k != null) { const x = all[k]; new Image().src = big(x.s, x.p); } });
  }
  function open(i, el) {
    list = visibleList(); cur = Math.max(0, list.indexOf(i)); opener = el;
    render(); lb.hidden = false; requestAnimationFrame(() => lb.classList.add('open'));
    document.body.classList.add('lb-open'); document.getElementById('lbClose').focus();
  }
  function close() { lb.classList.remove('open'); document.body.classList.remove('lb-open'); setTimeout(() => { lb.hidden = true; img.src = ''; }, 200); opener && opener.focus(); }
  const step = d => { cur = (cur + d + list.length) % list.length; render(); };
  years.addEventListener('click', e => { const el = e.target.closest('.g-item'); if (el) open(+el.dataset.i, el); });
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', () => step(-1));
  document.getElementById('lbNext').addEventListener('click', () => step(1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'Tab') { const f = [...lb.querySelectorAll('button')]; const k = f.indexOf(document.activeElement); e.preventDefault(); f[(k + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
  });
  let x0 = null;
  lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); x0 = null; });
})();
/* keep the season bar just under the fixed menu bar */
(() => { const nav = document.getElementById('chapterNav'); const set = () => nav && document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px'); set(); window.addEventListener('resize', set); window.addEventListener('scroll', set, { passive: true }); })();
