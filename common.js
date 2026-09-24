/* Shared helpers for Samdo FC standalone chapter pages */
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('chapterNav');
  if (nav) {
    const links = nav.querySelector('.nav-links');
    links.id = 'site-menu';
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'menu-toggle';
    toggle.textContent = 'Menu';
    toggle.setAttribute('aria-controls', links.id);
    nav.insertBefore(toggle, links);
    const narrow = window.matchMedia('(max-width:1100px)');
    function resetMenu() { links.hidden = narrow.matches; toggle.setAttribute('aria-expanded', String(!links.hidden)); }
    resetMenu();
    narrow.addEventListener('change', resetMenu);
    toggle.addEventListener('click', () => { links.hidden = !links.hidden; toggle.setAttribute('aria-expanded', String(!links.hidden)); });
    nav.addEventListener('keydown', e => { if (e.key === 'Escape' && narrow.matches) { resetMenu(); toggle.focus(); } });
    nav.querySelector('a.active')?.setAttribute('aria-current', 'page');
  }

  /* subtle fade-up for page headers/chapter heads, skipped if GSAP isn't loaded */
  if(window.gsap){
    gsap.utils.toArray('.page-hero, .chapter-head').forEach(el => {
      gsap.from(el, {opacity:0, y:24, duration:0.9, ease:'power2.out'});
    });
  }

  /* copy-to-clipboard for any button with [data-copy] (used on the Future/Support page) */
  document.querySelectorAll('.copy-btn').forEach(btn => {
    const original = btn.textContent;
    btn.addEventListener('click', async () => {
      const value = btn.dataset.copy;
      try{
        await navigator.clipboard.writeText(value);
      }catch(e){
        const ta = document.createElement('textarea');
        ta.value = value; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta);
      }
      btn.textContent = 'Copied ✓';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = original; btn.classList.remove('copied'); }, 1800);
    });
  });

});
