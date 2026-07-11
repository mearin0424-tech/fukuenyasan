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
      contact:   rel + '../fukuenyasan-lp/shared/contact.html',
      diagnosis: rel + '../fukuenyasan-lp/shared/diagnosis.html',
      caseIndex: rel + 'case/index.html',
      colIndex:  rel + 'column/index.html',
      regionIndex:    rel + 'region/index.html',
      situationIndex: rel + 'situation/index.html',
      genderIndex:    rel + 'gender/index.html',
      partnerIndex:   rel + 'partner/index.html',
      about:     rel + 'about/index.html',
      company:   rel + 'company/index.html',
      service:   rel + 'service/index.html',
      price:     rel + 'price/index.html',
      flow:      rel + 'flow/index.html',
      faq:       rel + 'faq/index.html',
      voice:     rel + 'voice/index.html',
      recruit:   rel + 'recruit/index.html',
      privacy:   rel + 'privacy/index.html',
      tokushoho: rel + 'tokushoho/index.html',
      contactPage: rel + 'contact/index.html',
      sitemap:   rel + 'sitemap/index.html',
      admin:     rel + 'admin/index.html',
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
'<div class="pre-header" role="complementary" aria-label="運営情報">\n' +
'  <div class="container pre-header-inner">\n' +
'    <p class="pre-header-note">探偵業届出 第30210334号（株式会社Azucar）｜ご相談受付 24時間・秘密厳守・全国対応</p>\n' +
'    <ul class="pre-header-links">\n' +
'      <li><a href="' + L.voice + '">ご相談者の声</a></li>\n' +
'      <li><a href="' + L.faq + '">よくあるご質問</a></li>\n' +
'      <li><a href="' + L.admin + '" class="pre-header-admin" rel="nofollow">管理画面ログイン</a></li>\n' +
'    </ul>\n' +
'  </div>\n' +
'</div>\n' +
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
        item(L.situationIndex, '場面別', 'situation') +
        item(L.regionIndex, '地域別', 'region') +
        item(L.price, '料金', 'price') +
        item(L.colIndex, 'コラム', 'column') +
