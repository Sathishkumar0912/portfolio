// ================================================
//  CORE.JS — Education · Position · Skills
//  - Education entries: slide-in from left on scroll
//  - Experience items: fade-up on scroll
//  - Skill categories: fade-up on scroll
// ================================================

(function () {
    'use strict';

    // ================= SHARED OBSERVER FACTORY =================

    /**
     * Creates an IntersectionObserver that adds 'visible'
     * to each matched element when it enters the viewport.
     *
     * @param {string}  selector  CSS selector for targets
     * @param {number}  threshold 0–1, fraction of element visible before trigger
     */
    function revealOnScroll(selector, threshold) {
        const elements = document.querySelectorAll(selector);
        if (!elements.length) return;

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);   // Fire once only
                }
            });
        }, { threshold: threshold || 0.15 });

        elements.forEach(el => io.observe(el));
    }

    // ================= EDUCATION ENTRIES =================
    revealOnScroll('.edu-entry', 0.2);

    // ================= EXPERIENCE ITEMS =================
    revealOnScroll('.exp-item', 0.12);

    // ================= SKILL CATEGORIES =================
    revealOnScroll('.skill-category', 0.2);


    // ================= SKILL PILL — RIPPLE ON CLICK =================
    // Adds a brief scale pulse when a skill pill is tapped/clicked

    function initSkillRipple() {
        const skills = document.querySelectorAll('.skill');

        skills.forEach(skill => {
            skill.addEventListener('click', () => {
                skill.style.transform = 'scale(0.92)';
                setTimeout(() => {
                    skill.style.transform = '';
                }, 180);
            });
        });
    }

    initSkillRipple();


    // ================= EXPERIENCE IMAGE — LIGHTBOX =================
    // Clicking a certificate image opens it full-screen for reading

    function initImageLightbox() {
        const images = document.querySelectorAll('.exp-content img');
        if (!images.length) return;

        // Create overlay elements once
        const overlay = document.createElement('div');
        overlay.id = 'cert-lightbox';
        overlay.style.cssText = `
            display: none;
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: rgba(0,0,0,0.88);
            backdrop-filter: blur(6px);
            align-items: center;
            justify-content: center;
            cursor: zoom-out;
            padding: 20px;
        `;

        const img = document.createElement('img');
        img.style.cssText = `
            max-width: 92vw;
            max-height: 88vh;
            border-radius: 12px;
            box-shadow: 0 0 60px rgba(30,144,255,0.4);
            object-fit: contain;
            user-select: none;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: fixed;
            top: 18px;
            right: 22px;
            background: rgba(30,144,255,0.2);
            border: 1px solid rgba(30,144,255,0.4);
            color: #fff;
            font-size: 26px;
            line-height: 1;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s ease;
        `;
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(30,144,255,0.45)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(30,144,255,0.2)';
        });

        overlay.appendChild(img);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);

        // Open
        images.forEach(source => {
            source.style.cursor = 'zoom-in';
            source.addEventListener('click', () => {
                img.src = source.src;
                overlay.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });

        // Close
        function closeLightbox() {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeLightbox();
        });
        closeBtn.addEventListener('click', closeLightbox);

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    initImageLightbox();

})();
