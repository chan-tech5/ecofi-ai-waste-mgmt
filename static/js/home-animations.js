/* ═══════════════════════════════════════
   EcoFi – Home Page Animations
   Particles · Scroll Reveal · Counters
   ═══════════════════════════════════════ */

(function () {
    'use strict';

    // ── 1. PARTICLE CANVAS ──────────────────
    const canvas = document.getElementById('particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let w, h;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 2.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.5 + 0.1;
                // Green or cyan tint
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

        // Create particles (lower count for performance)
        const count = Math.min(80, Math.floor((w * h) / 15000));
        for (let i = 0; i < count; i++) particles.push(new Particle());

        // Draw connecting lines between nearby particles
        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 200, 83, ${0.06 * (1 - dist / 150)})`;
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

    // ── 2. SCROLL REVEAL (Intersection Observer) ──────────
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, parseInt(delay));
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => observer.observe(el));
    }

    // ── 3. ANIMATED COUNTERS ──────────────────
    const counters = document.querySelectorAll('.counter');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;

        counters.forEach(counter => {
            const target = +counter.dataset.target;
            const duration = 2000; // ms
            const step = target / (duration / 16); // ~60fps
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
    }

    // Trigger counters when hero stats become visible
    if (counters.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        // Observe the first counter's parent (hero-stats or impact-section)
        const firstCounter = counters[0];
        if (firstCounter) counterObserver.observe(firstCounter.closest('.hero-stats') || firstCounter);
    }

    // Also animate impact section counters separately
    const impactSection = document.querySelector('.impact-section');
    if (impactSection) {
        const impactCounters = impactSection.querySelectorAll('.counter');
        let impactAnimated = false;

        const impactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !impactAnimated) {
                    impactAnimated = true;
                    impactCounters.forEach(counter => {
                        const target = +counter.dataset.target;
                        const duration = 2200;
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
                    impactObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        impactObserver.observe(impactSection);
    }

    // ── 4. NAVBAR SCROLL BEHAVIOUR ──────────────────
    const navbar = document.getElementById('navbar');
    if (navbar) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            lastScroll = scrollY;
        }, { passive: true });
    }

    // ── 5. HAMBURGER MENU ──────────────────
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close on link click (mobile)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // ── 6. SMOOTH SCROLL for anchor links ──────────
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
