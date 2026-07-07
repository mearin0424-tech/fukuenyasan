#!/usr/bin/env node
/* =====================================================
   復縁屋さん HP — 静的ページ生成スクリプト
   使い方:  node tools/generate.cjs
   data/site-data.json を読み、事例・コラム・タクソノミの各HTMLを
   出力し、sitemap.xml も生成する。ビルド不要の静的サイト向け。
   ===================================================== */
const fs = require('fs');
const path = require('path');

// 本番の公開URL（サイトマップ用）。デプロイ先に合わせて変更してください。
const SITE_URL = 'https://fukuenyasan.jp/';

const ROOT = path.resolve(__dirname, '..');            // fukuenyasan-hp/
const DATA = path.join(ROOT, 'data', 'site-data.json');
const R = require(path.join(ROOT, 'assets', 'js', 'render.js'));

function main() {
  const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
  const pages = R.buildAll(data);

  let written = 0;
  pages.forEach((p) => {
    const outPath = path.join(ROOT, p.path);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, p.html, 'utf8');
    written++;
  });

  // sitemap.xml（トップ + 生成ページ）
  const urls = ['index.html'].concat(pages.map((p) => p.path));
  const today = process.argv[2] || '2026-07-07';
  const sitemap =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => {
      const loc = SITE_URL + u.replace(/index\.html$/, '');
      return '  <url><loc>' + loc + '</loc><lastmod>' + today + '</lastmod></url>';
    }).join('\n') +
    '\n</urlset>\n';
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');

  // robots.txt
  fs.writeFileSync(path.join(ROOT, 'robots.txt'),
    'User-agent: *\nAllow: /\nSitemap: ' + SITE_URL + 'sitemap.xml\n', 'utf8');

  console.log('生成完了: ' + written + ' ページ + sitemap.xml + robots.txt');
  console.log('  事例: ' + data.cases.length + ' / コラム: ' + data.columns.length);
}

main();
