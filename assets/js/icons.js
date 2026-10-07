/* ==========================================================================
   NULEIV — 流程圖示
   線性圖示，統一畫在 24 網格上、stroke 1.6、圓端圓角，與全站既有的
   箭頭／勾選圖示同一套筆法，不使用外部圖示字型。

   用法：<i class="ico" data-ico="survey"></i>
   會在載入時被換成 inline SVG；顏色沿用 currentColor。
   ========================================================================== */
(function () {
  'use strict';

  var I = {

    /* ── 勘查・規劃 ───────────────────────────── */
    survey:
      '<path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z"/>' +
      '<circle cx="12" cy="10" r="2.6"/>',
    draft:
      '<rect x="3" y="4" width="18" height="16" rx="1.6"/>' +
      '<path d="M3 9h18M8.5 9v11"/>' +
      '<path d="M12 12.5h5.5M12 16h3"/>',
    calc:
      '<rect x="4.5" y="3" width="15" height="18" rx="1.8"/>' +
      '<path d="M8 7h8"/>' +
      '<path d="M8.6 12h.01M12 12h.01M15.4 12h.01M8.6 16h.01M12 16h.01M15.4 16h.01"/>',
    'search-doc':
      '<path d="M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7.5"/>' +
      '<path d="M8.5 16h5M8.5 12.5h3"/>' +
      '<circle cx="16" cy="6.8" r="3.3"/><path d="M18.4 9.2 21 11.8"/>',
    boundary:
      '<path d="M4 7.5V4h3.5M16.5 4H20v3.5M20 16.5V20h-3.5M7.5 20H4v-3.5"/>' +
      '<rect x="8.6" y="8.6" width="6.8" height="6.8" rx="1"/>',
    chat:
      '<path d="M20.5 12a7.8 7.8 0 0 1-11.3 7L4 20.5l1.6-4.9A7.8 7.8 0 1 1 20.5 12Z"/>' +
      '<path d="M9 11h6M9 14h4"/>',

    /* ── 設計・建置 ───────────────────────────── */
    layers:
      '<path d="M12 3 3 7.5 12 12l9-4.5L12 3Z"/>' +
      '<path d="M3 12.3 12 16.8l9-4.5"/><path d="M3 16.8 12 21.3l9-4.5"/>',
    build:                                   /* 安全帽 */
      '<rect x="2.4" y="15.2" width="19.2" height="4.2" rx="1.4"/>' +
      '<path d="M10 10.1V5.3a1.3 1.3 0 0 1 1.3-1.3h1.4A1.3 1.3 0 0 1 14 5.3v4.8"/>' +
      '<path d="M4.6 15.2v-2.9A5.7 5.7 0 0 1 10 6.6"/>' +
      '<path d="M14 6.6a5.7 5.7 0 0 1 5.4 5.7v2.9"/>',
    sensor:
      '<rect x="8.4" y="8.4" width="7.2" height="7.2" rx="1.4"/>' +
      '<path d="M10.4 8.4V4.8M13.6 8.4V4.8M10.4 19.2v-3.6M13.6 19.2v-3.6"/>' +
      '<path d="M8.4 10.4H4.8M8.4 13.6H4.8M19.2 10.4h-3.6M19.2 13.6h-3.6"/>',
    plug:
      '<path d="M9 3v5M15 3v5"/>' +
      '<path d="M6.5 8h11v2.6a5.5 5.5 0 0 1-11 0Z"/>' +
      '<path d="M12 16.1V21"/>',
    tower:
      '<path d="M12 3v3.4M12 3 7 21M12 3l5 18"/>' +
      '<path d="M8.9 9.5h6.2M7.9 14.5h8.2M4.5 21h15"/>',
    battery:
      '<rect x="2.5" y="7" width="16" height="10" rx="2.2"/><path d="M21.5 10.6v2.8"/>' +
      '<path d="M11.6 9.4 9 12.4h3l-.6 2.6 3-3.3h-3Z"/>',

    /* ── 行政・文件 ───────────────────────────── */
    'doc-sign':
      '<path d="M13.8 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.2Z"/>' +
      '<path d="M13.8 3v5.2H19"/>' +
      '<path d="M8.4 16c1.3-1.9 2.1-.8 2.9-.1.8.7 1.7.4 2.3-.9"/>',
    report:
      '<rect x="4.5" y="3" width="15" height="18" rx="1.8"/>' +
      '<path d="M8 8.4h8M8 12h8M8 15.6h5"/>',
    'edit-check':
      '<path d="M12.4 20.5H6A1.5 1.5 0 0 1 4.5 19V5A1.5 1.5 0 0 1 6 3.5h8.5A1.5 1.5 0 0 1 16 5v5.6"/>' +
      '<path d="M7.8 8h6.4M7.8 11.6h4"/>' +
      '<path d="M13.8 17.9 16 20.1l4-4.4"/>',
    cert:
      '<rect x="3.5" y="3.5" width="17" height="11.5" rx="1.6"/>' +
      '<path d="M7.5 7.6h9M7.5 11.2h4.5"/>' +
      '<path d="M14.4 15v5.5l2.4-1.5 2.3 1.5V15"/>',
    'shield-check':
      '<path d="M12 3 5 5.9v5.4c0 4.3 2.9 7.9 7 9.7 4.1-1.8 7-5.4 7-9.7V5.9Z"/>' +
      '<path d="M9.1 11.9 11.3 14l4.1-4.4"/>',
    mail:
      '<rect x="3" y="5" width="18" height="14" rx="2"/>' +
      '<path d="M3.6 6.6 12 12.8l8.4-6.2"/>',
    bill:
      '<path d="M6 3h12v18l-2-1.4-2 1.4-2-1.4-2 1.4L8 19.6 6 21Z"/>' +
      '<path d="M9 8.4h6M9 12h6M9 15.6h3.5"/>',
    publish:
      '<path d="M12 7.6c-2.1-2-5.2-2.6-8.2-2.1v12.8c3-.5 6.1.1 8.2 2.1 2.1-2 5.2-2.6 8.2-2.1V5.5c-3-.5-6.1.1-8.2 2.1Z"/>' +
      '<path d="M12 7.6v12.8"/>',

    /* ── 量測・監控 ───────────────────────────── */
    clipboard:
      '<path d="M9.2 5.5H6.8A1.6 1.6 0 0 0 5.2 7.1V19A1.6 1.6 0 0 0 6.8 20.6h10.4A1.6 1.6 0 0 0 18.8 19V7.1a1.6 1.6 0 0 0-1.6-1.6h-2.4"/>' +
      '<rect x="9.2" y="3.4" width="5.6" height="3.4" rx="1"/>' +
      '<path d="M8.8 13.6 11 15.8l4.3-4.5"/>',
    gauge:
      '<path d="M4 18a8 8 0 1 1 16 0"/>' +
      '<path d="M12 18 16 12.6"/><circle cx="12" cy="18" r="1.2"/>' +
      '<path d="M4 18h2.4M21.6 18H19.2"/>',
    monitor:
      '<rect x="3" y="4.4" width="18" height="12.2" rx="1.8"/>' +
      '<path d="M9 20.6h6M12 16.6v4"/>' +
      '<path d="M6.6 11.9 9 8.9l2.2 3.1 2.1-4.1 2.3 4h2.8"/>',
    meter:                                   /* 電表 */
      '<rect x="3.6" y="3.4" width="16.8" height="17.2" rx="2.2"/>' +
      '<rect x="7" y="6.8" width="10" height="4.2" rx="1"/>' +
      '<circle cx="8.4" cy="16.4" r="1.5"/><circle cx="12" cy="16.4" r="1.5"/><circle cx="15.6" cy="16.4" r="1.5"/>',
    matrix:
      '<path d="M4.5 3.5V20h16"/>' +
      '<circle cx="9" cy="15.4" r="1.5"/><circle cx="13.4" cy="10.6" r="1.5"/><circle cx="17.6" cy="6.8" r="1.5"/>',
    benchmark:
      '<path d="M4.3 20V10.4M9.4 20V4.6M14.6 20v-7.4M19.7 20V7.6"/>' +
      '<path d="M2.5 15.8h19" stroke-dasharray="3 3.2"/>',
    dashboard:
      '<rect x="3" y="4" width="18" height="16" rx="1.8"/><path d="M3 8.6h18"/>' +
      '<path d="M7 16.6v-3.2M11 16.6v-5M15 16.6v-2.2M18.6 16.6v-4"/>',
    pins:
      '<circle cx="6.2" cy="6.8" r="2.1"/><circle cx="17.6" cy="6" r="2.1"/>' +
      '<circle cx="12" cy="13" r="2.1"/><circle cx="7" cy="18.4" r="2.1"/>' +
      '<path d="M7.9 8.4 10.5 11.4M16 7.4 13.5 11.2M11 14.7 8.3 16.8"/>',

    /* ── 維運・優化 ───────────────────────────── */
    wrench:
      '<path d="M20.2 5.6 17.3 8.5 15 8l-.5-2.3 2.9-2.9a4.8 4.8 0 0 0-6.2 6.1l-6.3 6.3a2.2 2.2 0 0 0 3.1 3.1l6.3-6.3a4.8 4.8 0 0 0 5.9-6.4Z"/>',
    sliders:
      '<path d="M4.5 6.5h2.2M11.2 6.5h8.3"/><circle cx="9" cy="6.5" r="2.2"/>' +
      '<path d="M4.5 12h8.3M17.2 12h2.3"/><circle cx="15" cy="12" r="2.2"/>' +
      '<path d="M4.5 17.5h3.8M12.7 17.5h6.8"/><circle cx="10.5" cy="17.5" r="2.2"/>',
    refresh:
      '<path d="M20 11.2A8 8 0 0 0 6.3 6.1L4 8.4"/><path d="M4 4.2v4.4h4.4"/>' +
      '<path d="M4 12.8a8 8 0 0 0 13.7 5.1L20 15.6"/><path d="M20 19.8v-4.4h-4.4"/>',
    headset:
      '<path d="M5 13.4v-1.2a7 7 0 0 1 14 0v1.2"/>' +
      '<rect x="3" y="13" width="4" height="6" rx="1.6"/><rect x="17" y="13" width="4" height="6" rx="1.6"/>' +
      '<path d="M19 19v.6a2.4 2.4 0 0 1-2.4 2.4H13.4"/>',
    link:
      '<path d="M10.2 13.6a4.1 4.1 0 0 0 5.8.3l3-3a4.1 4.1 0 0 0-5.8-5.8l-1.2 1.1"/>' +
      '<path d="M13.8 10.4a4.1 4.1 0 0 0-5.8-.3l-3 3a4.1 4.1 0 0 0 5.8 5.8l1.2-1.1"/>',
    database:
      '<ellipse cx="12" cy="6.2" rx="7" ry="2.9"/>' +
      '<path d="M5 6.2v5.3c0 1.6 3.1 2.9 7 2.9s7-1.3 7-2.9V6.2"/>' +
      '<path d="M5 11.5v5.3c0 1.6 3.1 2.9 7 2.9s7-1.3 7-2.9v-5.3"/>',

    /* ── 交易・目標 ───────────────────────────── */
    compare:
      '<path d="M3.5 8.2h12.8M13 4.8l3.4 3.4L13 11.6"/>' +
      '<path d="M20.5 15.8H7.7M11 12.4l-3.4 3.4L11 19.2"/>',
    match:                                   /* 供需交集 */
      '<circle cx="9.1" cy="12" r="5.4"/><circle cx="14.9" cy="12" r="5.4"/>',
    target:
      '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.2"/>' +
      '<circle cx="12" cy="12" r="1"/>',
    leaf:
      '<path d="M20 4c0 8.2-4.6 12.3-9.6 12.3A5.5 5.5 0 0 1 4.9 10.8C4.9 6.2 9.5 4 20 4Z"/>' +
      '<path d="M4 20.4c1.6-4.3 4.3-7 7.6-8.7"/>',
    users:
      '<circle cx="9.2" cy="8.4" r="3.2"/>' +
      '<path d="M3.4 19.4a5.8 5.8 0 0 1 11.6 0"/>' +
      '<path d="M16 5.9a3.2 3.2 0 0 1 0 5.9"/><path d="M17.2 14.3a5.8 5.8 0 0 1 3.4 5.1"/>'
  };

  function svg(name) {
    var d = I[name];
    if (!d) return '';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  }

  function paint(root) {
    var nodes = (root || document).querySelectorAll('[data-ico]');
    Array.prototype.forEach.call(nodes, function (n) {
      if (n.firstElementChild) return;              // 已經畫過
      n.innerHTML = svg(n.getAttribute('data-ico'));
    });
  }

  window.NULEIV_ICONS = { set: I, svg: svg, paint: paint };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { paint(); });
  } else {
    paint();
  }
})();
