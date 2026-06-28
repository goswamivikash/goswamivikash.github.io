/* ===================================================================
   VIKASH GOSWAMI — PORTFOLIO SCRIPT
   =================================================================== */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------------------- LOADING SCREEN -------------------- */
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => {
      loader.classList.add("loaded");
    }, reduceMotion ? 100 : 900);
  });
  // Safety net in case 'load' fires late or assets stall
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("loaded");
  }, 3500);

  /* -------------------- CUSTOM CURSOR -------------------- */
  (function initCursor() {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const interactiveSelectors = "a, button, .project-card, input, textarea, .filter-btn, .domain-chip";
    document.querySelectorAll(interactiveSelectors).forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-active"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-active"));
    });
  })();

  /* -------------------- NAVBAR: scroll state + progress + active link -------------------- */
  const navbar = document.getElementById("navbar");
  const navProgress = document.getElementById("navProgress");
  const sections = Array.from(document.querySelectorAll("main > section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
  const backToTop = document.getElementById("backToTop");

  function onScroll() {
    const scrollY = window.scrollY;
    navbar.classList.toggle("scrolled", scrollY > 30);
    backToTop.classList.toggle("visible", scrollY > 600);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    navProgress.style.width = progress + "%";

    // active section
    let current = sections[0]?.id;
    const offset = 120;
    for (const sec of sections) {
      if (sec.getBoundingClientRect().top - offset <= 0) current = sec.id;
    }
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.nav === current);
    });

    // timeline fill
    updateTimelineFill();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* -------------------- MOBILE MENU -------------------- */
  const navBurger = document.getElementById("navBurger");
  const mobileMenu = document.getElementById("mobileMenu");

  function closeMobileMenu() {
    navBurger.classList.remove("open");
    navBurger.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
  }

  navBurger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    navBurger.classList.toggle("open", isOpen);
    navBurger.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  });

  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMobileMenu));

  /* -------------------- SMOOTH SCROLL for in-page links -------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 76;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navH + 1,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  });

  /* -------------------- THEME TOGGLE (saved preference) -------------------- */
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY = "vikash-portfolio-theme";

  function applyTheme(theme) {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    themeToggle.setAttribute("aria-pressed", String(theme === "light"));
  }

  let savedTheme = "dark";
  try {
    savedTheme = localStorage.getItem(THEME_KEY) ||
      (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  } catch (err) {
    savedTheme = "dark";
  }
  applyTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (err) { /* storage unavailable */ }
  });

  /* -------------------- SCROLL REVEAL -------------------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* -------------------- HERO ROTATOR (typing-style identity swap) -------------------- */
  (function heroRotator() {
    const el = document.getElementById("heroRotator");
    if (!el) return;
    const words = ["Customer Experience", "Fintech Products", "Fleet Operations"];
    if (reduceMotion) return;

    let i = 0;
    setInterval(() => {
      i = (i + 1) % words.length;
      el.style.opacity = "0";
      setTimeout(() => {
        el.textContent = words[i];
        el.style.opacity = "1";
      }, 280);
    }, 2600);
    el.style.transition = "opacity .28s ease";
  })();

  /* -------------------- ANIMATED COUNTERS -------------------- */
  (function counters() {
    const counterEls = document.querySelectorAll(".kpi-num[data-count]");
    if (!counterEls.length) return;

    function animateCounter(el) {
      const target = parseInt(el.dataset.count, 10) || 0;
      const suffix = el.dataset.suffix || "";
      const duration = reduceMotion ? 0 : 1400;
      const start = performance.now();

      function tick(now) {
        const progress = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(eased * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counterEls.forEach((el) => obs.observe(el));
    } else {
      counterEls.forEach(animateCounter);
    }
  })();

  /* -------------------- TIMELINE PROGRESS FILL -------------------- */
  function updateTimelineFill() {
    const timeline = document.getElementById("timeline");
    const fill = document.getElementById("timelineFill");
    if (!timeline || !fill) return;
    const rect = timeline.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const total = rect.height;
    const visible = Math.min(Math.max(viewportH * 0.75 - rect.top, 0), total);
    const pct = total > 0 ? (visible / total) * 100 : 0;
    fill.style.height = pct + "%";
  }

  /* -------------------- SKILLS DATA + BENTO RENDER + FILTER -------------------- */
  const skillsData = [
    { name: "Key Account Management", cat: "sales", size: "lg" },
    { name: "Client Acquisition", cat: "sales" },
    { name: "Lead Generation", cat: "sales" },
    { name: "Pipeline Management", cat: "sales" },
    { name: "Customer Retention", cat: "sales", size: "lg" },
    { name: "Upselling & Cross-Selling", cat: "sales" },
    { name: "FASTag Support", cat: "cx", size: "lg" },
    { name: "Renewals Management", cat: "cx" },
    { name: "Fintech Sales", cat: "cx" },
    { name: "Escalation Resolution", cat: "cx" },
    { name: "SLA Management", cat: "cx" },
    { name: "KYC & Compliance", cat: "cx" },
    { name: "CRM", cat: "cx" },
    { name: "MIS Reporting", cat: "cx", size: "lg" },
    { name: "Commercial Vehicle Ops", cat: "logistics", size: "lg" },
    { name: "Fleet Activation", cat: "logistics" },
    { name: "AIS 140 VLTD", cat: "logistics" },
    { name: "GPS Tracking", cat: "logistics" },
    { name: "Load Matching", cat: "logistics" },
    { name: "Fuel Cards", cat: "logistics" },
    { name: "Vehicle Loans", cat: "logistics" },
    { name: "SQL", cat: "tech" },
    { name: "Oracle DB", cat: "tech" },
    { name: "Google Cloud Platform", cat: "tech", size: "lg" },
    { name: "JSON & API", cat: "tech" },
    { name: "Microsoft Excel / Office", cat: "tech", size: "lg" },
  ];

  const catLabels = {
    sales: "Sales & Growth",
    cx: "CX & Ops",
    logistics: "Logistics & Fleet",
    tech: "Technical",
  };

  const skillsGrid = document.getElementById("skillsGrid");
  if (skillsGrid) {
    skillsGrid.innerHTML = skillsData
      .map(
        (s) => `
        <div class="skill-tile ${s.size ? "size-" + s.size : "size-sq"}" data-cat="${s.cat}">
          <span class="skill-tile-name">${s.name}</span>
          <span class="skill-tile-cat">${catLabels[s.cat]}</span>
        </div>`
      )
      .join("");

    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");

        const filter = btn.dataset.filter;
        document.querySelectorAll(".skill-tile").forEach((tile) => {
          const match = filter === "all" || tile.dataset.cat === filter;
          tile.classList.toggle("hidden", !match);
        });
      });
    });
  }

  /* -------------------- PROJECT DETAIL MODAL -------------------- */
  const caseStudies = {
    caseFastag: {
      tag: "Case Study · Fintech Ops",
      title: "FASTag Lifecycle at Scale",
      body: "Owned the complete FASTag lifecycle for a high-volume portfolio of fleet owner accounts — from first KYC activation through ongoing wallet recharges, subscription renewals, blacklist resolution, and Gold upgrades. The goal on every ticket: uninterrupted toll movement for the customer's fleet.",
      points: [
        "Handled KYC activation end-to-end for new and existing accounts",
        "Resolved blacklisting issues to restore toll access quickly",
        "Managed wallet recharges and subscription renewal cycles",
        "Processed Gold tier upgrades for high-volume fleet owners",
      ],
      stats: [
        { val: "5+", label: "Years owning this" },
        { val: "90%+", label: "Targets hit" },
      ],
    },
    caseGPS: {
      tag: "Case Study · Compliance",
      title: "1000+ Vehicles onto AIS 140",
      body: "Led GPS tracking and AIS 140 VLTD regulatory compliance onboarding across a large base of commercial vehicles, managing the full device lifecycle from activation through post-activation troubleshooting and replacements.",
      points: [
        "Coordinated device activation across 1000+ commercial vehicles",
        "Ensured regulatory compliance with AIS 140 VLTD standards",
        "Set up driver alerts and resolved post-activation issues",
        "Managed device replacement workflows to minimize downtime",
      ],
      stats: [
        { val: "1000+", label: "Vehicles onboarded" },
        { val: "5 yrs", label: "Ongoing ownership" },
      ],
    },
    caseRetention: {
      tag: "Case Study · Retention",
      title: "Proactive Renewals Calendar",
      body: "Designed and ran a proactive renewals calendar combined with rapid L2 escalation handling, specifically targeting enterprise fleet owner accounts that were at the highest risk of churn.",
      points: [
        "Built a renewals calendar to flag accounts before lapse",
        "Paired it with faster L2 escalation turnaround",
        "Focused first on enterprise accounts with highest revenue risk",
        "Tracked outcomes through BB Pro for visibility across teams",
      ],
      stats: [
        { val: "15–20%", label: "Retention lift" },
        { val: "Near-zero", label: "Churn on key accounts" },
      ],
    },
    caseMIS: {
      tag: "Case Study · Reporting",
      title: "Automated MIS & Tracking",
      body: "Designed and implemented automated tracking and MIS reporting workflows inside BlackBuck's internal BB Pro app, replacing manual update processes for fleet owner interactions, activation status, and escalations.",
      points: [
        "Standardized daily reporting format across the account portfolio",
        "Automated status tracking for product activations and renewals",
        "Improved handoff clarity between support and operations teams",
        "Reduced time spent on manual reporting tasks",
      ],
      stats: [
        { val: "25%", label: "Efficiency gain" },
      ],
    },
  };

  const modalOverlay = document.getElementById("modalOverlay");
  const modalContent = document.getElementById("modalContent");
  const modalClose = document.getElementById("modalClose");
  let lastFocusedEl = null;

  function openModal(key) {
    const data = caseStudies[key];
    if (!data) return;
    modalContent.innerHTML = `
      <span class="modal-tag">${data.tag}</span>
      <h3 id="modalTitle">${data.title}</h3>
      <p>${data.body}</p>
      <ul>${data.points.map((p) => `<li>${p}</li>`).join("")}</ul>
      <div class="modal-stat-row">
        ${data.stats.map((s) => `<div class="modal-stat"><strong>${s.val}</strong><span>${s.label}</span></div>`).join("")}
      </div>
    `;
    lastFocusedEl = document.activeElement;
    modalOverlay.classList.add("open");
    modalOverlay.setAttribute("aria-hidden", "false");
    modalClose.focus();
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modalOverlay.classList.remove("open");
    modalOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  document.querySelectorAll(".project-card[data-modal]").forEach((card) => {
    card.addEventListener("click", () => openModal(card.dataset.modal));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card.dataset.modal);
      }
    });
  });

  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("open")) closeModal();
  });

  /* -------------------- CONTACT FORM VALIDATION -------------------- */
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  function setFieldError(input, message) {
    const row = input.closest(".form-row");
    const errorEl = row.querySelector(".form-error");
    if (message) {
      row.classList.add("invalid");
      errorEl.textContent = message;
    } else {
      row.classList.remove("invalid");
      errorEl.textContent = "";
    }
  }

  function validateField(input) {
    if (input.validity.valueMissing) {
      setFieldError(input, "This field is required.");
      return false;
    }
    if (input.type === "email" && input.validity.typeMismatch) {
      setFieldError(input, "Enter a valid email address.");
      return false;
    }
    if (input.validity.tooShort) {
      setFieldError(input, `Please enter at least ${input.minLength} characters.`);
      return false;
    }
    setFieldError(input, "");
    return true;
  }

  if (contactForm) {
    const inputs = contactForm.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.closest(".form-row").classList.contains("invalid")) validateField(input);
      });
    });

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let allValid = true;
      inputs.forEach((input) => {
        if (!validateField(input)) allValid = false;
      });

      if (!allValid) {
        formStatus.textContent = "Please fix the highlighted fields.";
        formStatus.classList.add("error");
        return;
      }

      // No backend wired up — this is a static portfolio.
      // To make this live, connect EmailJS, Formspree, or your own endpoint here.
      formStatus.classList.remove("error");
      formStatus.textContent = "Thanks! This form isn't connected to an inbox yet — email swamiv768@gmail.com directly for now.";
      contactForm.reset();
    });
  }

  /* -------------------- FOOTER YEAR -------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------- LINKEDIN PLACEHOLDER NOTICE -------------------- */
  const linkedinLink = document.getElementById("linkedinLink");
  if (linkedinLink) {
    linkedinLink.addEventListener("click", (e) => {
      if (linkedinLink.getAttribute("href") === "#") {
        e.preventDefault();
        alert("Add your real LinkedIn URL in index.html (search for id=\"linkedinLink\").");
      }
    });
  }
})();
