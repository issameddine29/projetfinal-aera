/* ================================================================
   ÆRĀ STUDIO — main.js  v2.0
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── THEME TOGGLE ─────────────────────────────────────────────
    (function() {
        const btn  = document.getElementById('themeToggle');
        const html = document.documentElement;
        const PREF_KEY = 'aera-theme';

        // Lire le thème actuel (déjà appliqué par le script anti-flash)
        const getTheme = () => html.getAttribute('data-theme') || 'light';

        const applyTheme = (theme) => {
            html.setAttribute('data-theme', theme);
            localStorage.setItem(PREF_KEY, theme);

            // Meta theme-color navigateur
            let meta = document.querySelector('meta[name="theme-color"]');
            if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); }
            meta.content = theme === 'dark' ? '#07090F' : '#F3EDE3';

            // Aria label
            if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
        };

        const toggle = () => applyTheme(getTheme() === 'dark' ? 'light' : 'dark');

        if (btn) {
            btn.addEventListener('click', toggle);

            // Raccourci clavier Alt+T
            document.addEventListener('keydown', e => {
                if (e.altKey && e.key === 't') toggle();
            });
        }

        // Écouter les changements système (si l'utilisateur n'a pas fait de choix manuel)
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        mq.addEventListener('change', e => {
            if (!localStorage.getItem(PREF_KEY)) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });

        // Init aria-label
        applyTheme(getTheme());
    })();


    // ── PAGE LOADER ──────────────────────────────────────────────
    const loader = document.getElementById('pageLoader');
    if (loader) {
        const t0 = performance.now();
        const hideLoader = () => {
            const elapsed = performance.now() - t0;
            const delay = Math.max(0, 400 - elapsed);
            setTimeout(() => loader.classList.add('hidden'), delay);
        };
        if (document.readyState === 'complete') {
            hideLoader();
        } else {
            window.addEventListener('load', hideLoader);
        }
    }

    // ── CURSEUR PERSONNALISÉ ─────────────────────────────────────
    const cursor = document.getElementById('customCursor');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (cursor && window.innerWidth > 768 && !prefersReducedMotion) {
        let mx = 0, my = 0, cx = 0, cy = 0;
        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
        const lerp = (a, b, t) => a + (b - a) * t;
        const tick = () => {
            cx = lerp(cx, mx, 0.14);
            cy = lerp(cy, my, 0.14);
            cursor.style.left = cx + 'px';
            cursor.style.top  = cy + 'px';
            requestAnimationFrame(tick);
        };
        tick();

        document.querySelectorAll('a, button, .service-card, .realisation-item, .audience-card, .valeur-card, .testimonial-card, .methode-step, .faq-item, .cinfo').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });
    }

    // ── SCROLL PROGRESS ──────────────────────────────────────────
    const bar = document.getElementById('scrollProgress');
    if (bar) {
        window.addEventListener('scroll', () => {
            const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            bar.style.width = ((document.documentElement.scrollTop / h) * 100) + '%';
        }, { passive: true });
    }

    // ── PARTICLES ────────────────────────────────────────────────
    const pc = document.getElementById('particles');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (pc && !reducedMotion && window.innerWidth > 768) {
        const frag = document.createDocumentFragment();
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.cssText = `left:${Math.random()*100}%;animation-delay:${Math.random()*25}s;animation-duration:${18+Math.random()*12}s;will-change:transform`;
            frag.appendChild(p);
        }
        pc.appendChild(frag);
    }

    // ── NAVBAR SCROLL ─────────────────────────────────────────────
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        }, { passive: true });
    }

    // ── MENU MOBILE ───────────────────────────────────────────────
    const toggle  = document.getElementById('menuToggle');
    const navList = document.getElementById('navLinks');
    if (toggle && navList) {
        toggle.addEventListener('click', () => {
            const open = toggle.classList.toggle('active');
            navList.classList.toggle('active', open);
            toggle.setAttribute('aria-expanded', open);
        });
    }

    // ── SMOOTH SCROLL ─────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const t = document.querySelector(a.getAttribute('href'));
            if (!t) return;
            e.preventDefault();
            t.scrollIntoView({ behavior: 'smooth' });
            if (toggle && navList) {
                toggle.classList.remove('active');
                navList.classList.remove('active');
                toggle.setAttribute('aria-expanded', false);
            }
        });
    });

    // ── FAQ ───────────────────────────────────────────────────────
    document.querySelectorAll('.faq-item').forEach(item => {
        const q = item.querySelector('.faq-q');
        if (!q) return;

        const open = () => {
            const isOpen = item.classList.contains('active');
            document.querySelectorAll('.faq-item.active').forEach(other => {
                if (other !== item) { other.classList.remove('active'); other.querySelector('.faq-q')?.setAttribute('aria-expanded', false); }
            });
            item.classList.toggle('active', !isOpen);
            q.setAttribute('aria-expanded', !isOpen);
        };

        q.addEventListener('click', open);
        q.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });

    // ── FORMULAIRE ────────────────────────────────────────────────
    // URL du backend lue depuis <meta name="backend-url"> dans le HTML.
    // En dev  : <meta name="backend-url" content="http://localhost:5000">
    // En prod : <meta name="backend-url" content="https://api.aera-studio.be">
    // Ne jamais hardcoder l'URL ici — modifier uniquement le meta tag.
    const BACKEND_URL = (
        document.querySelector('meta[name="backend-url"]')?.getAttribute('content') || ''
    ).replace(/\/$/, '');

    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async e => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            if (btn) { btn.disabled = true; const s = btn.querySelector('span'); if (s) s.textContent = 'Envoi en cours…'; }

            try {
                // Build qualified description
                const rawMsg    = (form.querySelector('#message')?.value      || '').trim();
                const formule   = (form.querySelector('#formule')?.value      || '').trim();
                const activite  = (form.querySelector('#activite')?.value     || '').trim();
                const existSite = (form.querySelector('#existing_site')?.value|| '').trim();
                const delai     = (form.querySelector('input[name="delai"]:checked')?.value || '').trim();

                const qualLines = [
                    formule    ? `Formule : ${formule}`         : '',
                    existSite  ? `Site existant : ${existSite}` : '',
                    delai      ? `Délai : ${delai}`             : '',
                    activite   ? `Activité : ${activite}`       : '',
                ].filter(Boolean).join('\n');

                const description = qualLines
                    ? `${qualLines}\n\n${rawMsg}`
                    : rawMsg;

                const payload = {
                    client_nom:        (form.querySelector('#name')?.value    || '').trim(),
                    client_email:      (form.querySelector('#email')?.value   || '').trim(),
                    client_entreprise: (form.querySelector('#company')?.value || '').trim(),
                    client_telephone:  (form.querySelector('#phone')?.value   || '').trim(),
                    description,
                    // Anti-spam — ne pas modifier
                    _ts:     Date.now(),
                    website: (form.querySelector('#website')?.value || '').trim(),
                };

                const res = await fetch(`${BACKEND_URL}/api/contact`, {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify(payload),
                });

                const json = await res.json().catch(() => ({}));

                    if (res.ok) {
                        showToast('✅', 'Message envoyé !', json.message || 'Je vous recontacte très vite par téléphone.');
                        form.reset();
                } else {
                    showToast('❌', 'Erreur d\'envoi', json.erreur || 'Contactez-moi directement par téléphone.');
                }
            } catch {
                showToast('❌', 'Erreur réseau', 'Vérifiez votre connexion et réessayez.');
            } finally {
                if (btn) { btn.disabled = false; const s = btn.querySelector('span'); if (s) s.textContent = 'Envoyer ma demande →'; }
            }
        });
    }

    // ── MULTI-STEP FORM ──────────────────────────────────────────
    function goToStep(n) {
        const step1 = document.getElementById('fstep-1');
        const step2 = document.getElementById('fstep-2');
        const dots  = document.querySelectorAll('.form-step-dot');
        const line  = document.querySelector('.form-step-line');
        if (!step1 || !step2) return;

        if (n === 2) {
            step1.classList.add('form-step--hidden');
            step2.classList.remove('form-step--hidden');
            dots[0]?.classList.remove('is-active');
            dots[0]?.classList.add('is-done');
            dots[1]?.classList.add('is-active');
            line?.classList.add('is-done');
        } else {
            step2.classList.add('form-step--hidden');
            step1.classList.remove('form-step--hidden');
            dots[1]?.classList.remove('is-active', 'is-done');
            dots[0]?.classList.remove('is-done');
            dots[0]?.classList.add('is-active');
            line?.classList.remove('is-done');
        }
    }

    function validateStep1() {
        const fields = [
            { el: document.getElementById('name'),    test: v => v.trim().length >= 2 },
            { el: document.getElementById('phone'),   test: v => v.trim().length >= 6 },
            { el: document.getElementById('activite'), test: v => v.trim().length >= 2 },
        ];
        let ok = true;
        fields.forEach(({ el, test }) => {
            if (!el) return;
            el.classList.remove('field-error');
            if (!test(el.value)) {
                el.classList.add('field-error');
                ok = false;
            }
        });
        if (!ok) {
            const first = document.querySelector('#fstep-1 .field-error');
            first?.focus();
        }
        return ok;
    }

    document.querySelector('.form-next-btn')?.addEventListener('click', () => {
        if (validateStep1()) goToStep(2);
    });
    document.querySelector('.form-back-btn')?.addEventListener('click', () => goToStep(1));

    function showToast(icon, title, sub) {
        document.querySelector('.toast-notification')?.remove();
        const t = document.createElement('div');
        t.className = 'toast-notification';

        const iconEl = document.createElement('div');
        iconEl.className = 'toast-icon';
        iconEl.textContent = icon;

        const textEl = document.createElement('div');
        textEl.className = 'toast-text';
        const strong = document.createElement('strong');
        strong.textContent = title;
        const span = document.createElement('span');
        span.textContent = sub;
        textEl.append(strong, span);

        t.append(iconEl, textEl);
        document.body.appendChild(t);
        requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('visible')));
        setTimeout(() => { t.classList.remove('visible'); setTimeout(() => t.remove(), 500); }, 5000);
    }

    // ── REVEAL ANIMATIONS ─────────────────────────────────────────
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.classList.add('revealed');
            revealObs.unobserve(e.target);
            // Déclencher les split-words h2 en même temps que le reveal
            if (!prefersReducedMotion) {
                e.target.querySelectorAll('h2 .split-word').forEach((w, i) => {
                    w.style.transitionDelay = `${300 + i * 65}ms`;
                    w.classList.add('in');
                });
            }
        });
    }, { threshold: 0, rootMargin: '0px 0px -20px 0px' });

    document.querySelectorAll('.reveal-text, .reveal-card').forEach(el => revealObs.observe(el));

    // ── SKILL BARS ────────────────────────────────────────────────
    const skillObs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.target; skillObs.unobserve(e.target); } });
    }, { threshold: 0.4 });

    document.querySelectorAll('.skill-fill').forEach(el => skillObs.observe(el));

    // ── SCROLL SPY (active nav link) ──────────────────────────────
    const sections  = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    const spyObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                navAnchors.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`);
                });
            }
        });
    }, { threshold: 0.45 });

    sections.forEach(s => spyObs.observe(s));

    // ── CONTACT 3D TILT ───────────────────────────────────────────
    const cbox = document.querySelector('.contact-box');
    if (cbox && window.innerWidth > 992) {
        cbox.addEventListener('mousemove', e => {
            const r = cbox.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width  - 0.5) * 4;
            const y = ((e.clientY - r.top)  / r.height - 0.5) * -4;
            cbox.style.transform = `perspective(1200px) rotateY(${x}deg) rotateX(${y}deg)`;
        });
        cbox.addEventListener('mouseleave', () => { cbox.style.transform = ''; });
    }

    // ── HEADER PARALLAX ───────────────────────────────────────────
    let parallaxTicking = false;
    window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
            requestAnimationFrame(() => {
                const hero = document.querySelector('#accueil .hero-inner');
                if (hero) hero.style.transform = `translateY(${window.scrollY * 0.08}px)`;
                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    }, { passive: true });

    // ── CAROUSEL PORTFOLIO v4 ────────────────────────────────────
    (function() {
        const root    = document.getElementById('portfolioCarousel');
        if (!root) return;

        const track   = document.getElementById('carouselTrack');
        if (!track) return;
        const slides  = Array.from(track.querySelectorAll('.pf-slide, .pfv2-slide'));
        const dots    = Array.from(root.querySelectorAll('.carousel-dot, .pfv2-dot'));
        const prev    = document.getElementById('carouselPrev');
        const next    = document.getElementById('carouselNext');
        const counter = document.getElementById('carouselCounter');
        const label   = document.getElementById('carouselLabel');
        const controls = root.querySelector('.carousel-controls');
        const total   = slides.length;
        let current   = 0;
        let autoTimer = null;
        let isAnim    = false;
        let interacted = false;

        // ── Barre de progression (définie avant goTo pour être appelable dedans)
        const updateProgressBar = () => {
            if (!controls) return;
            let styleTag = document.getElementById('carousel-progress-style');
            if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.id = 'carousel-progress-style';
                document.head.appendChild(styleTag);
            }
            styleTag.textContent = `.carousel-controls::before { width: ${(current + 1) / total * 100}% !important; }`;
        };

        const goTo = (idx, fromAuto = false) => {
            if (isAnim) return;
            const target = ((idx % total) + total) % total;
            if (target === current && !fromAuto) return;
            isAnim = true;

            root.setAttribute('data-dir', target > current ? 'forward' : 'backward');
            slides[current].classList.remove('is-active');
            current = target;
            track.style.transform = `translateX(-${current * 100}%)`;

            // ── Accent CSS global réactif au slide ──
            const activeSlide = slides[current];
            const acc    = activeSlide.style.getPropertyValue('--acc')     || '#4D9EFF';
            const accRgb = activeSlide.style.getPropertyValue('--acc-rgb') || '77,158,255';
            root.style.setProperty('--slide-acc',     acc);
            root.style.setProperty('--slide-acc-rgb', accRgb);

            // ── Score bar reset avant activation ──
            const scoreFill = activeSlide.querySelector('.pfv2-score-fill');
            if (scoreFill) {
              const targetW = scoreFill.style.width;
              scoreFill.style.transition = 'none';
              scoreFill.style.width = '0';
              setTimeout(() => {
                scoreFill.style.transition = '';
                scoreFill.style.width = targetW;
              }, 80);
            }

            setTimeout(() => slides[current].classList.add('is-active'), 50);

            dots.forEach((d, i) => {
                d.classList.toggle('active', i === current);
                d.setAttribute('aria-selected', i === current);
            });

            if (prev) prev.disabled = current === 0;
            if (next) next.disabled = current === total - 1;
            if (counter) counter.textContent = `${current + 1} / ${total}`;
            if (label && dots[current]) label.innerHTML = dots[current].dataset.label || '';

            root.setAttribute('data-current', current);
            if (current === total - 1) root.setAttribute('data-last', '');
            else root.removeAttribute('data-last');

            if (!interacted) { interacted = true; root.classList.add('interacted'); }

            try { updateProgressBar(); } catch (_) {}
            setTimeout(() => { isAnim = false; }, 750);
            if (!fromAuto) resetAuto();
        };

        const startAuto = () => {
            clearInterval(autoTimer);
            if (current >= total - 1) return;
            autoTimer = setInterval(() => {
                if (current < total - 1) goTo(current + 1, true);
                else clearInterval(autoTimer);
            }, 5500);
        };

        const resetAuto = () => { clearInterval(autoTimer); startAuto(); };

        // ── Init accent slide 0 ──
        (function initAccent() {
            const s0 = slides[0];
            if (!s0) return;
            const acc    = s0.style.getPropertyValue('--acc')     || '#4D9EFF';
            const accRgb = s0.style.getPropertyValue('--acc-rgb') || '77,158,255';
            root.style.setProperty('--slide-acc',     acc);
            root.style.setProperty('--slide-acc-rgb', accRgb);
        })();

        // Boutons
        if (prev) prev.addEventListener('click', () => goTo(current - 1));
        if (next) next.addEventListener('click', () => goTo(current + 1));
        dots.forEach(d => d.addEventListener('click', () => goTo(parseInt(d.dataset.index))));

        // Clavier
        root.setAttribute('tabindex', '0');
        root.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
        });

        // ── SWIPE TACTILE ───────────────────────────────────────
        let tStartX = 0, tStartY = 0;
        root.addEventListener('touchstart', e => {
            tStartX = e.touches[0].clientX;
            tStartY = e.touches[0].clientY;
        }, { passive: true });
        root.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - tStartX;
            const dy = e.changedTouches[0].clientY - tStartY;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) {
                dx < 0 ? goTo(current + 1) : goTo(current - 1);
            }
        }, { passive: true });

        // ── DRAG SOURIS ─────────────────────────────────────────
        let mStartX = 0, mDragging = false, mDragged = false;
        root.addEventListener('mousedown', e => {
            if (e.button !== 0) return;
            mStartX = e.clientX; mDragging = true; mDragged = false;
            track.style.transition = 'none';
            root.classList.add('dragging');
        });
        document.addEventListener('mousemove', e => {
            if (!mDragging) return;
            const diff = e.clientX - mStartX;
            if (Math.abs(diff) > 8) mDragged = true;
            const clamped = Math.max(-(total - 1) * 100, Math.min(0, -current * 100 + (diff / root.offsetWidth) * 100));
            track.style.transform = `translateX(${clamped}%)`;
        });
        document.addEventListener('mouseup', e => {
            if (!mDragging) return;
            mDragging = false; root.classList.remove('dragging'); track.style.transition = '';
            const dx = e.clientX - mStartX;
            if (Math.abs(dx) > 64 && mDragged) {
                dx < 0 ? goTo(current + 1) : goTo(current - 1);
            } else {
                track.style.transform = `translateX(-${current * 100}%)`;
            }
        });
        root.addEventListener('click', e => {
            if (mDragged) {
                if (!e.target.closest('.carousel-controls')) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                mDragged = false;
            }
        }, true);

        root.addEventListener('mouseenter', () => clearInterval(autoTimer));
        root.addEventListener('mouseleave', () => startAuto());

        // ── INIT ─────────────────────────────────────────────────────────────────
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === 0);
            d.setAttribute('aria-selected', String(i === 0));
        });
        if (prev) prev.disabled = true;
        if (next) next.disabled = total <= 1;
        if (counter) counter.textContent = `1 / ${total}`;
        if (label && dots[0]) label.innerHTML = dots[0].dataset.label || '';
        root.setAttribute('data-current', '0');
        updateProgressBar();

        // Activer le slide 1 + démarrer l'auto-play SEULEMENT quand le carousel
        // est visible (classe "revealed" ajoutée par l'IntersectionObserver).
        // Sans ça, les animations du slide 1 jouent dans le vide (opacity:0)
        // et l'auto-play peut avancer avant que l'utilisateur voie le carousel.
        const startVisible = () => {
            slides[0].classList.add('is-active');
            startAuto();
        };
        if (root.classList.contains('revealed')) {
            startVisible();
        } else {
            let started = false;
            const revealWatch = new MutationObserver(() => {
                if (root.classList.contains('revealed') && !started) {
                    started = true;
                    revealWatch.disconnect();
                    startVisible();
                }
            });
            revealWatch.observe(root, { attributes: true, attributeFilter: ['class'] });
            // Fallback : si IntersectionObserver ne supporte pas l'élément (rare), activer après 10s
            setTimeout(() => { if (!started) { started = true; revealWatch.disconnect(); startVisible(); } }, 10000);
        }

    })();

    // ── COMPTEURS ANIMÉS ─────────────────────────────────────────────────────
    function animateCounter(el, duration) {
        // Lire uniquement le premier nœud texte (hors balises enfants comme <sup>)
        const rawText = el.dataset.target !== undefined
            ? el.dataset.target
            : (el.childNodes[0]?.textContent?.trim() || '');
        // Ignorer les plages (4–5), les symboles (<, >) et les vides
        if (!rawText || /[–—<>]/.test(rawText)) return;
        const raw    = rawText.replace(/[^\d.]/g, '');
        const target = parseFloat(raw);
        if (isNaN(target)) return;

        // Préserver le suffixe balise (ex: <sup>h</sup>) et texte (ex: %)
        const suffix = el.querySelector('sup, sub, .unit');
        const suffixHTML = suffix ? suffix.outerHTML : '';
        if (suffix) suffix.remove();

        const prefix   = (el.dataset.prefix || '');
        // Suffixe texte inline après les chiffres (ex: "%" dans "100%")
        const trailSuffix = rawText.replace(/^[^\d]*[\d.]+/, '');
        const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
        const start = performance.now();

        function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const value = target * easeOut(progress);
            el.textContent = prefix + value.toFixed(decimals) + trailSuffix;
            if (suffixHTML) el.insertAdjacentHTML('beforeend', suffixHTML);
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.classList.add('done-counting');
            }
        }
        requestAnimationFrame(tick);
    }

    const countObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            countObs.unobserve(entry.target);
            if (prefersReducedMotion) {
                entry.target.classList.add('done-counting');
                return;
            }
            animateCounter(entry.target, 1800);
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.hero-stat-num, .cpanel-trust-n').forEach(el => countObs.observe(el));

    // ── TILT 3D ──────────────────────────────────────────────────────────────
    function addTilt(selector, intensity) {
        document.querySelectorAll(selector).forEach(card => {
            card.classList.add('tilt-card');

            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const cx   = rect.left + rect.width  / 2;
                const cy   = rect.top  + rect.height / 2;
                const dx   = (e.clientX - cx) / (rect.width  / 2);
                const dy   = (e.clientY - cy) / (rect.height / 2);
                card.classList.remove('resetting');
                card.classList.add('tilting');
                card.style.transform =
                    `perspective(800px) rotateX(${-dy * intensity}deg) rotateY(${dx * intensity}deg) scale(1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('tilting');
                card.classList.add('resetting');
                card.style.transform = '';
                setTimeout(() => card.classList.remove('resetting'), 400);
            });
        });
    }

    if (window.innerWidth > 768 && !prefersReducedMotion) {
        addTilt('.svc-card',  6);
        addTilt('.pr-card',   5);
        addTilt('.sol-card',  4);
    }

    // ── BOUTONS MAGNÉTIQUES ───────────────────────────────────────────────────
    function addMagnet(selector, strength) {
        document.querySelectorAll(selector).forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const cx   = rect.left + rect.width  / 2;
                const cy   = rect.top  + rect.height / 2;
                const dx   = (e.clientX - cx) * strength;
                const dy   = (e.clientY - cy) * strength;
                btn.style.transform = `translate(${dx}px, ${dy}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.classList.add('magnet-reset');
                btn.style.transform = '';
                setTimeout(() => btn.classList.remove('magnet-reset'), 400);
            });
        });
    }

    if (window.innerWidth > 768 && !prefersReducedMotion) {
        addMagnet('.btn-primary', 0.3);
        addMagnet('.btn-ghost',   0.25);
    }

    // ── REACTBITS ────────────────────────────────────────────────────────────

    // 1. ShinyText — glint animé sur les numéros de section
    document.querySelectorAll('.section-num').forEach(el => el.classList.add('shiny-text'));

    // 2. TextScramble — effet hacker sur le hero overline
    (function () {
        const el = document.querySelector('.hero-overline');
        if (!el || prefersReducedMotion) return;
        const chars    = 'AEÆĀĒJKMNOPRSTUVXYZaerā·—![]{}=+*?#';
        const original = el.textContent;
        let queue = [], frameReq, frame = 0;

        function rch() { return chars[Math.floor(Math.random() * chars.length)]; }

        function update() {
            let out = '', done = 0;
            queue.forEach(q => {
                if (frame >= q.end)        { done++; out += q.to; }
                else if (frame >= q.st)    { if (!q.ch || Math.random() < 0.28) q.ch = rch(); out += `<span class="scramble-char">${q.ch}</span>`; }
                else                       { out += q.fr; }
            });
            el.innerHTML = out;
            if (done < queue.length) frameReq = requestAnimationFrame(() => { frame++; update(); });
        }

        function scramble(text) {
            const old = el.textContent;
            queue = []; frame = 0;
            for (let i = 0; i < Math.max(old.length, text.length); i++)
                queue.push({ fr: old[i] || '', to: text[i] || '', st: Math.floor(Math.random() * 6), end: 9 + i + Math.floor(Math.random() * 7), ch: '' });
            cancelAnimationFrame(frameReq);
            update();
        }

        el.textContent = '';
        setTimeout(() => scramble(original), 700);
    })();

    // 3. SplitText — h2 de section, mot par mot (trigger dans revealObs)
    if (!prefersReducedMotion) {
        document.querySelectorAll('.reveal-text h2').forEach(h2 => {
            const walker = document.createTreeWalker(h2, NodeFilter.SHOW_TEXT);
            const nodes  = [];
            let nd;
            while ((nd = walker.nextNode())) nodes.push(nd);
            nodes.forEach(tn => {
                const frag = document.createDocumentFragment();
                tn.textContent.split(/(\s+)/).forEach(p => {
                    if (!p) return;
                    if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
                    const s = document.createElement('span');
                    s.className = 'split-word';
                    s.textContent = p;
                    frag.appendChild(s);
                });
                tn.replaceWith(frag);
            });
        });
    }

    // 4. Spotlight — lueur qui suit le curseur sur les cartes
    (function () {
        if (prefersReducedMotion) return;
        ['svc-card', 'sol-card', 'pb-card'].forEach(cls => {
            document.querySelectorAll('.' + cls).forEach(card => {
                const glow = document.createElement('div');
                glow.className = 'card-spotlight';
                glow.setAttribute('aria-hidden', 'true');
                card.prepend(glow);
                card.addEventListener('mousemove', e => {
                    const r = card.getBoundingClientRect();
                    glow.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
                    glow.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
                });
                card.addEventListener('mouseleave', () => {
                    glow.style.removeProperty('--mouse-x');
                    glow.style.removeProperty('--mouse-y');
                });
            });
        });
    })();

}); // fin DOMContentLoaded

// ── HERO STARS — étoiles scintillantes + étoiles filantes ────────
(function () {
    const canvas = document.getElementById('heroStars');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, stars = [], shooters = [];
    const STAR_COUNT = 820;
    const SHOOTER_INTERVAL = 40; // ms entre chaque vague

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    function randBetween(a, b) { return a + Math.random() * (b - a); }

    function createStar() {
        return {
            x: Math.random() * W,
            y: Math.random() * H,
            r: randBetween(0.5, 2.4),
            alpha: randBetween(0.35, 1),
            speed: randBetween(0.006, 0.022),   // vitesse de scintillement
            phase: Math.random() * Math.PI * 2,
            twinkleAmp: randBetween(0.4, 0.85), // amplitude du scintillement
        };
    }

    function createShooter() {
        // Départ depuis n'importe quel bord
        const edge = Math.floor(Math.random() * 4); // 0=haut 1=droite 2=bas 3=gauche
        let x, y;
        if (edge === 0) { x = randBetween(0, W); y = -10; }
        else if (edge === 1) { x = W + 10; y = randBetween(0, H); }
        else if (edge === 2) { x = randBetween(0, W); y = H + 10; }
        else { x = -10; y = randBetween(0, H); }

        // Direction vers l'intérieur + déviation aléatoire ±70°
        const baseAngle = Math.atan2(H / 2 - y, W / 2 - x);
        const angle = baseAngle + randBetween(-1.2, 1.2);
        const speed = randBetween(5, 13);
        const length = randBetween(70, 200);
        return {
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            length,
            life: 1,
            decay: randBetween(0.016, 0.034),
        };
    }

    function initStars() {
        stars = Array.from({ length: STAR_COUNT }, createStar);
    }

    let lastShooter = 0;
    function tick(ts) {
        ctx.clearRect(0, 0, W, H);

        // ── Étoiles scintillantes
        stars.forEach(s => {
            s.phase += s.speed;
            const a = s.alpha * (s.twinkleAmp + (1 - s.twinkleAmp) * (0.5 + 0.5 * Math.sin(s.phase)));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
            ctx.fill();
        });

        // ── Pluie d'étoiles filantes — 8 à 18 par vague toutes les 120ms
        if (ts - lastShooter > SHOOTER_INTERVAL) {
            const batch = Math.floor(randBetween(25, 50));
            for (let i = 0; i < batch; i++) shooters.push(createShooter());
            lastShooter = ts;
        }

        // ── Dessiner & déplacer les étoiles filantes
        shooters = shooters.filter(s => s.life > 0);
        shooters.forEach(s => {
            s.x += s.vx;
            s.y += s.vy;
            s.life -= s.decay;

            const tailX = s.x - s.vx * (s.length / 10);
            const tailY = s.y - s.vy * (s.length / 10);

            const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
            grad.addColorStop(0, `rgba(255,255,255,0)`);
            grad.addColorStop(0.7, `rgba(180,220,255,${(s.life * 0.6).toFixed(3)})`);
            grad.addColorStop(1, `rgba(255,255,255,${(s.life * 0.95).toFixed(3)})`);

            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(s.x, s.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Petit point lumineux à la tête
            ctx.beginPath();
            ctx.arc(s.x, s.y, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${(s.life * 0.9).toFixed(3)})`;
            ctx.fill();
        });

        requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener('resize', () => { resize(); initStars(); });
    initStars();
    requestAnimationFrame(tick);
})();
