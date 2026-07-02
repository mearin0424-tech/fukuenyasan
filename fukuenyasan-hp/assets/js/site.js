// fukuenyasan-hp / site.js
// 全ページ共通JS：ハンバーガー開閉 / fade-in 表示演出（時間差つき）
//                / ヘッダのスクロール時スタイル / back-to-top ボタン注入

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

  var ticking = false;
  function onScroll(){
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
    toTop.classList.toggle('show', window.scrollY > 600);
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
})();
