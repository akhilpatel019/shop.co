(() => {
  const formatNumber = (value) => Math.round(value).toLocaleString('en-US');

  const animateCounter = (el) => {
    if (el.dataset.counted === 'true') return;
    el.dataset.counted = 'true';

    const target = Number(el.dataset.target);
    if (!Number.isFinite(target)) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || target <= 0) {
      el.textContent = formatNumber(target);
      return;
    }

    const duration = 1400;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatNumber(target * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatNumber(target);
      }
    };

    requestAnimationFrame(step);
  };

  const initCounters = (root = document) => {
    const counters = root.querySelectorAll('.nw-counter-number');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCounter);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    counters.forEach((counter) => {
      counter.textContent = '0';
      observer.observe(counter);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initCounters());
  } else {
    initCounters();
  }

  document.addEventListener('shopify:section:load', (event) => {
    initCounters(event.target);
  });
})();