'        <li class="gnav-cta">\n' +
'          <a href="' + L.diagnosis + '">12問の無料復縁診断を試す →</a>\n' +
'          <a href="' + L.contact + '">無料相談フォームへ →</a>\n' +
'        </li>\n' +
'      </ul>\n' +
'    </nav>\n' +
'    <div class="header-cta">\n' +
'      <div class="header-tel">\n' +
'        <a href="' + L.tel + '" class="header-tel-num">03-5356-8550</a>\n' +
'        <span class="header-tel-note">受付 24時間 / 秘密厳守</span>\n' +
'      </div>\n' +
'      <a href="' + L.diagnosis + '" class="btn-header btn-header--ghost">無料診断</a>\n' +
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
'        <h3>ABOUT</h3>\n' +
'        <ul>\n' +
'          <li><a href="' + L.about + '">私たちについて</a></li>\n' +
'          <li><a href="' + L.company + '">会社概要</a></li>\n' +
'          <li><a href="' + L.service + '">サービス</a></li>\n' +
'          <li><a href="' + L.price + '">料金案内</a></li>\n' +
'          <li><a href="' + L.flow + '">ご相談の流れ</a></li>\n' +
'          <li><a href="' + L.recruit + '">採用情報</a></li>\n' +
'        </ul>\n' +
'      </div>\n' +
'      <div class="footer-col">\n' +
'        <h3>SUPPORT</h3>\n' +
'        <ul>\n' +
'          <li><a href="' + L.contact + '">無料相談フォーム</a></li>\n' +
'          <li><a href="' + L.diagnosis + '">12問の復縁診断</a></li>\n' +
'          <li><a href="' + L.tel + '">03-5356-8550（24時間）</a></li>\n' +
'          <li><a href="' + L.voice + '">ご相談者の声</a></li>\n' +
'          <li><a href="' + L.faq + '">よくあるご質問</a></li>\n' +
'          <li><a href="' + L.sitemap + '">サイトマップ</a></li>\n' +
'        </ul>\n' +
'      </div>\n' +
'    </div>\n' +
'    <div class="footer-bottom">\n' +
'      <p>当社は探偵業法に基づき適正に運営しております。法令・公序良俗に反するご依頼はお受けできません。</p>\n' +
'      <p><a href="' + L.privacy + '">プライバシーポリシー</a>　<a href="' + L.tokushoho + '">特定商取引法に基づく表示</a>　<a href="' + L.admin + '" class="footer-admin" rel="nofollow"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg> 管理画面ログイン</a></p>\n' +
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

  /* ---------- 固定ページ（会社案内・サービス・規約 等） ---------- */
  function contentPage(o) {
    var rel = '../';
    var main =
      pageHero({
        breadcrumb: breadcrumb(rel, o.trail || []),
        kicker: o.kicker, title: o.pageTitle, lead: o.lead || ''
      }) +
      '  <section>\n    <div class="container"' + (o.narrow ? ' style="max-width:880px;"' : '') + '>\n' +
      o.body + '\n' +
      (o.cta === false ? '' : inlineCta(rel, o.ctaHeading)) +
      '    </div>\n  </section>\n';
    return {
      path: o.path,
      html: layout({ rel: rel, currentNav: o.currentNav || '', title: o.title, desc: o.desc, ogType: o.ogType || 'website', main: main })
    };
  }

  var SERVICES = [
    { slug: 'counseling', name: '復縁相談・カウンセリング', en: 'Counseling',
      lead: '別れの直後の混乱や不安を、まず落ち着いて受け止めるための時間です。初回のご相談は無料で承ります。',
      target: '気持ちの整理がつかない方／何から始めればよいか分からない方／まず話を聞いてほしい方',
      body: '傾聴を軸に、いま抱えているお気持ちと、別れに至った状況を丁寧に伺います。無理に前へ進めることはせず、ご本人のペースを最優先に、心の整理からお手伝いします。オンライン（Zoom・LINE通話等）でのご相談にも無料で対応しています。' },
    { slug: 'reconciliation', name: '復縁サポートプラン', en: 'Support Program',
      lead: '状況分析から行動計画づくり、日々のご相談まで。復縁を目指す道のりに、専任カウンセラーが継続的に伴走します。',
      target: '具体的に復縁を目指したい方／一人で進めることに不安がある方／計画的に取り組みたい方',
      body: '心理学・行動科学の知見と、6,000件以上のご相談データをもとに、お一人おひとりの状況に合わせた進め方をご提案します。月々6,300円〜の自社分割にも対応しており、費用はご契約前にすべて提示します。見込みが極めて低いと判断した場合は、正直にお伝えします。' },
    { slug: 'consulting', name: '恋愛・関係修復コンサルティング', en: 'Consulting',
      lead: '連絡の再開、会う約束、関係の深め方。場面ごとの迷いに対して、根拠のある選択肢を一緒に整理します。',
      target: '次の一手に迷っている方／連絡の取り方を相談したい方／関係を前に進めたい方',
      body: '「いま連絡すべきか」「どんな言葉を選ぶか」といった具体的な場面ごとに、相手のタイプや状況をふまえた選択肢を一緒に検討します。思いつきの行動ではなく、無理のない積み重ねを設計していきます。' },
    { slug: 'investigation', name: '事前の状況確認', en: 'Situation Check',
      lead: '判断材料を客観的に整理するためのサポートです。違法な調査や、相手の生活を脅かす行為は一切行いません。',
      target: '現状を客観的に把握したい方／進めるべきか迷っている方',
      body: 'ご相談を進めるうえで必要な範囲で、これまでの経緯や現在の関係性を客観的に整理します。探偵業法をはじめとする関連法令を遵守し、公序良俗に反するご依頼はお受けしません。ご不安な点は、無料相談の際に遠慮なくお尋ねください。' }
  ];

  function staticPages(data) {
    var rel = '../';
    var L = links(rel);
    var pages = [];

    // 私たちについて
    pages.push(contentPage({
      path: 'about/index.html', currentNav: '', title: '私たちについて｜復縁屋さん',
      desc: '復縁屋さんが大切にしている姿勢——誠実な見立て、科学的なアプローチ、明朗会計、秘密厳守についてご説明します。',
      trail: [{ label: '私たちについて' }], kicker: 'About Us', pageTitle: '私たちについて',
      lead: '「もう一度」を願う気持ちに、誠実に向き合うために。復縁屋さんが大切にしていることをお伝えします。',
      body:
        '<div class="article">' +
        '<h2>私たちの姿勢</h2>' +
        '<p>復縁は、勢いや気持ちの強さだけで進むものではありません。私たちは、心理学・行動科学の知見と、6,000件以上のご相談データをもとに、お一人おひとりの状況を構造的に整理し、次の一歩を一緒に考えます。根拠のない断定や、期待だけを持たせるご案内はいたしません。</p>' +
        '<h3>誠実な見立て</h3><p>無料相談の段階で状況を丁寧に伺い、見込みが極めて低いと判断した場合は、その旨を正直にお伝えします。</p>' +
        '<h3>科学的なアプローチ</h3><p>感情論ではなく、関係心理学や行動科学の視点から、別れの背景と関係性を読み解きます。</p>' +
        '<h3>明朗会計</h3><p>費用はご契約前にすべて提示し、ご説明のない追加請求はいたしません。月々6,300円〜の分割にも対応しています。</p>' +
        '<h3>秘密厳守</h3><p>探偵業法に基づき適正に運営し、ご相談内容の秘密保持を徹底します。初回のご相談は匿名でも承ります。</p>' +
        '<h2>運営者より</h2>' +
        '<blockquote>大切な人との別れは、これまでの自分を見つめ直すきっかけにもなります。私たちは、復縁という結果だけでなく、その過程でのあなた自身の歩みにも寄り添いたいと考えています。ひとりで抱え込まず、まずはお話を聞かせてください。</blockquote>' +
        '</div>'
    }));

    // 会社概要
    pages.push(contentPage({
      path: 'company/index.html', currentNav: '', title: '会社概要｜復縁屋さん', narrow: true,
      desc: '復縁屋さんを運営する株式会社Azucarの会社概要（所在地・法人番号・探偵業届出番号など）。',
      trail: [{ label: '会社概要' }], kicker: 'Company', pageTitle: '会社概要',
      body:
        '<div class="company-table"><dl>' +
        '<dt>サービス名</dt><dd>復縁屋さん</dd>' +
        '<dt>商号</dt><dd>株式会社Azucar</dd>' +
        '<dt>法人番号</dt><dd>7011601025568</dd>' +
        '<dt>所在地</dt><dd>〒176-0025 東京都練馬区中村南2丁目21番15号</dd>' +
        '<dt>連絡先</dt><dd>03-5356-8550（ご相談）／ 0120-972-119</dd>' +
        '<dt>資本金</dt><dd>5,000,000円</dd>' +
        '<dt>探偵業届出</dt><dd>第30210334号</dd>' +
        '<dt>事業内容</dt><dd>復縁・関係修復サポート、恋愛カウンセリング、恋愛コンサルティング</dd>' +
        '</dl></div>'
    }));

    // サービス一覧
    pages.push(contentPage({
      path: 'service/index.html', currentNav: 'service', title: 'サービス一覧｜復縁屋さん',
      desc: '復縁屋さんのサービス一覧。復縁相談・カウンセリング、復縁サポートプラン、恋愛コンサルティング、事前の状況確認。入口はすべて無料相談から。',
      trail: [{ label: 'サービス' }], kicker: 'Our Services', pageTitle: 'サービス一覧',
      lead: '状況やご希望に合わせて、必要なサポートだけをお選びいただけます。どのサービスも入口は無料相談からです。',
      body: '<div class="card-grid cols-2">' + SERVICES.map(function (s) {
        return '<a class="entry-card fade-in" href="' + rel + 'service/' + s.slug + '.html">' +
          '<div class="entry-body"><div class="tag-row"><span class="tag cat">' + esc(s.en) + '</span></div>' +
          '<h3 class="entry-title">' + esc(s.name) + '</h3><p class="entry-excerpt">' + esc(s.lead) + '</p>' +
          '<span class="entry-more">詳しく見る <span class="arrow">→</span></span></div></a>';
      }).join('') + '</div>'
    }));

    // サービス詳細
    SERVICES.forEach(function (s) {
      pages.push(contentPage({
        path: 'service/' + s.slug + '.html', currentNav: 'service',
        title: s.name + '｜サービス｜復縁屋さん', desc: s.lead,
        trail: [{ label: 'サービス', href: rel + 'service/index.html' }, { label: s.name }],
        kicker: s.en, pageTitle: s.name, lead: s.lead,
        body:
          '<div class="article">' +
          '<h2>このサービスについて</h2><p>' + esc(s.body) + '</p>' +
          '<h2>こんな方に</h2><p>' + esc(s.target) + '</p>' +
          '<h2>費用について</h2><p>費用はご状況・サポート内容・期間により異なります。ご契約前に総額と内訳を書面でご提示し、ご説明のない追加請求はいたしません。分割払いの場合、月々6,300円〜に対応しています。</p>' +
          '</div>'
      }));
    });

    // 料金案内
    pages.push(contentPage({
      path: 'price/index.html', currentNav: '', title: '料金案内｜復縁屋さん',
      desc: '復縁屋さんの料金体系。無料相談・月々6,300円〜の分割対応・個別お見積り。費用はご契約前にすべて提示します。',
      trail: [{ label: '料金案内' }], kicker: 'Pricing', pageTitle: '料金案内',
      lead: '費用はご契約前にすべてご提示します。ご説明のない追加請求はいたしません。',
      body:
        '<div class="price-grid">' +
        '<div class="price-card"><h3 class="price-name">無料相談</h3><p class="price-en">Consultation</p><div class="price-value"><span class="num">0<span class="unit">円</span></span></div><ul class="price-desc"><li>お電話・オンラインで対応</li><li>状況の整理と見立てをお伝え</li><li>匿名でのご相談も可能</li></ul><a href="' + L.contact + '" class="btn btn-outline">無料相談を申し込む</a></div>' +
        '<div class="price-card price-card--feature"><span class="price-tag">基本プラン</span><h3 class="price-name">復縁サポート</h3><p class="price-en">Support Program</p><div class="price-value"><span class="prefix">分割払いの場合</span><span class="num">月々6,300<span class="unit">円〜</span></span></div><ul class="price-desc"><li>状況分析と行動計画のご提案</li><li>専任カウンセラーが継続伴走</li><li>総額・内訳はご契約前に提示</li></ul><a href="' + L.contact + '" class="btn btn-primary">まず無料相談から</a></div>' +
        '<div class="price-card"><h3 class="price-name">個別プラン</h3><p class="price-en">Custom</p><div class="price-value"><span class="prefix">状況に応じて</span><span class="num" style="font-size:26px;">個別お見積り</span></div><ul class="price-desc"><li>複雑なご事情・長期のご支援向け</li><li>内容・期間・費用を明示して設計</li></ul><a href="' + L.contact + '" class="btn btn-outline">相談して見積もる</a></div>' +
        '</div>' +
        '<p class="price-note">※料金はご状況・サポート内容・期間により異なります。分割払いの場合、頭金として一部料金をお支払いいただく場合があります。詳細は無料相談の際に必ず書面でご確認いただけます。</p>'
    }));

    // ご相談の流れ
    pages.push(contentPage({
      path: 'flow/index.html', currentNav: '', title: 'ご相談の流れ｜復縁屋さん',
      desc: '無料相談から状況の整理・分析、ご提案・お見積り、サポート開始までの4ステップをご説明します。',
      trail: [{ label: 'ご相談の流れ' }], kicker: 'Process', pageTitle: 'ご相談の流れ',
      lead: 'ご相談から、実際のサポート開始までの流れです。その場でのご契約は不要です。',
      body:
        '<div class="flow-grid">' +
        '<div class="flow-card fade-in"><p class="flow-step">Step<strong>01</strong></p><h3 class="flow-title">無料相談</h3><p class="flow-text">フォームまたはお電話でご連絡ください。匿名でも構いません。まずはお話をゆっくり伺います。</p></div>' +
        '<div class="flow-card fade-in"><p class="flow-step">Step<strong>02</strong></p><h3 class="flow-title">状況の整理・分析</h3><p class="flow-text">別れの経緯や現在の関係性を、心理学の知見と過去の実例データに照らして整理します。</p></div>' +
        '<div class="flow-card fade-in"><p class="flow-step">Step<strong>03</strong></p><h3 class="flow-title">ご提案・お見積り</h3><p class="flow-text">進め方の選択肢と費用の総額・内訳をご提示します。その場でのご契約は不要です。</p></div>' +
        '<div class="flow-card fade-in"><p class="flow-step">Step<strong>04</strong></p><h3 class="flow-title">サポート開始</h3><p class="flow-text">ご納得いただけた場合のみ開始。専任カウンセラーが計画に沿って継続的に伴走します。</p></div>' +
        '</div>'
    }));

    // よくあるご質問
    var faqs = [
      ['相談だけでも大丈夫でしょうか？', 'もちろんです。ご相談だけでお悩みが整理され、解決に向かうケースもございます。無理な勧誘は一切いたしませんので、お気軽にご連絡ください。'],
      ['必ず復縁できますか？', '結果をお約束することはできません。ご状況により見通しは大きく異なります。そのため無料相談の段階で丁寧に状況を伺い、見込みが極めて低い場合は正直にその旨をお伝えしています。'],
      ['全国どこでも対応してもらえますか？', 'はい、全国対応です。各地域の事情に通じたスタッフがおりますので、地方にお住まいの方や、お相手が遠方にいらっしゃる場合もご相談ください。'],
      ['オンラインでの相談も可能ですか？', 'はい、ZoomやLINE通話などを利用したオンライン相談を無料で承っております。「まずは気軽に話を聞いてほしい」という段階でもご利用いただけます。'],
      ['サポートの期間はどのくらいかかりますか？', 'ご状況によりますが、平均的には2〜4ヶ月程度の期間をいただくケースが多くなっています。お相手との関係性に合わせ、無理のないペースで進めます。'],
      ['匿名で相談することはできますか？', 'はい、初回の無料相談はニックネームなど匿名で構いません。ご契約時にはご本人確認が必要となりますが、秘密保持は徹底しております。'],
      ['費用はどのくらいかかりますか？', 'ご状況・サポート内容・期間により異なります。ご契約前に総額と内訳を書面でご提示します。分割払いの場合、月々6,300円〜に対応しています。'],
      ['違法な調査などをお願いされることはありませんか？', '当社は探偵業法に基づき適正に運営しており、法令や公序良俗に反する行為は一切お受けしておりません。安心してご相談ください。']
    ];
    pages.push(contentPage({
      path: 'faq/index.html', currentNav: '', title: 'よくあるご質問｜復縁屋さん', narrow: true,
      desc: '復縁屋さんへのよくあるご質問。相談だけの利用、対応地域、オンライン相談、費用、秘密保持などについてお答えします。',
      trail: [{ label: 'よくあるご質問' }], kicker: 'FAQ', pageTitle: 'よくあるご質問',
      body: '<div class="faq-list">' + faqs.map(function (q) {
        return '<details class="faq-item fade-in"><summary>' + esc(q[0]) + '</summary><p class="faq-a">' + esc(q[1]) + '</p></details>';
      }).join('') + '</div>'
    }));

    // ご相談者の声
    var voices = [
      ['感情的になっていた自分を、一度落ち着かせてもらえました。', '別れた直後で、すぐに連絡したい気持ちでいっぱいでした。相談の中で「いま動かない」という選択肢を初めて理由付きで説明してもらい、焦らず段階を踏めたことが良かったと感じています。', '30代女性・会社員（ご相談期間 約4ヶ月）'],
      ['何をすべきか・すべきでないかが明確で、迷いが減りました。', '毎回の相談で「次に何をするか」を一緒に決めてもらえたので、一人で抱え込んでいた頃より気持ちがずっと楽になりました。費用も最初に総額を提示してもらえたので、安心して続けられました。', '40代男性・自営業（ご相談期間 約3ヶ月）'],
      ['正直に「難しい」と言ってもらえたことが、逆に信頼につながりました。', '甘い言葉で契約を勧められるのかと身構えていましたが、状況を丁寧に見たうえで率直に話してくれました。結果的に、自分にとって納得のいく進め方を選べたと思います。', '30代女性・公務員（ご相談期間 約5ヶ月）'],
      ['遠方でしたが、オンラインで問題なく相談できました。', '近くに相談できる場所がなく不安でしたが、オンラインで毎回しっかり時間を取ってもらえました。距離を理由にあきらめなくてよかったです。', '20代女性・看護師（ご相談期間 約3ヶ月）']
    ];
    pages.push(contentPage({
      path: 'voice/index.html', currentNav: '', title: 'ご相談者の声｜復縁屋さん',
      desc: '復縁屋さんにご相談いただいた方の声を紹介します。※いずれも個人の感想であり、同様の結果を保証するものではありません。',
      trail: [{ label: 'ご相談者の声' }], kicker: 'Voices', pageTitle: 'ご相談者の声',
      lead: 'ご相談いただいた方からの声を紹介します。',
      body: '<div class="voice-grid">' + voices.map(function (v) {
        return '<div class="voice-card fade-in"><p class="voice-quote">' + esc(v[0]) + '</p><p class="voice-body">' + esc(v[1]) + '</p><p class="voice-meta">' + esc(v[2]) + '</p><p class="voice-disclaimer">※個人の感想です。同様の結果を保証するものではありません。</p></div>';
      }).join('') + '</div>'
    }));

    // 採用情報
    pages.push(contentPage({
      path: 'recruit/index.html', currentNav: '', title: '採用情報｜復縁屋さん',
      desc: '復縁屋さんの採用情報。ご相談者に誠実に向き合えるカウンセラー・スタッフを募集しています。',
      trail: [{ label: '採用情報' }], kicker: 'Recruit', pageTitle: '採用情報',
      lead: '「もう一度」を願う方に、誠実に向き合える仲間を募集しています。',
      body:
        '<div class="article">' +
        '<h2>求める人物像</h2>' +
        '<ul><li>相手の話に丁寧に耳を傾けられる方</li><li>安易な断定をせず、事実にもとづいて考えられる方</li><li>心理学や対人支援に関心のある方</li><li>誠実さと守秘を大切にできる方</li></ul>' +
        '<h2>募集職種</h2><p>恋愛カウンセラー／ご相談サポートスタッフ（正社員・業務委託）。未経験の方も、研修を通じて段階的に業務を習得いただけます。</p>' +
        '<h2>応募方法</h2><p>まずはお問い合わせフォームより「採用応募」とご記載のうえご連絡ください。担当より追ってご案内いたします。</p>' +
        '</div>'
    }));

    // お問い合わせ
    pages.push(contentPage({
      path: 'contact/index.html', currentNav: '', title: 'お問い合わせ・無料相談｜復縁屋さん',
      desc: 'ご相談は無料・秘密厳守。フォーム・お電話・オンラインで承ります。匿名でのご相談も可能です。',
      trail: [{ label: 'お問い合わせ' }], kicker: 'Contact', pageTitle: 'お問い合わせ・無料相談',
      lead: 'ご相談は無料・秘密厳守。匿名でも構いません。フォーム・お電話・オンラインで承っています。',
      cta: false,
      body:
        '<div class="article">' +
        '<h2>無料相談フォーム</h2>' +
        '<p>下記のフォームより、24時間いつでもお申し込みいただけます。お話を伺ったうえで、誠実な見立てをお伝えします。</p>' +
        '<p><a href="' + L.contact + '" class="btn btn-primary">無料相談フォームへ進む <span class="arrow">→</span></a></p>' +
        '<h2>お電話でのご相談</h2>' +
        '<p><a href="' + L.tel + '" style="font-family:var(--font-serif);font-size:28px;color:var(--rose);">03-5356-8550</a><br>受付 24時間。お電話に出られない場合は、カウンセラー選定のうえ折り返しいたします。</p>' +
        '<h2>まずは診断から、という方へ</h2>' +
        '<p>「いきなり相談はハードルが高い」という方は、12問・約3分の無料診断からお試しいただけます。</p>' +
        '<p><a href="' + L.diagnosis + '" class="btn btn-outline">無料の復縁診断を試す</a></p>' +
        '</div>'
    }));

    // プライバシーポリシー
    pages.push(contentPage({
      path: 'privacy/index.html', currentNav: '', title: 'プライバシーポリシー｜復縁屋さん', narrow: true, cta: false,
      desc: '復縁屋さん（株式会社Azucar）のプライバシーポリシー。個人情報の取り扱いについてご説明します。',
      trail: [{ label: 'プライバシーポリシー' }], kicker: 'Privacy Policy', pageTitle: 'プライバシーポリシー',
      body:
        '<div class="article">' +
        '<p>株式会社Azucar（以下「当社」）は、ご相談者の個人情報の重要性を認識し、以下の方針に基づき適切に取り扱います。</p>' +
        '<h2>1. 取得する情報</h2><p>お名前、ご連絡先、ご相談内容など、サービス提供に必要な範囲の情報を取得します。</p>' +
        '<h2>2. 利用目的</h2><ul><li>ご相談・サービス提供およびそのご連絡のため</li><li>ご本人確認のため</li><li>サービス品質の向上のため</li></ul>' +
        '<h2>3. 第三者提供</h2><p>法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。</p>' +
        '<h2>4. 安全管理</h2><p>取得した個人情報の漏えい・滅失・毀損の防止に努め、適切に管理します。</p>' +
        '<h2>5. 開示・訂正・削除</h2><p>ご本人からの求めに応じ、保有する個人情報の開示・訂正・削除に対応します。下記お問い合わせ窓口までご連絡ください。</p>' +
        '<h2>6. お問い合わせ窓口</h2><p>株式会社Azucar　〒176-0025 東京都練馬区中村南2丁目21番15号　TEL: 0120-972-119</p>' +
        '</div>'
    }));

    // 特定商取引法に基づく表示
    pages.push(contentPage({
      path: 'tokushoho/index.html', currentNav: '', title: '特定商取引法に基づく表示｜復縁屋さん', narrow: true, cta: false,
      desc: '復縁屋さん（株式会社Azucar）の特定商取引法に基づく表示。',
      trail: [{ label: '特定商取引法に基づく表示' }], kicker: 'Legal', pageTitle: '特定商取引法に基づく表示',
      body:
        '<div class="company-table"><dl>' +
        '<dt>販売事業者</dt><dd>株式会社Azucar</dd>' +
        '<dt>所在地</dt><dd>〒176-0025 東京都練馬区中村南2丁目21番15号</dd>' +
        '<dt>連絡先</dt><dd>0120-972-119 / 03-5356-8550</dd>' +
        '<dt>販売価格</dt><dd>サービスごとに、ご契約前に書面でご提示します（分割の場合 月々6,300円〜）。</dd>' +
        '<dt>料金以外の費用</dt><dd>通信費等はお客様のご負担となります。</dd>' +
        '<dt>お支払い方法</dt><dd>指定のお支払い方法によります（自社分割対応）。</dd>' +
        '<dt>お支払い時期</dt><dd>ご契約時にご案内する時期によります。</dd>' +
        '<dt>役務の提供時期</dt><dd>ご契約後、双方で合意したスケジュールに基づき提供します。</dd>' +
        '<dt>キャンセル</dt><dd>契約内容に基づき対応します。詳細はご契約前にご説明します。</dd>' +
        '</dl></div>'
    }));

    // サイトマップ
    var smSection = function (title, items) {
      return '<div style="margin-bottom:34px;"><h2 class="related-head" style="border:0;font-family:var(--font-serif);font-size:18px;color:var(--ink);margin-bottom:14px;">' + esc(title) + '</h2><ul class="tag-row" style="flex-direction:column;gap:8px;align-items:flex-start;">' +
        items.map(function (it) { return '<li style="border:0;background:none;padding:0;font-size:14px;"><a href="' + it[1] + '">' + esc(it[0]) + '</a></li>'; }).join('') + '</ul></div>';
    };
    var caseLinks = data.cases.map(function (c) { return [c.title, rel + 'case/' + c.slug + '/index.html']; });
    var colLinks = data.columns.map(function (c) { return [c.title, rel + 'column/' + c.slug + '/index.html']; });
    var regionLinks = (data.taxonomies.regions || []).map(function (t) { return [t.label, rel + 'region/' + t.slug + '/index.html']; });
    var situationLinks = (data.taxonomies.situations || []).map(function (t) { return [t.label, rel + 'situation/' + t.slug + '/index.html']; });
    pages.push(contentPage({
      path: 'sitemap/index.html', currentNav: '', title: 'サイトマップ｜復縁屋さん', cta: false,
      desc: '復縁屋さんHPのサイトマップ。全ページの一覧です。',
      trail: [{ label: 'サイトマップ' }], kicker: 'Sitemap', pageTitle: 'サイトマップ',
      body: '<div class="sitemap-cols">' +
        smSection('メインコンテンツ', [['トップページ', L.home], ['サービス一覧', L.service], ['料金案内', L.price], ['ご相談の流れ', L.flow], ['ご相談者の声', L.voice], ['よくあるご質問', L.faq], ['無料の復縁診断', L.diagnosis]]) +
        smSection('会社案内', [['私たちについて', L.about], ['会社概要', L.company], ['採用情報', L.recruit], ['お問い合わせ', L.contactPage], ['プライバシーポリシー', L.privacy], ['特定商取引法に基づく表示', L.tokushoho]]) +
        smSection('復縁事例', caseLinks) +
        smSection('地域別の相談', regionLinks) +
        smSection('場面別の相談', situationLinks) +
        smSection('コラム', colLinks) +
        smSection('サイト管理', [['コンテンツ管理画面', L.admin]]) +
        '</div>'
    }));

    return pages;
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
    staticPages(data).forEach(function (p) { pages.push(p); });
    return pages;
  }

  var api = {
    esc: esc, buildAll: buildAll, KINDS: KINDS, layout: layout,
    caseIndexPage: caseIndexPage, casePage: casePage,
    columnIndexPage: columnIndexPage, columnPage: columnPage,
    taxonomyIndexPage: taxonomyIndexPage, taxonomyTermPage: taxonomyTermPage,
    contentPage: contentPage, staticPages: staticPages
  };

  global.FukuenRender = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;

})(typeof globalThis !== 'undefined' ? globalThis : this);
