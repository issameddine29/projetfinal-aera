
        // Gallery images array
        const galleryImages = [
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
            'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?w=1200&q=80',
            'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80',
            'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80',
            'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1200&q=80',
            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
            'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80',
            'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1200&q=80'
        ];
        let currentImageIndex = 0;
        let currentTestimonial = 0;
        const testimonials = [];
        let counted = false;
        // Initialize after DOM is ready
        document.addEventListener('DOMContentLoaded', function () {
            initLoader();
            initHeader();
            initMenu();
            initTestimonials();
            initLightbox();
            initReveal();
            initCounters();
            initDateInput();
            initDishCards();
        });
        // Loading screen
        function initLoader() {
            const loader = document.querySelector('.loader');
            const progress = document.querySelector('.loader-progress');
            let width = 0;
            const interval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        loader.classList.add('hidden');
                    }, 500);
                } else {
                    width += 5;
                    progress.style.width = width + '%';
                }
            }, 50);
        }
        // Header scroll effect
        function initHeader() {
            window.addEventListener('scroll', () => {
                const header = document.getElementById('header');
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }
        // Mobile menu
        function toggleMenu() {
            const menuToggle = document.querySelector('.menu-toggle');
            const nav = document.getElementById('nav');
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
        }
        function closeMenu() {
            const menuToggle = document.querySelector('.menu-toggle');
            const nav = document.getElementById('nav');
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        }
        // Menu filter
        function initMenu() {
            const buttons = document.querySelectorAll('.filter-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', function () {
                    const category = this.textContent.toLowerCase().replace('é', 'e').replace('è', 'e').replace('ê', 'e');
                    const categoryMap = {
                        'tout': 'all',
                        'entrees': 'entrees',
                        'plats': 'plats',
                        'desserts': 'desserts'
                    };
                    filterMenu(categoryMap[category] || category);
                });
            });
        }
        function filterMenu(category) {
            const categories = document.querySelectorAll('.menu-category');
            const buttons = document.querySelectorAll('.filter-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            categories.forEach(cat => {
                const isActive = category === 'all' || cat.id === category;
                if (isActive) {
                    cat.classList.add('active');
                    cat.style.display = 'contents';
                    cat.style.opacity = '1';
                } else {
                    cat.classList.remove('active');
                    cat.style.display = 'none';
                }
            });
            // Animate dish cards
            setTimeout(() => {
                const visibleCards = document.querySelectorAll('.menu-category.active .dish-card');
                visibleCards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }, 50);
        }
        // Testimonials carousel
        function initTestimonials() {
            const testimonialCards = document.querySelectorAll('.testimonial-card');
            const track = document.getElementById('testimonialsTrack');
            const dotsContainer = document.getElementById('testimonialDots');
            testimonialCards.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToTestimonial(index));
                dotsContainer.appendChild(dot);
            });
            // Auto-play testimonials
            setInterval(nextTestimonial, 5000);
        }
        function updateTestimonials() {
            const track = document.getElementById('testimonialsTrack');
            const dots = document.querySelectorAll('.dot');
            track.style.transform = `translateX(-${currentTestimonial * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentTestimonial);
            });
        }
        function nextTestimonial() {
            const testimonialCards = document.querySelectorAll('.testimonial-card');
            currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
            updateTestimonials();
        }
        function prevTestimonial() {
            const testimonialCards = document.querySelectorAll('.testimonial-card');
            currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
            updateTestimonials();
        }
        function goToTestimonial(index) {
            currentTestimonial = index;
            updateTestimonials();
        }
        // Lightbox
        function initLightbox() {
            document.addEventListener('keydown', (e) => {
                const lightbox = document.getElementById('lightbox');
                if (!lightbox.classList.contains('active')) return;
                if (e.key === 'Escape') closeLightbox(e);
                if (e.key === 'ArrowRight') nextImage();
                if (e.key === 'ArrowLeft') prevImage();
            });
        }
        function openLightbox(index) {
            currentImageIndex = index;
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            lightboxImg.src = galleryImages[index];
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        function closeLightbox(e) {
            if (e && e.target.tagName !== 'IMG') {
                const lightbox = document.getElementById('lightbox');
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
        function nextImage() {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            document.getElementById('lightbox-img').src = galleryImages[currentImageIndex];
        }
        function prevImage() {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            document.getElementById('lightbox-img').src = galleryImages[currentImageIndex];
        }
        // Scroll reveal
        function initReveal() {
            const revealElements = document.querySelectorAll('.reveal');
            function reveal() {
                revealElements.forEach(element => {
                    const windowHeight = window.innerHeight;
                    const elementTop = element.getBoundingClientRect().top;
                    const elementVisible = 150;
                    if (elementTop < windowHeight - elementVisible) {
                        element.classList.add('active');
                    }
                });
            }
            window.addEventListener('scroll', reveal);
            reveal();
        }
        // Counter animation
        function initCounters() {
            window.addEventListener('scroll', animateCounters);
        }
        function animateCounters() {
            if (counted) return;
            const aboutSection = document.querySelector('.about');
            if (!aboutSection) return;
            const sectionTop = aboutSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (sectionTop < windowHeight - 100) {
                counted = true;
                const statNumbers = document.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            stat.textContent = Math.floor(current).toLocaleString();
                            requestAnimationFrame(updateCounter);
                        } else {
                            stat.textContent = target.toLocaleString() + (target > 10 ? '+' : '');
                        }
                    };
                    updateCounter();
                });
            }
        }
        // Date input minimum
        function initDateInput() {
            const dateInput = document.getElementById('date');
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.setAttribute('min', today);
            }
        }
        // Initialize dish cards animation
        function initDishCards() {
            const dishCards = document.querySelectorAll('.dish-card');
            dishCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 100);
            });
        }
        // Reservation form handler
        function handleReservation(e) {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                guests: document.getElementById('guests').value,
                special: document.getElementById('special').value
            };
            btn.classList.add('loading');
            btn.disabled = true;
            btn.textContent = 'Réservation en cours...';
            setTimeout(() => {
                btn.classList.remove('loading');
                btn.disabled = false;
                btn.textContent = 'Confirmer la Réservation';
                showNotification('Réservation confirmée ! Un email vous a été envoyé.', 'success');
                document.getElementById('reservationForm').reset();
            }, 2000);
            console.log('Réservation:', formData);
        }
        // Notification system
        function showNotification(message, type) {
            const notification = document.getElementById('notification');
            const notificationText = document.getElementById('notification-text');
            notificationText.textContent = message;
            notification.classList.add(type, 'show');
            setTimeout(() => {
                notification.classList.remove('show', type);
            }, 4000);
        }
        // Close mobile menu on resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 968) {
                closeMenu();
            }
        });
   