// ================================================
//  HOME.JS — Hero + Analytics + About Sections
//  - Floating particles
//  - Animated stat counters (analytics cards)
//  - Contact item click-to-copy
//  - About cards reveal on scroll
//  - Scroll indicator hide
//  - Profile 3D tilt (desktop)
// ================================================

(function () {
    'use strict';

    // ================= FLOATING PARTICLES =================

    function createParticles() {
        const container = document.getElementById('heroParticles');
        if (!container) return;

        const count = window.innerWidth < 600 ? 10 : 20;

        for (let i = 0; i < count; i++) {
            const p = document.createElement('span');
            p.classList.add('particle');

            // Random size 4–14px
            const size = Math.random() * 10 + 4;
            p.style.width  = size + 'px';
            p.style.height = size + 'px';

            // Random horizontal start position
            p.style.left = Math.random() * 100 + '%';

            // Random speed and staggered start
            const duration = Math.random() * 12 + 8;
            const delay    = Math.random() * 12;
            p.style.animationDuration = duration + 's';
            p.style.animationDelay   = '-' + delay + 's';

            container.appendChild(p);
        }
    }

    createParticles();


    // ================= ANALYTICS STAT COUNTERS =================

    function animateCounter(el) {
        const raw    = el.getAttribute('data-target');
        const target = parseInt(raw, 10);
        if (isNaN(target)) return;

        const duration = 1600; // ms
        const start    = performance.now();

        function step(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target + '+';
            }
        }

        requestAnimationFrame(step);
    }

    function initStatCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        if (!counters.length) return;

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => io.observe(c));
    }

    initStatCounters();


    // ================= CONTACT ITEM CLICK-TO-COPY =================

    function initContactActions() {
        const items = document.querySelectorAll('.contact-item');

        items.forEach(item => {
            item.addEventListener('click', function (e) {

                // Let link clicks navigate normally
                if (e.target.closest('a')) return;

                const text = item.querySelector('span')?.textContent?.trim();
                if (text && navigator.clipboard) {
                    navigator.clipboard.writeText(text).then(() => {
                        showCopiedFeedback(item);
                    }).catch(() => {});
                }
            });
        });
    }

    function showCopiedFeedback(item) {
        const original = item.getAttribute('data-tooltip') || '';
        item.setAttribute('data-tooltip', 'Copied!');
        setTimeout(() => {
            item.setAttribute('data-tooltip', original);
        }, 1500);
    }

    initContactActions();


    // ================= ABOUT CARDS — REVEAL ON SCROLL =================

    function initAboutReveal() {
        const cards = document.querySelectorAll('.about-card');
        if (!cards.length) return;

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        cards.forEach(c => io.observe(c));
    }

    initAboutReveal();


    // ================= SCROLL INDICATOR — HIDE ON SCROLL =================

    function initScrollIndicator() {
        const indicator = document.querySelector('.scroll-indicator');
        if (!indicator) return;

        let hidden = false;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 80 && !hidden) {
                indicator.style.opacity      = '0';
                indicator.style.pointerEvents = 'none';
                hidden = true;
            } else if (window.scrollY <= 80 && hidden) {
                indicator.style.opacity      = '0.7';
                indicator.style.pointerEvents = 'auto';
                hidden = false;
            }
        }, { passive: true });
    }

    initScrollIndicator();


    // ================= PROFILE — 3D TILT (DESKTOP ONLY) =================

    function initProfileTilt() {
        const shape = document.querySelector('.profile-shape');

        // Skip on touch devices
        if (!shape || window.matchMedia('(pointer: coarse)').matches) return;

        shape.addEventListener('mousemove', (e) => {
            const rect = shape.getBoundingClientRect();
            const cx   = rect.left + rect.width  / 2;
            const cy   = rect.top  + rect.height / 2;
            const dx   = (e.clientX - cx) / (rect.width  / 2);
            const dy   = (e.clientY - cy) / (rect.height / 2);

            shape.style.transform = `
                perspective(400px)
                rotateX(${-dy * 8}deg)
                rotateY(${dx * 8}deg)
                scale(1.05)
            `;
        });

        shape.addEventListener('mouseleave', () => {
            shape.style.transform = '';
        });
    }

    initProfileTilt();


    // ================= STAT CARDS — HOVER GLOW =================
    // Small touch: adds a subtle colour pulse on the icon on card hover

    function initStatCardEffects() {
        const cards = document.querySelectorAll('.stat-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.stat-icon i');
                if (icon) icon.style.transform = 'scale(1.2) rotate(-6deg)';
            });

            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.stat-icon i');
                if (icon) icon.style.transform = '';
            });
        });
    }

    initStatCardEffects();

})();
