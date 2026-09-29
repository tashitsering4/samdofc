/* Shared rendering works without third-party animation services. */
const squad = window.SAMDO_SQUAD || [];
const roster = document.querySelector('.players-wrap');
if (roster) {
  const players = location.pathname.endsWith('people.html') ? squad : squad.slice(0, 8);
  roster.innerHTML = players.map(p => `<figure class="polaroid"><div class="art"><img src="${p.image}" alt="${p.name}" width="1122" height="1402" loading="lazy"></div><figcaption><div class="name">${p.name}</div><div class="role">${p.number ? `No. ${p.number}` : p.role}</div></figcaption></figure>`).join('');
  if (players.length < squad.length) roster.insertAdjacentHTML('afterend', '<p class="section-link"><a href="people.html">Meet the full 2026 squad →</a></p>');
}
const cabinet = document.getElementById('cabinet');
if (cabinet && window.SAMDO_TITLES) {
  const clubs = window.SAMDO_CLUBS || {};
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const side = (club, cls) => club
    ? `<div class="fin-team ${cls}"><span class="fin-logo"><img src="${club.logo}" alt="${esc(club.name)} logo" width="96" height="96" loading="lazy"></span><strong>${esc(club.name)}</strong></div>`
    : `<div class="fin-team ${cls} unknown"><span class="fin-logo" aria-hidden="true">?</span><strong>Opponent to be confirmed</strong></div>`;
  const byYear = {};
  const card = (m, i, year) => `<button type="button" class="sq-card" data-year="${year}" data-i="${i}" aria-label="View ${esc(m.name)}${m.role ? ', ' + esc(m.role) : ''} (${year} squad)"><span class="sq-photo"><img src="${m.image}" alt="" width="560" height="700" loading="lazy"><span class="sq-view" aria-hidden="true">View player</span></span><span class="sq-cap"><strong>${esc(m.name)}</strong>${m.role ? `<span>${esc(m.role)}</span>` : ''}</span></button>`;
  const current = squad.map(p => ({ name: p.name, image: p.image, role: !p.number ? 'Coach' : p.role === 'Goalkeeper' ? 'Goalkeeper' : `No. ${p.number}` }));

  cabinet.innerHTML = window.SAMDO_TITLES.slice().reverse().map(t => {
    const members = t.squad === 'current' ? current : t.squad;
    if (members && members.length) byYear[t.year] = { t, members };
    const headNote = t.opponent ? `Final · beat ${esc(t.opponent.name)} ${t.score}` : 'Nubri Manaslu Cup';
    const squadHtml = members && members.length
      ? `<h4 class="sq-title">The ${t.year} squad <span>${members.length}</span></h4><div class="sq-grid">${members.map((m, i) => card(m, i, t.year)).join('')}</div>`
      : `<div class="sq-soon"><strong>Squad coming soon</strong><span>We're working on it. The ${t.year} squad and photos will be added here.</span></div>`;
    return `<details class="trophy-card lit" id="title-${t.year}">
      <summary class="trophy-head"><span class="year">${t.year}</span><span class="ttl"><strong>${esc(t.title)}</strong><span>${headNote}</span></span><span class="chevron">Details +</span></summary>
      <div class="squad-meta">
        <div class="final-box">
          <span class="fin-label">${t.year} Nubri Manaslu Cup final</span>
          <div class="fin-row">${side(clubs.samdo, 'home')}<div class="fin-score">${t.score ? esc(t.score) : '<em>Champions</em>'}</div>${side(t.opponent, 'away')}</div>
          <p class="fin-note">${esc(t.note)}</p>
        </div>
        ${squadHtml}
        ${t.year === '2026' ? '<p class="fin-links"><a href="people.html">Meet the 2026 squad →</a> · <a href="gallery.html">Season photos →</a></p>' : ''}
      </div>
    </details>`;
  }).join('');

  /* ---------- player viewer ---------- */
  const keyOf = m => m.name.trim().toLowerCase() + (m.role === 'Coach' ? '|coach' : '');
  const yearsOf = m => Object.keys(byYear).filter(y => byYear[y].members.some(x => keyOf(x) === keyOf(m))).sort();
  const pv = document.createElement('div');
  pv.className = 'pv'; pv.hidden = true;
  pv.setAttribute('role', 'dialog'); pv.setAttribute('aria-modal', 'true'); pv.setAttribute('aria-label', 'Player viewer');
  pv.innerHTML = `<div class="pv-box">
      <button type="button" class="pv-btn pv-close" aria-label="Close">✕</button>
      <div class="pv-photo"><img alt=""></div>
      <div class="pv-info">
        <span class="pv-kicker"></span>
        <h3 class="pv-name"></h3>
        <p class="pv-role"></p>
        <p class="pv-final"></p>
        <div class="pv-titles"><span class="pv-label">Title squads</span><div class="pv-chips"></div></div>
        <div class="pv-nav"><button type="button" class="pv-btn pv-prev" aria-label="Previous player">←</button><span class="pv-count"></span><button type="button" class="pv-btn pv-next" aria-label="Next player">→</button></div>
      </div>
    </div>`;
  document.body.appendChild(pv);
  const $ = sel => pv.querySelector(sel);
  let curYear = null, curI = 0, opener = null;
  function show(year, i) {
    const { t, members } = byYear[year];
    curYear = year; curI = (i + members.length) % members.length;
    const m = members[curI], years = yearsOf(m);
    $('.pv-photo img').src = m.image; $('.pv-photo img').alt = m.name;
    $('.pv-kicker').textContent = `${year} title squad · ${t.title}`;
    $('.pv-name').textContent = m.name;
    $('.pv-role').textContent = m.role || 'Player';
    $('.pv-final').textContent = t.opponent ? `Final: Samdo FC ${t.score} ${t.opponent.name}` : 'Nubri Manaslu Cup champions';
    $('.pv-label').textContent = years.length > 1 ? `In ${years.length} title squads` : 'Title squad';
    $('.pv-chips').innerHTML = years.map(y => {
      const k = byYear[y].members.findIndex(x => keyOf(x) === keyOf(m));
      return `<button type="button" class="pv-chip${y === year ? ' on' : ''}" data-year="${y}" data-i="${k}" aria-pressed="${y === year}">★ ${y}</button>`;
    }).join('');
    $('.pv-count').textContent = `${curI + 1} / ${members.length}`;
  }
  function open(year, i, el) {
    opener = el; show(year, i); pv.hidden = false;
    requestAnimationFrame(() => pv.classList.add('open'));
    document.body.style.overflow = 'hidden'; $('.pv-close').focus();
  }
  function close() {
    pv.classList.remove('open'); document.body.style.overflow = '';
    setTimeout(() => { pv.hidden = true; }, 200); if (opener) opener.focus();
  }
  cabinet.addEventListener('click', e => { const c = e.target.closest('.sq-card'); if (c) open(c.dataset.year, +c.dataset.i, c); });
  $('.pv-close').addEventListener('click', close);
  $('.pv-prev').addEventListener('click', () => show(curYear, curI - 1));
  $('.pv-next').addEventListener('click', () => show(curYear, curI + 1));
  $('.pv-chips').addEventListener('click', e => { const c = e.target.closest('.pv-chip'); if (c) show(c.dataset.year, +c.dataset.i); });
  pv.addEventListener('click', e => { if (e.target === pv) close(); });
  document.addEventListener('keydown', e => {
    if (pv.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') show(curYear, curI + 1);
    else if (e.key === 'ArrowLeft') show(curYear, curI - 1);
    else if (e.key === 'Tab') { const f = [...pv.querySelectorAll('button')]; const k = f.indexOf(document.activeElement); e.preventDefault(); f[(k + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
  });
  let x0 = null;
  pv.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  pv.addEventListener('touchend', e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) show(curYear, curI + (dx < 0 ? 1 : -1)); x0 = null; });
}
document.getElementById('intro')?.remove();
