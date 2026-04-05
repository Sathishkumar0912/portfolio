// ================================================
//  CONTACT.JS
//  1. EmailJS initialisation + form submit
//  2. Inline field validation
//  3. Toast notifications (success / error)
//  4. Platform circles — scroll reveal
// ================================================

(function () {
    'use strict';

    /* ================================================
       1. EMAILJS INIT
    ================================================ */

    // Initialise with your public key
    if (typeof emailjs !== 'undefined') {
        emailjs.init('qJ53KikimI1Kopl01');
    } else {
        // SDK not loaded yet — wait for it
        window.addEventListener('load', () => {
            if (typeof emailjs !== 'undefined') {
                emailjs.init('qJ53KikimI1Kopl01');
            }
        });
    }


    /* ================================================
       2. FORM SUBMIT
    ================================================ */

    const form    = document.getElementById('contact-form');
    const sendBtn = document.getElementById('send-btn');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Client-side validation
            if (!validateForm()) return;

            // UI → loading state
            setBtnLoading(true);

            const formData = {
                name   : form.name.value.trim(),
                email  : form.email.value.trim(),
                subject: form.subject.value.trim(),
                message: form.message.value.trim(),
            };

            // Primary email — send to YOU
            emailjs.send('Portfolio', 'template_7t472sv', formData)
                .then(() => {

                    // Auto-reply — send to USER
                    emailjs.send('Portfolio', 'template_xi78rpy', formData)
                        .catch(() => { /* auto-reply is non-critical */ });

                    showToast('✅ Message sent! I\'ll get back to you soon.', 'success');
                    form.reset();
                    clearAllErrors();
                    setBtnLoading(false);
                })
                .catch((err) => {
                    console.error('EmailJS error:', err);
                    showToast('❌ Failed to send message. Please try again.', 'error');
                    setBtnLoading(false);
                });
        });
    }


    /* ================================================
       3. FIELD VALIDATION
    ================================================ */

    function validateForm() {
        let valid = true;
        clearAllErrors();

        const name    = form.name.value.trim();
        const email   = form.email.value.trim();
        const subject = form.subject.value.trim();
        const message = form.message.value.trim();

        if (!name) {
            setError('err-name', 'Name is required.');
            valid = false;
        }

        if (!email) {
            setError('err-email', 'Email is required.');
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('err-email', 'Please enter a valid email address.');
            valid = false;
        }

        if (!subject) {
            setError('err-subject', 'Subject is required.');
            valid = false;
        }

        if (!message) {
            setError('err-message', 'Message cannot be empty.');
            valid = false;
        } else if (message.length < 10) {
            setError('err-message', 'Message must be at least 10 characters.');
            valid = false;
        }

        return valid;
    }

    function setError(id, msg) {
        const el = document.getElementById(id);
        if (el) el.textContent = msg;
    }

    function clearAllErrors() {
        ['err-name', 'err-email', 'err-subject', 'err-message'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '';
        });
    }

    // Live clear error on input
    if (form) {
        form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', () => {
                const errId = 'err-' + field.name;
                const errEl = document.getElementById(errId);
                if (errEl) errEl.textContent = '';
            });
        });
    }


    /* ================================================
       4. BUTTON LOADING STATE
    ================================================ */

    function setBtnLoading(loading) {
        if (!sendBtn) return;
        const textEl    = sendBtn.querySelector('.btn-text');
        const loadingEl = sendBtn.querySelector('.btn-loading');

        sendBtn.disabled = loading;

        if (textEl)    textEl.hidden    =  loading;
        if (loadingEl) loadingEl.hidden = !loading;
    }


    /* ================================================
       5. TOAST NOTIFICATION
    ================================================ */

    let toastTimer = null;

    function showToast(message, type) {
        const toast = document.getElementById('contact-toast');
        if (!toast) return;

        // Clear any running timer
        if (toastTimer) clearTimeout(toastTimer);

        toast.textContent = message;
        toast.className   = 'contact-toast show ' + (type || '');

        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }


    /* ================================================
       6. PLATFORM CIRCLES — SCROLL REVEAL
    ================================================ */

    function initPlatformReveal() {
        const circles = document.querySelectorAll('.contact-circle');
        if (!circles.length) return;

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Stagger delay via inline style
        circles.forEach((circle, i) => {
            circle.style.transitionDelay = (i * 40) + 'ms';
            io.observe(circle);
        });
    }

    initPlatformReveal();

})();
