/* ================================================================
   ÆRĀ STUDIO — footer-canvas.js  v1.0
   Fond canvas footer : constellation de points + lignes lumineuses
   ================================================================ */
(function(){
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ft = document.querySelector('footer[role="contentinfo"]');
  if (!ft) return;

  var cvs = document.getElementById('footer-canvas');
  if (!cvs) return;

  var ctx = cvs.getContext('2d');
  var W = 0, H = 0, T = 0;

  function resize() {
    var r = ft.getBoundingClientRect();
    W = cvs.width  = r.width  || window.innerWidth;
    H = cvs.height = r.height || window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  var NP = window.innerWidth < 768 ? 20 : 38;
  var pts = [];
  for (var i = 0; i < NP; i++) {
    pts.push({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.18,
      r:  0.8 + Math.random() * 1.6,
      ph: Math.random() * Math.PI * 2,
      sp: 0.015 + Math.random() * 0.02
    });
  }

  var CONN = 160;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    T++;

    /* Points */
    pts.forEach(function(p) {
      p.x += p.vx; p.y += p.vy; p.ph += p.sp;
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;

      var glow = (Math.sin(p.ph) + 1) * 0.5;
      var a = 0.25 + glow * 0.45;
      var rad = p.r * (1 + glow * 0.7);

      var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad * 4);
      g.addColorStop(0,   'rgba(77,158,255,' + a + ')');
      g.addColorStop(0.5, 'rgba(77,158,255,' + (a * 0.3) + ')');
      g.addColorStop(1,   'rgba(77,158,255,0)');
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad * 4, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      /* Centre */
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(140,190,255,' + Math.min(1, a * 1.8) + ')';
      ctx.fill();
    });

    /* Connexions */
    for (var i = 0; i < pts.length - 1; i++) {
      for (var j = i + 1; j < pts.length; j++) {
        var dx = pts[j].x - pts[i].x;
        var dy = pts[j].y - pts[i].y;
        var d  = Math.sqrt(dx * dx + dy * dy);
        if (d > CONN) continue;
        var alpha = (1 - d / CONN) * 0.14;
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = 'rgba(77,158,255,' + alpha + ')';
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  /* Démarrer quand le footer devient visible (MutationObserver sur fp-active) */
  var started = false;
  function start() {
    if (!started) { started = true; draw(); }
  }

  var mo = new MutationObserver(function() {
    if (ft.classList.contains('fp-active')) start();
  });
  mo.observe(ft, { attributes: true, attributeFilter: ['class'] });

  /* Fallback si pas de fullpage */
  setTimeout(start, 3000);
})();
