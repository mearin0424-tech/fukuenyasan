/* =====================================================
   復縁屋さん HP — 共通レンダリングモジュール
   Node（生成スクリプト generate.cjs）とブラウザ（管理画面 admin）の両方で使用。
   純粋関数のみ。DOM/Node固有APIには依存しない。
   ページHTML文字列を組み立てて {path, html} の配列を返す。
   ===================================================== */
(function (global) {
  'use strict';

  /* ---------- ユーティリティ ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  // rel: そのページからHPルートへの相対プレフィックス（例 "../"）
  function links(rel) {
    return {
      home:      rel + 'index.html',
      css:       rel + 'assets/css/site.css',
      js:        rel + 'assets/js/site.js',
      contact:   rel + '../fukuenyasan-lp/contact.html',
      diagnosis: rel + '../fukuenyasan-lp/diagnosis.html',
      caseIndex: rel + 'case/index.html',
      colIndex:  rel + 'column/index.html',
      regionIndex:    rel + 'region/index.html',
      situationIndex: rel + 'situation/index.html',
      genderIndex:    rel + 'gender/index.html',
      partnerIndex:   rel + 'partner/index.html',
      tel: 'tel:0353568550'
    };
  }

  var KINDS = {
    region:    { dir: 'region',    tkey: 'regions',      field: 'region',      nav: '地域別',      indexTitle: '地域別の復縁相談',       suffix: 'の復縁相談' },
    situation: { dir: 'situation', tkey: 'situations',   field: 'situation',   nav: '場面別',      indexTitle: '状況・場面別の復縁相談', suffix: 'のご相談' },
    gender:    { dir: 'gender',    tkey: 'genders',      field: 'gender',      nav: 'ご相談者別',  indexTitle: 'ご相談者タイプ別',       suffix: '' },
    partner:   { dir: 'partner',   tkey: 'partnerTypes', field: 'partnerType', nav: '相手のタイプ別', indexTitle: '相手のタイプ別の復縁相談', suffix: '' }
  };

  // ラベル逆引き
  function label(data, tkey, slug) {
    var arr = data.taxonomies[tkey] || [];
    for (var i = 0; i < arr.length; i++) if (arr[i].slug === slug) return arr[i].short || arr[i].label;
    return slug;
  }

  /* ---------- 共通パーツ ---------- */
  function header(rel, currentNav) {
    var L = links(rel);
    function item(href, label, key) {
      var cur = key === currentNav ? ' aria-current="page"' : '';
      return '<li><a href="' + href + '"' + cur + '>' + label + '</a></li>';
    }
    return '' +
'<header class="site-header" id="site-header">\n' +
'  <div class="container header-inner">\n' +
'    <a href="' + L.home + '" class="brand" aria-label="復縁屋さん トップへ">\n' +
'      <span class="brand-en">Rework</span>\n' +
'      <span class="brand-ja">復縁屋さん</span>\n' +
'    </a>\n' +
'    <nav class="gnav" id="gnav" aria-label="グローバルナビゲーション">\n' +
'      <ul>\n' +
        item(L.home + '#service', 'サービス', 'service') +
        item(L.caseIndex, '事例', 'case') +
        item(L.regionIndex, '地域別', 'region') +
        item(L.situationIndex, '場面別', 'situation') +
        item(L.colIndex, 'コラム', 'column') +
        item(L.diagnosis, '無料診断', 'diagnosis') +
'      </ul>\n' +
'    </nav>\n' +
'    <div class="header-cta">\n' +
'      <div class="header-tel">\n' +
'        <a href="' + L.tel + '" class="header-tel-num">03-5356-8550</a>\n' +
'        <span class="header-tel-note">受付 24時間 / 秘密厳守</span>\n' +
'      </div>\n' +
'      <a href="' + L.contact + '" class="btn-header">無料相談はこちら</a>\n' +
'      <button class="menu-toggle" id="menu-toggle" aria-label="メニューを開く" aria-expanded="false" aria-controls="gnav">\n' +
'        <span></span><span></span><span></span>\n' +
'      </button>\n' +
'    </div>\n' +
'  </div>\n' +
'</header>\n';
  }

  function footer(rel) {
    var L = links(rel);
    return '' +
'<footer class="site-footer">\n' +
'  <div class="container">\n' +
'    <div class="footer-grid">\n' +
'      <div class="footer-brand">\n' +
'        <span class="brand-en">Rework</span>\n' +
'        <p class="brand-ja" style="font-size:22px;">復縁屋さん</p>\n' +
'        <p>心理学とデータに基づく復縁・関係修復サポート<br>〒176-0025 東京都練馬区中村南2丁目21番15号<br>株式会社Azucar（探偵業届出 第30210334号）</p>\n' +
'      </div>\n' +
'      <div class="footer-col">\n' +
'        <h3>CONTENTS</h3>\n' +
'        <ul>\n' +
'          <li><a href="' + L.caseIndex + '">復縁事例</a></li>\n' +
'          <li><a href="' + L.regionIndex + '">地域別の相談</a></li>\n' +
'          <li><a href="' + L.situationIndex + '">場面別の相談</a></li>\n' +
'          <li><a href="' + L.partnerIndex + '">相手のタイプ別</a></li>\n' +
'          <li><a href="' + L.genderIndex + '">ご相談者別</a></li>\n' +
'          <li><a href="' + L.colIndex + '">コラム</a></li>\n' +
'        </ul>\n' +
'      </div>\n' +
'      <div class="footer-col">\n' +
'        <h3>CONTACT</h3>\n' +
'        <ul>\n' +
'          <li><a href="' + L.contact + '">無料相談フォーム</a></li>\n' +
'          <li><a href="' + L.diagnosis + '">12問の復縁診断</a></li>\n' +
'          <li><a href="' + L.tel + '">03-5356-8550（24時間受付）</a></li>\n' +
'          <li><a href="' + L.home + '#price">料金について</a></li>\n' +
'          <li><a href="' + L.home + '#faq">よくあるご質問</a></li>\n' +
'        </ul>\n' +
'      </div>\n' +
'    </div>\n' +
'    <div class="footer-bottom">\n' +
'      <p>当社は探偵業法に基づき適正に運営しております。法令・公序良俗に反するご依頼はお受けできません。</p>\n' +
'      <p>© 2026 Azucar Inc. All Rights Reserved.</p>\n' +
'    </div>\n' +
'  </div>\n' +
'</footer>\n';
  }

  function ctaFixed(rel) {
    var L = links(rel);
    return '' +
'<div class="cta-fixed" role="navigation" aria-label="お問い合わせ">\n' +
'  <a href="' + L.contact + '" class="cta-fixed-form">\n' +
'    <span class="cta-fixed-main">無料相談フォーム</span>\n' +
'    <span class="cta-fixed-sub">24時間受付・秘密厳守</span>\n' +
'  </a>\n' +
'  <a href="' + L.tel + '" class="cta-fixed-tel">\n' +
'    <span class="cta-fixed-main">03-5356-8550</span>\n' +
'    <span class="cta-fixed-sub">タップで発信</span>\n' +
'  </a>\n' +
'</div>\n';
  }

  function inlineCta(rel, heading) {
    var L = links(rel);
    return '' +
'<div class="cta-inline">\n' +
'  <h3>' + esc(heading || 'ひとりで抱え込む前に、状況の整理から') + '</h3>\n' +
'  <p>ご相談は無料・秘密厳守。匿名でも構いません。まずはお気軽にお声がけください。</p>\n' +
'  <div class="cta-inline-actions">\n' +
'    <a href="' + L.contact + '" class="btn btn-primary">無料相談フォームへ <span class="arrow">→</span></a>\n' +
'    <a href="' + L.diagnosis + '" class="btn btn-outline--light">無料の復縁診断を試す</a>\n' +
'  </div>\n' +
'</div>\n';
  }

  function breadcrumb(rel, trail) {
    var L = links(rel);
    var parts = ['<a href="' + L.home + '">ホーム</a>'];
    for (var i = 0; i < trail.length; i++) {
      parts.push('<span aria-hidden="true">›</span>');
      if (trail[i].href) parts.push('<a href="' + trail[i].href + '">' + esc(trail[i].label) + '</a>');
      else parts.push('<span>' + esc(trail[i].label) + '</span>');
    }
    return '<nav class="breadcrumb" aria-label="パンくずリスト">' + parts.join('') + '</nav>';
  }

  /* ---------- 記事ブロック描画 ---------- */
  function renderBlocks(blocks) {
    var out = [];
    (blocks || []).forEach(function (b) {
      switch (b.t) {
        case 'lead': out.push('<p class="lead">' + esc(b.x) + '</p>'); break;
        case 'h2':   out.push('<h2 id="' + slugifyHeading(b.x) + '">' + esc(b.x) + '</h2>'); break;
        case 'h3':   out.push('<h3>' + esc(b.x) + '</h3>'); break;
        case 'p':    out.push('<p>' + esc(b.x) + '</p>'); break;
        case 'quote':out.push('<blockquote>' + esc(b.x) + '</blockquote>'); break;
        case 'ul':   out.push('<ul>' + (b.items || []).map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>'); break;
        case 'ol':   out.push('<ol>' + (b.items || []).map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ol>'); break;
        case 'advice':
          out.push('<h3>カウンセラーから</h3><blockquote>' + esc(b.x) + '</blockquote>'); break;
        default: if (b.x) out.push('<p>' + esc(b.x) + '</p>');
      }
    });
    return out.join('\n');
  }
  var _hcount = 0;
  function slugifyHeading(text) { _hcount++; return 'h-' + _hcount; }
  function tableOfContents(blocks) {
    _hcount = 0;
    var items = [];
    (blocks || []).forEach(function (b) {
      if (b.t === 'h2') { _hcount++; items.push({ id: 'h-' + _hcount, label: b.x }); }
    });
    _hcount = 0;
    if (!items.length) return '';
    return '<nav class="toc" aria-label="目次"><h4>Contents</h4><ul>' +
      items.map(function (i) { return '<li><a href="#' + i.id + '">' + esc(i.label) + '</a></li>'; }).join('') +
      '</ul></nav>';
  }

  /* ---------- レイアウト ---------- */
  function layout(o) {
    var L = links(o.rel);
    var jsonld = o.jsonld ? '<script type="application/ld+json">' + JSON.stringify(o.jsonld) + '</script>\n' : '';
    return '' +
'<!DOCTYPE html>\n<html lang="ja">\n<head>\n' +
'<meta charset="UTF-8">\n' +
'<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
'<title>' + esc(o.title) + '</title>\n' +
'<meta name="description" content="' + esc(o.desc) + '">\n' +
'<meta property="og:title" content="' + esc(o.title) + '">\n' +
'<meta property="og:description" content="' + esc(o.desc) + '">\n' +
'<meta property="og:type" content="' + (o.ogType || 'website') + '">\n' +
'<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
'<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Shippori+Mincho:wght@500;600;700&family=EB+Garamond:wght@500&display=swap" rel="stylesheet">\n' +
'<link rel="stylesheet" href="' + L.css + '">\n' +
jsonld +
'</head>\n<body>\n\n' +
header(o.rel, o.currentNav) +
'\n<main>\n' + o.main + '\n</main>\n\n' +
footer(o.rel) +
'\n' + ctaFixed(o.rel) +
'\n<script src="' + L.js + '"></script>\n</body>\n</html>\n';
  }

  /* ---------- カード ---------- */
  function caseCard(data, rel, c) {
    var L = links(rel);
    var href = rel + 'case/' + c.slug + '/index.html';
    var tags = [
      label(data, 'genders', c.gender),
      label(data, 'regions', c.region),
      label(data, 'situations', c.situation)
    ];
    return '' +
'<a class="entry-card fade-in" href="' + href + '">\n' +
'  <div class="entry-thumb"><div class="entry-thumb-label">CASE</div></div>\n' +
'  <div class="entry-body">\n' +
'    <div class="tag-row">' + tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') + '</div>\n' +
'    <h3 class="entry-title">' + esc(c.title) + '</h3>\n' +
'    <p class="entry-excerpt">' + esc(c.excerpt) + '</p>\n' +
'    <span class="entry-more">事例を読む <span class="arrow">→</span></span>\n' +
'  </div>\n' +
'</a>\n';
  }
  function columnCard(data, rel, col) {
    var href = rel + 'column/' + col.slug + '/index.html';
    return '' +
'<a class="entry-card fade-in" href="' + href + '">\n' +
'  <div class="entry-thumb"><div class="entry-thumb-label">COLUMN</div></div>\n' +
'  <div class="entry-body">\n' +
'    <div class="tag-row"><span class="tag cat">' + esc(col.category) + '</span></div>\n' +
'    <h3 class="entry-title">' + esc(col.title) + '</h3>\n' +
'    <p class="entry-excerpt">' + esc(col.excerpt) + '</p>\n' +
'    <span class="entry-more">続きを読む <span class="arrow">→</span></span>\n' +
'  </div>\n' +
'</a>\n';
  }

  /* ---------- ページビルダー ---------- */
  function pageHero(o) {
    return '' +
'  <section class="page-hero">\n' +
'    <div class="container">\n' +
      o.breadcrumb + '\n' +
'      <p class="kicker">' + esc(o.kicker) + '</p>\n' +
'      <h1 class="page-title">' + esc(o.title) + '</h1>\n' +
      (o.lead ? '      <p class="page-hero-lead">' + esc(o.lead) + '</p>\n' : '') +
      (o.after || '') +
'    </div>\n' +
'  </section>\n';
  }

  function caseIndexPage(data) {
    var rel = '../';
    var cards = data.cases.map(function (c) { return caseCard(data, rel, c); }).join('\n');
    var main =
      pageHero({
        breadcrumb: breadcrumb(rel, [{ label: '復縁事例' }]),
        kicker: 'Case Studies', title: '復縁のご相談事例',
        lead: '性別・地域・状況・お相手のタイプ別に、実際のご相談の流れを紹介しています。ご自身に近いケースから、進め方の参考にご覧ください。'
      }) +
'  <section>\n    <div class="container">\n      <div class="card-grid">\n' + cards + '\n      </div>\n' +
      inlineCta(rel, 'あなたの状況も、まず整理してみませんか') +
'    </div>\n  </section>\n';
    return {
      path: 'case/index.html',
      html: layout({
        rel: rel, currentNav: 'case',
        title: '復縁のご相談事例｜性別・地域・状況別｜復縁屋さん',
        desc: '復縁屋さんに寄せられたご相談事例を、性別・地域・状況・お相手のタイプ別に紹介。実際の進め方の参考にご覧いただけます。',
        main: main,
        jsonld: breadcrumbLd(data, [{ name: '復縁事例', url: '' }])
      })
    };
  }

  function casePage(data, c) {
    var rel = '../../';
    var facts = [
      ['ご相談者', label(data, 'genders', c.gender) + '・' + c.age],
      ['地域', label(data, 'regions', c.region)],
      ['ご相談内容', label(data, 'situations', c.situation)],
      ['お相手のタイプ', label(data, 'partnerTypes', c.partnerType)]
    ];
    var factHtml = '<dl class="case-facts">' + facts.map(function (f) {
      return '<div class="case-fact"><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>';
    }).join('') + '</dl>';

    // 関連事例（同じ状況 or 同じ相手タイプ、最大3件）
    var related = data.cases.filter(function (o) {
      return o.slug !== c.slug && (o.situation === c.situation || o.partnerType === c.partnerType);
    }).slice(0, 3);
    var relatedHtml = related.length ? relatedSection(data, rel, '関連する事例', related.map(function (o) { return caseCard(data, rel, o); })) : '';

    var main =
      pageHero({
        breadcrumb: breadcrumb(rel, [{ label: '復縁事例', href: rel + 'case/index.html' }, { label: label(data, 'situations', c.situation) }]),
        kicker: 'Case Study', title: c.title,
        after: '      <div class="taxo-nav" style="margin-top:22px;">' +
          taxoLink(rel, 'gender', c.gender, label(data, 'genders', c.gender)) +
          taxoLink(rel, 'region', c.region, label(data, 'regions', c.region)) +
          taxoLink(rel, 'situation', c.situation, label(data, 'situations', c.situation)) +
          taxoLink(rel, 'partner', c.partnerType, label(data, 'partnerTypes', c.partnerType)) +
          '</div>\n'
      }) +
'  <section>\n    <div class="container" style="max-width:860px;">\n' +
      factHtml + '\n' +
'      <p class="disclaimer" style="margin:10px 0 34px;">ご相談期間の目安：' + esc(c.duration) + '</p>\n' +
'      <div class="article">\n' + renderBlocks(c.body) + '\n</div>\n' +
'      <p class="voice-disclaimer" style="margin-top:28px;">※本事例はご相談内容をもとに、個人が特定されないよう内容を一部変更して構成しています。効果や結果を保証するものではありません。</p>\n' +
      inlineCta(rel, '同じような状況で悩んでいませんか') +
'    </div>\n  </section>\n' + relatedHtml;

    return {
      path: 'case/' + c.slug + '/index.html',
      html: layout({
        rel: rel, currentNav: 'case', ogType: 'article',
        title: c.title + '｜復縁事例｜復縁屋さん',
        desc: c.excerpt,
        main: main,
        jsonld: articleLd(data, c.title, c.excerpt, '')
      })
    };
  }

  function columnIndexPage(data) {
    var rel = '../';
    var cards = data.columns.map(function (col) { return columnCard(data, rel, col); }).join('\n');
    // カテゴリチップ
    var cats = data.taxonomies.columnCategories || [];
    var chips = '<div class="taxo-nav" style="margin-top:22px;">' +
      cats.map(function (c) { return '<span class="taxo-chip">' + esc(c) + '</span>'; }).join('') + '</div>';
    var main =
      pageHero({
        breadcrumb: breadcrumb(rel, [{ label: 'コラム' }]),
        kicker: 'Column', title: '復縁・恋愛心理コラム',
        lead: '復縁や関係の立て直しについて、心理学の知見をふまえた読み物をお届けします。',
        after: chips
      }) +
'  <section>\n    <div class="container">\n      <div class="card-grid">\n' + cards + '\n      </div>\n' +
      inlineCta(rel) +
'    </div>\n  </section>\n';
    return {
      path: 'column/index.html',
      html: layout({
        rel: rel, currentNav: 'column',
        title: '復縁・恋愛心理コラム｜復縁屋さん',
        desc: '復縁や関係の立て直しに役立つ、心理学にもとづいたコラムを掲載。別れの原因、連絡の取り方、自己成長などをテーマに解説します。',
        main: main,
        jsonld: breadcrumbLd(data, [{ name: 'コラム', url: '' }])
      })
    };
  }

  function columnPage(data, col) {
    var rel = '../../';
    var toc = tableOfContents(col.body);
    var related = data.columns.filter(function (o) { return o.slug !== col.slug && o.category === col.category; }).slice(0, 3);
    if (related.length < 3) {
      data.columns.forEach(function (o) {
        if (related.length < 3 && o.slug !== col.slug && related.indexOf(o) === -1) related.push(o);
      });
    }
    var relatedHtml = related.length ? relatedSection(data, rel, 'あわせて読みたい', related.slice(0, 3).map(function (o) { return columnCard(data, rel, o); })) : '';

    var main =
      pageHero({
        breadcrumb: breadcrumb(rel, [{ label: 'コラム', href: rel + 'column/index.html' }, { label: col.category }]),
        kicker: col.category, title: col.title,
        after: '      <p class="disclaimer" style="margin-top:16px;">公開日：' + esc(col.date) + '</p>\n'
      }) +
'  <section>\n    <div class="container">\n      <div class="article-layout">\n' +
'        <div class="article">\n' + renderBlocks(col.body) + '\n' +
          inlineCta(rel) +
'        </div>\n' +
        (toc ? '        ' + toc + '\n' : '') +
'      </div>\n    </div>\n  </section>\n' + relatedHtml;

    return {
      path: 'column/' + col.slug + '/index.html',
      html: layout({
        rel: rel, currentNav: 'column', ogType: 'article',
        title: col.title + '｜コラム｜復縁屋さん',
        desc: col.excerpt,
        main: main,
        jsonld: articleLd(data, col.title, col.excerpt, col.date)
      })
    };
  }

  function taxoLink(rel, kind, slug, text) {
    var dir = KINDS[kind].dir;
    return '<a class="taxo-chip" href="' + rel + dir + '/' + slug + '/index.html">' + esc(text) + '</a>';
  }

  function relatedSection(data, rel, heading, cardHtmlArr) {
    return '' +
'  <section style="background:#EFEBE3;">\n    <div class="container">\n' +
'      <div class="related-head"><h2>' + esc(heading) + '</h2></div>\n' +
'      <div class="card-grid">\n' + cardHtmlArr.join('\n') + '\n      </div>\n' +
'    </div>\n  </section>\n';
  }

  function taxonomyIndexPage(data, kind) {
    var K = KINDS[kind];
    var rel = '../';
    var terms = data.taxonomies[K.tkey] || [];
    var cards = terms.map(function (t) {
      var count = data.cases.filter(function (c) { return c[K.field] === t.slug; }).length;
      var href = rel + K.dir + '/' + t.slug + '/index.html';
      return '' +
'<a class="entry-card fade-in" href="' + href + '">\n' +
'  <div class="entry-body">\n' +
'    <div class="tag-row"><span class="tag">' + esc(K.nav) + '</span></div>\n' +
'    <h3 class="entry-title">' + esc(t.label) + '</h3>\n' +
'    <p class="entry-excerpt">' + esc((t.intro || '').slice(0, 70)) + '…</p>\n' +
'    <span class="entry-more">' + esc(t.short || t.label) + 'の相談を見る <span class="arrow">→</span></span>\n' +
'  </div>\n' +
'</a>\n';
    }).join('\n');
    var main =
      pageHero({
        breadcrumb: breadcrumb(rel, [{ label: K.indexTitle }]),
        kicker: K.nav, title: K.indexTitle,
        lead: 'ご自身やお相手の状況に近いページから、ご相談の進め方や事例をご覧いただけます。'
      }) +
'  <section>\n    <div class="container">\n      <div class="card-grid">\n' + cards + '\n      </div>\n' +
      inlineCta(rel) +
'    </div>\n  </section>\n';
    return {
      path: K.dir + '/index.html',
      html: layout({
        rel: rel, currentNav: kind,
        title: K.indexTitle + '｜復縁屋さん',
        desc: K.indexTitle + 'のご案内。' + data.site.descr + '。無料相談・秘密厳守・全国対応。',
        main: main,
        jsonld: breadcrumbLd(data, [{ name: K.indexTitle, url: '' }])
      })
    };
  }

  function taxonomyTermPage(data, kind, term) {
    var K = KINDS[kind];
    var rel = '../../';
    var matched = data.cases.filter(function (c) { return c[K.field] === term.slug; });
    var cards = matched.length
      ? matched.map(function (c) { return caseCard(data, rel, c); }).join('\n')
      : '<p class="disclaimer">このカテゴリの事例は準備中です。ご相談内容に近いケースは、無料相談の際に直接ご紹介します。</p>';

    // 他のタームへの回遊
    var others = (data.taxonomies[K.tkey] || []).map(function (t) {
      var cur = t.slug === term.slug ? ' is-current' : '';
      return '<a class="taxo-chip' + cur + '" href="' + rel + K.dir + '/' + t.slug + '/index.html">' + esc(t.short || t.label) + '</a>';
    }).join('');

    var main =
      pageHero({
        breadcrumb: breadcrumb(rel, [{ label: K.indexTitle, href: rel + K.dir + '/index.html' }, { label: term.short || term.label }]),
        kicker: K.nav, title: term.label + K.suffix,
        lead: term.intro,
        after: '      <div class="taxo-nav">' + others + '</div>\n'
      }) +
'  <section>\n    <div class="container">\n' +
'      <div class="related-head"><h2>' + esc(term.short || term.label) + 'に関する事例</h2>' +
        (matched.length ? '<a class="view-all" href="' + rel + 'case/index.html">すべての事例を見る →</a>' : '') +
'</div>\n' +
'      <div class="card-grid">\n' + cards + '\n      </div>\n' +
      inlineCta(rel, term.label + 'のお悩みも、まずはご相談ください') +
'    </div>\n  </section>\n';
    return {
      path: K.dir + '/' + term.slug + '/index.html',
      html: layout({
        rel: rel, currentNav: kind,
        title: term.label + K.suffix + '｜復縁屋さん',
        desc: (term.intro || '').slice(0, 110),
        main: main,
        jsonld: breadcrumbLd(data, [
          { name: K.indexTitle, url: K.dir + '/' },
          { name: term.label, url: '' }
        ])
      })
    };
  }

  /* ---------- 構造化データ ---------- */
  function articleLd(data, title, desc, date) {
    var o = {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: title, description: desc,
      author: { '@type': 'Organization', name: data.site.name },
      publisher: { '@type': 'Organization', name: '株式会社Azucar' }
    };
    if (date) { o.datePublished = date; o.dateModified = date; }
    return o;
  }
  function breadcrumbLd(data, items) {
    return {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [{ '@type': 'ListItem', position: 1, name: 'ホーム' }].concat(
        items.map(function (it, i) { return { '@type': 'ListItem', position: i + 2, name: it.name }; })
      )
    };
  }

  /* ---------- 全ページ生成 ---------- */
  function buildAll(data) {
    var pages = [];
    pages.push(caseIndexPage(data));
    data.cases.forEach(function (c) { pages.push(casePage(data, c)); });
    pages.push(columnIndexPage(data));
    data.columns.forEach(function (col) { pages.push(columnPage(data, col)); });
    Object.keys(KINDS).forEach(function (kind) {
      pages.push(taxonomyIndexPage(data, kind));
      (data.taxonomies[KINDS[kind].tkey] || []).forEach(function (term) {
        pages.push(taxonomyTermPage(data, kind, term));
      });
    });
    return pages;
  }

  var api = {
    esc: esc, buildAll: buildAll, KINDS: KINDS,
    caseIndexPage: caseIndexPage, casePage: casePage,
    columnIndexPage: columnIndexPage, columnPage: columnPage,
    taxonomyIndexPage: taxonomyIndexPage, taxonomyTermPage: taxonomyTermPage
  };

  global.FukuenRender = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;

})(typeof globalThis !== 'undefined' ? globalThis : this);
