/* ==========================================================================
   NULEIV — generated SVG scenery  (v2)

   Every <div class="art" data-art="solar"></div> is filled with a layered SVG
   scene, so the site needs no external photography and never shows a broken
   image.

   Add data-static to freeze a scene (no motion). Per the client's direction,
   motion belongs only in heroes / banners / section backgrounds — content
   imagery such as the newsroom thumbnails stays still.

       <div class="art" data-art="solar"></div>           animated
       <div class="art" data-art="solar" data-static></div>   frozen
       <div class="art" data-art="solar" data-crop="low"></div>  shift framing
   ========================================================================== */
(function () {
  'use strict';

  var uid = 0;
  var VB = '0 0 400 260';

  function el(tag, attrs, inner) {
    var s = '<' + tag;
    for (var k in attrs) if (attrs[k] !== null && attrs[k] !== undefined) s += ' ' + k + '="' + attrs[k] + '"';
    return s + (inner !== undefined ? '>' + inner + '</' + tag + '>' : '/>');
  }
  function stops(list) {
    return list.map(function (s) {
      return el('stop', { offset: s[0], 'stop-color': s[1], 'stop-opacity': s[2] });
    }).join('');
  }
  function lg(id, list, horizontal) {
    return el('linearGradient',
      { id: id, x1: '0', y1: '0', x2: horizontal ? '1' : '0', y2: horizontal ? '0' : '1' },
      stops(list));
  }
  function rg(id, list, cx, cy, r) {
    return el('radialGradient', { id: id, cx: cx || '.5', cy: cy || '.5', r: r || '.5' }, stops(list));
  }

  /* deterministic pseudo-random so every render is identical */
  function rnd(seed, i) {
    var a = Math.sin((i + 1) * 127.1 + seed * 311.7) * 43758.5453;
    return Math.abs(a - Math.floor(a));
  }

  /* ---------- atmosphere ---------------------------------------------- */

  /* layered ridgelines fading into haze — the main depth cue */
  function ridges(n, bands) {
    return bands.map(function (b, i) {
      var y = b.y, amp = b.amp, col = b.c, op = b.o;
      var d = 'M-20 ' + y;
      for (var x = -20, k = 0; x <= 420; x += 70, k++) {
        var h = y - amp * (0.45 + rnd(n + i * 7, k) * 0.9);
        d += ' Q ' + (x + 35) + ' ' + h.toFixed(1) + ' ' + (x + 70) + ' ' + (y - amp * 0.2 * rnd(n + i * 13, k)).toFixed(1);
      }
      d += ' L420 300 L-20 300 Z';
      return el('path', { d: d, fill: col, opacity: op });
    }).join('');
  }

  /* soft horizontal haze band — separates ground planes */
  function haze(n, y, h, color, op) {
    var id = 'hz' + n + '-' + Math.round(y);
    return el('defs', null, lg(id, [['0', color, '0'], ['.5', color, String(op)], ['1', color, '0']])) +
           el('rect', { x: -20, y: y, width: 440, height: h, fill: 'url(#' + id + ')' });
  }

  /* volumetric rays from a light source */
  function rays(n, cx, cy, count, len, color, still) {
    var out = '';
    for (var i = 0; i < count; i++) {
      var a = (-Math.PI / 2) + (i - count / 2) * 0.17 + rnd(n, i) * 0.05;
      var w = 5 + rnd(n + 3, i) * 13;
      var x1 = cx + Math.cos(a - 0.02) * 14, y1 = cy + Math.sin(a - 0.02) * 14;
      var x2 = cx + Math.cos(a) * len - w, y2 = cy + Math.sin(a) * len;
      var x3 = cx + Math.cos(a) * len + w;
      out += el('polygon', {
        points: x1.toFixed(1) + ',' + y1.toFixed(1) + ' ' + x2.toFixed(1) + ',' + y2.toFixed(1) + ' ' + x3.toFixed(1) + ',' + y2.toFixed(1),
        fill: color, opacity: (0.05 + rnd(n + 9, i) * 0.07).toFixed(3),
        'class': still ? null : 'art-breathe',
        style: still ? null : 'animation-delay:' + (i * 0.7).toFixed(1) + 's'
      });
    }
    return out;
  }

  /* drifting cloud bands */
  function clouds(n, y, count, color, op, still) {
    var out = '';
    for (var i = 0; i < count; i++) {
      var cx = rnd(n + 21, i) * 440 - 20;
      var cy = y + rnd(n + 33, i) * 34 - 17;
      var w = 50 + rnd(n + 41, i) * 120;
      var h = 4 + rnd(n + 53, i) * 7;
      out += el('ellipse', {
        cx: cx.toFixed(1), cy: cy.toFixed(1), rx: w.toFixed(1), ry: h.toFixed(1),
        fill: color, opacity: (op * (0.45 + rnd(n + 61, i) * 0.55)).toFixed(3),
        'class': still ? null : 'art-drift',
        style: still ? null : 'animation-delay:-' + (i * 5.5).toFixed(1) + 's;animation-duration:' + (46 + i * 9) + 's'
      });
    }
    return out;
  }

  function motes(n, count, color, yMax, still) {
    var out = '';
    for (var i = 0; i < count; i++) {
      var x = rnd(n + 71, i) * 400, y = rnd(n + 83, i) * (yMax || 150);
      out += el('circle', {
        cx: x.toFixed(1), cy: y.toFixed(1), r: (0.5 + rnd(n + 91, i) * 1.2).toFixed(1),
        fill: color, opacity: (0.18 + rnd(n + 97, i) * 0.5).toFixed(2),
        'class': (!still && i % 3 === 0) ? 'art-twinkle' : null,
        style: (!still && i % 3 === 0) ? 'animation-delay:' + (i * 0.23).toFixed(2) + 's' : null
      });
    }
    return out;
  }

  function birds(n, cx, cy, still) {
    var out = '';
    for (var i = 0; i < 5; i++) {
      var x = cx + rnd(n + 101, i) * 90 - 45, y = cy + rnd(n + 103, i) * 34 - 17;
      var s = 2.2 + rnd(n + 107, i) * 1.8;
      out += el('path', {
        d: 'M' + x.toFixed(1) + ' ' + y.toFixed(1) + ' q' + s + ' ' + (-s * .8) + ' ' + (s * 2) + ' 0 q' + s + ' ' + (-s * .8) + ' ' + (s * 2) + ' 0',
        fill: 'none', stroke: '#06323A', 'stroke-width': .9, opacity: .34,
        'class': still ? null : 'art-float-slow',
        style: still ? null : 'animation-delay:-' + (i * 2.3).toFixed(1) + 's'
      });
    }
    return out;
  }

  /* ---------- solar array in perspective ------------------------------ */
  function array(n, opts) {
    opts = opts || {};
    var base = opts.y || 165;
    var rows = [
      { y: base,       h: 5,  w: 20, gap: 5,  tilt: 4,  x0: 36,   o: .40 },
      { y: base + 13,  h: 8,  w: 28, gap: 7,  tilt: 6,  x0: 8,    o: .54 },
      { y: base + 30,  h: 12, w: 39, gap: 9,  tilt: 9,  x0: -30,  o: .70 },
      { y: base + 53,  h: 18, w: 54, gap: 12, tilt: 12, x0: -86,  o: .88 },
      { y: base + 83,  h: 26, w: 74, gap: 16, tilt: 16, x0: -150, o: 1   }
    ];
    var out = '';
    rows.forEach(function (r, i) {
      if (opts.rows && i >= opts.rows) return;
      for (var x = r.x0, j = 0; x < 440; x += r.w + r.gap, j++) {
        var p = [
          x + ',' + (r.y + r.h),
          (x + r.w) + ',' + (r.y + r.h),
          (x + r.w + r.tilt) + ',' + r.y,
          (x + r.tilt) + ',' + r.y
        ].join(' ');
        out += el('polygon', { points: p, fill: 'url(#pan' + n + ')', opacity: r.o });
        /* specular glint — reads as glass */
        if (rnd(n + 109, i * 20 + j) > .62) {
          out += el('polygon', {
            points: (x + r.tilt + r.w * .12) + ',' + (r.y + r.h * .12) + ' ' +
                    (x + r.tilt + r.w * .5) + ',' + (r.y + r.h * .12) + ' ' +
                    (x + r.w * .34) + ',' + (r.y + r.h * .8) + ' ' +
                    (x + r.w * .06) + ',' + (r.y + r.h * .8),
            fill: '#EAFFFC', opacity: (r.o * .22).toFixed(2)
          });
        }
        out += el('line', {
          x1: x + r.tilt, y1: r.y, x2: x + r.w + r.tilt, y2: r.y,
          stroke: '#C8F5F0', 'stroke-width': .8, opacity: (r.o * .7).toFixed(2)
        });
      }
    });
    return out;
  }

  /* ---------- node network -------------------------------------------- */
  var NET = {
    nodes: [[42, 64], [128, 108], [214, 58], [300, 112], [364, 62],
            [70, 176], [152, 206], [246, 164], [330, 212], [386, 150]],
    links: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [1, 5], [1, 6], [5, 6],
            [2, 7], [3, 7], [6, 7], [7, 8], [8, 9], [3, 9], [6, 8]]
  };
  function network(n, color, still) {
    var c = color || '#7FE0DA', out = '';
    NET.links.forEach(function (l, i) {
      var a = NET.nodes[l[0]], b = NET.nodes[l[1]];
      out += el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: c, 'stroke-width': .9, opacity: .3 });
      if (!still && i % 3 === 0) {
        out += el('line', {
          x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: c, 'stroke-width': 1.6,
          'stroke-dasharray': '4 40', 'class': 'art-flow',
          style: 'animation-delay:' + (i * 0.5).toFixed(1) + 's'
        });
      }
    });
    NET.nodes.forEach(function (p, i) {
      out += el('circle', { cx: p[0], cy: p[1], r: 6.5, fill: c, opacity: .12 });
      out += el('circle', {
        cx: p[0], cy: p[1], r: 2.4, fill: c,
        'class': still ? null : 'art-pulse',
        style: still ? null : 'animation-delay:' + (i * 0.34).toFixed(2) + 's'
      });
    });
    return out;
  }

  function floorGrid(n, y, color, op) {
    var c = color || '#7FE0DA', out = '';
    for (var i = -12; i <= 12; i++) {
      out += el('line', { x1: 200 + i * 16, y1: y, x2: 200 + i * 130, y2: 300, stroke: c, 'stroke-width': .6, opacity: op || .16 });
    }
    for (var j = 0; j < 9; j++) {
      var yy = y + Math.pow(j / 8, 2.1) * (300 - y);
      out += el('line', { x1: -100, y1: yy.toFixed(1), x2: 500, y2: yy.toFixed(1), stroke: c, 'stroke-width': .6, opacity: op || .16 });
    }
    return out;
  }

  /* ===================== scenes ======================================= */
  var SCENES = {

    /* Dawn over a solar farm — hero / 光電系統工程 */
    solar: function (n, still) {
      return el('defs', null,
        lg('sky' + n, [['0', '#03101A'], ['.3', '#0A3B4E'], ['.56', '#166F74'], ['.76', '#2FA08C'], ['.89', '#8FD3A8'], ['1', '#F3E6C0']]) +
        lg('pan' + n, [['0', '#A6F0E8', '.92'], ['1', '#06303C', '.96']]) +
        lg('grd' + n, [['0', '#0E565A'], ['1', '#02121A']]) +
        rg('glow' + n, [['0', '#FFF9E2', '.98'], ['.3', '#FFD79A', '.5'], ['.62', '#A9DD88', '.22'], ['1', '#A9DD88', '0']])
      ) +
      el('rect', { width: 400, height: 260, fill: 'url(#sky' + n + ')' }) +
      motes(n, 22, '#DFF6F2', 110, still) +
      clouds(n, 76, 7, '#9FE4DE', .2, still) +
      rays(n, 300, 136, 9, 150, '#FFE9B8', still) +
      el('circle', { cx: 300, cy: 136, r: 74, fill: 'url(#glow' + n + ')' }) +
      el('circle', { cx: 300, cy: 136, r: 12.5, fill: '#FFFDF0', opacity: .97 }) +
      ridges(n, [
        { y: 158, amp: 22, c: '#1C6B70', o: .55 },
        { y: 166, amp: 14, c: '#0E4A54', o: .72 }
      ]) +
      haze(n, 150, 22, '#D9F6EC', .3) +
      el('rect', { y: 168, width: 400, height: 92, fill: 'url(#grd' + n + ')' }) +
      array(n, { y: 172 }) +
      birds(n, 108, 70, still) +
      el('path', { d: 'M-20 250 Q 110 238 230 248 T 420 242 L420 280 L-20 280 Z', fill: '#021016', opacity: .85 });
    },

    /* Aerial drone view of a solar farm — wide full-bleed banners */
    aerial: function (n, still) {
      var out = el('defs', null,
        lg('gnd' + n, [['0', '#0A3238'], ['.5', '#0D4A4A'], ['1', '#06252C']]) +
        lg('row' + n, [['0', '#8FE8E0', '.85'], ['1', '#0B4450', '.9']], true) +
        rg('vig' + n, [['0', '#000000', '0'], ['1', '#02121A', '.72']], '.5', '.5', '.72')
      ) +
      el('rect', { width: 400, height: 260, fill: 'url(#gnd' + n + ')' });
      /* rotated bands of panel rows, read as a field seen from above */
      out += '<g transform="rotate(-14 200 130)">';
      for (var i = -3; i < 14; i++) {
        var y = i * 20 - 10;
        out += el('rect', { x: -90, y: y, width: 580, height: 11, fill: 'url(#row' + n + ')', opacity: (.5 + (i % 3) * .14).toFixed(2) });
        out += el('rect', { x: -90, y: y + 11, width: 580, height: 3, fill: '#021A22', opacity: .5 });
        for (var j = 0; j < 14; j++) {
          out += el('line', { x1: -90 + j * 44, y1: y, x2: -90 + j * 44, y2: y + 11, stroke: '#04252E', 'stroke-width': 1, opacity: .55 });
        }
      }
      out += '</g>';
      /* service track + inverter blocks */
      out += el('path', { d: 'M-20 196 Q 120 182 220 196 T 420 188 L420 200 Q 240 208 120 196 T -20 208 Z', fill: '#163F44', opacity: .8 });
      [[64, 150], [178, 136], [292, 158]].forEach(function (p, k) {
        out += el('rect', { x: p[0], y: p[1], width: 22, height: 11, rx: 1.5, fill: '#0A2B33', opacity: .95 });
        out += el('rect', { x: p[0], y: p[1], width: 22, height: 2, fill: '#8FE8E0', opacity: .5 });
        if (!still) out += el('circle', { cx: p[0] + 18, cy: p[1] + 6, r: 1.3, fill: '#B9F3A0', 'class': 'art-pulse', style: 'animation-delay:' + (k * .7) + 's' });
      });
      return out + el('rect', { width: 400, height: 260, fill: 'url(#vig' + n + ')' });
    },

    /* Battery / grid technology — 儲能, VPP */
    storage: function (n, still) {
      return el('defs', null,
        lg('sky' + n, [['0', '#020E16'], ['.45', '#062834'], ['1', '#0A4D52']]) +
        lg('box' + n, [['0', '#14707A'], ['1', '#04202A']]) +
        rg('vig' + n, [['0', '#000000', '0'], ['1', '#010C12', '.6']], '.5', '.45', '.75')
      ) +
      el('rect', { width: 400, height: 260, fill: 'url(#sky' + n + ')' }) +
      motes(n, 20, '#9BEDE6', 240, still) +
      clouds(n, 54, 5, '#2E7D86', .22, still) +
      floorGrid(n, 186, '#7FE0DA', .14) +
      network(n, null, still) +
      [[22, 196, 62, 30], [96, 201, 72, 34], [182, 198, 58, 31], [254, 204, 78, 36], [344, 199, 48, 30]]
        .map(function (b, i) {
          return el('rect', { x: b[0], y: b[1], width: b[2], height: b[3], rx: 2.5, fill: 'url(#box' + n + ')', opacity: .95 }) +
                 el('rect', { x: b[0], y: b[1], width: b[2], height: 2.4, fill: '#8DE6DF', opacity: .6 }) +
                 el('rect', { x: b[0] + 4, y: b[1] + 7, width: b[2] - 8, height: 1, fill: '#0B3C46', opacity: .8 }) +
                 el('circle', {
                   cx: b[0] + b[2] - 8, cy: b[1] + 8, r: 1.6, fill: '#B9F3A0',
                   'class': still ? null : 'art-pulse',
                   style: still ? null : 'animation-delay:' + (i * 0.4) + 's'
                 });
        }).join('') +
      el('rect', { width: 400, height: 260, fill: 'url(#vig' + n + ')' });
    },

    /* Abstract smart-grid network — 區域能源整合 */
    grid: function (n, still) {
      return el('defs', null,
        lg('sky' + n, [['0', '#03121A'], ['.55', '#073340'], ['1', '#0B5A5C']]) +
        rg('vig' + n, [['0', '#000000', '0'], ['1', '#01101A', '.6']], '.5', '.5', '.75')
      ) +
      el('rect', { width: 400, height: 260, fill: 'url(#sky' + n + ')' }) +
      motes(n, 24, '#9BEDE6', 250, still) +
      floorGrid(n, 200, '#7FE0DA', .12) +
      el('circle', { cx: 200, cy: 130, r: 96, fill: 'none', stroke: '#7FE0DA', 'stroke-width': .7, opacity: .16 }) +
      el('circle', { cx: 200, cy: 130, r: 132, fill: 'none', stroke: '#7FE0DA', 'stroke-width': .7, opacity: .1 }) +
      (still ? '' : el('circle', { cx: 200, cy: 130, r: 60, fill: 'none', stroke: '#B9F3A0', 'stroke-width': .8, opacity: .4, 'class': 'art-expand' })) +
      network(n, null, still) +
      el('rect', { width: 400, height: 260, fill: 'url(#vig' + n + ')' });
    },

    /* Data / analytics — 能源資訊服務 */
    data: function (n, still) {
      var bars = [[48, 178], [84, 160], [120, 166], [156, 136], [192, 144], [228, 112], [264, 118], [300, 84], [336, 62]];
      return el('defs', null,
        lg('sky' + n, [['0', '#02101A'], ['.6', '#06303C'], ['1', '#09525A']]) +
        lg('bar' + n, [['0', '#7FE0DA', '.95'], ['1', '#0A3F4B', '.2']])
      ) +
      el('rect', { width: 400, height: 260, fill: 'url(#sky' + n + ')' }) +
      motes(n, 18, '#9BEDE6', 240, still) +
      [60, 100, 140, 180].map(function (y) {
        return el('line', { x1: 28, y1: y, x2: 372, y2: y, stroke: '#7FE0DA', 'stroke-width': .6, opacity: .13 });
      }).join('') +
      bars.map(function (b, i) {
        return el('rect', {
          x: b[0], y: b[1], width: 22, height: 220 - b[1], rx: 2,
          fill: 'url(#bar' + n + ')', opacity: .85,
          'class': still ? null : 'art-rise',
          style: still ? null : 'animation-delay:' + (i * 0.09).toFixed(2) + 's'
        });
      }).join('') +
      el('polyline', {
        points: bars.map(function (b) { return (b[0] + 11) + ',' + (b[1] - 12); }).join(' '),
        fill: 'none', stroke: '#B9F3A0', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: .9
      }) +
      bars.map(function (b, i) {
        return el('circle', {
          cx: b[0] + 11, cy: b[1] - 12, r: 2.2, fill: '#DFFBCF',
          'class': (!still && i % 2) ? 'art-pulse' : null,
          style: (!still && i % 2) ? 'animation-delay:' + (i * 0.3) + 's' : null
        });
      }).join('') +
      el('line', { x1: 28, y1: 220, x2: 372, y2: 220, stroke: '#7FE0DA', 'stroke-width': 1, opacity: .4 });
    },

    /* Green landscape — 永續, 碳盤查 */
    leaf: function (n, still) {
      return el('defs', null,
        lg('sky' + n, [['0', '#03141A'], ['.34', '#0A4440'], ['.64', '#1E7A58'], ['.85', '#58A868'], ['1', '#CFE9AE']]) +
        rg('glow' + n, [['0', '#F4FCDD', '.85'], ['.5', '#B9E08A', '.26'], ['1', '#9ED06A', '0']])
      ) +
      el('rect', { width: 400, height: 260, fill: 'url(#sky' + n + ')' }) +
      motes(n, 20, '#E6F8D8', 120, still) +
      clouds(n, 70, 6, '#8FCCA4', .22, still) +
      el('circle', { cx: 118, cy: 96, r: 62, fill: 'url(#glow' + n + ')' }) +
      rays(n, 118, 96, 7, 120, '#EAF7C8', still) +
      ridges(n, [
        { y: 170, amp: 26, c: '#1B6E54', o: .5 },
        { y: 186, amp: 20, c: '#0F5440', o: .72 },
        { y: 206, amp: 15, c: '#073A2E', o: .88 }
      ]) +
      haze(n, 162, 24, '#DFF4DC', .26) +
      el('path', { d: 'M-20 232 Q 120 220 240 230 T 420 224 L420 280 L-20 280 Z', fill: '#031E18', opacity: .9 }) +
      birds(n, 280, 84, still);
    },

    /* Industrial park skyline — 區域整合 / 聯絡我們 */
    city: function (n, still) {
      var sky = [[14, 150, 30, 110], [50, 128, 24, 132], [80, 162, 34, 98], [120, 112, 28, 148],
                 [154, 146, 22, 114], [182, 100, 36, 160], [224, 154, 26, 106], [256, 124, 32, 136],
                 [294, 160, 24, 100], [324, 134, 30, 126], [360, 152, 28, 108]];
      return el('defs', null,
        lg('sky' + n, [['0', '#02101A'], ['.42', '#06293C'], ['.78', '#0C5A6E'], ['1', '#43A6AE']]) +
        lg('bld' + n, [['0', '#0C4A58'], ['1', '#010F17']]) +
        rg('vig' + n, [['0', '#000000', '0'], ['1', '#010B12', '.55']], '.5', '.5', '.78')
      ) +
      el('rect', { width: 400, height: 260, fill: 'url(#sky' + n + ')' }) +
      motes(n, 20, '#CFEFF6', 100, still) +
      clouds(n, 64, 6, '#2C7E92', .25, still) +
      haze(n, 142, 40, '#8FD3DC', .22) +
      sky.map(function (b, i) {
        var w = b[0], y = b[1], ww = b[2], hh = b[3], win = '';
        for (var r = 0; r < Math.floor(hh / 16); r++) {
          for (var c = 0; c < Math.floor(ww / 11); c++) {
            if ((r * 3 + c * 5 + i) % 4 === 0) continue;
            win += el('rect', {
              x: w + 4 + c * 11, y: y + 8 + r * 16, width: 4, height: 5, fill: '#8DE6DF',
              opacity: (((i + r + c) % 5) * .08 + .12).toFixed(2),
              'class': (!still && (i + r + c) % 11 === 0) ? 'art-twinkle' : null,
              style: (!still && (i + r + c) % 11 === 0) ? 'animation-delay:' + ((i + r) * .5).toFixed(1) + 's' : null
            });
          }
        }
        return el('rect', { x: w, y: y, width: ww, height: hh, fill: 'url(#bld' + n + ')' }) +
               el('rect', { x: w, y: y, width: ww, height: 1.6, fill: '#7FE0DA', opacity: .35 }) + win;
      }).join('') +
      floorGrid(n, 238, '#7FE0DA', .13) +
      el('rect', { width: 400, height: 260, fill: 'url(#vig' + n + ')' });
    },

    /* Trading / exchange flows — 綠電交易 */
    trade: function (n, still) {
      return el('defs', null,
        lg('sky' + n, [['0', '#03121A'], ['.5', '#06333F'], ['1', '#0A5A58']]) +
        lg('arr' + n, [['0', '#7FE0DA'], ['1', '#B9F3A0']], true) +
        rg('vig' + n, [['0', '#000000', '0'], ['1', '#010E16', '.6']], '.5', '.5', '.75')
      ) +
      el('rect', { width: 400, height: 260, fill: 'url(#sky' + n + ')' }) +
      motes(n, 18, '#9BEDE6', 250, still) +
      floorGrid(n, 206, '#7FE0DA', .1) +
      el('g', { opacity: .28 }, network(n, null, true)) +
      el('circle', { cx: 104, cy: 128, r: 46, fill: 'none', stroke: '#7FE0DA', 'stroke-width': .8, opacity: .25 }) +
      el('circle', { cx: 296, cy: 128, r: 46, fill: 'none', stroke: '#B9F3A0', 'stroke-width': .8, opacity: .25 }) +
      el('circle', { cx: 104, cy: 128, r: 16, fill: '#083743', stroke: '#7FE0DA', 'stroke-width': 1.2, opacity: .95 }) +
      el('circle', { cx: 296, cy: 128, r: 16, fill: '#083743', stroke: '#B9F3A0', 'stroke-width': 1.2, opacity: .95 }) +
      el('path', { d: 'M126 112 C 170 86 230 86 274 112', fill: 'none', stroke: 'url(#arr' + n + ')', 'stroke-width': 1.6, opacity: .7 }) +
      el('path', { d: 'M274 144 C 230 170 170 170 126 144', fill: 'none', stroke: 'url(#arr' + n + ')', 'stroke-width': 1.6, opacity: .7 }) +
      (still ? '' :
        el('path', { d: 'M126 112 C 170 86 230 86 274 112', fill: 'none', stroke: '#DFFBCF', 'stroke-width': 2.4, 'stroke-dasharray': '6 58', 'stroke-linecap': 'round', 'class': 'art-flow' }) +
        el('path', { d: 'M274 144 C 230 170 170 170 126 144', fill: 'none', stroke: '#DFFBCF', 'stroke-width': 2.4, 'stroke-dasharray': '6 58', 'stroke-linecap': 'round', 'class': 'art-flow', style: 'animation-delay:1.6s' })) +
      el('polygon', { points: '274,112 264,106 266,117', fill: '#B9F3A0', opacity: .9 }) +
      el('polygon', { points: '126,144 136,150 134,139', fill: '#7FE0DA', opacity: .9 }) +
      el('text', { x: 104, y: 132, 'text-anchor': 'middle', fill: '#CFF6F2', 'font-size': '9', 'font-family': 'Outfit,sans-serif', 'font-weight': '600', opacity: .85 }, 'kWh') +
      el('text', { x: 296, y: 132, 'text-anchor': 'middle', fill: '#DFFBCF', 'font-size': '9', 'font-family': 'Outfit,sans-serif', 'font-weight': '600', opacity: .85 }, 'REC') +
      el('rect', { width: 400, height: 260, fill: 'url(#vig' + n + ')' });
    },

    /* Maintenance / inspection — 案場維運 */
    om: function (n, still) {
      return el('defs', null,
        lg('sky' + n, [['0', '#03141C'], ['.36', '#083945'], ['.7', '#146F78'], ['.9', '#5FB8B2'], ['1', '#C9EDDF']]) +
        lg('pan' + n, [['0', '#A6F0E8', '.88'], ['1', '#06303C', '.96']]) +
        lg('grd' + n, [['0', '#0C4E55'], ['1', '#02141B']])
      ) +
      el('rect', { width: 400, height: 260, fill: 'url(#sky' + n + ')' }) +
      motes(n, 16, '#DFF6F2', 120, still) +
      clouds(n, 72, 6, '#8FCFD2', .22, still) +
      ridges(n, [{ y: 162, amp: 16, c: '#11545C', o: .6 }]) +
      haze(n, 152, 20, '#D6F6EC', .26) +
      el('rect', { y: 168, width: 400, height: 92, fill: 'url(#grd' + n + ')' }) +
      array(n, { y: 172 }) +
      (still ? '' : el('rect', { x: 0, y: 168, width: 70, height: 92, fill: '#B9F3A0', opacity: .12, 'class': 'art-scan' })) +
      el('g', { opacity: .9 },
        el('circle', { cx: 268, cy: 212, r: 20, fill: 'none', stroke: '#B9F3A0', 'stroke-width': 1.2 }) +
        (still ? '' : el('circle', { cx: 268, cy: 212, r: 28, fill: 'none', stroke: '#B9F3A0', 'stroke-width': .7, opacity: .5, 'class': 'art-ping' })) +
        el('line', { x1: 268, y1: 186, x2: 268, y2: 198, stroke: '#B9F3A0', 'stroke-width': 1.2 }) +
        el('line', { x1: 268, y1: 226, x2: 268, y2: 238, stroke: '#B9F3A0', 'stroke-width': 1.2 }) +
        el('line', { x1: 242, y1: 212, x2: 254, y2: 212, stroke: '#B9F3A0', 'stroke-width': 1.2 }) +
        el('line', { x1: 282, y1: 212, x2: 294, y2: 212, stroke: '#B9F3A0', 'stroke-width': 1.2 })
      );
    },

    /* Dusk / warm variant — gives pages an alternative mood */
    dusk: function (n, still) {
      return el('defs', null,
        lg('sky' + n, [['0', '#0B1026'], ['.3', '#2A2452'], ['.55', '#6B3A63'], ['.75', '#C06A63'], ['.9', '#E9A878'], ['1', '#F7D9A8']]) +
        lg('pan' + n, [['0', '#FFD9A8', '.7'], ['1', '#1A1836', '.95']]) +
        lg('grd' + n, [['0', '#2B2140'], ['1', '#0A0A18']]) +
        rg('glow' + n, [['0', '#FFF3D0', '.95'], ['.4', '#FFA978', '.4'], ['1', '#C06A63', '0']])
      ) +
      el('rect', { width: 400, height: 260, fill: 'url(#sky' + n + ')' }) +
      motes(n, 26, '#FFE9D0', 100, still) +
      clouds(n, 86, 8, '#B3738A', .3, still) +
      el('circle', { cx: 112, cy: 170, r: 70, fill: 'url(#glow' + n + ')' }) +
      el('circle', { cx: 112, cy: 170, r: 15, fill: '#FFF6E0', opacity: .95 }) +
      ridges(n, [
        { y: 176, amp: 20, c: '#4B2F55', o: .6 },
        { y: 188, amp: 13, c: '#2A1C3C', o: .8 }
      ]) +
      haze(n, 168, 24, '#FFD5A8', .28) +
      el('rect', { y: 190, width: 400, height: 70, fill: 'url(#grd' + n + ')' }) +
      array(n, { y: 194, rows: 4 }) +
      birds(n, 290, 92, still);
    },

    /* Close-up panel surface — texture panel for editorial breaks */
    macro: function (n, still) {
      var out = el('defs', null,
        lg('cell' + n, [['0', '#0E4C5C'], ['.5', '#0A3A48'], ['1', '#052530']]) +
        rg('spec' + n, [['0', '#CFF6F2', '.5'], ['1', '#CFF6F2', '0']], '.3', '.2', '.6')
      ) + el('rect', { width: 400, height: 260, fill: '#041C26' });
      out += '<g transform="rotate(-18 200 130)">';
      for (var r = -2; r < 9; r++) {
        for (var c = -2; c < 11; c++) {
          out += el('rect', {
            x: c * 46 - 30, y: r * 38 - 20, width: 42, height: 34, rx: 2,
            fill: 'url(#cell' + n + ')', stroke: '#1B6B78', 'stroke-width': .8, opacity: .95
          });
          out += el('line', { x1: c * 46 - 30, y1: r * 38 - 3, x2: c * 46 + 12, y2: r * 38 - 3, stroke: '#2A8A96', 'stroke-width': .7, opacity: .5 });
        }
      }
      out += '</g>';
      out += el('ellipse', { cx: 120, cy: 60, rx: 190, ry: 120, fill: 'url(#spec' + n + ')' });
      if (!still) out += el('rect', { x: -120, y: 0, width: 90, height: 260, fill: '#CFF6F2', opacity: .07, 'class': 'art-sweep' });
      return out;
    },

    /* Light tiffany version — for sections on white */
    light: function (n, still) {
      return el('defs', null,
        lg('sky' + n, [['0', '#FFFFFF'], ['.4', '#E8FAF8'], ['1', '#A2E4DE']]) +
        lg('pan' + n, [['0', '#0E7F7B', '.7'], ['1', '#7FE0DA', '.26']]) +
        lg('grd' + n, [['0', '#D3F3EF'], ['1', '#9FE0DA']]) +
        rg('glow' + n, [['0', '#FFFFFF', '.95'], ['1', '#B9F3A0', '0']])
      ) +
      el('rect', { width: 400, height: 260, fill: 'url(#sky' + n + ')' }) +
      clouds(n, 60, 5, '#FFFFFF', .5, still) +
      el('circle', { cx: 300, cy: 112, r: 66, fill: 'url(#glow' + n + ')' }) +
      ridges(n, [{ y: 160, amp: 16, c: '#BDEAE4', o: .8 }]) +
      el('rect', { y: 168, width: 400, height: 92, fill: 'url(#grd' + n + ')' }) +
      array(n, { y: 172 });
    }
  };

  /* ---------- mount ---------- */
  var ANIM = /\s*class="art-[a-z-]+"|\s*style="animation[^"]*"/g;

  function build(node) {
    var key = node.getAttribute('data-art');
    var scene = SCENES[key] || SCENES.solar;
    var still = node.hasAttribute('data-static');
    var n = ++uid;
    var body = scene(n, still);
    if (still) body = body.replace(ANIM, '');   // belt and braces
    var crop = node.getAttribute('data-crop');
    var par = crop === 'low' ? 'xMidYMax slice'
            : crop === 'high' ? 'xMidYMin slice'
            : 'xMidYMid slice';
    node.innerHTML = '<svg viewBox="' + VB + '" preserveAspectRatio="' + par + '" ' +
      'xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' + body + '</svg>';
  }

  function run() {
    Array.prototype.forEach.call(document.querySelectorAll('.art[data-art]'), function (n) {
      if (!n.firstChild) build(n);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();

  window.NULEIV_ART = { scenes: Object.keys(SCENES), build: build, run: run };
})();
