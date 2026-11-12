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

  /* ─── 6. HEADER SCROLL ELEVATION ──────────────────────────────────────── */
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    const onScroll = () => {
      siteHeader.classList.toggle('scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─── 7. HERO INTERACTIVE ARCHITECTURE EXPLORER ───────────────────────── */
  const archTabs = Array.from(document.querySelectorAll('[data-arch-tab]'));
  const archReadout = document.getElementById('arch-detail-readout');
  const archLayerData = {
    '1': {
      title: '01 / Automate Daily Work:',
      desc: 'Handles repetitive invoice entry, email triage, and document checks automatically—while your team keeps final approval.',
      svgId: 'arch-layer-1',
    },
    '2': {
      title: '02 / Predict & Spot Issues Early:',
      desc: 'Turns your sales, stock, and production records into clear demand forecasts and early warnings before costly disruptions.',
      svgId: 'arch-layer-2',
    },
    '3': {
      title: '03 / Instant Company Answers:',
      desc: 'Lets staff search SOPs, contracts, and manuals in plain English and get verified answers linked to the exact source file.',
      svgId: 'arch-layer-3',
    },
    '4': {
      title: '04 / Connects to Your Existing Software:',
      desc: 'Plugs directly into your ERP, CRM, billing, and cloud tools with staff permissions and predictable operating costs.',
      svgId: 'arch-layer-4',
    },
  };

  if (archTabs.length && archReadout) {
    let archTimer = null;
    let currentArchIdx = 0;

    function activateArchLayer(key, userTriggered) {
      if (userTriggered && archTimer) {
        clearInterval(archTimer);
        archTimer = null;
      }
      archTabs.forEach((btn) => {
        const isActive = btn.dataset.archTab === key;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
      });
      Object.keys(archLayerData).forEach((k) => {
        const el = document.getElementById(archLayerData[k].svgId);
        if (el) {
          el.setAttribute('stroke', k === key ? '#22D3EE' : '#334155');
          el.setAttribute('stroke-width', k === key ? '2' : '1.2');
        }
      });
      const info = archLayerData[key];
      if (info) {
        archReadout.innerHTML = '<strong>' + info.title + '</strong> ' + info.desc;
      }
    }

    archTabs.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        currentArchIdx = idx;
        activateArchLayer(btn.dataset.archTab, true);
      });
    });

    if (!prefersReducedMotion) {
      archTimer = setInterval(() => {
        currentArchIdx = (currentArchIdx + 1) % archTabs.length;
        activateArchLayer(archTabs[currentArchIdx].dataset.archTab, false);
      }, 4200);
    }
  }

  /* ─── 8. SOLUTION BLUEPRINTS INTERACTIVE FILTER ───────────────────────── */
  const filterButtons = Array.from(document.querySelectorAll('[data-blueprint-filter]'));
  const blueprintCards = Array.from(document.querySelectorAll('.blueprint-card'));

  if (filterButtons.length && blueprintCards.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.blueprintFilter;
        filterButtons.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        blueprintCards.forEach((card) => {
          const cat = card.dataset.category || '';
          const match = filter === 'all' || cat.split(',').includes(filter);
          card.classList.toggle('is-hidden', !match);
        });
      });
    });
  }

  /* ─── 9. INTERACTIVE ENGAGEMENT STEPPER (01-05) ────────────────────────── */
  const processSteps = Array.from(document.querySelectorAll('[data-process-step]'));
  const processPanel = document.getElementById('process-detail-panel');
  const processData = {
    '01': {
      meta: 'Stage 01 // Discover',
      title: 'Workflow Mapping, Data Audit & Opportunity Prioritization',
      desc: 'We shadow operational teams, inspect existing databases and documents, and rank AI opportunities by feasibility and measurable business value.',
      deliverables: ['AI Readiness Scorecard', 'Data & System Inventory', 'Prioritized Use-Case Shortlist'],
    },
    '02': {
      meta: 'Stage 02 // Strategize',
      title: 'Target AI Architecture, Model Selection & Governance Blueprint',
      desc: 'We define the technical architecture, evaluation benchmarks, security boundaries, and integration contracts before production engineering begins.',
      deliverables: ['Solution Architecture Spec', 'Security & RBAC Design', 'Evaluation Benchmark Plan'],
    },
    '03': {
      meta: 'Stage 03 // Engineer',
      title: 'Custom AI Pipelines, RAG Indexes, ML Models & Agent Workflows',
      desc: 'Our engineers build modular LLM, RAG, ML, or computer vision components validated continuously against domain test sets.',
      deliverables: ['Production AI Services', 'Automated Evaluation Suite', 'Prompt & Model Registry'],
    },
    '04': {
      meta: 'Stage 04 // Integrate',
      title: 'Connecting Intelligence Directly Into Enterprise Applications',
      desc: 'We integrate AI endpoints into your ERP, CRM, ticketing tools, and internal portals with human-in-the-loop review gates.',
      deliverables: ['API & Webhook Connectors', 'Human Approval Interfaces', 'Team Enablement Docs'],
    },
    '05': {
      meta: 'Stage 05 // Scale & Optimize',
      title: 'LLMOps Observability, Drift Monitoring & 24/7 Support',
      desc: 'We monitor latency, token efficiency, and prediction accuracy in production—continuously optimizing as your data and workflows grow.',
      deliverables: ['Live Telemetry Dashboards', 'Drift & Cost Alerts', '24/7 Engineering Support'],
    },
  };

  if (processSteps.length && processPanel) {
    function selectStep(stepKey) {
      processSteps.forEach((s) => {
        const active = s.dataset.processStep === stepKey;
        s.classList.toggle('active', active);
        s.setAttribute('aria-selected', String(active));
      });
      const d = processData[stepKey];
      if (!d) return;
      const listHtml = d.deliverables
        .map(
          (item) =>
            '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span>' +
            item +
            '</span></li>'
        )
        .join('');
      processPanel.innerHTML =
        '<div><div class="process-detail-meta">' +
        d.meta +
        '</div><h3 style="font-size:1.2rem;margin-bottom:8px;">' +
        d.title +
        '</h3><p style="color:var(--text-secondary);font-size:0.9375rem;">' +
        d.desc +
        '</p></div><div><div style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;">Key Deliverables</div><ul class="bullet-list">' +
        listHtml +
        '</ul></div>';
    }

    processSteps.forEach((step) => {
      step.addEventListener('click', () => selectStep(step.dataset.processStep));
      step.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectStep(step.dataset.processStep);
        }
      });
    });
  }

  /* ─── 10. ZETASHIELD 360 INTERACTIVE MODULE INSPECTOR ──────────────────── */
  const zsButtons = Array.from(document.querySelectorAll('[data-zs-module]'));
  const zsReadout = document.getElementById('zs-live-readout');
  const zsModuleData = {
    '1': {
      label: 'Module 01 // Secure Data Storage',
      text: 'Structured storage architecture protecting operational records, customer measurements, transaction logs, and AI document repositories.',
      svgId: 'zs-node-1',
    },
    '2': {
      label: 'Module 02 // Automated Backup Management',
      text: 'Scheduled automated backup jobs with status monitoring so critical business datasets are captured consistently without manual intervention.',
      svgId: 'zs-node-2',
    },
    '3': {
      label: 'Module 03 // Controlled Access',
      text: 'Role-based access control (RBAC) and granular permission matrices restricting data visibility and export privileges by user role.',
      svgId: 'zs-node-3',
    },
    '4': {
      label: 'Module 04 // Data Recovery & Business Continuity',
      text: 'Structured restoration workflows and continuity planning enabling clean business data recovery when operational disruptions occur.',
      svgId: 'zs-node-4',
    },
  };

  if (zsButtons.length && zsReadout) {
    function selectZsModule(key) {
      zsButtons.forEach((b) => b.classList.toggle('active', b.dataset.zsModule === key));
      Object.keys(zsModuleData).forEach((k) => {
        const node = document.getElementById(zsModuleData[k].svgId);
        if (node) {
          node.setAttribute('stroke', k === key ? '#22D3EE' : '#334155');
          node.setAttribute('stroke-width', k === key ? '2' : '1.2');
        }
      });
      const info = zsModuleData[key];
      if (info) {
        zsReadout.innerHTML =
          '<div class="zs-live-readout-label">' + info.label + '</div><p>' + info.text + '</p>';
      }
    }

    zsButtons.forEach((btn) => {
      btn.addEventListener('click', () => selectZsModule(btn.dataset.zsModule));
    });
  }

  /* ─── 11. PRIVACY-CONSCIOUS CONVERSION EVENT HOOKS ─────────────────────── */
  document.querySelectorAll('[data-track]').forEach((el) => {
    el.addEventListener('click', () => {
      window.dispatchEvent(
        new CustomEvent('zetalink:track', {
          detail: { event: el.dataset.track, href: el.getAttribute('href') || '' },
        })
      );
    });
  });
})();

