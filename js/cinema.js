/* ================================================================
   ÆRĀ STUDIO — cinema.js  v3.0
   Animations fluides 60fps — propriétés GPU uniquement
   Fond vivant + gauche/droite bidirectionnel
   ================================================================ */

(function () {
    'use strict';

    /* ── GUARD ─────────────────────────────────────────────────── */
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* ── CONFIG GSAP ────────────────────────────────────────────── */
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ force3D: true, nullTargetWarn: false });

    ScrollTrigger.config({ ignoreMobileResize: true });

    /* ── CONSTANTES ─────────────────────────────────────────────── */
    var isMobile = window.innerWidth < 768;
    var EO  = 'expo.out';   /* entrées latérales — plus expressif  */
    var EOU = 'power3.out'; /* entrées verticales — plus organique */

    /* ── ÉTATS INITIAUX HERO (avant premier paint, loader couvre) ─ */
    gsap.set(['.hero-overline','.hero-subtitle','.hero-actions','.hero-stats'], {
        opacity: 0, y: 24
    });
    gsap.set(['.hero-card-1','.hero-card-2','.hero-card-3'], {
        opacity: 0, x: 80
    });
    gsap.set('.hero-orb', { opacity: 0, scale: 0.2 });

    /* ================================================================
       FOND — Réseau neuronal · Impulsions · Fragments de code
       "Un développeur qui change le futur"
    ================================================================ */
    function initBackground() {
        var cvs = document.createElement('canvas');
        cvs.id = 'cine-bg';
        cvs.setAttribute('aria-hidden', 'true');
        cvs.style.cssText =
            'position:fixed;inset:0;width:100%;height:100%;' +
            'pointer-events:none;z-index:9990;opacity:.22;transition:opacity .5s;';
        /* Lecture du thème pour ajuster l'opacité */
        function updateOpacity() {
            var d = document.documentElement.getAttribute('data-theme') === 'dark';
            cvs.style.opacity = d ? '.32' : '.18';
        }
        updateOpacity();
        new MutationObserver(updateOpacity).observe(
            document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }
        );
        document.body.prepend(cvs);

        var ctx = cvs.getContext('2d');
        var W = 0, H = 0;
        var mX = 0.5, mY = 0.5; /* souris normalisée */

        function resize() {
            W = cvs.width  = window.innerWidth;
            H = cvs.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', function () {
            resize();
            buildNodes();
        }, { passive: true });
        document.addEventListener('mousemove', function (e) {
            mX = e.clientX / window.innerWidth;
            mY = e.clientY / window.innerHeight;
        }, { passive: true });

        var MOB  = window.innerWidth < 768;
        var NC   = MOB ? 22 : 42;   /* nombre de nœuds             */
        var MAXD = MOB ? 140 : 190; /* distance max pour les liens  */

        /* ── NŒUDS ──────────────────────────────────────────────── */
        var nodes = [];
        function buildNodes() {
            nodes = [];
            for (var i = 0; i < NC; i++) {
                nodes.push({
                    x:  Math.random() * W,
                    y:  Math.random() * H,
                    vx: (Math.random() - .5) * .28,
                    vy: (Math.random() - .5) * .28,
                    r:  .6 + Math.random() * 2.2,
                    ph: Math.random() * Math.PI * 2
                });
            }
        }
        buildNodes();

        /* ── FRAGMENTS DE CODE ───────────────────────────────────── */
        var SYMS = [
            '{  }','</>','( )','[ ]','=>','&&','||',
            '01','10','0x','#!/',
            'AI','ML','git','ssh','npm','cd ~',
            'fn()','API','∞','λ','∑'
        ];
        var chars = [];
        var NCHARS = MOB ? 14 : 26;
        function makeChar() {
            return {
                x:  10 + Math.random() * (W - 20),
                y:  H  + 30 + Math.random() * 400,
                vy: -(0.22 + Math.random() * .42),
                s:  SYMS[Math.floor(Math.random() * SYMS.length)],
                a:  0,
                da: .0025 + Math.random() * .003,
                sz: 9 + Math.random() * 5
            };
        }
        for (var ci = 0; ci < NCHARS; ci++) chars.push(makeChar());

        /* ── IMPULSIONS le long des liens ────────────────────────── */
        var pulses = [];
        var pTimer = 0;
        function tryPulse() {
            if (++pTimer < 28) return;
            pTimer = 0;
            for (var t = 0; t < 12; t++) {
                var a = nodes[Math.floor(Math.random() * NC)];
                var b = nodes[Math.floor(Math.random() * NC)];
                if (a === b) continue;
                var d = Math.hypot(b.x - a.x, b.y - a.y);
                if (d > MAXD) continue;
                pulses.push({ ax: a.x, ay: a.y, bx: b.x, by: b.y,
                               t: 0, sp: .007 + Math.random() * .009,
                               c: Math.random() > .5 ? '77,158,255' : '0,212,255' });
                break;
            }
        }

        /* ── BOUCLE DE RENDU ─────────────────────────────────────── */
        function draw() {
            ctx.clearRect(0, 0, W, H);

            var dark = document.documentElement.getAttribute('data-theme') === 'dark';
            var AM   = dark ? 1.0 : .60;

            /* parallax souris */
            var ox = (mX - .5) * 28;
            var oy = (mY - .5) * 18;
            ctx.save();
            ctx.translate(ox, oy);

            /* ── Déplacer les nœuds ── */
            for (var i = 0; i < NC; i++) {
                var n = nodes[i];
                n.x += n.vx;  n.y += n.vy;  n.ph += .016;
                if (n.x < -60) n.x = W + 60;
                else if (n.x > W + 60) n.x = -60;
                if (n.y < -60) n.y = H + 60;
                else if (n.y > H + 60) n.y = -60;
            }

            /* ── Liens entre nœuds proches ── */
            for (var ii = 0; ii < NC - 1; ii++) {
                for (var jj = ii + 1; jj < NC; jj++) {
                    var ni = nodes[ii], nj = nodes[jj];
                    var dx = nj.x - ni.x, dy = nj.y - ni.y;
                    var dd = Math.sqrt(dx * dx + dy * dy);
                    if (dd > MAXD) continue;
                    var la = (1 - dd / MAXD) * .90 * AM;
                    ctx.beginPath();
                    ctx.moveTo(ni.x, ni.y);
                    ctx.lineTo(nj.x, nj.y);
                    ctx.strokeStyle = 'rgba(77,158,255,' + la + ')';
                    ctx.lineWidth   = .75;
                    ctx.stroke();
                }
            }

            /* ── Impulsions ── */
            tryPulse();
            for (var pi = pulses.length - 1; pi >= 0; pi--) {
                var pl = pulses[pi];
                pl.t += pl.sp;
                if (pl.t >= 1) { pulses.splice(pi, 1); continue; }
                var px = pl.ax + (pl.bx - pl.ax) * pl.t;
                var py = pl.ay + (pl.by - pl.ay) * pl.t;
                var pg = ctx.createRadialGradient(px, py, 0, px, py, 7);
                pg.addColorStop(0,  'rgba(' + pl.c + ',' + (1.0 * AM) + ')');
                pg.addColorStop(.4, 'rgba(' + pl.c + ',' + (.45 * AM) + ')');
                pg.addColorStop(1,  'rgba(' + pl.c + ',0)');
                ctx.fillStyle = pg;
                ctx.beginPath();
                ctx.arc(px, py, 7, 0, Math.PI * 2);
                ctx.fill();
            }

            /* ── Nœuds ── */
            for (var ni2 = 0; ni2 < NC; ni2++) {
                var nd  = nodes[ni2];
                var gl  = (Math.sin(nd.ph) + 1) * .5;
                var na  = (.55 + gl * .70) * AM;
                var rad = nd.r * 3.5 + gl * 2.5;
                var ng  = ctx.createRadialGradient(nd.x, nd.y, 0, nd.x, nd.y, rad);
                ng.addColorStop(0,  'rgba(100,175,255,' + na + ')');
                ng.addColorStop(.5, 'rgba(77,158,255,'  + (na * .4) + ')');
                ng.addColorStop(1,  'rgba(77,158,255,0)');
                ctx.fillStyle = ng;
                ctx.beginPath();
                ctx.arc(nd.x, nd.y, rad, 0, Math.PI * 2);
                ctx.fill();
                /* point central plus brillant */
                ctx.beginPath();
                ctx.arc(nd.x, nd.y, nd.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(180,220,255,' + (na * 1.8) + ')';
                ctx.fill();
            }

            /* ── Fragments de code ── */
            ctx.textBaseline = 'middle';
            for (var ci2 = 0; ci2 < chars.length; ci2++) {
                var ch = chars[ci2];
                ch.y += ch.vy;
                ch.a += ch.da;
                if (ch.a > .80) ch.da = -Math.abs(ch.da) * .28;
                if (ch.a <= 0 || ch.y < -40) { chars[ci2] = makeChar(); continue; }
                ctx.font      = 'bold ' + ch.sz + 'px "Courier New",monospace';
                ctx.fillStyle = 'rgba(77,158,255,' + (ch.a * AM) + ')';
                ctx.fillText(ch.s, ch.x, ch.y);
            }

            ctx.restore();
            requestAnimationFrame(draw);
        }
        requestAnimationFrame(draw);
    }

    /* ================================================================
       SPOTLIGHT CURSEUR
    ================================================================ */
    function initSpotlight() {
        var spot = document.getElementById('cineSpotlight');
        if (!spot || isMobile) return;

        var tx = window.innerWidth / 2,
            ty = window.innerHeight / 2,
            cx = tx, cy = ty;

        document.addEventListener('mousemove', function (e) {
            tx = e.clientX; ty = e.clientY;
        }, { passive: true });

        (function tick() {
            cx += (tx - cx) * .07;
            cy += (ty - cy) * .07;
            spot.style.left = cx + 'px';
            spot.style.top  = cy + 'px';
            requestAnimationFrame(tick);
        })();
    }

    /* ================================================================
       HERO ENTRANCE — timeline cinématographique v4
    ================================================================ */
    function animateHero() {

        /* ── Timeline hero ultra-cinématographique ── */
        var tl = gsap.timeline({ defaults: { ease: EO } });

        /* Overline avec blur entrant */
        tl.fromTo('.hero-overline',
            { opacity:0, y:20, filter:'blur(8px)' },
            { opacity:1, y:0, filter:'blur(0px)', duration:.75, delay:.05 })

        /* Chaque ligne de titre : slide + blur + skew */
          .fromTo('.hero-title-line:nth-child(1) span',
              { opacity:0, y:'115%', skewX: -4, filter:'blur(6px)' },
              { opacity:1, y:0, skewX:0, filter:'blur(0px)', duration:.90, ease:'expo.out' }, '-=0.25')
          .fromTo('.hero-title-line:nth-child(2) span',
              { opacity:0, y:'115%', skewX: -3, filter:'blur(5px)' },
              { opacity:1, y:0, skewX:0, filter:'blur(0px)', duration:.90, ease:'expo.out' }, '-=0.65')
          .fromTo('.hero-title-line:nth-child(3) span',
              { opacity:0, y:'115%', skewX: -5, filter:'blur(7px)' },
              { opacity:1, y:0, skewX:0, filter:'blur(0px)', duration:.95, ease:'expo.out' }, '-=0.65')

        /* Subtitle avec clip reveal */
          .fromTo('.hero-subtitle',
              { opacity:0, y:28, filter:'blur(4px)', clipPath:'inset(0 100% 0 0)' },
              { opacity:1, y:0,  filter:'blur(0px)', clipPath:'inset(0 0% 0 0)',
                duration:.90, ease:'expo.out' }, '-=0.45')

        /* Actions avec spring */
          .fromTo('.hero-actions',
              { opacity:0, y:20, scale:0.95 },
              { opacity:1, y:0,  scale:1, duration:.75, ease:'back.out(1.4)' }, '-=0.50')

        /* Stats avec stagger */
          .fromTo('.hero-stat',
              { opacity:0, y:16, scale:0.9 },
              { opacity:1, y:0,  scale:1, duration:.65, ease:'back.out(1.5)', stagger:0.10 }, '-=0.45');

        /* Ajouter classe pour le blur CSS */
        document.querySelectorAll('.hero-title-line span').forEach(function(el) {
            el.classList.add('gsap-animated');
        });

        /* ── Orb — expansion lente et organique ── */
        gsap.to('.hero-orb', {
            opacity:1, scale:1,
            duration: 3.2, ease: 'power1.out', delay: .2
        });

        /* ── Stats — compteur animé après apparition ── */
        tl.call(function() { animateCounters(); }, null, '-=0.2');

        /* ── Cards — entrées diagonales avec rebond + directions différentes ── */
        gsap.fromTo('.hero-card-1',
            { opacity:0, x:120, y:-40, rotate: 8, scale:0.8, filter:'blur(10px)' },
            { opacity:1, x:0, y:0, rotate:0, scale:1, filter:'blur(0px)',
              duration:1.4, ease:'expo.out', delay:1.0 });
        gsap.fromTo('.hero-card-2',
            { opacity:0, x:-100, y:50, rotate:-6, scale:0.8, filter:'blur(10px)' },
            { opacity:1, x:0, y:0, rotate:0, scale:1, filter:'blur(0px)',
              duration:1.4, ease:'expo.out', delay:1.2 });
        gsap.fromTo('.hero-card-3',
            { opacity:0, x:80, y:70, rotate:6, scale:0.8, filter:'blur(10px)' },
            { opacity:1, x:0, y:0, rotate:0, scale:1, filter:'blur(0px)',
              duration:1.1, ease:'back.out(1.4)', delay:1.5 });

        /* ── Parallax de sortie hero ── */
        gsap.to('.hero-visual', {
            y: -80, ease: 'none',
            scrollTrigger: {
                trigger: '#accueil', start: 'top top',
                end: 'bottom top', scrub: 1.2
            }
        });

        /* ── Parallax contenu hero — légère résistance ── */
        gsap.to('.hero-content', {
            y: 30, ease: 'none',
            scrollTrigger: {
                trigger: '#accueil', start: 'top top',
                end: 'bottom top', scrub: 0.8
            }
        });
    }

    /* ── Compteurs animés sur les stats hero ─────────────────────── */
    function animateCounters() {
        var counters = [
            { el: '.hero-stat:nth-child(1) .hero-stat-num', from: 0, to: 24, suffix: 'h', duration: 1.2 },
            { el: '.hero-stat:nth-child(2) .hero-stat-num', from: 0, to: 250, suffix: '€', duration: 1.5 },
        ];
        counters.forEach(function(c) {
            var el = document.querySelector(c.el);
            if (!el) return;
            var sup = el.querySelector('sup');
            var supText = sup ? sup.outerHTML : '';
            gsap.fromTo({ val: c.from }, { val: c.to },
                {
                    duration: c.duration,
                    ease: 'power2.out',
                    onUpdate: function() {
                        el.innerHTML = Math.round(this.targets()[0].val) + supText;
                    }
                }
            );
        });
    }


    /* ================================================================
       ANIMATIONS DE SCROLL — bidirectionnelles, GPU-only
       Règle : opacity + X  OU  opacity + Y   (jamais les deux + scale + rotation)
    ================================================================ */
    function initScrollAnimations() {

        /* Anime une seule fois à l'entrée — reste visible ensuite */
        var TA = 'play none none none';

        /* ── Helper : cartes gauche/droite en alternance ──────────── */
        function lr(targets, xAmp, dur, startPct) {
            xAmp     = xAmp     || 90;
            dur      = dur      || 0.75;
            startPct = startPct || 88;

            gsap.utils.toArray(targets).forEach(function (el, i) {
                var from = (i % 2 === 0) ? -xAmp : xAmp;
                gsap.fromTo(el,
                    { opacity: 0, x: from },
                    {
                        opacity: 1, x: 0,
                        duration: dur,
                        ease: EO,
                        overwrite: 'auto',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top ' + startPct + '%',
                            end:   'top 10%',
                            toggleActions: TA
                        }
                    }
                );
            });
        }

        /* ── Helper : fondu + slide vertical ─────────────────────── */
        function up(targets, yAmp, dur, startPct) {
            yAmp     = yAmp     || 50;
            dur      = dur      || 0.80;
            startPct = startPct || 86;

            gsap.utils.toArray(targets).forEach(function (el) {
                gsap.fromTo(el,
                    { opacity: 0, y: yAmp },
                    {
                        opacity: 1, y: 0,
                        duration: dur,
                        ease: EOU,
                        overwrite: 'auto',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top ' + startPct + '%',
                            end:   'top 10%',
                            toggleActions: TA
                        }
                    }
                );
            });
        }

        /* ── SERVICES ─────────────────────────────────────────────── */
        up('#services .svc-hdr h2',     60, .90);
        up('#services .svc-hdr-sub',    30, .75, 88);
        gsap.utils.toArray('.svc-card').forEach(function(el, i) {
            gsap.fromTo(el, { opacity:0, y:50 },
                { opacity:1, y:0, duration:.75, ease:EOU, delay: i * 0.08,
                  scrollTrigger: { trigger: el, start:'top 88%', toggleActions: TA } });
        });
        up('.service-card-auto',        50, .85);
        lr('.svc-xp-card',              80, .70);
        up('.svc-proof',                40, .80);

        /* ── LE PROBLÈME ──────────────────────────────────────────── */
        up('#pourqui .pb-hdr h2',       60, .90);
        up('#pourqui .pb-hdr-sub',      30, .75, 88);
        lr('.pb-card',                 110, .80);
        up('.pb-cta-wrap',              40, .80);

        /* ── LA SOLUTION ──────────────────────────────────────────── */
        up('#valeur .sol-hdr h2',       60, .90);
        up('#valeur .sol-hdr-sub',      30, .75, 88);
        gsap.utils.toArray('.sol-card').forEach(function(el, i) {
            gsap.fromTo(el, { opacity:0, y:60, scale:0.97 },
                { opacity:1, y:0, scale:1, duration:.85, ease:EOU, delay: i * 0.10,
                  scrollTrigger: { trigger: el, start:'top 88%', toggleActions: TA } });
        });

        /* Stats numériques : scale depuis zéro */
        gsap.utils.toArray('.sol-stat').forEach(function (el) {
            gsap.fromTo(el,
                { opacity: 0, scale: .3 },
                {
                    opacity: 1, scale: 1,
                    duration: .70, ease: 'back.out(1.6)',
                    overwrite: 'auto',
                    scrollTrigger: {
                        trigger: el, start: 'top 86%', end: 'top 10%',
                        toggleActions: TA
                    }
                }
            );
        });

        up('.sol-banner',               40, .80);

        /* ── RÉALISATIONS ─────────────────────────────────────────── */
        up('#realisations .pf-hdr',     60, .90);
        gsap.fromTo('.pf-carousel',
            { opacity: 0, y: 70 },
            {
                opacity: 1, y: 0, duration: 1.1, ease: EO, overwrite: 'auto',
                scrollTrigger: {
                    trigger: '.pf-carousel', start: 'top 86%', end: 'top 5%',
                    toggleActions: TA
                }
            }
        );

        /* ── CTA MID-BAND ─────────────────────────────────────────── */
        up('.cta-mid-band',             40, .80);

        /* ── TÉMOIGNAGES ──────────────────────────────────────────── */
        up('#temoignages .section-header', 50, .85);
        gsap.fromTo('.tm-card',
            { opacity: 0, y: 60 },
            {
                opacity: 1, y: 0, duration: 1.1, ease: EO, overwrite: 'auto',
                scrollTrigger: {
                    trigger: '.tm-card', start: 'top 86%', end: 'top 5%',
                    toggleActions: TA
                }
            }
        );

        /* ── À PROPOS ─────────────────────────────────────────────── */
        up('#apropos h2',               50, .85);
        lr('[id="apropos"] .about-col, [id="apropos"] .profile-card', 90, .85);

        /* ── MÉTHODE — stagger séquentiel ────────────────────────── */
        up('#methode h2',               50, .85);
        gsap.utils.toArray('.methode-step').forEach(function(el, i) {
            gsap.fromTo(el, { opacity:0, y:40 },
                { opacity:1, y:0, duration:.70, ease:EOU, delay: i * 0.12,
                  scrollTrigger: { trigger: el, start:'top 88%', toggleActions: TA } });
        });

        /* ── FORMULES — stagger + scale légère ─────────────────── */
        up('#formules h2',              50, .85);
        gsap.utils.toArray('.pr-v2').forEach(function(el, i) {
            gsap.fromTo(el, { opacity:0, y:50, scale:0.96 },
                { opacity:1, y:0, scale:1, duration:.85, ease:'back.out(1.3)', delay: i * 0.09,
                  scrollTrigger: { trigger: el, start:'top 88%', toggleActions: TA } });
        });

        /* ── OPTIONS ──────────────────────────────────────────────── */
        up('#options h2',               50, .85);
        lr('.pr-xcard',                 90, .75);

        /* ── FAQ — stagger avec alternance ─────────────────────── */
        up('#faq h2',                   50, .85);
        gsap.utils.toArray('.faq-item').forEach(function(el, i) {
            gsap.fromTo(el, { opacity:0, x: i%2===0 ? -55 : 55 },
                { opacity:1, x:0, duration:.65, ease:EO, delay: i * 0.06,
                  scrollTrigger: { trigger: el, start:'top 90%', toggleActions: TA } });
        });

        /* ── CONTACT ──────────────────────────────────────────────── */
        up('#contact h2',               60, .90);
        gsap.fromTo('.contact-box',
            { opacity: 0, y: 70 },
            {
                opacity: 1, y: 0, duration: 1.1, ease: EO, overwrite: 'auto',
                scrollTrigger: {
                    trigger: '.contact-box', start: 'top 86%', end: 'top 5%',
                    toggleActions: TA
                }
            }
        );
        lr('.cinfo',                    60, .70, 90);

        /* ── SECTION NUMBERS ──────────────────────────────────────── */
        document.querySelectorAll('.section-num').forEach(function (el) {
            gsap.fromTo(el,
                { opacity: 0, x: -20 },
                {
                    opacity: 1, x: 0, duration: .65, ease: EO, overwrite: 'auto',
                    scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: TA }
                }
            );
        });

        /* ── DIVIDER LINES ────────────────────────────────────────── */
        document.querySelectorAll('.divider-line').forEach(function (el) {
            gsap.fromTo(el,
                { scaleX: 0, transformOrigin: 'left center' },
                {
                    scaleX: 1, duration: .60, ease: EO, delay: .12, overwrite: 'auto',
                    scrollTrigger: { trigger: el, start: 'top 91%', toggleActions: TA }
                }
            );
        });

        /* ── CHIFFRES ANIMÉS — stats sections ────────────────────── */
        initNumberCounters();

        /* ── PARALLAX LÉGER sur les orbs de section ─────────────── */
        initSectionParallax();
    }

    /* ================================================================
       COMPTEURS NUMÉRIQUES — sections stats
    ================================================================ */
    function initNumberCounters() {
        var targets = [
            { selector: '.phi-stat-n', attr: 'data-count' },
        ];

        /* Générique — tout élément avec data-count */
        document.querySelectorAll('[data-count]').forEach(function(el) {
            var target = parseFloat(el.getAttribute('data-count')) || 0;
            var suffix = el.getAttribute('data-suffix') || '';
            var prefix = el.getAttribute('data-prefix') || '';
            var decimals = el.getAttribute('data-decimals') || 0;

            gsap.fromTo({ val: 0 }, { val: target }, {
                duration: 1.8,
                ease: 'power2.out',
                onUpdate: function() {
                    var v = this.targets()[0].val;
                    el.textContent = prefix + v.toFixed(decimals) + suffix;
                },
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    /* ================================================================
       PARALLAX SECTIONS — orbs et backgrounds
    ================================================================ */
    function initSectionParallax() {
        /* Orb hero — renforcé */
        gsap.to('.hero-orb', {
            y: -60,
            ease: 'none',
            scrollTrigger: {
                trigger: '#accueil',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5
            }
        });

        /* Fond de sections — mouvement lent */
        ['#pourqui', '#valeur', '#temoignages', '#formules'].forEach(function(id) {
            var section = document.querySelector(id);
            if (!section) return;
            gsap.fromTo(section,
                { backgroundPositionY: '0%' },
                {
                    backgroundPositionY: '15%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1
                    }
                }
            );
        });

        /* Lignes de section — scale depuis centre */
        if (!isMobile) {
            document.querySelectorAll('.section-header').forEach(function(el) {
                gsap.fromTo(el,
                    { '--line-scale': 0 },
                    {
                        '--line-scale': 1,
                        ease: EO,
                        duration: 0.6,
                        delay: 0.3,
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 85%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            });
        }
    }


    /* ================================================================
       PARALLAX SOURIS — hero — profondeur cinématographique
    ================================================================ */
    function initMouseParallax() {
        var hero  = document.getElementById('accueil');
        if (!hero) return;

        var orb   = hero.querySelector('.hero-orb');
        var cards = hero.querySelectorAll('.hero-card');
        var depth = hero.querySelector('.cine-depth-bg');
        var title = hero.querySelector('.hero-title');
        var mx = 0, my = 0, ox = 0, oy = 0;
        var active = false;

        /* Activation au premier mouvement — évite le saut initial */
        document.addEventListener('mousemove', function (e) {
            mx = (e.clientX / window.innerWidth)  - .5;
            my = (e.clientY / window.innerHeight) - .5;
            active = true;
        }, { passive: true });

        (function tick() {
            if (active) {
                var lag = .048; /* inertie douce */
                ox += (mx - ox) * lag;
                oy += (my - oy) * lag;

                /* Couches à vitesses différentes — effet profondeur */
                if (depth) gsap.set(depth, { x: ox * -22, y: oy * -14 });
                if (orb)   gsap.set(orb,   { x: ox *  60, y: oy *  38 });
                if (title) gsap.set(title,  { x: ox *   6, y: oy *   4 });
                cards.forEach(function (c, i) {
                    var factor = (i + 1) * 22;
                    gsap.set(c, { x: ox * factor, y: oy * (factor * 0.6) });
                });
            }
            requestAnimationFrame(tick);
        })();
    }

    /* ================================================================
       FLOATING DEVIS BUTTON — apparaît après hero, disparaît avant contact
    ================================================================ */
    function initFloatDevis() {
        var btnDevis = document.getElementById('floatDevis');
        var btnWa    = document.getElementById('floatWa');
        var hero     = document.getElementById('accueil');
        var contact  = document.getElementById('contact');
        if (!hero || !contact) return;

        function toggle(el, show) {
            if (!el) return;
            if (show) {
                el.classList.add('visible');
                el.removeAttribute('aria-hidden');
            } else {
                el.classList.remove('visible');
                el.setAttribute('aria-hidden', 'true');
            }
        }

        function update() {
            var heroBottom    = hero.getBoundingClientRect().bottom;
            var contactTop    = contact.getBoundingClientRect().top;
            var winH          = window.innerHeight;
            var afterHero     = heroBottom < winH * 0.5;
            var beforeContact = contactTop > winH * 0.8;
            var show          = afterHero && beforeContact;

            toggle(btnDevis, show);
            toggle(btnWa,    show);
        }

        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    /* ================================================================
       DÉMARRAGE
    ================================================================ */
    document.addEventListener('DOMContentLoaded', function () {

        initBackground();
        initSpotlight();
        initScrollAnimations();
        initFloatDevis();
        if (!isMobile) initMouseParallax();

        /* Hero après disparition du loader */
        var loader = document.getElementById('pageLoader');
        if (!loader) { animateHero(); return; }

        var obs = new MutationObserver(function (_, o) {
            if (loader.classList.contains('hidden')) {
                o.disconnect();
                setTimeout(animateHero, 80);
            }
        });
        obs.observe(loader, { attributes: true, attributeFilter: ['class'] });
        setTimeout(animateHero, 2600);
    });

})();
