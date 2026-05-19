const filterButtons = document.querySelectorAll(".filter-chip");
const archiveCards = document.querySelectorAll(".archive-card");
const projectCards = document.querySelectorAll(".project-card");
const mockupSlides = document.querySelectorAll(".mockup-slide");
const mockupMeta = document.querySelector("#mockup-meta");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const interactiveElements = document.querySelectorAll("a, button, .archive-card");
const revealItems = document.querySelectorAll("[data-reveal]");
const topbar = document.querySelector(".topbar");
const themeToggle = document.querySelector(".theme-toggle");
const themeToggleText = document.querySelector(".theme-toggle-text");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a[href^='#']");
const sections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const THEME_STORAGE_KEY = "portfolio-theme";

function applyTheme(theme) {
  const nextTheme = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;

  if (themeToggle) {
    const isLight = nextTheme === "light";
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Alternar para tema escuro" : "Alternar para tema claro"
    );
  }

  if (themeToggleText) {
    themeToggleText.textContent = nextTheme === "light" ? "Light" : "Dark";
  }
}

function initTheme() {
  let savedTheme = "dark";

  try {
    savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY) || "dark";
  } catch {
    savedTheme = "dark";
  }

  applyTheme(savedTheme || "dark");

  themeToggle?.addEventListener("click", () => {
    const currentTheme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    const nextTheme = currentTheme === "light" ? "dark" : "light";

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Tema ainda alterna em tempo real mesmo se a persistência estiver indisponível.
    }

    applyTheme(nextTheme);
  });
}

initTheme();

projectCards.forEach((card) => {
  const type = card.dataset.type;
  const action = card.querySelector(".archive-button");

  if (!action) {
    return;
  }

  if (type === "simple") {
    action.setAttribute("aria-disabled", "true");
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((chip) => {
      chip.classList.toggle("is-selected", chip === button);
    });

    archiveCards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !matches);
    });
  });
});

let mockupIndex = 0;
let mockupInterval;

function renderMockupSlide(index) {
  mockupSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === index);
  });

  if (mockupMeta && mockupSlides[index]) {
    mockupMeta.textContent = mockupSlides[index].dataset.mockupName;
  }
}

function startMockupCycle() {
  if (!mockupSlides.length) {
    return;
  }

  window.clearInterval(mockupInterval);
  mockupInterval = window.setInterval(() => {
    mockupIndex = (mockupIndex + 1) % mockupSlides.length;
    renderMockupSlide(mockupIndex);
  }, 3400);
}

function stopMockupCycle() {
  window.clearInterval(mockupInterval);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopMockupCycle();
    return;
  }

  startMockupCycle();
});

renderMockupSlide(mockupIndex);
startMockupCycle();

function initCustomCursor() {
  if (!cursorDot || !cursorRing) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (prefersReducedMotion || (hasCoarsePointer && !hasFinePointer)) {
    document.body.classList.remove("has-custom-cursor");
    return;
  }

  document.body.classList.add("has-custom-cursor");

  let ringX = window.innerWidth / 2;
  let ringY = window.innerHeight / 2;

  window.addEventListener("mousemove", (event) => {
    const { clientX, clientY } = event;
    cursorDot.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;
    ringX += (clientX - ringX) * 0.18;
    ringY += (clientY - ringY) * 0.18;
  });

  function animateRing() {
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    window.requestAnimationFrame(animateRing);
  }

  animateRing();

  interactiveElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursorRing.classList.add("is-active");
    });

    element.addEventListener("mouseleave", () => {
      cursorRing.classList.remove("is-active");
    });
  });
}

initCustomCursor();

function initRevealOnScroll() {
  if (!revealItems.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

initRevealOnScroll();

function closeMobileNav() {
  if (!topbar || !menuToggle) {
    return;
  }

  topbar.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
}

function initPremiumHeader() {
  if (!topbar) {
    return;
  }

  function updateHeaderState() {
    topbar.classList.toggle("is-scrolled", window.scrollY > 18);
  }

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  menuToggle?.addEventListener("click", () => {
    const isOpen = topbar.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileNav();
    }
  });
}

function initActiveNavigation() {
  if (!sections.length || !navLinks.length || !("IntersectionObserver" in window)) {
    return;
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) {
        return;
      }

      const activeId = `#${visibleEntry.target.id}`;

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === activeId);
      });
    },
    {
      threshold: [0.18, 0.32, 0.5],
      rootMargin: "-18% 0px -58% 0px",
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

initPremiumHeader();
initActiveNavigation();
