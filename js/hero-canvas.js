/* ================================================================
   ÆRĀ STUDIO — hero-canvas.js  v3.0  ULTRA
   Animation hero : WebGL-style sur Canvas 2D
   Modules : Plasma fluid + DNA helix + Meteor shower +
             Bokeh depth-of-field + Chromatic aberration lines +
             Reactive mouse warp field
   Pure Canvas 2D · 60fps · zéro dépendance
   ================================================================ */
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var hero = document.getElementById('accueil');
  if (!hero) return;

  /* ── Canvas ── */
  var cvs = document.getElementById('hero-canvas') || document.createElement('canvas');
  cvs.id = 'hero-canvas';
  cvs.setAttribute('aria-hidden', 'true');
  cvs.style.cssText = [
    'position:fixed','inset:0','width:100%','height:100%',
    'pointer-events:none','z-index:0','opacity:0',
    'transition:opacity 1.4s ease'
  ].join(';') + ';';
  if (!cvs.parentNode) document.body.insertBefore(cvs, document.body.firstChild);

  var ctx = cvs.getContext('2d');
  var W = 0, H = 0, T = 0, RAF;
  var MOB = window.innerWidth < 768;

  function resize() {
    W = cvs.width  = window.innerWidth;
    H = cvs.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', function () { resize(); initAll(); }, { passive: true });

  /* ── Thème ── */
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  new MutationObserver(function () {
    dark = document.documentElement.getAttribute('data-theme') !== 'light';
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* ── Souris ── */
  var mxRaw = 0.5, myRaw = 0.4, mxLerp = 0.5, myLerp = 0.4;
  document.addEventListener('mousemove', function (e) {
    mxRaw = e.clientX / W;
    myRaw = e.clientY / H;
  }, { passive: true });

  /* ═══════════════════════════════════════════════════════════════
     MODULE A — PLASMA FIELD (distance fields animés)
     Inspiré des shaders GLSL, recréé en Canvas 2D
  ═══════════════════════════════════════════════════════════════ */
  var plasmaCanvas = document.createElement('canvas');
  var plasmaCtx    = plasmaCanvas.getContext('2d');
  var PLASMA_RES   = MOB ? 28 : 42; // résolution de la grille plasma
  var plasmaW = 0, plasmaH = 0;

  function resizePlasma() {
    plasmaW = plasmaCanvas.width  = PLASMA_RES;
    plasmaH = plasmaCanvas.height = PLASMA_RES;
  }
  resizePlasma();

  var plasmaData = plasmaCtx.createImageData(PLASMA_RES, PLASMA_RES);

  function drawPlasma(t) {
    var d   = plasmaData.data;
    var mx  = mxLerp, my = myLerp;
    var isDk = dark;

    for (var y = 0; y < PLASMA_RES; y++) {
      for (var x = 0; x < PLASMA_RES; x++) {
        var fx = x / PLASMA_RES;
        var fy = y / PLASMA_RES;
        var tt = t * 0.0014;

        /* Distance fields multipliés — effet plasma */
        var v = Math.sin(fx * 6 + tt * 1.2)
              + Math.sin(fy * 5 + tt * 0.8)
              + Math.sin((fx + fy) * 4 + tt)
              + Math.sin(Math.sqrt((fx - mx) * (fx - mx) + (fy - my) * (fy - my)) * 9 - tt * 0.9)
              + Math.cos(Math.sqrt((fx - 0.5) * (fx - 0.5) + (fy - 0.5) * (fy - 0.5)) * 7 + tt * 0.6);

        v = (v + 5) / 10; // normaliser 0..1

        /* Palette de couleurs : bleu → cyan → violet */
        var r, g, b, a;
        if (isDk) {
          r = Math.round(10  + v * 60);
          g = Math.round(20  + v * 100);
          b = Math.round(120 + v * 135);
          a = Math.round(v * 38 + 8);    // très transparent — effet ambient
        } else {
          r = Math.round(180 + v * 50);
          g = Math.round(200 + v * 40);
          b = Math.round(255);
          a = Math.round(v * 20 + 5);
        }

        var idx = (y * PLASMA_RES + x) * 4;
        d[idx]     = r;
        d[idx + 1] = g;
        d[idx + 2] = b;
        d[idx + 3] = a;
      }
    }
    plasmaCtx.putImageData(plasmaData, 0, 0);
  }

  function renderPlasma() {
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(plasmaCanvas, 0, 0, W, H);
    ctx.restore();
  }

  /* ═══════════════════════════════════════════════════════════════
     MODULE B — METEOR SHOWER (étoiles filantes avec traîne chromée)
  ═══════════════════════════════════════════════════════════════ */
  var meteors = [];
  var METEOR_MAX = MOB ? 5 : 10;

  function spawnMeteor() {
    var angle  = -Math.PI / 4 - (Math.random() - 0.5) * 0.4;
    var speed  = 4 + Math.random() * 6;
    var startX = Math.random() * W * 1.4 - W * 0.2;
    var startY = -20 - Math.random() * 100;
    var len    = 80 + Math.random() * 180;
    meteors.push({
      x: startX, y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len: len,
      life: 1,
      decay: 0.010 + Math.random() * 0.008,
      w: 1 + Math.random() * 1.5,
      hue: Math.random() > 0.5 ? '77,158,255' : '0,200,230'
    });
  }

  var meteorTimer = 0;
  function updateMeteors() {
    meteorTimer++;
    if (meteorTimer > (MOB ? 55 : 35) && meteors.length < METEOR_MAX) {
      meteorTimer = 0;
      spawnMeteor();
    }

    for (var i = meteors.length - 1; i >= 0; i--) {
      var m = meteors[i];
      m.x += m.vx; m.y += m.vy;
      m.life -= m.decay;
      if (m.life <= 0) { meteors.splice(i, 1); continue; }

      /* Traîne avec gradient chromatique */
      var tailX = m.x - m.vx * (m.len / m.w / 4);
      var tailY = m.y - m.vy * (m.len / m.w / 4);

      var mg = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
      mg.addColorStop(0,   'rgba(' + m.hue + ',0)');
      mg.addColorStop(0.5, 'rgba(' + m.hue + ',' + (m.life * 0.18) + ')');
      mg.addColorStop(1,   'rgba(220,240,255,' + (m.life * 0.55) + ')');

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(m.x, m.y);
      ctx.strokeStyle = mg;
      ctx.lineWidth   = m.w * m.life;
      ctx.lineCap     = 'round';
      ctx.stroke();

      /* Tête brillante */
      var hg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 5 * m.life);
      hg.addColorStop(0, 'rgba(255,255,255,' + (m.life * 0.9) + ')');
      hg.addColorStop(1, 'rgba(' + m.hue + ',0)');
      ctx.beginPath();
      ctx.arc(m.x, m.y, 5 * m.life, 0, Math.PI * 2);
      ctx.fillStyle = hg;
      ctx.fill();
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     MODULE C — BOKEH PARTICLES (sphères floues profondeur de champ)
  ═══════════════════════════════════════════════════════════════ */
  var bokeh = [];
  var BOKEH_N = MOB ? 18 : 38;

  function initBokeh() {
    bokeh = [];
    for (var i = 0; i < BOKEH_N; i++) {
      bokeh.push({
        x:    Math.random() * W,
        y:    Math.random() * H,
        z:    Math.random(),             // profondeur 0..1
        vx:   (Math.random() - 0.5) * 0.3,
        vy:   (Math.random() - 0.5) * 0.25,
        ph:   Math.random() * Math.PI * 2,
        spd:  0.008 + Math.random() * 0.015,
        hue:  Math.floor(Math.random() * 3)  // 0=bleu 1=cyan 2=violet
      });
    }
  }
  initBokeh();

  var hues = ['77,158,255', '0,195,230', '140,100,255'];

  function drawBokeh() {
    bokeh.forEach(function (b) {
      b.x  += b.vx + (mxLerp - 0.5) * b.z * 0.8;
      b.y  += b.vy + (myLerp - 0.5) * b.z * 0.5;
      b.ph += b.spd;

      /* Wrap */
      if (b.x < -60) b.x = W + 60;
      else if (b.x > W + 60) b.x = -60;
      if (b.y < -60) b.y = H + 60;
      else if (b.y > H + 60) b.y = -60;

      /* Taille selon profondeur (bokeh = grand = hors focus) */
      var depth   = b.z;
      var pulse   = (Math.sin(b.ph) + 1) * 0.5;
      var radius  = (12 + depth * 38) * (0.7 + pulse * 0.3);
      var alpha   = (0.04 + depth * 0.06) * (dark ? 1 : 0.5);

      /* Disque bokeh flou */
      var bg = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, radius);
      var h  = hues[b.hue];
      bg.addColorStop(0,    'rgba(' + h + ',' + (alpha * 1.8) + ')');
      bg.addColorStop(0.3,  'rgba(' + h + ',' + alpha + ')');
      bg.addColorStop(0.7,  'rgba(' + h + ',' + (alpha * 0.3) + ')');
      bg.addColorStop(1,    'rgba(' + h + ',0)');
      ctx.beginPath();
      ctx.arc(b.x, b.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = bg;
      ctx.fill();

      /* Anneau lens (effet optique) */
      if (depth > 0.5 && !MOB) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, radius * 0.88, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(' + h + ',' + (alpha * 0.5) + ')';
        ctx.lineWidth   = 0.6;
        ctx.stroke();
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     MODULE D — WARP GRID (grille déformée par le champ de souris)
  ═══════════════════════════════════════════════════════════════ */
  var GRID_COLS = MOB ? 8  : 14;
  var GRID_ROWS = MOB ? 5  : 9;

  function drawWarpGrid() {
    var CELL_W = W / GRID_COLS;
    var CELL_H = H / GRID_ROWS;
    var mx = mxLerp * W;
    var my = myLerp * H;
    var AM = dark ? 0.065 : 0.035;
    var WARP_STRENGTH = 55;

    ctx.save();

    /* Lignes horizontales déformées */
    for (var row = 0; row <= GRID_ROWS; row++) {
      ctx.beginPath();
      var baseY = row * CELL_H;
      for (var col = 0; col <= GRID_COLS; col++) {
        var bx = col * CELL_W;
        var dx = bx - mx;
        var dy = baseY - my;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var warp = WARP_STRENGTH / (1 + dist * 0.007);
        var wx = bx + (dx / (dist + 1)) * warp * (Math.sin(T * 0.018 + col * 0.4) * 0.5);
        var wy = baseY + (dy / (dist + 1)) * warp * (Math.cos(T * 0.022 + row * 0.5) * 0.5);

        /* Alpha plus fort près de la souris */
        var proximity = Math.max(0, 1 - dist / (W * 0.4));
        var alpha = AM + proximity * AM * 2;

        if (col === 0) {
          ctx.moveTo(wx, wy);
          ctx.strokeStyle = 'rgba(77,158,255,' + alpha + ')';
          ctx.lineWidth   = 0.5;
        } else {
          ctx.lineTo(wx, wy);
        }
      }
      ctx.stroke();
    }

    /* Lignes verticales */
    for (var col2 = 0; col2 <= GRID_COLS; col2++) {
      ctx.beginPath();
      var baseX = col2 * CELL_W;
      for (var row2 = 0; row2 <= GRID_ROWS; row2++) {
        var by = row2 * CELL_H;
        var dx2 = baseX - mx;
        var dy2 = by - my;
        var dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        var warp2 = WARP_STRENGTH / (1 + dist2 * 0.007);
        var wx2 = baseX + (dx2 / (dist2 + 1)) * warp2 * (Math.sin(T * 0.020 + col2 * 0.3) * 0.5);
        var wy2 = by    + (dy2 / (dist2 + 1)) * warp2 * (Math.cos(T * 0.016 + row2 * 0.4) * 0.5);

        var proximity2 = Math.max(0, 1 - dist2 / (W * 0.4));
        var alpha2 = AM + proximity2 * AM * 2;

        if (row2 === 0) {
          ctx.moveTo(wx2, wy2);
          ctx.strokeStyle = 'rgba(77,158,255,' + alpha2 + ')';
          ctx.lineWidth   = 0.5;
        } else {
          ctx.lineTo(wx2, wy2);
        }
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  /* ═══════════════════════════════════════════════════════════════
     MODULE E — AURORA RIBBONS (rubans d'aurore boréale)
  ═══════════════════════════════════════════════════════════════ */
  var aurora = [];
  (function initAurora() {
    var palette = [
      { r:'77,158,255',  w: 100, spd: 0.006 },
      { r:'0,195,230',   w: 130, spd: 0.009 },
      { r:'120,80,255',  w: 90,  spd: 0.011 },
      { r:'0,230,180',   w: 80,  spd: 0.007 },
    ];
    palette.forEach(function (p, i) {
      aurora.push({
        yBase: 0.18 + i * 0.17,
        amp:   55 + Math.random() * 70,
        freq:  0.0025 + Math.random() * 0.003,
        spd:   p.spd,
        ph:    Math.random() * Math.PI * 2,
        w:     p.w + Math.random() * 60,
        hue:   p.r
      });
    });
  })();

  function drawAurora() {
    aurora.forEach(function (r) {
      var base = r.yBase * H;
      var pts  = [];
      var STEPS = 50;
      for (var i = 0; i <= STEPS; i++) {
        var t  = i / STEPS;
        var x  = t * W;
        var y  = base
               + Math.sin(x * r.freq + T * r.spd + r.ph) * r.amp
               + Math.cos(x * r.freq * 1.7 + T * r.spd * 0.7) * r.amp * 0.35
               + (myLerp - 0.5) * 50;
        pts.push([x, y]);
      }

      var al = dark ? 0.045 : 0.022;
      var grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0,   'rgba(' + r.hue + ',0)');
      grad.addColorStop(0.15,'rgba(' + r.hue + ',' + al + ')');
      grad.addColorStop(0.5, 'rgba(' + r.hue + ',' + (al * 1.8) + ')');
      grad.addColorStop(0.85,'rgba(' + r.hue + ',' + al + ')');
      grad.addColorStop(1,   'rgba(' + r.hue + ',0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1] - r.w / 2);
      for (var j = 1; j < pts.length; j++) ctx.lineTo(pts[j][0], pts[j][1] - r.w / 2);
      for (var k = pts.length - 1; k >= 0; k--) ctx.lineTo(pts[k][0], pts[k][1] + r.w / 2);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     MODULE F — VIGNETTE + SCANLINES + CHROMATIC ABERRATION
  ═══════════════════════════════════════════════════════════════ */
  function drawPostFX() {
    /* Vignette radiale */
    var vg = ctx.createRadialGradient(
      W * (0.4 + mxLerp * 0.2), H * (0.4 + myLerp * 0.2), H * 0.25,
      W / 2, H / 2, H * 0.95
    );
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, dark ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0.08)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    /* Scanlines subtiles (dark only) */
    if (dark && !MOB) {
      ctx.save();
      ctx.globalAlpha = 0.016;
      ctx.fillStyle   = '#000';
      for (var y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1);
      ctx.restore();
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     BOUCLE PRINCIPALE
  ═══════════════════════════════════════════════════════════════ */
  function initAll() {
    initBokeh();
  }

  var running = false;
  function loop() {
    RAF = requestAnimationFrame(loop);
    T++;

    /* Lerp souris */
    mxLerp += (mxRaw - mxLerp) * 0.055;
    myLerp += (myRaw - myLerp) * 0.055;

    ctx.clearRect(0, 0, W, H);

    /* Plasma en fond */
    drawPlasma(T);
    renderPlasma();

    /* Grille déformée */
    drawWarpGrid();

    /* Aurore */
    drawAurora();

    /* Bokeh depth-of-field */
    drawBokeh();

    /* Météores */
    updateMeteors();

    /* Post-FX */
    drawPostFX();
  }

  /* ── Démarrer après loader ── */
  function start() {
    if (running) return;
    running = true;
    loop();
    setTimeout(function () {
      cvs.style.opacity = dark ? '1' : '0.75';
    }, 100);
  }

  /* Attendre que GSAP ait fini le loader */
  var loader = document.getElementById('pageLoader');
  if (loader) {
    var mo = new MutationObserver(function (_, obs) {
      if (loader.classList.contains('hidden')) {
        obs.disconnect();
        setTimeout(start, 200);
      }
    });
    mo.observe(loader, { attributes: true, attributeFilter: ['class'] });
    setTimeout(start, 2800); // fallback
  } else {
    setTimeout(start, 400);
  }

  /* Thème change → opacité */
  new MutationObserver(function () {
    dark = document.documentElement.getAttribute('data-theme') !== 'light';
    if (running) cvs.style.opacity = dark ? '1' : '0.75';
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* Visibilité → pause RAF */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { cancelAnimationFrame(RAF); running = false; }
    else if (!running)   { start(); }
  });

})();
