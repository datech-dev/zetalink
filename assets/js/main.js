/* ==========================================================================
   Zetalink Technologies — Interactive Navigation, Accordions & Form Handling
   ========================================================================== */

(function () {
  'use strict';

  /* ─── 1. DESKTOP DROPDOWN / MEGA-MENU NAVIGATION ──────────────────────── */
  const navItems = Array.from(document.querySelectorAll('.nav-item[data-dropdown]'));
  let closeTimer = null;

  function closeAllDropdowns(exceptItem) {
    navItems.forEach((item) => {
      if (item !== exceptItem) {
        item.classList.remove('open');
        const trigger = item.querySelector('.nav-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  navItems.forEach((item) => {
    const trigger = item.querySelector('.nav-trigger');
    if (!trigger) return;

    item.addEventListener('mouseenter', () => {
      if (closeTimer) clearTimeout(closeTimer);
      closeAllDropdowns(item);
      item.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    });

    item.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => {
        item.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }, 140);
    });

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = item.classList.contains('open');
      closeAllDropdowns(null);
      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item[data-dropdown]')) {
      closeAllDropdowns(null);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns(null);
      closeMobileDrawer();
    }
  });

  /* ─── 2. MOBILE NAVIGATION DRAWER ─────────────────────────────────────── */
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  function closeMobileDrawer() {
    if (!mobileDrawer || !mobileBtn) return;
    mobileDrawer.classList.remove('open');
    mobileBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileBtn.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileDrawer);
    });
  }

  document.querySelectorAll('.mobile-nav-group-title').forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.mobile-nav-group');
      if (!group) return;
      const expanded = group.classList.toggle('expanded');
      btn.setAttribute('aria-expanded', String(expanded));
    });
  });

  /* ─── 3. FAQ ACCORDION ────────────────────────────────────────────────── */
  document.querySelectorAll('.faq-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (!item) return;
      const isOpen = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });

  /* ─── 4. SCROLL REVEAL (RESPECTS REDUCED MOTION) ──────────────────────── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  /* ─── 5. CONTACT FORM VALIDATION & WEB3FORMS SUBMISSION ───────────────── */
  const enquiryForm = document.getElementById('ai-enquiry-form');
  if (enquiryForm) {
    // Pre-select Area of Interest from URL ?interest=...
    const params = new URLSearchParams(window.location.search);
    const interestParam = params.get('interest');
    const interestSelect = document.getElementById('field-interest');
    if (interestParam && interestSelect) {
      const normalized = interestParam.toLowerCase();
      for (let i = 0; i < interestSelect.options.length; i++) {
        const opt = interestSelect.options[i];
        if (
          opt.dataset.slug === normalized ||
          opt.value.toLowerCase().includes(normalized.replace(/-/g, ' '))
        ) {
          interestSelect.selectedIndex = i;
          break;
        }
      }
    }

    const alertBox = document.getElementById('form-alert');
    const submitBtn = document.getElementById('form-submit-btn');

    function setAlert(type, message) {
      if (!alertBox) return;
      alertBox.className = 'form-alert show ' + type;
      alertBox.textContent = message;
    }

    function clearAlert() {
      if (!alertBox) return;
      alertBox.className = 'form-alert';
      alertBox.textContent = '';
    }

    function setFieldError(input, errorId, show) {
      const errEl = document.getElementById(errorId);
      if (show) {
        input.classList.add('invalid');
        if (errEl) errEl.classList.add('visible');
      } else {
        input.classList.remove('invalid');
        if (errEl) errEl.classList.remove('visible');
      }
    }

    function validateForm() {
      let valid = true;
      const nameInput = document.getElementById('field-name');
      const emailInput = document.getElementById('field-email');
      const companyInput = document.getElementById('field-company');
      const interestInput = document.getElementById('field-interest');
      const messageInput = document.getElementById('field-message');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        setFieldError(nameInput, 'error-name', true);
        valid = false;
      } else {
        setFieldError(nameInput, 'error-name', false);
      }

      if (!emailRegex.test(emailInput.value.trim())) {
        setFieldError(emailInput, 'error-email', true);
        valid = false;
      } else {
        setFieldError(emailInput, 'error-email', false);
      }

      if (!companyInput.value.trim()) {
        setFieldError(companyInput, 'error-company', true);
        valid = false;
      } else {
        setFieldError(companyInput, 'error-company', false);
      }

      if (!interestInput.value) {
        setFieldError(interestInput, 'error-interest', true);
        valid = false;
      } else {
        setFieldError(interestInput, 'error-interest', false);
      }

      if (!messageInput.value.trim() || messageInput.value.trim().length < 15) {
        setFieldError(messageInput, 'error-message', true);
        valid = false;
      } else {
        setFieldError(messageInput, 'error-message', false);
      }

      return valid;
    }

    enquiryForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      clearAlert();

      // Spam honeypot check
      const botcheck = enquiryForm.querySelector('input[name="botcheck"]');
      if (botcheck && botcheck.checked) {
        return;
      }

      if (!validateForm()) {
        setAlert('error', 'Please complete all required fields accurately before submitting.');
        return;
      }

      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting enquiry...';

      try {
        const formData = new FormData(enquiryForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (response.ok && result.success) {
          enquiryForm.reset();
          setAlert(
            'success',
            'Thank you. Your AI project enquiry has been received by Zetalink Technologies. Our engineering team will respond within one business day.'
          );
        } else {
          setAlert(
            'error',
            result.message || 'We could not deliver your submission right now. Please email us directly at contact@zetalink.cloud.'
          );
        }
      } catch (err) {
        setAlert(
          'error',
          'A network error prevented your submission. Please verify your connection or contact us directly at contact@zetalink.cloud.'
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    });
  }
})();

