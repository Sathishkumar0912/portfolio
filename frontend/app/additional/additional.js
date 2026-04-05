// ================================================
//  ADDITIONAL.JS — Honors & Awards · Languages
//  1. Honors carousel — auto-slide, dots, arrows
//  2. Language cards — scroll reveal + progress bar
//  3. Language click pulse interaction
// ================================================

(function () {
    'use strict';


    /* ================================================
       1. HONORS SLIDER
    ================================================ */

    function initHonors() {
        const wrapper   = document.querySelector('.honor-wrapper');
        const cards     = wrapper  ? wrapper.querySelectorAll('.honor-card')  : [];
        const dots      = wrapper  ? wrapper.querySelectorAll('.honor-dot')   : [];
        const prevBtn   = wrapper  ? wrapper.querySelector('.honor-prev')     : null;
        const nextBtn   = wrapper  ? wrapper.querySelector('.honor-next')     : null;

        if (!cards.length) return;

        let current    = 0;
        let autoTimer  = null;
        const INTERVAL = 5000; // ms between auto-slides

        // ---- Show a specific card ----
        function show(index) {
            // Clamp & wrap
            index = ((index % cards.length) + cards.length) % cards.length;
            current = index;

            cards.forEach((card, i) => {
                const isActive = i === index;
                card.classList.toggle('active', isActive);
                // Force reflow so CSS transition re-fires
                if (isActive) {
                    void card.offsetWidth;
                }
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        // ---- Auto-slide ----
        function startAuto() {
            stopAuto();
            autoTimer = setInterval(() => show(current + 1), INTERVAL);
        }

        function stopAuto() {
            if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
        }

        // ---- Dot clicks ----
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                show(i);
                startAuto(); // reset timer after manual nav
            });
        });

        // ---- Arrow buttons ----
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                show(current - 1);
                startAuto();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                show(current + 1);
                startAuto();
            });
        }

        // ---- Pause on hover ----
        if (wrapper) {
            wrapper.addEventListener('mouseenter', stopAuto);
            wrapper.addEventListener('mouseleave', startAuto);

            // Touch swipe support
            let touchStartX = 0;

            wrapper.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].clientX;
                stopAuto();
            }, { passive: true });

            wrapper.addEventListener('touchend', (e) => {
                const diff = touchStartX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 40) {
                    show(diff > 0 ? current + 1 : current - 1);
                }
                startAuto();
            }, { passive: true });
        }

        // ---- Keyboard navigation (when section in view) ----
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft')  { show(current - 1); startAuto(); }
            if (e.key === 'ArrowRight') { show(current + 1); startAuto(); }
        });

        // ---- Init ----
        show(0);
        startAuto();
    }

    initHonors();


    /* ================================================
       2. LANGUAGE CARDS — Scroll reveal + progress bar
    ================================================ */

    function initLanguages() {
        const cards = document.querySelectorAll('.language-card');
        if (!cards.length) return;

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const card  = entry.target;
                const bar   = card.querySelector('.meter-bar');
                const level = card.getAttribute('data-level');

                // Reveal card (CSS handles the transition via .visible)
                card.classList.add('visible');

                // Animate the progress bar after a short pause
                if (bar && level) {
                    setTimeout(() => {
                        bar.style.width = level + '%';
                    }, 200);
                }

                io.unobserve(card);
            });
        }, { threshold: 0.45 });

        cards.forEach(card => io.observe(card));
    }

    initLanguages();


    /* ================================================
       3. LANGUAGE CARD — Click pulse
    ================================================ */

    function initLanguageInteraction() {
        const cards = document.querySelectorAll('.language-card');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                card.style.transform = 'scale(0.96)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 180);
            });
        });
    }

    initLanguageInteraction();

})();
