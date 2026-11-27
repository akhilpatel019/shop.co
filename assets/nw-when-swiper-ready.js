window.nwWhenSwiperReady = function (callback, timeoutMs) {
  if (typeof callback !== 'function') return;

  var maxWait = typeof timeoutMs === 'number' ? timeoutMs : 5000;

  if (typeof Swiper !== 'undefined') {
    callback();
    return;
  }
                                        
  var startedAt = Date.now();

  (function poll() {
    if (typeof Swiper !== 'undefined') {
      callback();
      return;
    }

    if (Date.now() - startedAt >= maxWait) return;

    window.setTimeout(poll, 50);
  })();
};

window.nwPrefersReducedMotion = function () {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

window.nwAutoplayEnabled = function (requested) {
  return !!requested && !window.nwPrefersReducedMotion();
};
