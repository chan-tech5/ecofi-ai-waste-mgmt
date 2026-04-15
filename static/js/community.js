/* ═══════════════════════════════════════
   COMMUNITY PAGE – EcoFi JavaScript
   ═══════════════════════════════════════ */

/* ── Particle Canvas ── */
(function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;

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

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

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
    const revealEls = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => entry.target.classList.add('active'), +delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealEls.forEach(el => observer.observe(el));
})();

/* ── Animated Counters ── */
(function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const obsCounter = new IntersectionObserver((entries) => {
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
                obsCounter.unobserve(el);
            }
        });
    }, { threshold: 0.3 });
    counters.forEach(c => obsCounter.observe(c));
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

/* ── Tab Switching ── */
(function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`tab-${target}`).classList.add('active');
        });
    });
})();

/* ── Star Rating ── */
(function initStarRating() {
    const starContainer = document.getElementById('star-rating');
    const ratingInput = document.getElementById('fb-rating');
    if (!starContainer) return;

    const stars = starContainer.querySelectorAll('i');
    let currentRating = 0;

    stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            const val = +star.dataset.val;
            stars.forEach(s => s.classList.toggle('filled', +s.dataset.val <= val));
        });

        star.addEventListener('click', () => {
            currentRating = +star.dataset.val;
            ratingInput.value = currentRating;
            stars.forEach(s => s.classList.toggle('filled', +s.dataset.val <= currentRating));
        });
    });

    starContainer.addEventListener('mouseleave', () => {
        stars.forEach(s => s.classList.toggle('filled', +s.dataset.val <= currentRating));
    });
})();

/* ── Discussion Form ── */
(function initDiscussion() {
    const form = document.getElementById('discussion-form');
    const feed = document.getElementById('comments-feed');
    if (!form || !feed) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('disc-name').value.trim();
        const message = document.getElementById('disc-message').value.trim();
        if (!name || !message) return;

        // Create initials
        const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

        const card = document.createElement('div');
        card.className = 'comment-card';
        card.style.animation = 'fadeTab 0.5s ease';
        card.innerHTML = `
            <div class="comment-avatar">${initials}</div>
            <div class="comment-body">
                <div class="comment-header">
                    <strong>${escapeHTML(name)}</strong>
                    <span>Just now</span>
                </div>
                <p>${escapeHTML(message)}</p>
                <div class="comment-actions">
                    <button class="like-btn"><i class="fas fa-heart"></i> 0</button>
                    <button class="reply-btn"><i class="fas fa-reply"></i> Reply</button>
                </div>
            </div>
        `;

        feed.insertBefore(card, feed.firstChild);
        form.reset();

        // Save discussion to backend
        fetch('/api/discussion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, message })
        }).catch(() => {});
    });
})();

/* ── Feedback Form ── */
(function initFeedback() {
    const form = document.getElementById('feedback-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('fb-name').value.trim();
        const email = document.getElementById('fb-email').value.trim();
        const category = document.getElementById('fb-category').value;
        const rating = document.getElementById('fb-rating').value;
        const message = document.getElementById('fb-message').value.trim();

        if (!name || !email || !category || !message) return;

        const btn = form.querySelector('.submit-btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        try {
            // Send to our backend
            await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, category, rating: +rating, message })
            });

            showModal('Feedback Sent!', 'Thank you for your valuable feedback. Our team will review it within 48 hours.');
            form.reset();
            // Reset stars
            document.querySelectorAll('#star-rating i').forEach(s => s.classList.remove('filled'));
            document.getElementById('fb-rating').value = 0;
        } catch (err) {
            showModal('Oops!', 'Something went wrong. Please try again later.');
        }

        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Feedback';
        btn.disabled = false;
    });
})();

/* ── Volunteer Form ── */
(function initVolunteer() {
    const form = document.getElementById('volunteer-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById('vol-name').value.trim(),
            email: document.getElementById('vol-email').value.trim(),
            phone: document.getElementById('vol-phone').value.trim(),
            city: document.getElementById('vol-city').value.trim(),
            role: document.getElementById('vol-role').value,
            availability: document.getElementById('vol-availability').value,
            message: document.getElementById('vol-message').value.trim()
        };

        if (!data.name || !data.email || !data.role) return;

        const btn = form.querySelector('.submit-btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
        btn.disabled = true;

        try {
            await fetch('/api/volunteer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            showModal(
                'Welcome Aboard! 🎉',
                `Thank you, ${escapeHTML(data.name)}! You've been registered as a volunteer. We'll reach out with upcoming opportunities.`
            );
            form.reset();
        } catch (err) {
            showModal('Oops!', 'Something went wrong. Please try again.');
        }

        btn.innerHTML = '<i class="fas fa-rocket"></i> Join as Volunteer';
        btn.disabled = false;
    });
})();

/* ── Pledge Button ── */
(function initPledge() {
    const pledgeBtn = document.getElementById('pledge-btn');
    if (!pledgeBtn) return;

    // Check if already pledged
    if (localStorage.getItem('ecofi-pledged')) {
        pledgeBtn.textContent = '✓ Pledge Taken';
        pledgeBtn.classList.add('pledged');
    }

    pledgeBtn.addEventListener('click', () => {
        if (localStorage.getItem('ecofi-pledged')) return;
        localStorage.setItem('ecofi-pledged', 'true');
        pledgeBtn.innerHTML = '<i class="fas fa-check"></i> Pledge Taken';
        pledgeBtn.classList.add('pledged');

        // Increment displayed count
        const numEl = pledgeBtn.closest('.pledge-content').querySelector('.pledge-num');
        if (numEl) {
            const current = parseInt(numEl.textContent.replace(/,/g, '')) || 0;
            numEl.textContent = (current + 1).toLocaleString();
        }

        showModal('Thank You! 🌍', 'Your green pledge has been recorded. Together we make the difference!');
    });
})();

/* ── Like Button (toggle) ── */
document.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.like-btn');
    if (!likeBtn) return;

    const icon = likeBtn.querySelector('i');
    const text = likeBtn.textContent.trim();
    const num = parseInt(text.match(/\d+/)?.[0] || '0');

    if (likeBtn.classList.contains('liked')) {
        likeBtn.classList.remove('liked');
        likeBtn.innerHTML = `<i class="fas fa-heart"></i> ${num - 1}`;
        likeBtn.style.color = '';
    } else {
        likeBtn.classList.add('liked');
        likeBtn.innerHTML = `<i class="fas fa-heart"></i> ${num + 1}`;
        likeBtn.style.color = '#ef4444';
    }
});

/* ── Modal Utility ── */
function showModal(title, message) {
    const modal = document.getElementById('success-modal');
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
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
