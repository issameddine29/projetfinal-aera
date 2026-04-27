// ===== MOBILE MENU =====
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        menuToggle?.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // ===== FAQ ACCORDION =====
        document.querySelectorAll('.faq-question').forEach(button => {
            button.addEventListener('click', () => {
                const item = button.parentElement;
                const isActive = item.classList.contains('active');
                document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });
        });

        // ===== SCROLL ANIMATIONS =====
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.animate-on-scroll');
            const windowHeight = window.innerHeight;
            elements.forEach(el => {
                if (el.getBoundingClientRect().top < windowHeight - 100) {
                    el.classList.add('visible');
                }
            });
        };
        document.addEventListener('DOMContentLoaded', animateOnScroll);
        window.addEventListener('scroll', animateOnScroll);

        // ===== SMOOTH SCROLL =====
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });