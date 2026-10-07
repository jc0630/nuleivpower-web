/* ==========================================================================
   NULEIV — interactions
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---------- 1. Loader ---------- */
  window.addEventListener('load', function () {
    setTimeout(function () {
      var l = $('.loader');
      if (l) { l.classList.add('is-done'); setTimeout(function () { l.remove(); }, 800); }
    }, 420);
  });

  /* ---------- 2. Custom cursor ---------- */
  var cur = $('.cursor');
  if (cur) {
    var pin  = $('.cursor__pin', cur);
    var ring = $('.cursor__ring', cur);
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var px = mx, py = my, rx = mx, ry = my, started = false;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!started) { started = true; px = rx = mx; py = ry = my; cur.style.opacity = 1; }
    });
    document.addEventListener('mousedown', function () { document.body.classList.add('cursor-down'); });
    document.addEventListener('mouseup',   function () { document.body.classList.remove('cursor-down'); });
    document.addEventListener('mouseleave',function () { cur.style.opacity = 0; });
    document.addEventListener('mouseenter',function () { cur.style.opacity = 1; });

    (function loop() {
      px += (mx - px) * 0.28;  py += (my - py) * 0.28;
      rx += (mx - rx) * 0.13;  ry += (my - ry) * 0.13;
      pin.style.transform  = 'translate3d(' + px + 'px,' + py + 'px,0)' +
        (document.body.classList.contains('cursor-hover') ? ' scale(.55)' : '');
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      requestAnimationFrame(loop);
    })();

    // hover states — delegated so injected markup is covered
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest('a,button,[data-cursor],input,select,textarea,.acc__q,.tab');
      if (!t) return;
      var mode = t.getAttribute('data-cursor');
      if (mode === 'view' || t.classList.contains('post') || t.closest('.post')) {
        document.body.classList.add('cursor-view');
        var lbl = $('.cursor__label');
        if (lbl) lbl.textContent = t.getAttribute('data-cursor-label') || 'VIEW';
      } else {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (!e.target.closest('a,button,[data-cursor],input,select,textarea,.acc__q,.tab')) return;
      document.body.classList.remove('cursor-hover', 'cursor-view');
    });
  }

  /* ---------- 3. Header: stick + hide on scroll down ---------- */
  var header = $('.site-header');
  var bar = $('.progress');
  var last = 0;
  function onScroll() {
    var y = window.scrollY;
    if (header) {
      header.classList.toggle('is-stuck', y > 24);
      header.classList.toggle('is-hidden', y > 520 && y > last && !document.body.classList.contains('nav-open'));
    }
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    last = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 4. Mobile nav ---------- */
  var burger = $('.burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }
  $$('.mnav__top').forEach(function (btn) {
    if (btn.tagName !== 'BUTTON') return;
    btn.addEventListener('click', function () { btn.parentElement.classList.toggle('is-open'); });
  });

  /* ---------- 5. Reveal on scroll ---------- */
  var targets = $$('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var d = parseInt(el.getAttribute('data-delay') || '0', 10);
        setTimeout(function () { el.classList.add('is-in'); }, d);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* auto-stagger children of [data-stagger] */
  $$('[data-stagger]').forEach(function (group) {
    var step = parseInt(group.getAttribute('data-stagger') || '90', 10);
    Array.prototype.forEach.call(group.children, function (child, i) {
      if (!child.hasAttribute('data-reveal')) child.setAttribute('data-reveal', '');
      child.setAttribute('data-delay', i * step);
      if (reduced) child.classList.add('is-in');
    });
  });
  // re-observe freshly tagged children
  if (!reduced && 'IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        setTimeout(function () { el.classList.add('is-in'); },
                   parseInt(el.getAttribute('data-delay') || '0', 10));
        io2.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    $$('[data-reveal]:not(.is-in)').forEach(function (el) { io2.observe(el); });
  }

  /* ---------- 6. Count-up numbers ---------- */
  function countUp(el) {
    var to = parseFloat(el.getAttribute('data-count'));
    var dec = (el.getAttribute('data-dec') | 0);
    var dur = 1500, t0 = null;
    function tick(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (to * eased).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = $$('[data-count]');
  if (counters.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
    } else {
      var cio = new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { el.textContent = '0'; cio.observe(el); });
    }
  }

  /* ---------- 7. Marquee: duplicate the set for a seamless loop ---------- */
  $$('.marquee__track').forEach(function (track) {
    var set = track.firstElementChild;
    if (set) track.appendChild(set.cloneNode(true));
  });

  /* ---------- 8. Accordion ---------- */
  document.addEventListener('click', function (e) {
    var q = e.target.closest('.acc__q');
    if (!q) return;
    var item = q.parentElement;
    var list = item.parentElement;
    var isOpen = item.classList.contains('is-open');
    if (list.hasAttribute('data-single')) {
      $$('.acc__item', list).forEach(function (i) { i.classList.remove('is-open'); });
    }
    item.classList.toggle('is-open', !isOpen);
    q.setAttribute('aria-expanded', !isOpen);
  });

  /* ---------- 9. Tabs / filters ---------- */
  $$('[data-tabs]').forEach(function (group) {
    var btns = $$('.tab', group);
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-target');
        btns.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        var scope = document.querySelector(group.getAttribute('data-tabs')) || document;
        $$('.tabpane', scope).forEach(function (p) {
          p.hidden = !(p.getAttribute('data-pane') === target);
        });
        $$('[data-filter-item]', scope).forEach(function (item) {
          var show = target === 'all' || item.getAttribute('data-filter-item') === target;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  });

  /* deep-link to a tab via #hash */
  if (location.hash) {
    var hb = document.querySelector('.tab[data-target="' + location.hash.slice(1) + '"]');
    if (hb) setTimeout(function () { hb.click(); }, 60);
  }

  /* ---------- 10. Hero parallax on generated art ---------- */
  if (!reduced) {
    var para = $$('[data-parallax]');
    if (para.length) {
      window.addEventListener('scroll', function () {
        var y = window.scrollY;
        para.forEach(function (el) {
          var sp = parseFloat(el.getAttribute('data-parallax')) || 0.15;
          el.style.transform = 'translate3d(0,' + (y * sp) + 'px,0)';
        });
      }, { passive: true });
    }
  }

  /* ---------- 10b. Hover-indexed list: swap the backdrop per row ---------- */
  $$('[data-index]').forEach(function (group) {
    var media = $$('.art[data-index-media]', group);
    var rows = $$('[data-index-item]', group);
    if (!media.length || !rows.length) return;

    function activate(key) {
      media.forEach(function (m) {
        m.classList.toggle('is-on', m.getAttribute('data-index-media') === key);
      });
    }
    activate(rows[0].getAttribute('data-index-item'));

    rows.forEach(function (row) {
      var key = row.getAttribute('data-index-item');
      row.addEventListener('mouseenter', function () { activate(key); });
      row.addEventListener('focus', function () { activate(key); });
    });
  });

  /* ---------- 10c. Chapter rail ---------- */
  (function () {
    var rail = $('[data-rail]');
    if (!rail) return;
    var links = $$('a', rail);
    var chapters = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
    if (!chapters.length) return;

    if (!('IntersectionObserver' in window)) { rail.classList.add('is-on'); return; }

    var seen = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) seen.add(en.target); else seen.delete(en.target);
      });
      rail.classList.toggle('is-on', seen.size > 0);
      // highlight whichever chapter covers the middle of the viewport
      var mid = window.innerHeight / 2, best = null, bestD = Infinity;
      chapters.forEach(function (c) {
        var r = c.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var d = Math.abs((r.top + r.bottom) / 2 - mid);
        if (d < bestD) { bestD = d; best = c; }
      });
      links.forEach(function (a) {
        a.classList.toggle('is-on', best && a.getAttribute('href') === '#' + best.id);
      });
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    chapters.forEach(function (c) { io.observe(c); });

    window.addEventListener('scroll', function () {
      var mid = window.innerHeight / 2, best = null, bestD = Infinity;
      chapters.forEach(function (c) {
        var r = c.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var d = Math.abs((r.top + r.bottom) / 2 - mid);
        if (d < bestD) { bestD = d; best = c; }
      });
      links.forEach(function (a) {
        a.classList.toggle('is-on', best && a.getAttribute('href') === '#' + best.id);
      });
    }, { passive: true });
  })();

  /* ---------- 10d. 步驟流程圖 ----------
     橫式時把同一列標題拉成等高，下方說明文才會落在同一條基線上。
     只有真的有標題換行時才會加高，所以單行的頁面不會多出空隙。        */
  (function () {
    var lists = $$('.steps:not(.steps--v)');
    if (!lists.length) return;

    function sync() {
      lists.forEach(function (list) {
        var ts = $$('.step__t', list);
        ts.forEach(function (t) { t.style.minHeight = ''; });
        if (window.innerWidth < 900) return;
        var h = 0;
        ts.forEach(function (t) { h = Math.max(h, t.offsetHeight); });
        ts.forEach(function (t) { t.style.minHeight = h + 'px'; });
      });
    }
    sync();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t); t = setTimeout(sync, 150);
    });
  })();

  /* ---------- 11. Forms (demo only — no backend) ---------- */
  $$('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('.form-msg', form);
      if (msg) {
        msg.classList.add('is-on');
        msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    });
  });

  /* ---------- 12. No-op demo buttons ---------- */
  $$('[data-noop]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); });
  });

  /* ---------- 12b. 圖片輪播 .gal ----------
     左右鍵／點點／觸控滑動／鍵盤方向鍵，自動播放滑入即暫停。
     在容器加 data-gal-auto="0" 可關閉自動播放。 */
  $$('[data-gal]').forEach(function (gal) {
    var track = gal.querySelector('.gal__track');
    var slides = Array.prototype.slice.call(gal.querySelectorAll('.gal__slide'));
    if (!track || slides.length < 2) return;

    var dotsBox = gal.querySelector('.gal__dots');
    var countEl = gal.querySelector('.gal__count');
    var prev = gal.querySelector('[data-gal-prev]');
    var next = gal.querySelector('[data-gal-next]');
    var i = 0, timer = null, hover = false;
    var delay = parseInt(gal.getAttribute('data-gal-auto') || '6000', 10);
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var dots = slides.map(function (s, n) {
      if (!dotsBox) return null;
      var b = document.createElement('button');
      b.className = 'gal__dot';
      b.type = 'button';
      b.setAttribute('aria-label', '第 ' + (n + 1) + ' 張');
      b.addEventListener('click', function () { go(n); stop(); });
      dotsBox.appendChild(b);
      return b;
    });

    /* 左側服務項目：點擊跳到對應圖片 */
    var items = Array.prototype.slice.call(gal.querySelectorAll('[data-gal-go]'));
    items.forEach(function (b, n) {
      b.addEventListener('click', function () { go(n); stop(); });
    });

    function go(n) {
      i = (n + slides.length) % slides.length;
      track.style.transform = 'translate3d(' + (-i * 100) + '%,0,0)';
      slides.forEach(function (s, k) {
        if (k === i) s.setAttribute('data-on', ''); else s.removeAttribute('data-on');
      });
      dots.forEach(function (d, k) {
        if (d) d.setAttribute('aria-current', k === i ? 'true' : 'false');
      });
      items.forEach(function (b, k) {
        b.setAttribute('aria-current', k === i ? 'true' : 'false');
      });
      if (countEl) {
        countEl.textContent = ('0' + (i + 1)).slice(-2) + ' / ' +
          ('0' + slides.length).slice(-2);
      }
    }
    function start() {
      if (reduce || delay <= 0 || timer) return;
      timer = setInterval(function () { if (!hover) go(i + 1); }, delay);
    }
    function stop() { clearInterval(timer); timer = null; }

    if (prev) prev.addEventListener('click', function () { go(i - 1); stop(); });
    if (next) next.addEventListener('click', function () { go(i + 1); stop(); });

    gal.addEventListener('mouseenter', function () { hover = true; });
    gal.addEventListener('mouseleave', function () { hover = false; });
    gal.setAttribute('tabindex', '0');
    gal.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(i - 1); stop(); }
      if (e.key === 'ArrowRight') { go(i + 1); stop(); }
    });

    var x0 = null;
    gal.addEventListener('touchstart', function (e) {
      x0 = e.touches[0].clientX;
    }, { passive: true });
    gal.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 42) { go(dx < 0 ? i + 1 : i - 1); stop(); }
      x0 = null;
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); } else { start(); }
    });

    go(0);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting) { start(); } else { stop(); } });
      }, { threshold: 0.25 }).observe(gal);
    } else { start(); }
  });

  /* ---------- 13. Close mobile nav on resize up ---------- */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1040 && document.body.classList.contains('nav-open')) {
      document.body.classList.remove('nav-open');
      document.body.style.overflow = '';
      if (burger) burger.setAttribute('aria-expanded', 'false');
    }
  });
})();
