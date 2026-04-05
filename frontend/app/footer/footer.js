// ================================================
//  FOOTER.JS
//  1. Auto-update copyright year
//  2. Social icon staggered reveal on scroll
// ================================================

(function () {
    'use strict';

    // ---- Auto year ----
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ---- Icon reveal ----
    function initFooterReveal() {
        const icons = document.querySelectorAll('.footer-icon');
        if (!icons.length) return;

        // Set initial hidden state
        icons.forEach((icon, i) => {
            icon.style.opacity          = '0';
            icon.style.transform        = 'translateY(14px)';
            icon.style.transitionDelay  = (i * 55) + 'ms';
        });

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const footer = entry.target;
                    const iconList = footer.querySelectorAll('.footer-icon');
                    iconList.forEach(icon => {
                        icon.style.opacity   = '1';
                        icon.style.transform = 'translateY(0)';
                    });
                    io.unobserve(footer);
                }
            });
        }, { threshold: 0.2 });

        const footer = document.querySelector('.footer');
        if (footer) io.observe(footer);
    }

    initFooterReveal();

})();
