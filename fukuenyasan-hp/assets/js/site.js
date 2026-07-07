// fukuenyasan-hp / site.js
// 全ページ共通JS：ハンバーガー開閉 / fade-in 表示演出（時間差つき）
//                / ヘッダのスクロール時スタイル / back-to-top ボタン注入
//                / 桜の花びら演出 / スクロール進捗バー / 統計カウントアップ
//                / 閲覧者向け編集ボタン（?edit=1 で有効化）

(function(){
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ハンバーガー開閉
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        nav.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // フェードイン（同時に見えた要素は 90ms ずつ時間差で表示）
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      var delay = 0;
      entries.forEach(function(e){
        if (e.isIntersecting) {
          if (!reduceMotion) e.target.style.transitionDelay = delay + 'ms';
          e.target.classList.add('visible');
          delay += 90;
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.fade-in').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.fade-in').forEach(function(el){ el.classList.add('visible'); });
  }

  // 統計数値のカウントアップ（.stat-item .num の数字部分）
  if ('IntersectionObserver' in window && !reduceMotion) {
    var numIo = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (!e.isIntersecting) return;
        numIo.unobserve(e.target);
        var node = e.target.firstChild; // 先頭のテキストノードが数値（<small> は後続）
        if (!node || node.nodeType !== 3) return;
        var raw = node.textContent.trim();
        var m = raw.match(/^([\d,]+)$/);
        if (!m) return; // 「全国」など数値以外はそのまま
        var target = parseInt(m[1].replace(/,/g, ''), 10);
        if (!isFinite(target) || target <= 0) return;
        var start = null, DUR = 1200;
        function fmt(n){ return n.toLocaleString('ja-JP'); }
        function step(ts){
          if (start === null) start = ts;
          var p = Math.min(1, (ts - start) / DUR);
          var eased = 1 - Math.pow(1 - p, 3);
          node.textContent = fmt(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(step);
          else node.textContent = fmt(target);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('.stat-item .num').forEach(function(el){ numIo.observe(el); });
  }

  // 桜の花びら（ヒーロー／下層ページヘッダに注入）
  if (!reduceMotion) {
    document.querySelectorAll('.hero, .page-hero').forEach(function(area){
      var isHero = area.classList.contains('hero');
      var count = isHero ? 10 : 6;
      var fall = isHero ? 700 : 340;
      var wrap = document.createElement('div');
      wrap.className = 'petals';
      wrap.setAttribute('aria-hidden', 'true');
      for (var i = 0; i < count; i++) {
        var s = document.createElement('span');
        s.textContent = '🌸';
        s.style.left = (Math.random() * 100) + '%';
        s.style.setProperty('--size', (9 + Math.random() * 9) + 'px');
        s.style.setProperty('--dur', (9 + Math.random() * 7) + 's');
        s.style.setProperty('--delay', (-Math.random() * 12) + 's');
        s.style.setProperty('--sway', ((Math.random() - 0.5) * 160) + 'px');
        s.style.setProperty('--fall', fall + 'px');
        s.style.setProperty('--spin', (140 + Math.random() * 320) + 'deg');
        s.style.setProperty('--petal-op', (0.35 + Math.random() * 0.35).toFixed(2));
        wrap.appendChild(s);
      }
      area.insertBefore(wrap, area.firstChild);
    });
  }

  // ヘッダ：スクロール時に影を強める
  var header = document.querySelector('.site-header');

  // back-to-top ボタン（全ページ共通なので JS で注入する）
  var toTop = document.createElement('button');
  toTop.className = 'back-to-top';
  toTop.setAttribute('aria-label', 'ページ上部へ戻る');
  toTop.textContent = '▲';
  document.body.appendChild(toTop);
  toTop.addEventListener('click', function(){
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  // スクロール進捗バー
  var progress = null;
  if (!reduceMotion) {
    progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);
  }

  var ticking = false;
  function onScroll(){
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
    toTop.classList.toggle('show', window.scrollY > 600);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  // 閲覧者向け編集ボタン：URL に ?edit=1 を付けると有効化（?edit=0 で解除）。
  // ボタンは admin/edit.html を対象ページ付きで開く。書き込みは管理画面で
  // サイトフォルダを選択した人にしかできない。
  try {
    var q = new URLSearchParams(location.search);
    if (q.get('edit') === '1') localStorage.setItem('fukuenEditMode', '1');
    if (q.get('edit') === '0') localStorage.removeItem('fukuenEditMode');
    if (localStorage.getItem('fukuenEditMode') === '1') {
      // site.js の src（例 ../assets/js/site.js）からサイトルートまでの深さを求める
      var script = document.querySelector('script[src*="assets/js/site.js"]');
      var src = script ? script.getAttribute('src') : './assets/js/site.js';
      var ups = (src.match(/\.\.\//g) || []).length;
      var rootPrefix = ups ? Array(ups + 1).join('../') : './';
      var segs = location.pathname.split('/').filter(Boolean);
      var pagePath = segs.slice(-(ups + 1)).join('/') || 'index.html';
      if (!/\.html?$/i.test(pagePath)) pagePath = (pagePath ? pagePath + '/' : '') + 'index.html';
      var fab = document.createElement('a');
      fab.className = 'edit-fab';
      fab.href = rootPrefix + 'admin/edit.html?page=' + encodeURIComponent(pagePath);
      fab.textContent = '✏️ このページを編集';
      document.body.appendChild(fab);
    }
  } catch (e) { /* URLSearchParams 非対応などは無視 */ }
})();
