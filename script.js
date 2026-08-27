document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  initReveal();
});

// Fade sections in as they enter the viewport. Anything that cannot be
// observed (no IntersectionObserver, reduced motion) is shown immediately.
function initReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("reveal", "is-visible"));
    return;
  }

  targets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("is-visible");
        observer.unobserve(el);
        // Drop the reveal classes once the fade finishes. They carry the
        // stagger delay, which would otherwise slow down hover transitions.
        settle(el);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
  );

  targets.forEach((el) => observer.observe(el));
}

// Strip the reveal classes after the fade completes, with a timeout fallback
// in case transitionend never fires (element hidden, transition interrupted).
function settle(el) {
  let done = false;
  const clear = () => {
    if (done) return;
    done = true;
    el.classList.remove("reveal", "is-visible");
    el.removeEventListener("transitionend", onEnd);
  };
  const onEnd = (e) => {
    if (e.target === el && e.propertyName === "opacity") clear();
  };
  el.addEventListener("transitionend", onEnd);
  setTimeout(clear, 1500);
}
