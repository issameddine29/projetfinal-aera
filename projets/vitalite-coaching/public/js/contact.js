// ===== CONFIGURATION =====
        const CONFIG = {
            timeSlots: ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
            bookingHours: { start: 9, end: 18 },
            daysAvailable: [1, 2, 3, 4, 5, 6], // Lundi à Samedi (0 = Dimanche)
            maxDaysAhead: 60, // Réservations possibles jusqu'à 60 jours
            storageKey: 'vitalite_bookings'
        };

        // ===== STATE =====
        let currentDate = new Date();
        let selectedDate = null;
        let selectedTime = null;

        // ===== DOM ELEMENTS =====
        const elements = {
            form: document.getElementById('bookingForm'),
            submitBtn: document.getElementById('submitBtn'),
            alertContainer: document.getElementById('alertContainer'),
            calendarGrid: document.getElementById('calendarGrid'),
            slotsGrid: document.getElementById('slotsGrid'),
            currentMonthYear: document.getElementById('currentMonthYear'),
            prevMonth: document.getElementById('prevMonth'),
            nextMonth: document.getElementById('nextMonth'),
            selectedDateTime: document.getElementById('selectedDateTime'),
            modal: document.getElementById('confirmationModal'),
            modalClose: document.getElementById('modalClose'),
            hintChips: document.querySelectorAll('.hint-chip')
        };

        // ===== UTILITIES =====
        const formatDate = (date) => {
            return date.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        };

        const formatTime = (time) => {
            const [h, m] = time.split(':');
            return `${h}h${m}`;
        };

        const isDateAvailable = (date) => {
            const day = date.getDay();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const maxDate = new Date();
            maxDate.setDate(today.getDate() + CONFIG.maxDaysAhead);
            
            return CONFIG.daysAvailable.includes(day) && 
                   date >= today && 
                   date <= maxDate;
        };

        const getBookedSlots = (dateStr) => {
            const bookings = JSON.parse(localStorage.getItem(CONFIG.storageKey)) || {};
            return bookings[dateStr] || [];
        };

        const saveBooking = (dateStr, time, data) => {
            const bookings = JSON.parse(localStorage.getItem(CONFIG.storageKey)) || {};
            if (!bookings[dateStr]) bookings[dateStr] = [];
            bookings[dateStr].push({ time, ...data, timestamp: new Date().toISOString() });
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(bookings));
        };

        // ===== CALENDAR FUNCTIONS =====
        const renderCalendar = () => {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            // Update header
            const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                               'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
            elements.currentMonthYear.textContent = `${monthNames[month]} ${year}`;
            
            // Clear grid
            elements.calendarGrid.innerHTML = '';
            
            // Day names
            const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
            dayNames.forEach(day => {
                const el = document.createElement('div');
                el.className = 'calendar-day-name';
                el.textContent = day;
                el.setAttribute('role', 'columnheader');
                elements.calendarGrid.appendChild(el);
            });
            
            // Calculate days
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const startPadding = (firstDay.getDay() + 6) % 7; // Adjust for Monday start
            const totalDays = lastDay.getDate();
            
            // Previous month padding
            for (let i = 0; i < startPadding; i++) {
                const el = document.createElement('div');
                el.className = 'calendar-day other-month';
                el.setAttribute('role', 'gridcell');
                el.setAttribute('aria-disabled', 'true');
                elements.calendarGrid.appendChild(el);
            }
            
            // Current month days
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            for (let day = 1; day <= totalDays; day++) {
                const date = new Date(year, month, day);
                const dateStr = date.toISOString().split('T')[0];
                const isToday = date.getTime() === today.getTime();
                const isAvailable = isDateAvailable(date);
                const hasBookings = getBookedSlots(dateStr).length > 0;
                
                const el = document.createElement('button');
                el.type = 'button';
                el.className = `calendar-day${isToday ? ' today' : ''}${!isAvailable ? ' disabled' : ''}${hasBookings ? ' has-booking' : ''}`;
                el.textContent = day;
                el.setAttribute('role', 'gridcell');
                el.setAttribute('aria-label', `${formatDate(date)}${isAvailable ? ', disponible' : ', indisponible'}`);
                el.setAttribute('data-date', dateStr);
                
                if (isAvailable) {
                    el.addEventListener('click', () => selectDate(date, dateStr));
                } else {
                    el.disabled = true;
                    el.setAttribute('aria-disabled', 'true');
                }
                
                elements.calendarGrid.appendChild(el);
            }
        };

        const selectDate = (date, dateStr) => {
            // Update visual selection
            document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
            document.querySelector(`.calendar-day[data-date="${dateStr}"]`)?.classList.add('selected');
            
            selectedDate = date;
            selectedTime = null;
            elements.selectedDateTime.value = '';
            renderTimeSlots(dateStr);
        };

        // ===== TIME SLOTS FUNCTIONS =====
        const renderTimeSlots = (dateStr) => {
            elements.slotsGrid.innerHTML = '';
            
            const bookedSlots = getBookedSlots(dateStr).map(b => typeof b === 'string' ? b : b.time);
            const now = new Date();
            const isToday = dateStr === now.toISOString().split('T')[0];
            
            if (bookedSlots.length === CONFIG.timeSlots.length) {
                elements.slotsGrid.innerHTML = '<p style="grid-column: 1/-1; color: var(--text-light); text-align: center; padding: 20px;">📅 Aucun créneau disponible ce jour</p>';
                return;
            }
            
            CONFIG.timeSlots.forEach(slot => {
                const [hour] = slot.split(':').map(Number);
                const isPast = isToday && (hour < now.getHours() || (hour === now.getHours() && now.getMinutes() > 30));
                const isBooked = bookedSlots.includes(slot);
                
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `slot-btn${isBooked ? ' unavailable' : ' available'}`;
                btn.textContent = formatTime(slot);
                btn.setAttribute('role', 'radio');
                btn.setAttribute('aria-label', `Créneau ${formatTime(slot)}${isBooked ? ' (réservé)' : ' (disponible)'}`);
                
                if (isBooked || isPast) {
                    btn.disabled = true;
                    btn.setAttribute('aria-disabled', 'true');
                } else {
                    btn.addEventListener('click', () => selectTime(slot, btn));
                }
                
                elements.slotsGrid.appendChild(btn);
            });
        };

        const selectTime = (time, element) => {
            // Update visual selection
            document.querySelectorAll('.slot-btn.selected').forEach(el => el.classList.remove('selected'));
            element.classList.add('selected');
            element.setAttribute('aria-checked', 'true');
            
            selectedTime = time;
            elements.selectedDateTime.value = `${selectedDate.toISOString().split('T')[0]}T${time}`;
            
            // Enable submit if form is valid
            validateForm();
        };

        // ===== FORM FUNCTIONS =====
        const showAlert = (message, type = 'success') => {
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            alert.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
            alert.style.display = 'flex';
            elements.alertContainer.innerHTML = '';
            elements.alertContainer.appendChild(alert);
            
            if (type === 'success') {
                setTimeout(() => alert.remove(), 5000);
            }
        };

        const validateForm = () => {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const program = document.querySelector('input[name="program"]:checked')?.value;
            
            const isValid = name && email && program && selectedDate && selectedTime;
            elements.submitBtn.disabled = !isValid;
            return isValid;
        };

        const showMessageHint = (hint) => {
            const messageField = document.getElementById('message');
            const current = messageField.value.trim();
            messageField.value = current ? `${current}\n• ${hint}` : `• ${hint}`;
            messageField.focus();
        };

        const showConfirmationModal = (data) => {
            document.getElementById('confirmName').textContent = data.name;
            document.getElementById('confirmDate').textContent = formatDate(selectedDate);
            document.getElementById('confirmTime').textContent = formatTime(selectedTime);
            document.getElementById('confirmProgram').textContent = 
                document.querySelector(`input[value="${data.program}"]`)?.nextElementSibling?.textContent || data.program;
            document.getElementById('confirmLocation').textContent = 
                data.location === 'online' ? '🌐 Visioconférence' : 
                data.location === 'paris' ? '📍 Paris (adresse envoyée par email)' : '📍 En ligne';
            
            elements.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            elements.modal.classList.remove('active');
            document.body.style.overflow = '';
            window.location.href = 'index.html';
        };

        // ===== EVENT LISTENERS =====
        const initEventListeners = () => {
            // Calendar navigation
            elements.prevMonth.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                renderCalendar();
            });
            
            elements.nextMonth.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                renderCalendar();
            });
            
            // Form inputs validation
            ['name', 'email', 'phone'].forEach(id => {
                document.getElementById(id).addEventListener('input', validateForm);
            });
            
            document.querySelectorAll('input[name="program"]').forEach(radio => {
                radio.addEventListener('change', validateForm);
            });
            
            // Message hints
            elements.hintChips.forEach(chip => {
                chip.addEventListener('click', () => showMessageHint(chip.dataset.hint));
            });
            
            // Form submission
            elements.form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                if (!validateForm()) {
                    showAlert('Veuillez remplir tous les champs obligatoires et sélectionner un créneau.', 'error');
                    return;
                }
                
                // Show loading state
                elements.submitBtn.classList.add('loading');
                elements.submitBtn.disabled = true;
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Collect form data
                const formData = {
                    name: document.getElementById('name').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    location: document.getElementById('location').value,
                    program: document.querySelector('input[name="program"]:checked').value,
                    message: document.getElementById('message').value.trim(),
                    datetime: elements.selectedDateTime.value
                };
                
                // Save to localStorage (demo)
                const dateStr = selectedDate.toISOString().split('T')[0];
                saveBooking(dateStr, selectedTime, { name: formData.name, email: formData.email });
                
                // Reset form
                elements.form.reset();
                document.querySelectorAll('.program-pill input').forEach(i => i.checked = false);
                document.querySelectorAll('.slot-btn.selected, .calendar-day.selected').forEach(el => el.classList.remove('selected'));
                selectedDate = null;
                selectedTime = null;
                elements.selectedDateTime.value = '';
                elements.submitBtn.disabled = true;
                renderCalendar();
                elements.slotsGrid.innerHTML = '<p style="grid-column: 1/-1; color: var(--text-light); text-align: center; padding: 20px;"><i class="fas fa-hand-pointer"></i><br>Sélectionnez une date pour voir les créneaux</p>';
                
                // Show confirmation
                showAlert('Réservation confirmée ! Vérifiez votre email.', 'success');
                showConfirmationModal(formData);
                
                // Reset button state
                elements.submitBtn.classList.remove('loading');
            });
            
            // Modal close
            elements.modalClose.addEventListener('click', closeModal);
            elements.modal.addEventListener('click', (e) => {
                if (e.target === elements.modal) closeModal();
            });
            
            // Close modal on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && elements.modal.classList.contains('active')) {
                    closeModal();
                }
            });
        };

        // ===== MOBILE MENU =====
        const initMobileMenu = () => {
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
        };

        // ===== SCROLL ANIMATIONS =====
        const initScrollAnimations = () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });
            
            document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
        };

        // ===== INITIALIZATION =====
        const init = () => {
            renderCalendar();
            initEventListeners();
            initMobileMenu();
            initScrollAnimations();
            
            // Set min date for native date picker fallback
            const today = new Date().toISOString().split('T')[0];
            document.querySelectorAll('input[type="date"]').forEach(input => {
                input.setAttribute('min', today);
            });
        };

        // Start when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }