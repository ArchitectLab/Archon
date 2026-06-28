/* ============================================================
   ARCHITECT LAB — Motion engine · al-scroll.js
   Powers the "Materialisation" scroll system. Vanilla JS, no deps.

   Reveals are driven by a scroll/resize/rAF check against
   getBoundingClientRect (NOT IntersectionObserver — so it runs
   identically in previews, exports and real browsers). Also scrubs
   scroll progress for the rail + parallax, runs count-ups + typing.

   Drop-in: add the data-* attributes (see al-scroll.css), then
   <script src="al-scroll.js"></script> near the end of <body>.

   Public API (also works on slides — call reveal() on a slide root):
     AL.motion.observe(scope)   index [data-al] inside scope + check now
     AL.motion.reveal(el)       force an element (+ its [data-al]
                                children) to their final state now
     AL.motion.reset(el)        re-arm for replay
     AL.motion.refresh()        re-scan DOM + re-measure + re-check
   ============================================================ */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.AL = window.AL || {};

  var items = [];        // revealable elements
  var parallax = [];     // scrubbed depth elements
  var SEL = '[data-al], [data-al-count], [data-al-type]';

  /* ---------- helpers ---------- */
  function measureDraw(scope) {
    scope.querySelectorAll('[data-al="draw"]').forEach(function (p) {
      if (p.__len) return;
      try { var len = p.getTotalLength(); if (len) { p.style.setProperty('--len', len); p.__len = len; } } catch (e) {}
    });
  }

  function applyStagger(scope) {
    scope.querySelectorAll('[data-al-stagger]').forEach(function (par) {
      if (par.__staggered) return; par.__staggered = true;
      var step = parseFloat(par.getAttribute('data-al-stagger')) || 90;
      var i = 0;
      par.querySelectorAll('[data-al]').forEach(function (it) {
        if (it.closest('[data-al-stagger]') !== par) return;
        it.style.setProperty('--al-delay', (i * step) + 'ms');
        i++;
      });
    });
  }

  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-al-count'));
    if (isNaN(target)) return;
    var dur = parseFloat(el.getAttribute('data-al-count-dur')) || 1100;
    var dec = (String(el.getAttribute('data-al-count')).split('.')[1] || '').length;
    if (reduce) { el.textContent = target.toFixed(dec); return; }
    var start = performance.now();
    (function tick(now) {
      var t = Math.min(1, (now - start) / dur);
      var e = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * e).toFixed(dec);
      if (t < 1) requestAnimationFrame(tick); else el.textContent = target.toFixed(dec);
    })(start);
  }

  function typeOut(el) {
    if (el.__typed) return; el.__typed = true;
    var text = el.getAttribute('data-al-type') || el.__rawText || el.textContent;
    el.__rawText = text;
    var speed = parseFloat(el.getAttribute('data-al-type-speed')) || 34;
    var caret = el.getAttribute('data-al-type-caret') !== 'false';
    el.textContent = '';
    var span = document.createElement('span');
    el.appendChild(span);
    var car;
    if (caret) { car = document.createElement('span'); car.className = 'al-caret'; car.textContent = '▌'; el.appendChild(car); }
    if (reduce) { span.textContent = text; return; }
    var i = 0;
    (function step() {
      span.textContent = text.slice(0, i);
      if (i++ <= text.length) setTimeout(step, speed);
    })();
  }

  function activate(el) {
    if (el.classList.contains('is-in')) return;
    el.classList.add('is-in');
    if (el.hasAttribute('data-al-count')) countUp(el);
    if (el.hasAttribute('data-al-type')) typeOut(el);
  }

  function deactivate(el) {
    el.classList.remove('is-in');
    el.__typed = false;
  }

  /* ---------- collect ---------- */
  function collect(scope) {
    scope = scope || document;
    measureDraw(scope);
    applyStagger(scope);
    scope.querySelectorAll(SEL).forEach(function (el) {
      if (el.__al) return; el.__al = true; items.push(el);
    });
    parallax = Array.prototype.slice.call(document.querySelectorAll('[data-al-parallax]'));
  }

  /* ---------- the reveal check (rect-based) ---------- */
  function check() {
    var vh = window.innerHeight || root.clientHeight;
    var enter = vh * 0.86, exit = vh * 0.04;
    for (var i = 0; i < items.length; i++) {
      var el = items[i];
      var r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0 && r.top === 0) continue; // not laid out yet
      var inView = r.top < enter && r.bottom > exit;
      if (reduce) { activate(el); continue; }
      if (inView) activate(el);
      else if (el.hasAttribute('data-al-repeat')) deactivate(el);
    }
  }

  /* ---------- scrubbed scroll: rail + parallax ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var max = root.scrollHeight - root.clientHeight;
      var y = window.scrollY || window.pageYOffset || 0;
      var p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      root.style.setProperty('--al-progress', p);
      if (!reduce) {
        var vh = window.innerHeight;
        for (var i = 0; i < parallax.length; i++) {
          var el = parallax[i];
          var f = parseFloat(el.getAttribute('data-al-parallax')) || 0.15;
          var r = el.getBoundingClientRect();
          var off = ((r.top + r.height / 2) - vh / 2) * -f;
          el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
        }
      }
      check();
      ticking = false;
    });
  }

  /* ---------- public API ---------- */
  AL.motion = {
    observe: function (scope) { collect(scope); check(); },
    reveal: function (el) {
      if (!el) return;
      if (el.matches && el.matches(SEL)) activate(el);
      el.querySelectorAll && el.querySelectorAll(SEL).forEach(activate);
    },
    reset: function (el) {
      if (!el) return;
      var list = (el.matches && el.matches('[data-al]')) ? [el] : [];
      el.querySelectorAll && el.querySelectorAll('[data-al]').forEach(function (n) { list.push(n); });
      list.forEach(deactivate);
    },
    refresh: function () { collect(document); onScroll(); }
  };

  /* ---------- boot ---------- */
  function inInitialView(el) {
    var r = el.getBoundingClientRect();
    return r.top < (window.innerHeight || root.clientHeight) * 0.98 && r.bottom > -4;
  }

  // When the page can't be scrolled (e.g. an embedded/auto-height host),
  // play the materialisation section-by-section so nothing stays hidden
  // and the signature effect is still seen. Cancelled if a real scroll
  // happens first (then it's scroll-driven, as on a normal website).
  var cascaded = false;
  function autoCascade() {
    if (cascaded) return; cascaded = true;
    var secs = Array.prototype.slice.call(document.querySelectorAll('[data-al-section], section'));
    var i = 0;
    (function next() {
      if (i >= secs.length) return;
      AL.motion.reveal(secs[i]); i++;
      setTimeout(next, 900);
    })();
  }

  function boot() {
    // Arm the page (enables hidden start-states) then reveal the first
    // screen in the SAME task — so above-the-fold paints visible directly,
    // never stuck at opacity:0 even if transitions are frozen (capture/PDF).
    root.classList.add('al-ready');
    collect(document);
    void document.body.offsetHeight;               // force layout → real rects
    items.forEach(function (el) { if (inInitialView(el)) activate(el); });
    onScroll();

    var scrolled = false;
    window.addEventListener('scroll', function () { scrolled = true; onScroll(); }, { passive: true });
    window.addEventListener('resize', function () {
      items.forEach(function (el) { el.__len = 0; }); measureDraw(document); onScroll();
    }, { passive: true });

    // Can the document actually scroll here?
    var se = document.scrollingElement || root;
    var canScroll;
    try { var b = se.scrollTop; se.scrollTop = b + 2; canScroll = se.scrollTop !== b; se.scrollTop = b; } catch (e) { canScroll = true; }
    var overflowing = (root.scrollHeight - root.clientHeight) > 8;

    setTimeout(check, 140);
    setTimeout(function () { measureDraw(document); check(); }, 520);
    // If there's content below the fold but no way to scroll to it, self-play.
    if (!reduce && overflowing && !canScroll) {
      setTimeout(function () { if (!scrolled) autoCascade(); }, 1100);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
