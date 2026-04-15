/* ═══════════════════════════════════════
   EVENT PAGE – EcoFi JavaScript
   ═══════════════════════════════════════ */

/* ── Particle Canvas ── */
(function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const COUNT = 55;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.color = Math.random() > 0.5 ? '0,200,83' : '0,229,255';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0,200,83,${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();
})();

/* ── Scroll Reveal ── */
(function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => entry.target.classList.add('active'), +delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    els.forEach(el => observer.observe(el));
})();

/* ── Animated Counters ── */
(function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = +el.dataset.target;
                const duration = 2000;
                const start = performance.now();
                function tick(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(target * eased).toLocaleString();
                    if (progress < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.3 });
    counters.forEach(c => obs.observe(c));
})();

/* ── Navbar Scroll & Hamburger ── */
(function initNav() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
})();

/* ── Category Filter ── */
(function initFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.event-card');
    const noEvents = document.getElementById('noEvents');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            let visibleCount = 0;
            cards.forEach(card => {
                const cat = card.dataset.category;
                if (filter === 'all' || cat === filter) {
                    card.classList.remove('hidden');
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            });

            noEvents.style.display = visibleCount === 0 ? 'block' : 'none';
        });
    });
})();

/* ── Registration Modal ── */
(function initRegistration() {
    const modal = document.getElementById('register-modal');
    const closeBtn = document.getElementById('modal-close');
    const form = document.getElementById('register-form');
    const eventNameEl = document.getElementById('modal-event-name');
    const eventIdInput = document.getElementById('reg-event-id');
    const eventTitleInput = document.getElementById('reg-event-title');

    // Open modal
    document.querySelectorAll('.register-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const eventId = btn.dataset.event;
            const eventTitle = btn.dataset.title;

            // Check if already registered
            const registered = JSON.parse(localStorage.getItem('ecofi-registrations') || '[]');
            if (registered.includes(eventId)) {
                showSuccess(
                    "You're already registered for this event! Check your email for details.",
                    eventTitle
                );
                return;
            }

            eventIdInput.value = eventId;
            eventTitleInput.value = eventTitle;
            eventNameEl.textContent = eventTitle;
            modal.classList.add('show');
        });
    });

    // Close modal
    closeBtn.addEventListener('click', () => modal.classList.remove('show'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('show');
    });

    // Submit form
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            event_id: eventIdInput.value,
            event_title: eventTitleInput.value,
            name: document.getElementById('reg-name').value.trim(),
            email: document.getElementById('reg-email').value.trim(),
            phone: document.getElementById('reg-phone').value.trim(),
            team_size: document.getElementById('reg-team').value,
            note: document.getElementById('reg-note').value.trim()
        };

        if (!data.name || !data.email || !data.phone) return;

        const submitBtn = document.getElementById('reg-submit-btn');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
        submitBtn.disabled = true;

        try {
            const res = await fetch('/api/event-register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            if (result.success) {
                // Save to localStorage
                const registered = JSON.parse(localStorage.getItem('ecofi-registrations') || '[]');
                registered.push(data.event_id);
                localStorage.setItem('ecofi-registrations', JSON.stringify(registered));

                // Mark button as registered
                markRegistered(data.event_id);

                // Close register modal
                modal.classList.remove('show');

                // Show success
                showSuccess(
                    'Check your email for event details and reminders.',
                    data.event_title,
                    result.registration_id,
                    data.name,
                    data.team_size
                );

                form.reset();
            } else {
                alert(result.error || 'Registration failed.');
            }
        } catch (err) {
            alert('Network error. Please try again.');
        }

        submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Confirm Registration';
        submitBtn.disabled = false;
    });

    // Mark already-registered events on page load
    const registered = JSON.parse(localStorage.getItem('ecofi-registrations') || '[]');
    registered.forEach(id => markRegistered(id));

    function markRegistered(eventId) {
        document.querySelectorAll(`.register-btn[data-event="${eventId}"]`).forEach(btn => {
            btn.innerHTML = '<i class="fas fa-check"></i> Registered';
            btn.classList.add('registered');
        });
    }
})();

/* ── Success Modal ── */
function showSuccess(message, eventTitle, regId, name, teamSize) {
    const modal = document.getElementById('success-modal');
    document.getElementById('success-message').textContent = message;

    const details = document.getElementById('success-details');
    if (regId) {
        details.innerHTML = `
            <div class="detail-row"><span>Event</span><strong>${escapeHTML(eventTitle)}</strong></div>
            <div class="detail-row"><span>Registration ID</span><strong>${regId}</strong></div>
            <div class="detail-row"><span>Name</span><strong>${escapeHTML(name)}</strong></div>
            <div class="detail-row"><span>Team Size</span><strong>${teamSize} person(s)</strong></div>
        `;
        details.style.display = 'block';
    } else {
        details.style.display = 'none';
    }

    modal.classList.add('show');
}

/* ── Escape HTML ── */
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
