const filterButtons = document.querySelectorAll(".filter-chip");
const archiveCards = document.querySelectorAll(".archive-card");
const projectCards = document.querySelectorAll(".project-card");
const mockupSlides = document.querySelectorAll(".mockup-slide");
const mockupMeta = document.querySelector("#mockup-meta");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const interactiveElements = document.querySelectorAll("a, button, .archive-card");
const revealItems = document.querySelectorAll("[data-reveal]");

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
