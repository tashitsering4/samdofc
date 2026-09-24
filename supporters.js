/* Samdo FC — Our Supporters page. Data comes from supporters-data.js; every total is calculated here. */
(() => {
  const seasons = window.SAMDO_SUPPORTERS || [];
  const abroad = new Set(window.SAMDO_ABROAD || []);
  const fmt = new Intl.NumberFormat('en-IN');
  const npr = n => `NPR ${fmt.format(n)}`;
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const sum = list => list.reduce((t, g) => t + g[2], 0);

  const all = [];
  seasons.forEach(s => s.gifts.forEach((g, i) => all.push({ name: g[0], place: g[1], amount: g[2], photo: g[3] || '', season: s.season, order: all.length })));
  const grand = sum(all.map(x => [0, 0, x.amount]));
  const places = new Set(all.map(x => x.place).filter(Boolean));
  const countries = new Set(all.map(x => abroad.has(x.place) ? x.place : 'Nepal'));

  /* hero total */
  document.getElementById('grandTotal').innerHTML = `<small>NPR</small>${fmt.format(grand)}`;
  document.getElementById('totalFacts').innerHTML =
    `<div><dt>Contributions</dt><dd>${all.length}</dd></div><div><dt>Seasons</dt><dd>${seasons.length}</dd></div><div><dt>Countries</dt><dd>${countries.size}</dd></div>`;

  /* season cards */
  document.getElementById('seasonCards').innerHTML = seasons.map(s =>
    `<a class="s-season" href="#wall" data-season="${s.season}"><span class="s-season-year">${s.season}</span>
      <span class="s-season-meta"><strong>${npr(sum(s.gifts))}</strong><span>${s.gifts.length} contributions · ${esc(s.note)}</span></span>
      <span class="s-season-go">See names →</span></a>`).join('');

  /* where support comes from: top 5 places + everything else */
  const byPlace = {};
  all.forEach(x => { const k = x.place || 'Not stated'; byPlace[k] = byPlace[k] || { total: 0, count: 0 }; byPlace[k].total += x.amount; byPlace[k].count++; });
  let rows = Object.entries(byPlace).sort((a, b) => b[1].total - a[1].total);
  if (rows.length > 6) {
    const rest = rows.slice(5), other = { total: 0, count: 0, names: rest.map(r => r[0]) };
    rest.forEach(r => { other.total += r[1].total; other.count += r[1].count; });
    rows = rows.slice(0, 5).concat([['Other places', other]]);
  }
  const max = Math.max(...rows.map(r => r[1].total));
  const bars = document.getElementById('whereBars');
  bars.innerHTML = rows.map(([name, v]) => {
    const pct = Math.round(v.total / grand * 100);
    const tip = `${esc(name)}${v.names ? ' (' + esc(v.names.join(', ')) + ')' : ''}: <b>${npr(v.total)}</b> · ${v.count} gift${v.count > 1 ? "s" : ""} · ${pct}% of all support`;
    return `<li class="s-bar" tabindex="0" data-tip="${tip.replace(/"/g, '&quot;')}" aria-label="${esc(name)}: ${npr(v.total)}, ${v.count} contribution${v.count > 1 ? 's' : ''}">
      <span class="s-bar-name">${esc(name)}<small>${v.count} gift${v.count > 1 ? 's' : ''}</small></span>
      <span class="s-bar-track"><span class="s-bar-fill" style="--w:${(v.total / max * 100).toFixed(1)}%"></span><span class="s-bar-val">${fmt.format(v.total)}</span></span></li>`;
  }).join('');
  const tipEl = document.createElement('div'); tipEl.className = 's-tip'; tipEl.setAttribute('role', 'tooltip'); document.body.appendChild(tipEl);
  const showTip = (el, x, y) => { tipEl.innerHTML = el.dataset.tip; tipEl.classList.add('on'); const r = tipEl.getBoundingClientRect(); tipEl.style.left = Math.min(window.innerWidth - r.width - 8, Math.max(8, x + 14)) + 'px'; tipEl.style.top = Math.max(8, y - r.height - 12) + 'px'; };
  bars.querySelectorAll('.s-bar').forEach(el => {
    el.addEventListener('mousemove', e => showTip(el, e.clientX, e.clientY));
    el.addEventListener('mouseleave', () => tipEl.classList.remove('on'));
    el.addEventListener('focus', () => { const r = el.getBoundingClientRect(); showTip(el, r.left + r.width / 2, r.top); });
    el.addEventListener('blur', () => tipEl.classList.remove('on'));
  });
  const where = document.querySelector('.s-where');
  if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { where.classList.add('in'); io.disconnect(); } }), { threshold: .3 }); io.observe(where); } else where.classList.add('in');

  /* thank-you wall: season tabs, search and sort */
  const tabs = document.getElementById('seasonTabs'), list = document.getElementById('wallList'), result = document.getElementById('wallResult');
  const search = document.getElementById('wallSearch'), sortSel = document.getElementById('wallSort');
  let current = 'all';
  tabs.innerHTML = `<button type="button" class="s-tab" role="tab" data-s="all" aria-selected="true">All <small>${all.length}</small></button>` +
    seasons.map(s => `<button type="button" class="s-tab" role="tab" data-s="${s.season}" aria-selected="false">${s.season} <small>${s.gifts.length}</small></button>`).join('');
  const initials = n => n.replace(/\(.*?\)/g, '').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  function render() {
    const q = search.value.trim().toLowerCase();
    let items = all.filter(x => (current === 'all' || x.season === current) && (!q || (x.name + ' ' + x.place).toLowerCase().includes(q)));
    if (sortSel.value === 'amount') items.sort((a, b) => b.amount - a.amount || a.order - b.order);
    else if (sortSel.value === 'name') items.sort((a, b) => a.name.localeCompare(b.name));
    const total = items.reduce((t, x) => t + x.amount, 0);
    result.innerHTML = items.length
      ? `Showing <b>${items.length}</b> contribution${items.length > 1 ? 's' : ''}${current === 'all' ? '' : ' in ' + current}${q ? ` matching “${esc(search.value.trim())}”` : ''} · total <b>${npr(total)}</b>`
      : '';
    list.innerHTML = items.length ? items.map((x, i) => `<li class="s-card${abroad.has(x.place) ? ' abroad' : ''}" style="--i:${Math.min(i, 30)}">
        <span class="s-avatar${x.photo ? ' has-photo' : ''}" aria-hidden="true">${x.photo ? `<img src="images/web/supporters/${esc(x.photo)}" alt="" width="96" height="96" loading="lazy" onerror="this.parentNode.classList.remove('has-photo');this.remove()">` : ''}<i>${esc(initials(x.name))}</i></span>
        <span class="s-who"><strong>${esc(x.name)}</strong><span>${esc(x.place)}${current === 'all' ? ` <em>${x.season}</em>` : ''}</span></span>
        <span class="s-amt">${fmt.format(x.amount)}<small>NPR</small></span></li>`).join('')
      : `<li class="s-empty">No supporters match “${esc(search.value.trim())}”. Try another name or place.</li>`;
  }
  function pick(s) { current = s; tabs.querySelectorAll('.s-tab').forEach(t => t.setAttribute('aria-selected', String(t.dataset.s === s))); render(); }
  tabs.addEventListener('click', e => { const t = e.target.closest('.s-tab'); if (t) pick(t.dataset.s); });
  search.addEventListener('input', render);
  sortSel.addEventListener('change', render);
  document.getElementById('seasonCards').addEventListener('click', e => { const a = e.target.closest('.s-season'); if (a) pick(a.dataset.season); });
  render();
})();
