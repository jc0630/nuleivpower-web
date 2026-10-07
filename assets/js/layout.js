/* ==========================================================================
   NULEIV — shared layout (header / mobile nav / footer / cursor / loader)
   Injected on every page so the navigation only lives in one place.
   Each page sets  <body data-page="services" data-sub="service-pv">
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Site map ---------- */
  var NAV = [
    {
      key: 'services', label: '服務項目', href: 'services.html',
      children: [
        { key: 'service-pv',       label: '光電系統工程', href: 'service-pv.html' },
        { key: 'service-om',       label: '光電案場維運', href: 'service-om.html' },
        { key: 'service-regional', label: '區域能源整合', href: 'service-regional.html' },
        { key: 'service-data',     label: '能源資訊服務', href: 'service-data.html' },
        { key: 'service-trading',  label: '綠電交易服務', href: 'service-trading.html' }
      ]
    },
    { key: 'about', label: '關於立德新能源', href: 'about.html' },
    {
      key: 'sustainability', label: '永續經營', href: 'sustainability.html',
      children: [
        { key: 'sustain-carbon', label: '碳盤查', href: 'sustain-carbon.html' },
        { key: 'sustain-esg',    label: 'ESG',    href: 'sustain-esg.html' }
      ]
    },
    { key: 'contact', label: '聯絡我們', href: 'contact.html' },
    {
      key: 'faq', label: 'Q&A', href: 'faq.html',
      children: [
        { key: 'faq-green',   label: '綠能相關', href: 'faq.html#green' },
        { key: 'faq-service', label: '服務相關', href: 'faq.html#service' }
      ]
    },
    { key: 'news', label: '最新消息', href: 'news.html' }
  ];

  /* ---------- Shared SVG ---------- */
  var ICON = {
    caret: '<svg class="nav__caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    globe: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/></svg>'
  };

  /* Simplified NULEIV mark: angular "4" glyph + gradient location pin */
  function mark(id, light) {
    var gid = 'pin-' + id;
    return '<svg class="logo-mark" viewBox="0 0 104 112" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#4FC3E8"/><stop offset="1" stop-color="#9ED06A"/></linearGradient></defs>' +
      '<g fill="' + (light ? '#ffffff' : 'currentColor') + '">' +
      '<path d="M46 2 H68 L24 52 H2 Z"/>' +
      '<path d="M2 52 H66 V70 H2 Z"/>' +
      '<path d="M34 52 H54 V84 L76 57 L90 69 L54 110 H34 Z"/>' +
      '</g>' +
      '<path d="M84 10a14 14 0 0 1 14 14c0 10-14 26-14 26S70 34 70 24a14 14 0 0 1 14-14z" fill="url(#' + gid + ')"/>' +
      '</svg>';
  }

  var page = document.body.dataset.page || '';
  var sub = document.body.dataset.sub || '';

  /* ---------- Loader ---------- */
  var loader = document.createElement('div');
  loader.className = 'loader';
  loader.innerHTML = mark('load') + '<div class="loader__bar"></div>';
  document.body.appendChild(loader);

  /* ---------- Scroll progress ---------- */
  var progress = document.createElement('div');
  progress.className = 'progress';
  document.body.appendChild(progress);

  /* ---------- Header ---------- */
  function navItem(item) {
    var active = item.key === page ? ' is-active' : '';
    var html = '<li class="nav__item' + active + '">';
    html += '<a class="nav__link" href="' + item.href + '">' + item.label +
            (item.children ? ICON.caret : '') + '</a>';
    if (item.children) {
      html += '<div class="drop"><ul>';
      item.children.forEach(function (c) {
        html += '<li><a class="drop__link' + (c.key === sub ? ' is-active' : '') +
                '" href="' + c.href + '"><i class="drop__dot"></i>' + c.label + '</a></li>';
      });
      html += '</ul></div>';
    }
    return html + '</li>';
  }

  var header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML =
    '<div class="wrap site-header__bar">' +
      '<a class="brand" href="index.html" aria-label="立德新能源 NULEIV 首頁">' +
        '<img class="brand__img" src="assets/img/logo.jpg" alt="立德新能源 NULEIV">' +
        '<span class="brand__alt" aria-hidden="true">' + mark('hdr', true) +
          '<b>NULEIV<span>立德新能源</span></b></span>' +
      '</a>' +
      '<nav class="nav" aria-label="主選單"><ul style="display:flex;align-items:center;gap:inherit">' +
        NAV.map(navItem).join('') +
      '</ul></nav>' +
      '<div class="site-header__actions">' +
        '<button class="lang" type="button" data-noop>' + ICON.globe + 'EN</button>' +
        '<a class="btn btn--primary btn--sm" href="contact.html" data-hide-sm>免費諮詢' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
        '</a>' +
        '<button class="burger" type="button" aria-label="開啟選單" aria-expanded="false">' +
          '<span></span><span></span><span></span></button>' +
      '</div>' +
    '</div>';
  document.body.insertBefore(header, document.body.firstChild);

  /* ---------- Mobile drawer ---------- */
  var mnav = document.createElement('div');
  mnav.className = 'mnav';
  mnav.innerHTML = '<div class="wrap" style="padding-inline:0">' +
    NAV.map(function (item) {
      if (!item.children) {
        return '<div class="mnav__group"><a class="mnav__top" href="' + item.href + '">' + item.label + '</a></div>';
      }
      return '<div class="mnav__group' + (item.key === page ? ' is-open' : '') + '">' +
        '<button class="mnav__top" type="button">' + item.label + ICON.chev + '</button>' +
        '<div class="mnav__sub"><div>' +
          '<a href="' + item.href + '">' + item.label + '總覽</a>' +
          item.children.map(function (c) { return '<a href="' + c.href + '">' + c.label + '</a>'; }).join('') +
        '</div></div></div>';
    }).join('') +
    '<div style="display:flex;gap:12px;margin-top:34px;flex-wrap:wrap">' +
      '<a class="btn btn--primary" href="contact.html">免費諮詢</a>' +
      '<button class="btn btn--ghost" type="button" data-noop>EN</button>' +
    '</div></div>';
  document.body.appendChild(mnav);

  /* ---------- Footer ---------- */
  var year = new Date().getFullYear();
  var footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML =
    '<div class="site-footer__orb"></div>' +
    '<div class="wrap">' +
      '<div class="site-footer__grid">' +
        '<div>' +
          '<div class="site-footer__brand">' + mark('foot', true) +
            '<b>NULEIV<span>立德新能源</span></b></div>' +
          '<p class="small" style="color:rgba(255,255,255,.6);max-width:34ch">' +
            '上市集團立德電子（3058）旗下成員。從太陽能光電建置、大型儲能系統到綠電媒合交易，' +
            '以一站式智慧能源整合服務，陪企業走完淨零這條路。</p>' +
          '<div class="social" style="margin-top:26px">' +
            '<a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 112.5 6 2.5 2.5 0 014.98 3.5zM3 8.98h4v12H3zM9.5 8.98h3.8v1.64h.06a4.17 4.17 0 013.75-2.06c4 0 4.74 2.64 4.74 6.07v6.35h-4v-5.63c0-1.34 0-3.07-1.87-3.07s-2.16 1.46-2.16 2.97v5.73h-4z"/></svg></a>' +
            '<a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.54-1.5h1.66V3.63A22 22 0 0014.3 3.5c-2.4 0-4 1.46-4 4.14V9.9H7.6V13h2.7v8z"/></svg></a>' +
            '<a href="#" aria-label="Email"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M3 7l9 6 9-6"/></svg></a>' +
          '</div>' +
        '</div>' +
        '<div><h4>服務項目</h4><nav class="site-footer__links">' +
          NAV[0].children.map(function (c) { return '<a href="' + c.href + '">' + c.label + '</a>'; }).join('') +
        '</nav></div>' +
        '<div><h4>關於我們</h4><nav class="site-footer__links">' +
          '<a href="about.html">關於立德新能源</a><a href="sustainability.html">永續經營</a>' +
          '<a href="sustain-carbon.html">碳盤查</a><a href="sustain-esg.html">ESG</a>' +
          '<a href="news.html">最新消息</a>' +
        '</nav></div>' +
        '<div><h4>聯絡資訊</h4><nav class="site-footer__links">' +
          '<a href="contact.html">聯絡我們</a><a href="faq.html">常見問題 Q&amp;A</a>' +
          '<a href="mailto:service@nuleiv.com">service@nuleiv.com</a>' +
          '<a href="tel:+886223456789">+886 2 2345 6789</a>' +
          '<span class="small" style="color:rgba(255,255,255,.45);display:block;padding-top:6px;line-height:1.7">' +
            '新北市新店區寶橋路 Ｘ 號 Ｘ 樓<br>週一至週五 09:00–18:00</span>' +
        '</nav></div>' +
      '</div>' +
      '<div class="site-footer__bottom">' +
        '<p>© ' + year + ' NULEIV 立德新能源股份有限公司 — All rights reserved.</p>' +
        '<nav><a href="#">隱私權政策</a><a href="#">使用條款</a><a href="#">法律聲明</a></nav>' +
      '</div>' +
    '</div>';
  document.body.appendChild(footer);

  /* ---------- Custom cursor (logo pin) ---------- */
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var cur = document.createElement('div');
    cur.className = 'cursor';
    cur.innerHTML =
      '<div class="cursor__ring"><span class="cursor__label">VIEW</span></div>' +
      '<svg class="cursor__pin" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><linearGradient id="curGrad" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#4FC3E8"/><stop offset="1" stop-color="#9ED06A"/></linearGradient></defs>' +
        '<path d="M14 1a13 13 0 0 1 13 13c0 9.4-13 23-13 23S1 23.4 1 14A13 13 0 0 1 14 1z" ' +
        'fill="url(#curGrad)" stroke="#ffffff" stroke-width="1.6"/>' +
        '<circle cx="14" cy="13.6" r="4.2" fill="#ffffff" opacity=".92"/>' +
      '</svg>';
    document.body.appendChild(cur);
    document.body.classList.add('has-cursor');
  }

  /* expose for app.js */
  window.NULEIV = { NAV: NAV, mark: mark };
})();
