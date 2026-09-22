const root = document.documentElement;
const toggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const nav = document.querySelector('.nav');

// Theme: 'system' (default) follows the OS and updates live; 'light'/'dark' are explicit picks.
const ORDER = ['system', 'light', 'dark'];
const GLYPH = { system: '◐', light: '○', dark: '●' };
const media = window.matchMedia('(prefers-color-scheme: dark)');
function readPref() { try { return localStorage.getItem('vk-theme') || 'system'; } catch (e) { return 'system'; } }
function applyTheme(pref) {
  const dark = pref === 'dark' || (pref === 'system' && media.matches);
  root.dataset.theme = dark ? 'dark' : 'light';
  root.dataset.themePref = pref;
  if (toggle) {
    toggle.textContent = GLYPH[pref];
    toggle.setAttribute('aria-label', `Theme: ${pref}`);
    toggle.title = `Theme: ${pref} (click to cycle)`;
  }
}
applyTheme(readPref());
media.addEventListener('change', () => { if (readPref() === 'system') applyTheme('system'); });
toggle?.addEventListener('click', () => {
  const next = ORDER[(ORDER.indexOf(readPref()) + 1) % ORDER.length];
  try { if (next === 'system') localStorage.removeItem('vk-theme'); else localStorage.setItem('vk-theme', next); } catch (e) {}
  applyTheme(next);
});

// Mobile nav
menuToggle?.addEventListener('click', () => {
  const open = nav?.classList.toggle('nav-open') ?? false;
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('nav-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open navigation');
}));

// Accordion: keep only one open, swap the +/− glyph.
document.querySelectorAll('.accordion-list details').forEach((d) => {
  d.addEventListener('toggle', () => {
    const b = d.querySelector('summary b');
    if (b) b.textContent = d.open ? '−' : '＋';
    if (d.open) document.querySelectorAll('.accordion-list details').forEach((o) => { if (o !== d) o.open = false; });
  });
});

// Side nav: highlight the section whose top is above the viewport midpoint; invert colors over dark sections.
const sideNav = document.querySelector('.side-nav');
if (sideNav) {
  const links = [...sideNav.querySelectorAll('a')];
  const hero = document.querySelector('.hero');
  const items = links.map((a) => ({ a, id: a.dataset.section, el: a.dataset.section === 'top' ? hero : document.getElementById(a.dataset.section) })).filter((x) => x.el);
  const darkIds = new Set(['projects', 'contact']);
  let current = null;
  const update = () => {
    const mid = window.scrollY + window.innerHeight * 0.45;
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    let active = items[0];
    for (const it of items) if (it.el.getBoundingClientRect().top + window.scrollY <= mid) active = it;
    if (atBottom) active = items[items.length - 1];
    if (active.id === current) return;
    current = active.id;
    links.forEach((l) => l.classList.toggle('active', l === active.a));
    sideNav.classList.toggle('on-dark', darkIds.has(active.id));
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// More projects: staggered reveal when the grid scrolls into view.
const moreCards = document.querySelectorAll('.more-card');
if (moreCards.length) {
  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    moreCards.forEach((card) => reveal.observe(card));
  } else {
    moreCards.forEach((card) => card.classList.add('in'));
  }
}
