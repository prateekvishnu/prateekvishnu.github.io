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
