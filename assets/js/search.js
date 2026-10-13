/* ==========================================================================
   NULEIV — 全站關鍵字搜尋
   純靜態站，沒有後端，所以索引是建置期先產好的靜態檔：
     tools/build-search-index.py  →  assets/data/search-index.js
   內容改完要重新產生索引（README 有指令）。

   索引到「第一次打開搜尋」才載入，平常瀏覽不會多付這段流量；
   用 <script> 注入而不是 fetch，是為了連 file:// 直接開也能運作。

   中文沒有詞界，所以一律走子字串比對，不做斷詞；
   空白分隔的多個關鍵字視為 AND。
   ========================================================================== */
(function () {
  'use strict';

  var MAX = 14;    /* 結果上限 */
  var PAD = 42;    /* 摘要在命中字前取幾個字（後面取兩倍） */

  var idx = null, loading = null, lastQ = '', rows = [], sel = -1;

  /* 全形英數 → 半形後轉小寫；中文不動。兩個轉換都不改長度，
     所以用它算出來的位置可以直接套回原字串。 */
  function norm(s) {
    return String(s || '').replace(/[！-～]/g, function (c) {
      return String.fromCharCode(c.charCodeAt(0) - 0xFEE0);
    }).replace(/　/g, ' ').toLowerCase();
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function countOf(hay, needle) {
    var n = 0, i = 0;
    while ((i = hay.indexOf(needle, i)) !== -1) { n++; i += needle.length; }
    return n;
  }

  /* ---------- 索引 ---------- */
  function loadIndex() {
    if (idx) return Promise.resolve(idx);
    if (loading) return loading;
    loading = new Promise(function (res) {
      var s = document.createElement('script');
      s.src = 'assets/data/search-index.js';
      s.onload = s.onerror = function () {
        idx = window.NULEIV_SEARCH_INDEX || { pages: [] };
        idx.pages.forEach(function (p) {
          p._t = norm(p.t); p._g = norm(p.g); p._d = norm(p.d);
          p.s.forEach(function (sec) { sec._h = norm(sec.h); sec._b = norm(sec.b); });
        });
        res(idx);
      };
      document.head.appendChild(s);
    });
    return loading;
  }

  /* ---------- 比對 ---------- */
  function scorePage(p, terms) {
    var secScore = p.s.map(function () { return 0; });
    var total = 0;

    for (var i = 0; i < terms.length; i++) {
      var t = terms[i], hit = 0;
      if (p._t.indexOf(t) !== -1) hit += 14;
      if (p._g.indexOf(t) !== -1) hit += 5;
      if (p._d.indexOf(t) !== -1) hit += 4;
      for (var j = 0; j < p.s.length; j++) {
        var c = 0;
        if (p.s[j]._h.indexOf(t) !== -1) c += 7;
        c += Math.min(countOf(p.s[j]._b, t), 6) * 1.5;
        secScore[j] += c; hit += c;
      }
      if (!hit) return null;          /* 有一個詞整頁都沒出現就淘汰（AND） */
      total += hit;
    }

    var b = 0;
    for (var k = 1; k < secScore.length; k++) if (secScore[k] > secScore[b]) b = k;
    return { p: p, score: total, sec: secScore[b] > 0 ? p.s[b] : p.s[0] };
  }

  function search(q) {
    var terms = norm(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return { terms: terms, hits: [] };
    var hits = [];
    idx.pages.forEach(function (p) {
      var r = scorePage(p, terms);
      if (r) hits.push(r);
    });
    hits.sort(function (a, b) { return b.score - a.score; });
    return { terms: terms, hits: hits.slice(0, MAX) };
  }

  /* 把所有命中的區段合併後包 <mark>，避免 <mark> 標籤本身被二次比對 */
  function markup(text, terms) {
    var out = esc(text), low = norm(out), ranges = [];
    terms.forEach(function (t) {
      var i = 0;
      while ((i = low.indexOf(t, i)) !== -1) { ranges.push([i, i + t.length]); i += t.length; }
    });
    if (!ranges.length) return out;
    ranges.sort(function (a, b) { return a[0] - b[0]; });
    var merged = [ranges[0].slice()];
    for (var r = 1; r < ranges.length; r++) {
      var last = merged[merged.length - 1];
      if (ranges[r][0] <= last[1]) last[1] = Math.max(last[1], ranges[r][1]);
      else merged.push(ranges[r].slice());
    }
    var res = '', pos = 0;
    merged.forEach(function (m) {
      res += out.slice(pos, m[0]) + '<mark>' + out.slice(m[0], m[1]) + '</mark>';
      pos = m[1];
    });
    return res + out.slice(pos);
  }

  function snippet(sec, terms) {
    if (!sec || !sec.b) return '';
    var at = -1;
    terms.forEach(function (t) {
      var k = sec._b.indexOf(t);
      if (k !== -1 && (at === -1 || k < at)) at = k;
    });
    if (at === -1) at = 0;
    var s = Math.max(0, at - PAD), e = Math.min(sec.b.length, at + PAD * 2);
    return (s > 0 ? '…' : '') + sec.b.slice(s, e) + (e < sec.b.length ? '…' : '');
  }

  /* ---------- 面板 ---------- */
  var ICO = {
    find: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    go: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };

  var QUICK = [
    ['服務項目', 'services.html'], ['光電系統工程', 'service-pv.html'],
    ['綠電交易服務', 'service-trading.html'], ['案場紀錄', 'service-pv.html#case-record'],
    ['碳盤查', 'sustain-carbon.html'], ['ESG', 'sustain-esg.html'],
    ['常見問題', 'faq.html'], ['聯絡我們', 'contact.html']
  ];

  var box = document.createElement('div');
  box.className = 'srch';
  box.hidden = true;
  box.innerHTML =
    '<div class="srch__scrim" data-srch-close></div>' +
    '<div class="srch__panel" role="dialog" aria-modal="true" aria-label="全站搜尋">' +
      '<div class="srch__bar">' +
        '<i class="srch__ico" aria-hidden="true">' + ICO.find + '</i>' +
        '<input class="srch__input" type="search" autocomplete="off" spellcheck="false" ' +
          'placeholder="搜尋服務、案場、永續或常見問題…" aria-label="搜尋關鍵字" ' +
          'aria-controls="srch-list" role="combobox" aria-expanded="false">' +
        '<button class="srch__close" type="button" data-srch-close aria-label="關閉搜尋">' + ICO.x + '</button>' +
      '</div>' +
      '<div class="srch__body">' +
        '<div class="srch__quick"><span class="srch__quick-t">熱門</span>' +
          QUICK.map(function (q) {
            return '<a class="srch__chip" href="' + q[1] + '">' + q[0] + '</a>';
          }).join('') +
        '</div>' +
        '<ul class="srch__list" id="srch-list" role="listbox"></ul>' +
        '<p class="srch__empty" hidden></p>' +
      '</div>' +
      '<div class="srch__foot"><span><kbd>↑</kbd><kbd>↓</kbd> 選擇</span>' +
        '<span><kbd>Enter</kbd> 前往</span><span><kbd>Esc</kbd> 關閉</span></div>' +
    '</div>';
  document.body.appendChild(box);

  var input = box.querySelector('.srch__input');
  var list = box.querySelector('.srch__list');
  var empty = box.querySelector('.srch__empty');
  var quick = box.querySelector('.srch__quick');

  function render(q) {
    var r = search(q);
    rows = r.hits; sel = -1;
    quick.hidden = !!q;
    input.setAttribute('aria-expanded', rows.length ? 'true' : 'false');

    if (!q) { list.innerHTML = ''; empty.hidden = true; return; }
    if (!rows.length) {
      list.innerHTML = '';
      empty.hidden = false;
      empty.innerHTML = '找不到「<b>' + esc(q) + '</b>」的相關內容，換個說法或試試上面的熱門關鍵字。';
      return;
    }
    empty.hidden = true;
    list.innerHTML = rows.map(function (h, n) {
      var href = h.p.u + '?q=' + encodeURIComponent(q) + (h.sec && h.sec.a ? '#' + h.sec.a : '');
      return '<li role="presentation">' +
        '<a class="srch__row" role="option" id="srch-r' + n + '" aria-selected="false" href="' + href + '">' +
          '<span class="srch__crumb">' + esc(h.p.g) + (h.sec && h.sec.h ? ' ／ ' + esc(h.sec.h) : '') + '</span>' +
          '<span class="srch__title">' + markup(h.p.t, r.terms) + '</span>' +
          '<span class="srch__snip">' + markup(snippet(h.sec, r.terms), r.terms) + '</span>' +
          '<i class="srch__go" aria-hidden="true">' + ICO.go + '</i>' +
        '</a></li>';
    }).join('');
  }

  function move(d) {
    var items = list.querySelectorAll('.srch__row');
    if (!items.length) return;
    if (sel > -1) items[sel].setAttribute('aria-selected', 'false');
    sel = (sel + d + items.length + (sel === -1 && d < 0 ? 1 : 0)) % items.length;
    items[sel].setAttribute('aria-selected', 'true');
    items[sel].scrollIntoView({ block: 'nearest' });
    input.setAttribute('aria-activedescendant', items[sel].id);
  }

  var opened = false, lastFocus = null;

  function open(seed) {
    if (opened) return;
    opened = true;
    lastFocus = document.activeElement;
    box.hidden = false;
    document.body.classList.add('srch-open');
    loadIndex().then(function () {
      if (input.value) render(input.value);
    });
    if (seed) input.value = seed;
    requestAnimationFrame(function () {
      box.classList.add('is-on');
      input.focus();
      input.select();
    });
  }

  function close() {
    if (!opened) return;
    opened = false;
    box.classList.remove('is-on');
    document.body.classList.remove('srch-open');
    setTimeout(function () { if (!opened) box.hidden = true; }, 240);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  box.addEventListener('click', function (e) {
    if (e.target.closest('[data-srch-close]')) close();
  });

  var tid = null;
  input.addEventListener('input', function () {
    var q = input.value.trim();
    if (q === lastQ) return;
    lastQ = q;
    clearTimeout(tid);
    tid = setTimeout(function () {
      loadIndex().then(function () { render(q); });
    }, 90);
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') {
      var items = list.querySelectorAll('.srch__row');
      if (items.length) { e.preventDefault(); items[sel > -1 ? sel : 0].click(); }
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && opened) { e.preventDefault(); close(); return; }
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault(); opened ? close() : open(); return;
    }
    /* 「/」當快捷鍵，但使用者正在其他輸入框打字時不要攔 */
    if (e.key === '/' && !opened && !e.metaKey && !e.ctrlKey && !e.altKey) {
      var a = document.activeElement;
      if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return;
      if (a && a.isContentEditable) return;
      e.preventDefault(); open();
    }
  });

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-srch-open]');
    if (!t) return;
    e.preventDefault();
    open();
  });

  /* ---------- 從搜尋結果進站：標出關鍵字並捲到第一個 ---------- */
  function highlightOnPage() {
    var m = /[?&]q=([^&#]*)/.exec(location.search);
    if (!m) return;
    var q = decodeURIComponent(m[1].replace(/\+/g, ' ')).trim();
    var terms = norm(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return;

    var skip = /^(SCRIPT|STYLE|NOSCRIPT|SVG|CANVAS|IFRAME|TEXTAREA|INPUT|MARK)$/;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode;
        if (!p || skip.test(p.nodeName)) return NodeFilter.FILTER_REJECT;
        if (p.closest('.srch,.site-header,.site-footer,.mnav,.loader')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);

    var first = null, made = 0;
    nodes.forEach(function (node) {
      if (made > 120) return;
      var low = norm(node.nodeValue), at = -1, len = 0;
      terms.forEach(function (t) {
        var k = low.indexOf(t);
        if (k !== -1 && (at === -1 || k < at)) { at = k; len = t.length; }
      });
      if (at === -1) return;
      var mk = document.createElement('mark');
      mk.className = 'srch-hit';
      var tail = node.splitText(at);
      tail.splitText(len);
      tail.parentNode.replaceChild(mk, tail);
      mk.appendChild(tail);
      made++;
      if (!first) first = mk;
    });

    if (!first) return;
    var note = document.createElement('div');
    note.className = 'srch-note';
    note.innerHTML = '<span>搜尋結果：<b>' + esc(q) + '</b></span>' +
      '<button type="button" aria-label="清除標示">' + ICO.x + '</button>';
    document.body.appendChild(note);
    note.querySelector('button').addEventListener('click', function () {
      document.querySelectorAll('mark.srch-hit').forEach(function (el) {
        var t = document.createTextNode(el.textContent);
        el.parentNode.replaceChild(t, el);
        t.parentNode.normalize();
      });
      note.remove();
      history.replaceState(null, '', location.pathname + location.hash);
    });

    setTimeout(function () {
      var y = first.getBoundingClientRect().top + window.pageYOffset - 140;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }, location.hash ? 700 : 420);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', highlightOnPage);
  } else { highlightOnPage(); }

  window.NULEIV_SEARCH = { open: open, close: close };
})();
