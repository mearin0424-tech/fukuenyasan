/*
 * layout-check.js — スマホ幅での「崩れ」検出ロジック（依存なし）
 *
 * 使い方:
 *   1) 検証ハーネス tools/responsive-qa.html から呼ばれる（各ページ×各幅で実行）
 *   2) 本番/任意ページのコンソールに貼り付けて  layoutAudit(window)  でも単体実行可
 *
 * 戻り値: 問題の配列。空配列なら「崩れなし」。
 *   { type, sel, detail }
 *     type = 'page-overflow'      … 横スクロールが発生（画面外まで内容がある）
 *          | 'element-overflow'   … 個別要素が画面の左右にはみ出している
 *          | 'text-clip'          … nowrap/overflow:hidden で文字が収まらず切れている
 */
(function (global) {
  'use strict';

  function cssPath(el) {
    if (!el || el.nodeType !== 1) return '';
    if (el.id) return el.tagName.toLowerCase() + '#' + el.id;
    var sel = el.tagName.toLowerCase();
    var cls = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 3);
    if (cls.length) sel += '.' + cls.join('.');
    return sel;
  }

  // 祖先に「横スクロール/クリップ領域」があるか（カルーセル等は意図的に画面外へ伸びる）
  function insideScrollClip(el, win) {
    var p = el.parentElement;
    while (p && p.tagName !== 'BODY' && p.tagName !== 'HTML') {
      var cs = win.getComputedStyle(p);
      var ov = cs.overflow + ' ' + cs.overflowX + ' ' + cs.overflowY;
      if (/auto|scroll|hidden|clip/.test(ov)) return true;
      p = p.parentElement;
    }
    return false;
  }

  function innermost(list) {
    // 親子で同時に該当した場合、いちばん内側（=実際の原因要素）だけ残す
    return list.filter(function (a) {
      return !list.some(function (b) { return b.el !== a.el && a.el.contains(b.el); });
    });
  }

  function audit(win, opts) {
    win = win || global;
    opts = opts || {};
    var tol = opts.tolerance != null ? opts.tolerance : 2; // サブピクセル丸め誤差の許容(px)
    var doc = win.document;
    var vw = win.innerWidth;
    var issues = [];

    // 1) ページ全体の横はみ出し（= 横スクロールバーが出る状態）
    var rootSW = Math.max(doc.documentElement.scrollWidth, doc.body ? doc.body.scrollWidth : 0);
    if (rootSW > vw + tol) {
      issues.push({
        type: 'page-overflow', sel: 'html',
        detail: '横スクロール発生: 内容幅 ' + rootSW + 'px > 画面幅 ' + vw + 'px'
      });
    }

    if (!doc.body) return issues;
    var all = Array.prototype.slice.call(doc.body.querySelectorAll('*'));

    // 2) 個別要素の左右はみ出し
    var over = [];
    all.forEach(function (el) {
      var cs = win.getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return;
      var r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      if (r.right > vw + tol || r.left < -tol) {
        // カルーセル等、横スクロール/クリップ領域の中身は意図的なので除外
        if (insideScrollClip(el, win)) return;
        over.push({ el: el, r: r });
      }
    });
    innermost(over).forEach(function (f) {
      issues.push({
        type: 'element-overflow', sel: cssPath(f.el),
        detail: '画面(' + vw + 'px)外へ: 左端 ' + Math.round(f.r.left) + 'px / 右端 ' + Math.round(f.r.right) + 'px'
      });
    });

    // 3) 文字が収まらず切れている（nowrap もしくは overflow:hidden で内容が溢れる）
    var textSel = 'a,button,span,p,h1,h2,h3,h4,[class*="cta"],[class*="btn"],[class*="label"]';
    var clip = [];
    Array.prototype.slice.call(doc.body.querySelectorAll(textSel)).forEach(function (el) {
      var cs = win.getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return;
      // 文字が「1行に固定(nowrap)」で容器に収まらず切れるケースのみ対象にする。
      // overflow:hidden の箱(ボタン等)は装飾擬似要素 ::after(position:absolute) で
      // scrollWidth が膨らみ誤検出するため、nowrap のテキスト要素に限定する。
      if (cs.whiteSpace !== 'nowrap') return;
      // 絶対配置の子(装飾)を持つ要素は scrollWidth が当てにならないので除外
      var hasAbs = Array.prototype.some.call(el.children, function (c) {
        var p = win.getComputedStyle(c).position; return p === 'absolute' || p === 'fixed';
      });
      if (hasAbs) return;
      if (el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1) {
        var txt = (el.textContent || '').trim();
        if (txt.length) clip.push({ el: el, txt: txt });
      }
    });
    innermost(clip).forEach(function (f) {
      issues.push({
        type: 'text-clip', sel: cssPath(f.el),
        detail: '文字が切れる: 文字幅 ' + f.el.scrollWidth + 'px > 表示幅 ' + f.el.clientWidth +
                'px ｢' + f.txt.slice(0, 24) + (f.txt.length > 24 ? '…' : '') + '｣'
      });
    });

    return issues;
  }

  global.layoutAudit = audit;
  if (typeof module !== 'undefined' && module.exports) module.exports = audit;
})(typeof window !== 'undefined' ? window : this);
