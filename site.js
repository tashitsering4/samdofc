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
  const card = m => `<figure class="sq-card"><img src="${m.image}" alt="${esc(m.name)}" width="560" height="700" loading="lazy"><figcaption><strong>${esc(m.name)}</strong>${m.role ? `<span>${esc(m.role)}</span>` : ''}</figcaption></figure>`;
  const current = squad.map(p => ({ name: p.name, image: p.image, role: !p.number ? 'Coach' : p.role === 'Goalkeeper' ? 'Goalkeeper' : `No. ${p.number}` }));

  cabinet.innerHTML = window.SAMDO_TITLES.slice().reverse().map(t => {
    const members = t.squad === 'current' ? current : t.squad;
    const headNote = t.opponent ? `Final · beat ${esc(t.opponent.name)} ${t.score}` : 'Nubri Manaslu Cup';
    const squadHtml = members && members.length
      ? `<h4 class="sq-title">The ${t.year} squad <span>${members.length}</span></h4><div class="sq-grid">${members.map(card).join('')}</div>`
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
}
document.getElementById('intro')?.remove();
