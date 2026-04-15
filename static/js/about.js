/* ═══════════════════════════════════════
   ABOUT PAGE JS — EcoFi
   ═══════════════════════════════════════ */

/* ── Particle Canvas ── */
(function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const COUNT = Math.min(80, Math.floor(window.innerWidth / 18));

    for (let i = 0; i < COUNT; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.5,
            dx: (Math.random() - 0.5) * 0.4,
            dy: (Math.random() - 0.5) * 0.4,
            o: Math.random() * 0.4 + 0.1
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 200, 83, ${p.o})`;
            ctx.fill();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 200, 83, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }
    draw();
})();

/* ── Navbar Scroll ── */
(function initNavbar() {
    const header = document.getElementById('navbar');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
})();

/* ── Hamburger Toggle ── */
(function initHamburger() {
    const btn = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav-menu');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    // Close on link click
    nav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => nav.classList.remove('active'));
    });
})();

/* ── Scroll Reveal ── */
(function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, idx * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    els.forEach(el => observer.observe(el));
})();

/* ── Counter Animation ── */
(function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                const duration = 2000;
                const start = performance.now();

                function animate(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const ease = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(target * ease).toLocaleString();
                    if (progress < 1) requestAnimationFrame(animate);
                    else el.textContent = target.toLocaleString();
                }
                requestAnimationFrame(animate);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
})();

/* ── Progress Ring Animation ── */
(function initRings() {
    const rings = document.querySelectorAll('.progress-ring');
    if (!rings.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'stroke-dashoffset 2s ease-out';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    rings.forEach(r => observer.observe(r));
})();

/* ── Smooth Scroll for Anchor Links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ═══════════════════════════════════════
   INTERACTIVE VALUES ORBIT
   ═══════════════════════════════════════ */
(function initValuesOrbit() {
    /* ── Content Data ── */
    const valuesData = {
        sustainability: {
            icon: 'fas fa-globe-asia',
            title: 'Sustainability',
            question: 'How does EcoFi drive sustainability?',
            answer: 'Every feature we build is rooted in one question: does this reduce waste and protect our planet? From AI-powered sorting that ensures recyclables never reach landfills, to our carbon-tracking dashboard — sustainability isn\'t a buzzword for us, it\'s our operating system.',
            approach: 'EcoFi embeds sustainability into daily habits by making eco-friendly choices the easiest choices. Our reward system turns green actions into tangible benefits, creating a self-sustaining loop of positive environmental impact.'
        },
        community: {
            icon: 'fas fa-handshake',
            title: 'Community',
            question: 'What role does community play in EcoFi?',
            answer: 'Waste management is not a solo mission. EcoFi brings together neighbours, schools, businesses, and local bodies into one collaborative platform. Discussion forums, group cleanups, and shared leaderboards make sustainability a team sport.',
            approach: 'We believe change is contagious. By connecting eco-warriors in the same neighbourhood, EcoFi creates micro-communities that hold each other accountable, celebrate wins, and collectively push for cleaner streets — one ward at a time.'
        },
        innovation: {
            icon: 'fas fa-microchip',
            title: 'Innovation',
            question: 'How is EcoFi innovating in waste management?',
            answer: 'Our AI classification model identifies waste types from a single photo with high accuracy. Smart route optimization reduces collection costs. EcoCoins turn good behaviour into a digital economy. These aren\'t gimmicks — they\'re engineering solutions to real-world chaos.',
            approach: 'EcoFi treats waste management as a technology problem first. We continuously train our models, add new features based on user feedback, and partner with research institutions to stay at the cutting edge of green-tech innovation.'
        },
        transparency: {
            icon: 'fas fa-shield-alt',
            title: 'Transparency',
            question: 'How does EcoFi ensure transparency?',
            answer: 'Every donation, every EcoCoin earned, every kilogram recycled — it\'s all tracked and visible. Users can see exactly where their contributions go, how funds are used, and what impact their actions create. No black boxes, no vague promises.',
            approach: 'We publish real-time dashboards showing collection data, fund utilization, and community progress. Our open reporting system means every stakeholder — from donors to volunteers — can verify EcoFi\'s impact with hard numbers.'
        },
        impact: {
            icon: 'fas fa-award',
            title: 'Impact',
            question: 'What kind of impact is EcoFi creating?',
            answer: 'Over 12,500 tonnes of waste diverted from landfills. 8,500+ active users making daily green choices. 24 community events that brought thousands together for cleaner cities. These numbers grow every single day.',
            approach: 'Impact at EcoFi isn\'t measured in downloads — it\'s measured in tonnes saved, emissions reduced, and lives improved. Every feature is designed with a measurable environmental outcome, and we report on it publicly.'
        },
        accessibility: {
            icon: 'fas fa-universal-access',
            title: 'Accessibility',
            question: 'How does EcoFi make waste management accessible?',
            answer: 'Complex waste rules made simple with photo-based classification. Multiple language support. A mobile-first design that works even on basic smartphones. EcoFi is built for everyone — from tech-savvy students to senior citizens in rural areas.',
            approach: 'We remove every barrier between intention and action. No complicated forms, no jargon, no expensive equipment needed. Just snap a photo, follow the guide, earn rewards. Green living shouldn\'t require a manual.'
        }
    };

    /* ── Desktop: Orbit click handler ── */
    const nodes = document.querySelectorAll('.values-orbit .value-node');
    const connLine = document.getElementById('connLine');
    const orbitCenter = document.querySelector('.orbit-center');
    const detailPanel = document.getElementById('valueDetailPanel');
    const detailContent = document.getElementById('valueDetailContent');
    const emptyState = detailPanel ? detailPanel.querySelector('.value-detail-empty') : null;
    const orbitWrap = document.querySelector('.values-orbit-wrap');

    function getNodeCenter(node) {
        if (!orbitWrap) return { x: 230, y: 230 };
        const wrapRect = orbitWrap.getBoundingClientRect();
        const dot = node.querySelector('.value-dot');
        const dotRect = dot.getBoundingClientRect();
        return {
            x: (dotRect.left + dotRect.width / 2 - wrapRect.left) / wrapRect.width * 460,
            y: (dotRect.top + dotRect.height / 2 - wrapRect.top) / wrapRect.height * 460
        };
    }

    function showDetail(key) {
        const data = valuesData[key];
        if (!data || !detailContent) return;

        // Update content
        document.getElementById('detailIcon').innerHTML = `<i class="${data.icon}"></i>`;
        document.getElementById('detailTitle').textContent = data.title;
        document.getElementById('detailQuestion').textContent = data.question;
        document.getElementById('detailAnswer').textContent = data.answer;
        document.getElementById('detailApproach').textContent = data.approach;

        // Show content, hide empty
        if (emptyState) emptyState.style.display = 'none';
        detailContent.style.display = 'block';
        detailPanel.classList.add('has-content');

        // Re-trigger animation
        detailContent.classList.remove('animate-in');
        void detailContent.offsetWidth; // force reflow
        detailContent.classList.add('animate-in');
    }

    nodes.forEach(node => {
        node.addEventListener('click', () => {
            const key = node.dataset.value;

            // Toggle active class
            nodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');

            // Draw connecting line
            if (connLine) {
                const pos = getNodeCenter(node);
                connLine.setAttribute('x2', pos.x);
                connLine.setAttribute('y2', pos.y);
                connLine.setAttribute('opacity', '1');
            }

            // Center glow
            if (orbitCenter) orbitCenter.classList.add('active-glow');

            // Show detail
            showDetail(key);
        });
    });

    /* ── Mobile: Card click handler ── */
    const mobCards = document.querySelectorAll('.value-mob-card');
    const mobDetail = document.getElementById('valueMobDetail');

    mobCards.forEach(card => {
        card.addEventListener('click', () => {
            const key = card.dataset.value;
            const data = valuesData[key];
            if (!data || !mobDetail) return;

            mobCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            document.getElementById('mobDetailIcon').innerHTML = `<i class="${data.icon}"></i>`;
            document.getElementById('mobDetailTitle').textContent = data.title;
            document.getElementById('mobDetailAnswer').textContent = data.answer;
            document.getElementById('mobDetailApproach').textContent = data.approach;

            mobDetail.style.display = 'block';
            mobDetail.style.animation = 'none';
            void mobDetail.offsetWidth;
            mobDetail.style.animation = 'detailSlideIn 0.4s ease-out';
        });
    });

    /* ── Auto-select first value after a delay ── */
    setTimeout(() => {
        const firstNode = document.querySelector('.values-orbit .value-node[data-value="sustainability"]');
        if (firstNode) firstNode.click();
    }, 1200);

})();
