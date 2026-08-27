(() => {
  const selectors = "h1, h2, h3, h4, p, img, a, button, label, input";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let sequence = 0;

  function prepare(element) {
    if (element.dataset.reveal) return;

    const isImage = element.matches("img");
    element.dataset.reveal = isImage ? "right" : sequence % 2 ? "right" : "left";
    element.style.transitionDelay = `${Math.min(sequence * 60, 420)}ms`;
    sequence += 1;
  }

  function revealVisible(elements) {
    elements.forEach((element) => {
      if (reducedMotion || element.getBoundingClientRect().top < window.innerHeight * 0.92) {
        element.classList.add("is-visible");
      }
    });
  }

  function setup() {
    const elements = [...document.querySelectorAll(selectors)];
    elements.forEach(prepare);

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealVisible(elements);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8%" },
    );

    elements.forEach((element) => observer.observe(element));

    const contentObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;

          const addedElements = node.matches(selectors)
            ? [node]
            : [...node.querySelectorAll(selectors)];

          addedElements.forEach((element) => {
            prepare(element);
            observer.observe(element);
          });
        });
      });
    });

    contentObserver.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup, { once: true });
  } else {
    setup();
  }
})();
