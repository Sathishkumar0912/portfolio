// ================================================
//  RECOMMENDED.JS
//  1. Featured flip cards — touch toggle + reveal
//  2. Certification slider — nav buttons + dots
//  3. Projects — scroll reveal + iframe preview
//  4. Courses — physics balls animation
// ================================================

(function () {
    'use strict';


    /* ================================================
       HELPER — Scroll reveal (adds .visible class)
    ================================================ */

    function revealOnScroll(selector, threshold) {
        const els = document.querySelectorAll(selector);
        if (!els.length) return;

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: threshold || 0.12 });

        els.forEach(el => io.observe(el));
    }


    /* ================================================
       1. FEATURED FLIP CARDS
    ================================================ */

    function initFlipCards() {
        const wrappers = document.querySelectorAll('.flip-wrapper');
        if (!wrappers.length) return;

        // Scroll reveal for flip cards
        revealOnScroll('.flip-wrapper', 0.15);

        // Touch devices: tap to toggle flip
        wrappers.forEach(wrapper => {
            wrapper.addEventListener('click', function (e) {
                // Only toggle on touch / pointer-coarse
                if (!window.matchMedia('(pointer: coarse)').matches) return;
                this.classList.toggle('flipped');
            });
        });
    }

    initFlipCards();


    /* ================================================
       2. CERTIFICATION SLIDER
    ================================================ */

    function initCertSlider() {
        const slider   = document.querySelector('.cert-slider');
        const dotsWrap = document.getElementById('certDots');
        const leftBtn  = document.querySelector('.cert-nav.left');
        const rightBtn = document.querySelector('.cert-nav.right');

        if (!slider) return;

        const cards     = slider.querySelectorAll('.cert-card');
        const cardCount = cards.length;

        // Build dots
        if (dotsWrap) {
            cards.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('cert-dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Go to certificate ${i + 1}`);
                dot.addEventListener('click', () => scrollToCard(i));
                dotsWrap.appendChild(dot);
            });
        }

        // Scroll to card by index
        function scrollToCard(index) {
            const card   = cards[index];
            const offset = card.offsetLeft - slider.offsetLeft;
            slider.scrollTo({ left: offset, behavior: 'smooth' });
        }

        // Update active dot on scroll
        function updateDots() {
            const dots    = dotsWrap ? dotsWrap.querySelectorAll('.cert-dot') : [];
            const sliderW = slider.clientWidth;

            let activeIdx = 0;
            let minDist   = Infinity;

            cards.forEach((card, i) => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                const viewCenter = slider.scrollLeft + sliderW / 2;
                const dist       = Math.abs(cardCenter - viewCenter);
                if (dist < minDist) { minDist = dist; activeIdx = i; }
            });

            dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
        }

        slider.addEventListener('scroll', updateDots, { passive: true });

        // Nav buttons
        if (rightBtn) {
            rightBtn.addEventListener('click', () => {
                slider.scrollBy({ left: 300, behavior: 'smooth' });
            });
        }

        if (leftBtn) {
            leftBtn.addEventListener('click', () => {
                slider.scrollBy({ left: -300, behavior: 'smooth' });
            });
        }

        // Drag-to-scroll (mouse)
        let isDown = false, startX = 0, scrollLeft = 0;

        slider.addEventListener('mousedown', (e) => {
            isDown     = true;
            startX     = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            slider.style.cursor = 'grabbing';
        });

        slider.addEventListener('mouseleave', () => { isDown = false; slider.style.cursor = ''; });
        slider.addEventListener('mouseup',    () => { isDown = false; slider.style.cursor = ''; });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x    = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 1.4;
            slider.scrollLeft = scrollLeft - walk;
        });
    }

    initCertSlider();


    /* ================================================
       3. PROJECTS — Reveal + iframe preview
    ================================================ */

    function initProjects() {

        // Scroll reveal
        revealOnScroll('.project-card', 0.1);

        // iframe preview on "View Website"
        const previews = document.querySelectorAll('.project-preview');

        previews.forEach(preview => {
            const btn       = preview.querySelector('.project-view-btn');
            const frameWrap = preview.querySelector('.project-frame');
            if (!btn || !frameWrap) return;

            btn.addEventListener('click', () => {
                const url = preview.getAttribute('data-url');
                if (!url) return;

                // Inject iframe once
                if (!frameWrap.innerHTML.trim()) {
                    frameWrap.innerHTML = `<iframe src="${url}" loading="lazy"></iframe>`;
                }

                // Hide image + overlay, show frame
                const img     = preview.querySelector('img');
                const overlay = preview.querySelector('.project-overlay');
                if (img)     img.style.display     = 'none';
                if (overlay) overlay.style.display = 'none';
                frameWrap.style.display = 'block';
            });
        });
    }

    initProjects();


    /* ================================================
       4. COURSE BALLS — Physics simulation
    ================================================ */

    function initCourseBalls() {
        const container = document.querySelector('.course-3d-container');
        const infoEl    = document.getElementById('courseInfo');
        const balls     = container ? container.querySelectorAll('.course-ball') : [];

        if (!balls.length || !container) return;

        const BALL_SIZE  = parseInt(getComputedStyle(balls[0]).width) || 68;
        let   positions  = [];
        let   velocities = [];
        let   animFrameId;

        // Initialise random positions & velocities
        balls.forEach((ball, i) => {
            const maxX = container.clientWidth  - BALL_SIZE;
            const maxY = container.clientHeight - BALL_SIZE;

            const x = Math.random() * maxX;
            const y = Math.random() * maxY;

            positions[i]  = { x, y };
            velocities[i] = {
                x: (Math.random() * 0.4 + 0.1) * (Math.random() < 0.5 ? 1 : -1),
                y: (Math.random() * 0.4 + 0.1) * (Math.random() < 0.5 ? 1 : -1),
            };

            ball.style.left = x + 'px';
            ball.style.top  = y + 'px';

            // Click to reveal course name
            ball.addEventListener('click', () => {
                // Clear active on all
                balls.forEach(b => b.classList.remove('active'));
                ball.classList.add('active');

                if (infoEl) {
                    infoEl.textContent = ball.getAttribute('data-course');
                    infoEl.classList.add('active');
                }
            });
        });

        // Animation loop
        function animate() {
            const maxX = container.clientWidth  - BALL_SIZE;
            const maxY = container.clientHeight - BALL_SIZE;

            balls.forEach((ball, i) => {
                positions[i].x += velocities[i].x;
                positions[i].y += velocities[i].y;

                // Bounce off walls
                if (positions[i].x <= 0 || positions[i].x >= maxX) {
                    velocities[i].x *= -1;
                    positions[i].x   = Math.max(0, Math.min(positions[i].x, maxX));
                }

                if (positions[i].y <= 0 || positions[i].y >= maxY) {
                    velocities[i].y *= -1;
                    positions[i].y   = Math.max(0, Math.min(positions[i].y, maxY));
                }

                ball.style.left = positions[i].x + 'px';
                ball.style.top  = positions[i].y + 'px';
            });

            animFrameId = requestAnimationFrame(animate);
        }

        animate();

        // Pause animation when off-screen (performance)
        const containerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate();
                } else {
                    cancelAnimationFrame(animFrameId);
                }
            });
        }, { threshold: 0.01 });

        containerObserver.observe(container);

        // Recalculate ball size on resize
        window.addEventListener('resize', () => {
            const newSize = parseInt(getComputedStyle(balls[0]).width) || 68;
            // Clamp existing positions into new bounds
            balls.forEach((ball, i) => {
                const mX = container.clientWidth  - newSize;
                const mY = container.clientHeight - newSize;
                positions[i].x = Math.min(positions[i].x, mX);
                positions[i].y = Math.min(positions[i].y, mY);
            });
        }, { passive: true });
    }

    initCourseBalls();

})();
