/* ════════════════════════════════════════════
   ÆRÆ · FULLPAGE IMMERSIVE SYSTEM · JS  v2.0
   Corrections scroll v8 :
   - Seuil wheel augmenté (180→280) + cooldown strict
   - Scroll interne section détecté correctement
   - Anchor links compatibles fullpage
   - Momentum scroll mobile amélioré
   - Throttle rAF sur la détection wheel
   ════════════════════════════════════════════ */
(function(){
'use strict';

/* ── Config sections ─────────────────────────── */
const CFG = [
  {id:'accueil',      label:'01 · Accueil',      accent:'#5AACFF', fx:'vortex',  el:null},
  {id:'pourqui',      label:'02 · Le problème',  accent:'#FF6B6B', fx:'burst',   el:null},
  {id:'valeur',       label:'03 · La solution',  accent:'#22C98A', fx:'rise',    el:null},
  {id:'temoignages',  label:'04 · Témoignages',  accent:'#FFD060', fx:'sparkle', el:null},
  {id:'services',     label:'05 · Savoir-faire', accent:'#5AACFF', fx:'cascade', el:null},
  {id:'realisations', label:'06 · Réalisations', accent:'#5AACFF', fx:'ripple',  el:null},
  {id:'apropos',      label:'07 · Philosophie',  accent:'#A78BFA', fx:'drift',   el:null},
  {id:'methode',      label:'08 · Méthode',      accent:'#FFD060', fx:'pulse',   el:null},
  {id:'prestations',  label:'09 · Prestations',  accent:'#A78BFA', fx:'cascade', el:null},
  {id:'formules',     label:'10 · Formules',     accent:'#FFD060', fx:'rain',    el:null},
  {id:'options',      label:'11 · Options',      accent:'#5AACFF', fx:'fade',    el:null},
  {id:'faq',          label:'12 · FAQ',          accent:'#5AACFF', fx:'fade',    el:null},
  {id:'contact',      label:'13 · Contact',      accent:'#5AACFF', fx:'vortex',  el:null},
  {id:'__footer__',   label:'14 · Studio',       accent:'#5AACFF', fx:'fade',    el:null},
];

/* ── DOM ─────────────────────────────────────── */
const canvas = document.getElementById('fp-canvas');
const flash  = document.getElementById('fp-flash');
const bar    = document.getElementById('fp-bar');
const info   = document.getElementById('fp-info');
const nav    = document.getElementById('fp-nav');
const ctx    = canvas.getContext('2d');
let W, H;

function rsz(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
rsz();
window.addEventListener('resize', rsz, { passive: true });

/* ── Sections DOM ────────────────────────────── */
const footerEl = document.querySelector('footer[role="contentinfo"]');
const secs = CFG.map(c => {
  const el = c.id === '__footer__' ? footerEl : document.getElementById(c.id);
  return el ? {...c, el} : null;
}).filter(Boolean);

let cur = 0, busy = false;
const revealed = new Set();

/* ══════════════════════════════════════════════
   PARTICLES
══════════════════════════════════════════════ */
class P {
  constructor(x, y, acc, type) {
    this.acc = acc; this.type = type; this.life = 1;
    this.size = 1 + Math.random() * 3.5;
    const a = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 4;
    switch (type) {
      case 'rise':
        this.x = (Math.random() - .5) * W + W / 2; this.y = H * .7 + Math.random() * H * .3;
        this.vx = (Math.random() - .5) * .5; this.vy = -(1.5 + Math.random() * 2.5); break;
      case 'rain':
        this.x = Math.random() * W; this.y = -20 - Math.random() * H * .4;
        this.vx = (Math.random() - .5) * .4; this.vy = 3 + Math.random() * 4; break;
      case 'vortex':
        const r = 30 + Math.random() * 200, ang = Math.random() * Math.PI * 2;
        this.x = W / 2 + Math.cos(ang) * r; this.y = H / 2 + Math.sin(ang) * r;
        this.vx = -Math.sin(ang) * (1.5 + Math.random() * 2.5);
        this.vy =  Math.cos(ang) * (1.5 + Math.random() * 2.5); break;
      case 'drift':
        this.x = (Math.random() - .5) * W + W / 2; this.y = H * .5 + Math.random() * H * .4;
        this.vx = (Math.random() - .5) * 1.2; this.vy = -(0.3 + Math.random() * .9); break;
      case 'fade':
        this.x = Math.random() * W; this.y = Math.random() * H;
        this.vx = (Math.random() - .5) * .8; this.vy = (Math.random() - .5) * .8; break;
      default:
        this.x = x; this.y = y;
        this.vx = Math.cos(a) * sp; this.vy = Math.sin(a) * sp;
        if (type === 'cascade') { this.x = Math.random() * W; this.y = H * .3 + Math.random() * H * .4; }
    }
    this.dec = .010 + Math.random() * .016;
  }
  tick() {
    this.x += this.vx; this.y += this.vy;
    if (this.type === 'burst' || this.type === 'sparkle') { this.vx *= .93; this.vy *= .93; this.vy += .05; }
    if (this.type === 'vortex') { this.vx *= .97; this.vy *= .97; }
    this.life -= this.dec;
  }
  draw() {
    if (this.life <= 0) return;
    ctx.save(); ctx.globalAlpha = Math.max(0, this.life) * .72;
    ctx.fillStyle = this.acc;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

class Ripple {
  constructor(x, y, acc) { this.x = x; this.y = y; this.acc = acc; this.r = 0; this.life = 1; }
  tick() { this.r += 15; this.life -= .028; }
  draw() {
    if (this.life <= 0) return;
    ctx.save(); ctx.globalAlpha = Math.max(0, this.life) * .45;
    ctx.strokeStyle = this.acc; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
}

let pool = [], ripples = [], flashAl = 0, flashCol = '#5AACFF';

function spawnFX(type, accent, cx, cy) {
  cx = cx || W / 2; cy = cy || H * .45;
  const N = { burst:110, rise:130, rain:150, vortex:110, drift:90, sparkle:100, cascade:90, ripple:70, pulse:65, fade:45 };
  for (let i = 0; i < (N[type] || 80); i++) pool.push(new P(cx, cy, accent, type));
  if (['burst','vortex','ripple','pulse','sparkle'].includes(type)) {
    ripples.push(new Ripple(cx, cy, accent));
    setTimeout(() => ripples.push(new Ripple(cx, cy, accent)), 200);
    setTimeout(() => ripples.push(new Ripple(cx, cy, accent)), 400);
  }
  flashAl = type === 'fade' ? .08 : type === 'pulse' ? .1 : .28;
  flashCol = accent;
}

/* ── Render ──────────────────────────────────── */
(function render() {
  requestAnimationFrame(render);
  ctx.clearRect(0, 0, W, H);
  if (flashAl > 0) {
    flash.style.background = flashCol;
    flash.style.opacity = Math.min(.99, flashAl);
    flashAl = Math.max(0, flashAl - .022);
  } else { flash.style.opacity = 0; }
  ripples = ripples.filter(r => { r.tick(); r.draw(); return r.life > 0 && r.r < Math.max(W, H); });
  pool    = pool.filter(p => { p.tick(); p.draw(); return p.life > 0; });
})();

/* ── Reveal contenu section ──────────────────── */
function revealSection(sec) {
  if (revealed.has(sec.id)) return;
  revealed.add(sec.id);
  const el = sec.el;
  const lines = [...el.querySelectorAll('.hero-title-line')];
  const texts = [...el.querySelectorAll('.hero-overline,.hero-subtitle,.hero-actions,.hero-stat,.hero-visual,.hero-card,.reveal-text,.sol-banner,.svc-xp-block')];
  const cards = [...el.querySelectorAll('.reveal-card')];
  let delay = 0;
  lines.forEach(l => { setTimeout(() => l.classList.add('fp-in'), delay); delay += 120; });
  texts.forEach(t => {
    if (!lines.includes(t)) { setTimeout(() => t.classList.add('fp-in'), delay); delay += 90; }
  });
  cards.forEach((c, i) => { setTimeout(() => c.classList.add('fp-in'), delay + i * 100); });
}

/* ── Transition ──────────────────────────────── */
function go(next) {
  if (busy) return;
  next = ((next % secs.length) + secs.length) % secs.length;
  if (next === cur) return;
  busy = true;

  const goDown  = next > cur || (cur === secs.length - 1 && next === 0);
  const prevSec = secs[cur];
  const nextSec = secs[next];

  /* Réinitialiser le scroll interne de la section qui quitte */
  if (prevSec.el.scrollTop > 0) prevSec.el.scrollTop = 0;

  prevSec.el.classList.remove('fp-active');
  prevSec.el.classList.add(goDown ? 'fp-to-top' : 'fp-to-bot');
  nextSec.el.classList.remove('fp-to-top', 'fp-to-bot', 'fp-from-top', 'fp-from-bot');
  nextSec.el.classList.add(goDown ? 'fp-from-bot' : 'fp-from-top');

  spawnFX(nextSec.fx, nextSec.accent, W / 2, H * .45);

  bar.style.width    = Math.round((next / (secs.length - 1)) * 100) + '%';
  bar.style.background = nextSec.accent;
  info.textContent   = nextSec.label;
  info.style.color   = nextSec.accent;
  info.style.opacity = '1';

  requestAnimationFrame(() => requestAnimationFrame(() => {
    nextSec.el.classList.add('fp-active');
    nextSec.el.classList.remove('fp-from-bot', 'fp-from-top');
    setTimeout(() => {
      prevSec.el.classList.remove('fp-to-top', 'fp-to-bot');
      revealSection(nextSec);
      cur = next;
      /* ── Cooldown strict post-transition ── */
      setTimeout(() => { busy = false; }, 350);
    }, 640);
  }));
}

/* ── Init ────────────────────────────────────── */
secs.forEach(s => s.el.classList.remove('fp-active'));
secs[0].el.classList.add('fp-active');
bar.style.width      = '0%';
bar.style.background = secs[0].accent;
info.textContent     = secs[0].label;
info.style.color     = secs[0].accent;

setTimeout(() => {
  info.style.opacity = '1';
  nav.style.opacity  = '1';
  revealSection(secs[0]);
}, 900);

/* ══════════════════════════════════════════════
   SCROLL — détection interne vs changement slide
   ══════════════════════════════════════════════
   Logique :
   1. Si busy → tout bloquer
   2. Vérifier si la section active a encore du contenu
      à scroller dans la direction demandée
   3. Si oui → laisser le scroll interne se faire
   4. Si non (atTop/atBot) → accumuler delta jusqu'au seuil
*/

/* Seuil intentionnellement haut pour éviter les double-sauts */
const WHEEL_THRESH    = 280;   /* px accumulés avant changement slide */
const WHEEL_COOLDOWN  = 900;   /* ms minimum entre deux slides */
const INNER_SLACK     = 4;     /* px de tolérance bords section */

let wheelDelta  = 0;
let lastSlide   = 0;           /* timestamp dernier changement slide */
let wheelPending = false;

function isSectionScrollable(el, dir) {
  /* dir > 0 = vers le bas, dir < 0 = vers le haut */
  if (el.scrollHeight <= el.clientHeight + INNER_SLACK) return false;
  if (dir > 0) return el.scrollTop < el.scrollHeight - el.clientHeight - INNER_SLACK;
  if (dir < 0) return el.scrollTop > INNER_SLACK;
  return false;
}

window.addEventListener('wheel', function(e) {
  /* Toujours prévenir le scroll de page (html/body overflow:hidden) */
  e.preventDefault();

  if (busy) return;

  const now = Date.now();
  const sec = secs[cur]?.el;
  const dir = e.deltaY;

  /* ── Si la section peut encore scroller dans cette direction ── */
  if (sec && isSectionScrollable(sec, dir)) {
    /* Laisser le scroll interne se faire — ne pas accumuler */
    sec.scrollTop += dir;
    wheelDelta = 0;
    return;
  }

  /* ── Accumuler le delta ── */
  if (!wheelPending) {
    wheelPending = true;
    wheelDelta   = 0;
  }
  wheelDelta += dir;

  /* ── Déclencher si seuil atteint ET cooldown écoulé ── */
  if (Math.abs(wheelDelta) >= WHEEL_THRESH && now - lastSlide >= WHEEL_COOLDOWN) {
    const direction = wheelDelta > 0 ? 1 : -1;
    wheelDelta      = 0;
    wheelPending    = false;
    lastSlide       = now;
    go(cur + direction);
  }

  /* ── Reset si inactivité ── */
  clearTimeout(window._wheelTimer);
  window._wheelTimer = setTimeout(function() {
    wheelDelta   = 0;
    wheelPending = false;
  }, 600);

}, { passive: false });

/* ══════════════════════════════════════════════
   TOUCH — momentum natif + détection bords
══════════════════════════════════════════════ */
let touchY0 = 0, touchY1 = 0, touchScrolled = false;

window.addEventListener('touchstart', function(e) {
  touchY0 = e.touches[0].clientY;
  touchY1 = touchY0;
  touchScrolled = false;
}, { passive: true });

window.addEventListener('touchmove', function(e) {
  const sec = secs[cur]?.el;
  const dy  = touchY0 - e.touches[0].clientY;
  touchY1   = e.touches[0].clientY;

  /* Si la section peut scroller → laisser faire le scroll natif */
  if (sec && isSectionScrollable(sec, dy)) {
    touchScrolled = true;
    return; /* pas de preventDefault → scroll natif */
  }
  /* Sinon bloquer le scroll de page */
  e.preventDefault();
}, { passive: false });

window.addEventListener('touchend', function(e) {
  if (busy) return;
  /* Si on a scrollé à l'intérieur → ne pas changer de slide */
  if (touchScrolled) { touchScrolled = false; return; }

  const dy  = touchY0 - e.changedTouches[0].clientY;
  const now = Date.now();

  if (Math.abs(dy) < 50) return; /* swipe trop court */
  if (now - lastSlide < WHEEL_COOLDOWN) return;

  const sec = secs[cur]?.el;
  /* Vérifier les bords */
  if (sec) {
    if (dy > 0 && isSectionScrollable(sec, 1)) return;  /* pas encore au bas */
    if (dy < 0 && isSectionScrollable(sec, -1)) return; /* pas encore au haut */
  }

  lastSlide = now;
  go(dy > 0 ? cur + 1 : cur - 1);
}, { passive: true });

/* ── Clavier ─────────────────────────────────── */
window.addEventListener('keydown', function(e) {
  if (busy) return;
  /* Ignorer si un input/textarea est focalisé */
  const tag = document.activeElement?.tagName?.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

  const now = Date.now();
  if (now - lastSlide < 500) return;

  if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); lastSlide = now; go(cur + 1); }
  if (e.key === 'ArrowUp'   || e.key === 'PageUp')   { e.preventDefault(); lastSlide = now; go(cur - 1); }
  if (e.key === 'Home')                               { e.preventDefault(); lastSlide = now; go(0); }
  if (e.key === 'End')                                { e.preventDefault(); lastSlide = now; go(secs.length - 1); }
});

/* ── Liens ancres — compatibilité fullpage ───── */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  const hash  = a.getAttribute('href').slice(1);
  const idx   = secs.findIndex(function(s) { return s.id === hash; });
  if (idx >= 0) {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      go(idx);
    });
  }
});

/* ── Nav arrows ──────────────────────────────── */
const arrUp = document.querySelector('#fp-nav .arr-up');
const arrDn = document.querySelector('#fp-nav .arr-dn');
if (arrUp) arrUp.addEventListener('click', function() { go(cur - 1); });
if (arrDn) arrDn.addEventListener('click', function() { go(cur + 1); });

})();
