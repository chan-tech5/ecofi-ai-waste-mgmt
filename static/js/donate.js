/* ═══════════════════════════════════════
   EcoFi – Donate Page Interactions
   ═══════════════════════════════════════ */

(function () {
    'use strict';

    // ── 1. PARTICLE CANVAS ──────────────────
    const canvas = document.getElementById('particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let w, h;
        function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.color = Math.random() > 0.5
                    ? `rgba(0, 200, 83, ${this.opacity})`
                    : `rgba(0, 229, 255, ${this.opacity * 0.6})`;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > w) this.speedX *= -1;
                if (this.y < 0 || this.y > h) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        const count = Math.min(60, Math.floor((w * h) / 20000));
        for (let i = 0; i < count; i++) particles.push(new Particle());

        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 140) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 200, 83, ${0.05 * (1 - dist / 140)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => { p.update(); p.draw(); });
            drawLines();
            requestAnimationFrame(animate);
        }
        animate();
    }

    // ── 2. SCROLL REVEAL ──────────────────
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => entry.target.classList.add('active'), parseInt(delay));
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => observer.observe(el));
    }

    // ── 3. ANIMATED COUNTERS ──────────────────
    const counters = document.querySelectorAll('.counter');
    if (counters.length) {
        let animated = false;
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    counters.forEach(counter => {
                        const target = +counter.dataset.target;
                        const duration = 2000;
                        const step = target / (duration / 16);
                        let current = 0;
                        function tick() {
                            current += step;
                            if (current >= target) {
                                counter.textContent = target.toLocaleString();
                            } else {
                                counter.textContent = Math.floor(current).toLocaleString();
                                requestAnimationFrame(tick);
                            }
                        }
                        tick();
                    });
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        const firstCounter = counters[0];
        if (firstCounter) counterObserver.observe(firstCounter.closest('.impact-strip') || firstCounter);
    }

    // ── 4. BAR CHART ANIMATION ──────────────────
    const bars = document.querySelectorAll('.bar-fill');
    if (bars.length) {
        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    bars.forEach((bar, i) => {
                        setTimeout(() => bar.classList.add('animated'), i * 200);
                    });
                    barObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        barObserver.observe(bars[0].closest('.breakdown-grid'));
    }

    // ── 5. NAVBAR SCROLL ──────────────────
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        }, { passive: true });
    }

    // ── 6. HAMBURGER MENU ──────────────────
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // ── 7. QUICK AMOUNT BUTTONS ──────────────────
    const amountInput = document.getElementById('donor-amount');
    const btnAmountText = document.getElementById('btn-amount');
    const amtBtns = document.querySelectorAll('.amt-btn');

    amtBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            amtBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const val = btn.dataset.amount;
            if (amountInput) amountInput.value = val;
            updateBtnAmount(val);
        });
    });

    if (amountInput) {
        amountInput.addEventListener('input', () => {
            amtBtns.forEach(b => {
                b.classList.toggle('active', b.dataset.amount === amountInput.value);
            });
            updateBtnAmount(amountInput.value);
        });
    }

    function updateBtnAmount(val) {
        if (btnAmountText) {
            btnAmountText.textContent = parseInt(val || 0).toLocaleString('en-IN');
        }
    }

    // ── 8. DONATION FORM SUBMISSION ──────────────────
    const form = document.getElementById('donation-form');
    const donateBtn = document.getElementById('donate-btn');
    const modal = document.getElementById('success-modal');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('donor-name').value.trim();
            const email = document.getElementById('donor-email').value.trim();
            const phone = document.getElementById('donor-phone').value.trim();
            const amount = parseInt(document.getElementById('donor-amount').value);
            const payment = document.getElementById('donor-payment').value;
            const frequency = document.getElementById('donor-frequency').value;
            const message = document.getElementById('donor-message').value.trim();

            // Validation
            if (!name || !email || !phone || !amount || !payment) {
                shakeButton();
                return;
            }
            if (amount < 1) {
                shakeButton();
                return;
            }

            // Processing state
            donateBtn.classList.add('processing');
            donateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

            const paymentLabels = { upi: 'UPI', card: 'Card', netbanking: 'Net Banking', wallet: 'Wallet' };

            // Send donation to backend
            fetch('/api/donate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, amount, payment, frequency, message })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert('Error: ' + data.error);
                    donateBtn.classList.remove('processing');
                    donateBtn.innerHTML = '<i class="fas fa-heart"></i> Donate ₹<span id="btn-amount">' + amount.toLocaleString('en-IN') + '</span>';
                    return;
                }

                // Populate modal with server response
                document.getElementById('modal-donor-name').textContent = name;
                document.getElementById('modal-amount').textContent = data.amount.toLocaleString('en-IN');
                document.getElementById('modal-receipt-id').textContent = data.receipt_id;
                document.getElementById('modal-date').textContent = data.date;
                document.getElementById('modal-method').textContent = (paymentLabels[payment] || payment) + ' (' + frequency + ')';
                document.getElementById('modal-kg').textContent = data.kg_recycled;
                document.getElementById('modal-co2').textContent = data.co2_saved;

                // Show modal
                modal.classList.add('show');

                // Reset button
                donateBtn.classList.remove('processing');
                donateBtn.innerHTML = '<i class="fas fa-heart"></i> Donate ₹<span id="btn-amount">' + amount.toLocaleString('en-IN') + '</span>';

                console.log('💚 Donation saved! Receipt:', data.receipt_id);
            })
            .catch(err => {
                console.error('Donation error:', err);
                alert('Something went wrong. Please try again.');
                donateBtn.classList.remove('processing');
                donateBtn.innerHTML = '<i class="fas fa-heart"></i> Donate ₹<span id="btn-amount">' + amount.toLocaleString('en-IN') + '</span>';
            });
        });
    }

    function shakeButton() {
        if (!donateBtn) return;
        donateBtn.style.animation = 'shake 0.5s';
        setTimeout(() => donateBtn.style.animation = '', 500);
    }

    // Modal close functions (global)
    window.closeModal = function () {
        modal.classList.remove('show');
        window.location.href = 'index.html';
    };
    window.donateAgain = function () {
        modal.classList.remove('show');
        form.reset();
        amtBtns.forEach(b => b.classList.remove('active'));
        amtBtns[2].classList.add('active'); // default ₹1,000
        if (amountInput) amountInput.value = 1000;
        updateBtnAmount(1000);
        document.getElementById('donate-now').scrollIntoView({ behavior: 'smooth' });
    };

    // ── 9. FAQ ACCORDION ──────────────────
    document.querySelectorAll('.faq-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('open');
            // Close all
            document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
            // Toggle current
            if (!isOpen) item.classList.add('open');
        });
    });

    // ── 10. SMOOTH SCROLL ──────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

})();

/* Shake animation */
const style = document.createElement('style');
style.textContent = `@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }`;
document.head.appendChild(style);
