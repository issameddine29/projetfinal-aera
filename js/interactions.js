/* ================================================================
   ÆRĀ STUDIO — interactions.js  v2.0  (corrigé)
   ================================================================
   Ordre de chargement : après main.js et cinema.js (defer)
   Pas de conflit avec : GSAP, carousel, FAQ accordion de main.js,
   reveal system de styles.css, hero animations de cinema.js
   ================================================================ */

(function () {
  'use strict';

  const PRM  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOB  = window.innerWidth < 768;
  const EASE = 'cubic-bezier(0.23,1,0.32,1)';

  /* ═══════════════════════════════════════════════════════════════
     0. CSS RUNTIME
  ═══════════════════════════════════════════════════════════════ */
  (function injectCSS() {
    if (document.getElementById('aera-ix-style')) return;
    const s = document.createElement('style');
    s.id = 'aera-ix-style';
    s.textContent = `
      @keyframes ix-ripple { to { transform:scale(1); opacity:0; } }
      .ix-ripple {
        position:absolute; border-radius:50%; pointer-events:none;
        background:rgba(255,255,255,0.18);
        transform:scale(0); opacity:1; z-index:10;
        animation:ix-ripple 0.65s ${EASE} forwards;
      }

      .ix-cursor {
        display:inline-block; width:2px; height:1em;
        background:var(--terra); margin-left:1px;
        vertical-align:text-bottom;
        animation:ix-blink 0.7s step-end infinite;
      }
      @keyframes ix-blink { 0%,100%{opacity:1} 50%{opacity:0} }

      .ix-scroll-hint {
        position:absolute; bottom:28px; left:50%;
        transform:translateX(-50%);
        color:var(--text-muted);
        opacity:1; transition:opacity 0.5s ease;
        animation:ix-bounce 2s ease-in-out infinite;
        cursor:pointer; z-index:5; pointer-events:auto;
        display:flex; align-items:center; justify-content:center;
      }
      .ix-scroll-hint.hidden { opacity:0; pointer-events:none; }
      @keyframes ix-bounce {
        0%,100%{transform:translateX(-50%) translateY(0)}
        50%{transform:translateX(-50%) translateY(7px)}
      }

      .ix-liquid {
        transition:transform 0.4s ${EASE}, box-shadow 0.4s ease, letter-spacing 0.3s ease !important;
      }
      .ix-liquid:hover {
        transform:translateY(-3px) scale(1.025) !important;
        letter-spacing:0.025em;
      }
      .ix-liquid:active {
        transform:scale(0.97) !important;
        transition-duration:0.08s !important;
      }

      .ix-shimmer { position:relative; overflow:hidden; }
      .ix-shimmer::after {
        content:''; position:absolute; inset:0;
        background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.22) 50%,transparent 100%);
        transform:translateX(-100%);
        transition:transform 0.5s ease;
        pointer-events:none;
      }
      .ix-shimmer:hover::after { transform:translateX(100%); }

      .ix-glow {
        background-image:radial-gradient(
          circle at var(--gx,50%) var(--gy,50%),
          rgba(var(--acc-rgb,77,158,255),0.10) 0%,
          transparent 65%
        ) !important;
      }

      .nav-links a { display:inline-block; }
      .nav-links a::after {
        content:''; display:block; height:1px; width:0;
        background:var(--terra);
        transition:width 0.3s ${EASE}; margin-top:1px;
      }
      .nav-links a:hover::after,
      .nav-links a.active::after { width:100%; }

      .ix-trail {
        position:fixed; border-radius:50%; pointer-events:none;
        z-index:9997; transform:translate(-50%,-50%);
        background:var(--terra); transition:opacity 0.2s ease;
      }
      @media (hover:none) { .ix-trail { display:none !important; } }

      .ix-form-progress {
        height:3px; background:var(--border);
        border-radius:99px; margin-bottom:20px; overflow:hidden;
      }
      .ix-form-fill {
        display:block; height:100%; width:0; border-radius:99px;
        background:linear-gradient(90deg,var(--terra),var(--gold));
        transition:width 0.4s ${EASE}, background 0.5s ease;
      }

      #contactForm .form-group.ix-focused label { color:var(--terra); }
      #contactForm .form-group.ix-focused input,
      #contactForm .form-group.ix-focused textarea,
      #contactForm .form-group.ix-focused select {
        border-color:var(--terra) !important;
        box-shadow:0 0 0 3px rgba(26,101,255,0.13) !important;
      }
      #contactForm .form-group.ix-filled label { color:var(--terra); opacity:0.72; }

      .ix-kpi-hover { transition:transform 0.35s ${EASE} !important; cursor:default; }
      .ix-kpi-hover:hover { transform:scale(1.08) translateY(-2px) !important; }

      .faq-item.ix-open {
        border-color:var(--terra) !important;
        box-shadow:0 8px 32px rgba(26,101,255,0.15) !important;
        background:rgba(26,101,255,0.03) !important;
      }

      :focus-visible {
        outline:2px solid var(--terra) !important;
        outline-offset:3px; border-radius:4px;
      }

      img[loading] { opacity:0; transition:opacity 0.4s ease; }
      img.ix-loaded { opacity:1 !important; }

      ::selection      { background:rgba(26,101,255,0.22); color:var(--ink); }
      ::-moz-selection { background:rgba(26,101,255,0.22); color:var(--ink); }
    `;
    document.head.appendChild(s);
  })();


  /* ═══════════════════════════════════════════════════════════════
     1. WEB AUDIO
  ═══════════════════════════════════════════════════════════════ */
  let _ctx = null;
  function audio() {
    if (!_ctx) try { _ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(_) {}
    return _ctx;
  }
  function playTick(freq, dur, vol) {
    freq = freq || 800; dur = dur || 0.05; vol = vol || 0.035;
    if (PRM) return;
    var ctx = audio(); if (!ctx) return;
    var osc = ctx.createOscillator();
    var g   = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.frequency.value = freq; osc.type = 'sine';
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.start(); osc.stop(ctx.currentTime + dur);
  }
  function playWhoosh() {
    if (PRM) return;
    var ctx = audio(); if (!ctx) return;
    var len = Math.floor(ctx.sampleRate * 0.1);
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d   = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = ctx.createBufferSource();
    var g   = ctx.createGain();
    var f   = ctx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 3200; f.Q.value = 0.8;
    src.buffer = buf;
    src.connect(f); f.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.05, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
    src.start(); src.stop(ctx.currentTime + 0.12);
  }
  document.addEventListener('click',      function(){ audio(); }, { once:true, passive:true });
  document.addEventListener('keydown',    function(){ audio(); }, { once:true, passive:true });
  document.addEventListener('touchstart', function(){ audio(); }, { once:true, passive:true });


  /* ═══════════════════════════════════════════════════════════════
     2. RIPPLE
  ═══════════════════════════════════════════════════════════════ */
  var RIPPLE_SEL = [
    '.btn-primary','.btn-ghost','.nav-cta',
    '.pr-v2-btn','.pf-sl-cta-p','.pf-cta-btn-primary',
    '.sol-banner-cta','.auto-cta','.tm-cta-primary',
    '.footer-cta-btn','.submit-btn',
    '.cpanel-gsm-cta','.cpanel-wa-cta',
    '.pb-cta-btn','.phi-cta'
  ].join(',');

  document.querySelectorAll(RIPPLE_SEL).forEach(function(el) {
    var pos = getComputedStyle(el).position;
    if (pos === 'static') el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.addEventListener('click', function(e) {
      var r    = el.getBoundingClientRect();
      var size = Math.max(r.width, r.height) * 2.4;
      var rpl  = document.createElement('span');
      rpl.className = 'ix-ripple';
      rpl.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (e.clientX - r.left - size/2) + 'px;top:' + (e.clientY - r.top - size/2) + 'px;';
      el.appendChild(rpl);
      playTick(1100, 0.07, 0.03);
      setTimeout(function(){ rpl.remove(); }, 700);
    }, { passive:true });
  });


  /* ═══════════════════════════════════════════════════════════════
     3. LIQUID + SHIMMER
  ═══════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.btn-primary,.submit-btn,.pr-v2-btn--primary,.footer-cta-btn,.pf-cta-btn-primary').forEach(function(btn) {
    btn.classList.add('ix-liquid','ix-shimmer');
    btn.addEventListener('mouseenter', playWhoosh, { passive:true });
  });


  /* ═══════════════════════════════════════════════════════════════
     4. TYPING EFFECT — hero-subtitle
  ═══════════════════════════════════════════════════════════════ */
  (function() {
    if (PRM) return;
    var sub = document.querySelector('.hero-subtitle');
    if (!sub) return;
    var fullText = sub.innerText.trim();
    if (!fullText) return;
    sub.textContent = '';
    var cursor = document.createElement('span');
    cursor.className = 'ix-cursor';
    sub.appendChild(cursor);
    var idx = 0;
    function typeNext() {
      if (idx >= fullText.length) {
        setTimeout(function(){
          cursor.style.animation = 'ix-blink 1s step-end infinite';
          setTimeout(function(){ if (cursor.parentNode) cursor.remove(); }, 2000);
        }, 200);
        return;
      }
      var ch = fullText[idx];
      sub.insertBefore(document.createTextNode(ch), cursor);
      idx++;
      var pause = (ch === '.' || ch === ',') ? 150 : (ch === ' ' ? 40 : 25 + Math.random() * 20);
      setTimeout(typeNext, pause);
    }
    setTimeout(typeNext, 1900);
  })();


  /* ═══════════════════════════════════════════════════════════════
     5. NAVBAR — glassmorphism fixe (scroll window désactivé en fullpage)
  ═══════════════════════════════════════════════════════════════ */
  (function() {
    var nav = document.getElementById('navbar');
    if (!nav) return;
    /* Blur fixe premium — fullpage.js intercepte wheel donc pas de scroll window */
    nav.style.backdropFilter = 'blur(20px) saturate(1.8)';
    nav.style.webkitBackdropFilter = 'blur(20px) saturate(1.8)';
    /* Augmenter blur pendant transition fp */
    document.addEventListener('fp-transition-start', function() {
      nav.style.backdropFilter = 'blur(28px) saturate(2)';
      nav.style.webkitBackdropFilter = 'blur(28px) saturate(2)';
    });
    document.addEventListener('fp-transition-end', function() {
      nav.style.backdropFilter = 'blur(20px) saturate(1.8)';
      nav.style.webkitBackdropFilter = 'blur(20px) saturate(1.8)';
    });
  })();


  /* ═══════════════════════════════════════════════════════════════
     6. MAGNETIC NAV LINKS
  ═══════════════════════════════════════════════════════════════ */
  if (!MOB && !PRM) {
    document.querySelectorAll('.nav-links a').forEach(function(link) {
      link.addEventListener('mousemove', function(e) {
        var r  = link.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width  / 2) * 0.3;
        var dy = (e.clientY - r.top  - r.height / 2) * 0.3;
        link.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      }, { passive:true });
      link.addEventListener('mouseleave', function() {
        link.style.transition = 'transform 0.4s ' + EASE;
        link.style.transform  = '';
        setTimeout(function(){ link.style.transition = ''; }, 400);
      });
    });
  }


  /* ═══════════════════════════════════════════════════════════════
     7. CARD GLOW
  ═══════════════════════════════════════════════════════════════ */
  if (!MOB && !PRM) {
    document.querySelectorAll('.sol-card,.prest-card,.pb-card,.svc-xp-card,.pr-v2,.pr-xcard,.svc-card').forEach(function(card) {
      var rgb = getComputedStyle(card).getPropertyValue('--sol-acc-rgb').trim() || '77,158,255';
      card.style.setProperty('--acc-rgb', rgb);
      card.addEventListener('mousemove', function(e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--gy', ((e.clientY - r.top)  / r.height * 100) + '%');
        card.classList.add('ix-glow');
      }, { passive:true });
      card.addEventListener('mouseleave', function() { card.classList.remove('ix-glow'); });
    });
  }


  /* ═══════════════════════════════════════════════════════════════
     8. FAQ — sons + sync ix-open
  ═══════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.faq-q').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item    = btn.closest('.faq-item');
      var wasOpen = item && item.classList.contains('active');
      setTimeout(function() {
        document.querySelectorAll('.faq-item').forEach(function(it) {
          it.classList.toggle('ix-open', it.classList.contains('active'));
        });
        playTick(wasOpen ? 330 : 480, 0.09, 0.032);
      }, 15);
    }, { passive:true });
  });


  /* ═══════════════════════════════════════════════════════════════
     9. HERO CARDS — parallax 3D
  ═══════════════════════════════════════════════════════════════ */
  if (!MOB && !PRM) {
    var C = [
      { el: document.querySelector('.hero-card-1'), tx: 0.024, tz: 0.4 },
      { el: document.querySelector('.hero-card-2'), tx: 0.032, tz: 0.6 },
      { el: document.querySelector('.hero-card-3'), tx: 0.018, tz: 0.3 },
    ].filter(function(c){ return c.el; });

    if (C.length) {
      var _mx = 0, _my = 0;
      document.addEventListener('mousemove', function(e) {
        _mx = e.clientX / window.innerWidth  - 0.5;
        _my = e.clientY / window.innerHeight - 0.5;
      }, { passive:true });
      (function frame() {
        C.forEach(function(c) {
          var x  = _mx * c.tx * 120;
          var y  = _my * c.tx * 90;
          var rx = -_my * c.tz * 10;
          var ry =  _mx * c.tz * 10;
          c.el.style.transform = 'translate(' + x + 'px,' + y + 'px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
        });
        requestAnimationFrame(frame);
      })();
    }
  }


  /* ═══════════════════════════════════════════════════════════════
     10. CURSOR TRAIL
  ═══════════════════════════════════════════════════════════════ */
  if (!MOB && !PRM) {
    var N = 6;
    var pts = [];
    for (var ti = 0; ti < N; ti++) {
      var d = document.createElement('div');
      var sz = 7 - ti;
      d.className = 'ix-trail';
      d.style.cssText = 'width:' + sz + 'px;height:' + sz + 'px;opacity:' + (0.55 - ti * 0.07) + ';';
      document.body.appendChild(d);
      pts.push({ el:d, x:-100, y:-100 });
    }
    var tmx = -100, tmy = -100;
    document.addEventListener('mousemove', function(e){ tmx = e.clientX; tmy = e.clientY; }, { passive:true });
    (function frame() {
      pts[0].x += (tmx - pts[0].x) * 0.32;
      pts[0].y += (tmy - pts[0].y) * 0.32;
      for (var i = 1; i < N; i++) {
        pts[i].x += (pts[i-1].x - pts[i].x) * 0.42;
        pts[i].y += (pts[i-1].y - pts[i].y) * 0.42;
      }
      pts.forEach(function(p){ p.el.style.left = p.x + 'px'; p.el.style.top = p.y + 'px'; });
      requestAnimationFrame(frame);
    })();
    document.addEventListener('mousedown', function(){ pts.forEach(function(p){ p.el.style.opacity='0'; }); });
    document.addEventListener('mouseup',   function(){
      pts.forEach(function(p, i){ p.el.style.opacity = String(0.55 - i * 0.07); });
    });
  }


  /* ═══════════════════════════════════════════════════════════════
     11. FORM PROGRESS + FOCUS STATES
  ═══════════════════════════════════════════════════════════════ */
  (function() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    var bar  = document.createElement('div');
    bar.className = 'ix-form-progress';
    bar.setAttribute('aria-hidden','true');
    var fill = document.createElement('span');
    fill.className = 'ix-form-fill';
    bar.appendChild(fill);
    form.insertAdjacentElement('beforebegin', bar);
    var required = Array.from(form.querySelectorAll('[required]'));
    function updateBar() {
      var n   = required.filter(function(f){ return f.value.trim(); }).length;
      var pct = required.length ? Math.round(n / required.length * 100) : 0;
      fill.style.width      = pct + '%';
      fill.style.background = pct === 100
        ? 'linear-gradient(90deg,var(--terra),#22c55e)'
        : 'linear-gradient(90deg,var(--terra),var(--gold))';
    }
    form.querySelectorAll('input,textarea,select').forEach(function(input) {
      var g = input.closest('.form-group');
      if (!g) return;
      function checkFill(){ g.classList.toggle('ix-filled', !!input.value.trim()); }
      input.addEventListener('focus',  function(){ g.classList.add('ix-focused'); playTick(860, 0.04, 0.022); });
      input.addEventListener('blur',   function(){ g.classList.remove('ix-focused'); checkFill(); });
      input.addEventListener('input',  function(){ checkFill(); updateBar(); });
      input.addEventListener('change', updateBar);
      checkFill();
    });
    updateBar();
  })();


  /* ═══════════════════════════════════════════════════════════════
     12. SCROLL VELOCITY — écoute le scroll INTERNE des sections fp
     (window.scroll ne fire pas — html/body overflow:hidden)
  ═══════════════════════════════════════════════════════════════ */
  (function() {
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;
    /* Écouter le scroll sur chaque section fullpage */
    document.querySelectorAll('section[id], footer[role="contentinfo"]').forEach(function(sec) {
      var prevY = 0, prevT = Date.now();
      sec.addEventListener('scroll', function() {
        var y   = sec.scrollTop;
        var now = Date.now();
        var vel = Math.min(Math.abs(y - prevY) / Math.max(now - prevT, 1), 3);
        var hue = Math.round(220 - vel * 55);
        bar.style.background = 'hsl(' + hue + ',90%,58%)';
        bar.style.boxShadow  = vel > 0.8 ? '0 0 10px hsl(' + hue + ',90%,58%)' : '';
        prevY = y; prevT = now;
      }, { passive: true });
    });
  })();


  /* ═══════════════════════════════════════════════════════════════
     13. KPI HOVER
  ═══════════════════════════════════════════════════════════════ */
  if (!MOB) {
    document.querySelectorAll('.hero-stat,.sol-proof-item,.pf-kpi,.tm-kpi,.phi-stat,.svc-ps').forEach(function(el) {
      el.classList.add('ix-kpi-hover');
      el.addEventListener('mouseenter', function(){ playTick(580, 0.05, 0.022); }, { passive:true });
    });
  }


  /* ═══════════════════════════════════════════════════════════════
     14. HOVER SOUNDS — nav + carousel tabs
  ═══════════════════════════════════════════════════════════════ */
  if (!MOB) {
    document.querySelectorAll('.nav-links a,.pf-nav-tab').forEach(function(el) {
      el.addEventListener('mouseenter', function(){ playTick(680, 0.04, 0.018); }, { passive:true });
    });
  }


  /* ═══════════════════════════════════════════════════════════════
     15. SECTION TRACKER
  ═══════════════════════════════════════════════════════════════ */
  (function() {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) document.body.setAttribute('data-section', e.target.id);
      });
    }, { threshold:0.35 });
    document.querySelectorAll('section[id]').forEach(function(s){ obs.observe(s); });
  })();


  /* ═══════════════════════════════════════════════════════════════
     16. ANNOUNCE BAR
  ═══════════════════════════════════════════════════════════════ */
  (function() {
    var bar   = document.getElementById('announceBar');
    var close = document.getElementById('announceClose');
    if (!bar || !close) return;
    if (sessionStorage.getItem('ix-announce-closed')) { bar.remove(); return; }
    close.addEventListener('click', function() {
      var h = bar.offsetHeight;
      bar.style.cssText += 'overflow:hidden;transition:max-height 0.4s ease,opacity 0.3s ease,padding 0.35s ease;max-height:' + h + 'px;';
      requestAnimationFrame(function() {
        bar.style.maxHeight = '0';
        bar.style.opacity   = '0';
        bar.style.padding   = '0';
      });
      setTimeout(function(){ bar.remove(); }, 420);
      sessionStorage.setItem('ix-announce-closed', '1');
      playTick(320, 0.07, 0.028);
    });
  })();


  /* ═══════════════════════════════════════════════════════════════
     17. SMOOTH ANCHOR — DÉSACTIVÉ (fullpage.js gère les anchors)
     Les liens #section sont interceptés par fullpage.js go(idx)
  ═══════════════════════════════════════════════════════════════ */
  /* Ajouter juste le son sur les liens ancre sans changer le comportement */
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function() {
      playTick(520, 0.06, 0.025);
    }, { passive: true });
  });


  /* ═══════════════════════════════════════════════════════════════
     18. AVAILABLE DOTS — délais aléatoires
  ═══════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.phi-avail-dot,.hero-avail-dot,.cpanel-avail-dot,.footer-cta-dot,.tm-live-dot,.pf-live-dot').forEach(function(dot) {
    dot.style.animationDelay = (Math.random() * 2).toFixed(2) + 's';
  });


  /* ═══════════════════════════════════════════════════════════════
     19. LAZY IMAGE
  ═══════════════════════════════════════════════════════════════ */
  document.querySelectorAll('img[loading="lazy"]').forEach(function(img) {
    if (img.complete) { img.classList.add('ix-loaded'); return; }
    img.addEventListener('load', function(){ img.classList.add('ix-loaded'); }, { once:true });
  });


  /* ═══════════════════════════════════════════════════════════════
     20. SCROLL HINT
  ═══════════════════════════════════════════════════════════════ */
  (function() {
    if (PRM) return;
    var hero = document.querySelector('#accueil');
    if (!hero) return;
    if (getComputedStyle(hero).position === 'static') hero.style.position = 'relative';
    var hint = document.createElement('div');
    hint.className = 'ix-scroll-hint';
    hint.setAttribute('aria-hidden','true');
    hint.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12l7 7 7-7"/></svg>';
    hero.appendChild(hint);
    hint.addEventListener('click', function() {
      var next = document.querySelector('#pourqui') || document.querySelector('#services');
      if (next) next.scrollIntoView({ behavior:'smooth', block:'start' });
    });
    window.addEventListener('scroll', function() {
      if (window.scrollY > 100) hint.classList.add('hidden');
    }, { passive:true, once:true });
  })();


  /* ═══════════════════════════════════════════════════════════════
     21. STAGGER DELAY — grilles
  ═══════════════════════════════════════════════════════════════ */
  ['.svc-grid','.sol-grid','.pb-grid','.prest-grid','.svc-xp-grid','.pr-grid-v2','.pr-extras-grid'].forEach(function(sel) {
    var g = document.querySelector(sel);
    if (!g) return;
    Array.from(g.children).forEach(function(child, i) {
      if (!child.style.transitionDelay) child.style.transitionDelay = (i * 75) + 'ms';
    });
  });


  /* ═══════════════════════════════════════════════════════════════
     22. TOOL TAGS — hover son
  ═══════════════════════════════════════════════════════════════ */
  if (!MOB) {
    document.querySelectorAll('.sol-tool-tag,.phi-stack-tag,.auto-tool-tag,.pf-sr-tags span').forEach(function(tag) {
      tag.addEventListener('mouseenter', function(){ playTick(740, 0.035, 0.018); }, { passive:true });
    });
  }


  console.info('[ÆRĀ] interactions.js v2.0 — 22 modules OK');

})();
