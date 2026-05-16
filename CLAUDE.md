# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Two independent sub-projects with **no shared build pipeline**:

- `fukuenyasan-lp/` — the marketing LP (Japanese, mobile-first). Static HTML + Tailwind CDN. Includes:
  - `index.html` — the main LP (~2,400 lines, all CSS inlined in a single `<style>` block at the top)
  - `contact.html` — 無料相談フォーム. JS-generated select/checkbox options; submit handler only does `window.location.href = './thanks.html'` (no real backend wiring yet — see `contact.html:346`)
  - `diagnosis.html` — in-page 12問診断 (uses the same LP style system)
  - `thanks.html`, `images/`
- `diagnosis/` — a **separate**, older diagnostic form that POSTs to PHP. Built on jQuery + jQuery Validation + a vendored copy of the `Multi-Step-Form-Js` library.
  - `index.html` (form), `index.js` (vendored multi-step-form library)
  - `mail.php` — submission handler (PHP-Factory's free mailer template, mails `contact@fukuenyasan.jp`)
  - `avm_chatwork.php` — Chatwork notification hook, required by `mail.php`
  - `package.json` is the **library's** manifest (`http-server -c-1` demo only), not the project's

**Important:** `diagnosis/README.md` documents the upstream multi-step-form-js library, NOT this project. Don't treat it as project documentation.

## How to run / preview

There is no build step. Open the HTML files directly, or serve the folder statically:

```
# any static server works for fukuenyasan-lp/
npx http-server fukuenyasan-lp -c-1
# or for the diagnosis form (note: PHP submission won't work locally without PHP)
npx http-server diagnosis -c-1
```

PHP endpoints (`mail.php`, `avm_chatwork.php`) only run on the production server (`fukuenyasan.jp`). There is no local PHP setup.

No tests, no linter, no formatter are configured.

## Architecture of `fukuenyasan-lp/index.html`

Reading order, top to bottom:
1. Hero (`hero-gradient`)
2. 痛み訴求 (`.pain-section`, `.warning-text`)
3. プロの解決根拠 (`.logic-section` + `.notebook-card` + `.expert-sign`)
4. 選ばれる理由 (`.reason-section-bg` — **濃紺 + ゴールド/パープル**, 3 POINT cards `.bold-card`)
5. 復縁ステップ (`.flow-section-bg` — timeline with `.flow-step` + designed chevron arrows `.flow-arrow`)
6. 費用案内 (`.price-light-content` / `.price-guarantee-section`)
7. 満足度バナー + 体験談 (`.satisfaction-integrated-bg`, `.letter-card`)
8. 最終CTA → 診断誘導 (`.lp-diag-wrapper`) → FAQ → 会社情報
9. 固定下部CTA (`.fixed.bottom-0`)

## Design system conventions (fukuenyasan-lp)

When editing styles, **edit the inline `<style>` block at the top of `fukuenyasan-lp/index.html`**, not a separate CSS file.

### Color tokens (`:root`)
- Rose family — `--primary-rose`, `--dark-rose`, `--accent-rose`, `--light-rose`, `--highlight-red`
- Plan A章カラー — `--deep-navy`, `--navy-2`, `--gold-main`, `--gold-light`, `--royal-purple`, `--purple-deep`
- 選ばれる理由セクションは **濃紺背景** がベース; POINT 1=ゴールド (`.theme-gold`), 2=ローズ (default), 3=パープル (`.theme-purple`)。バッジは `.point-badge.gold` / `.point-badge.purple`。

### Font policy
- **Body / headings / 説明文**: `Noto Sans JP`
- **明朝 (`Shippori Mincho`) は数字・権威表記のみ**: POINT/STEP数字、統計（6,000件、96%、6,300円）、`.expert-sign` (Yuji Syuku)、`.price-gold-text`
- 装飾的な英字キャプションは `'Cinzel'` / `'Noto Serif JP'` がスポット使用されている

### CTAボタン
- 必ず `btn-premium-3d` + 色クラス（`btn-yellow` or `btn-pink`）+ `floating-action` を組み合わせる
- ラベルテキストには `.cta-label` クラス（`white-space: nowrap` 強制、Hiragino Sans / Yu Gothic / Noto Sans JP）
- `btn-pink` は電話CTA（`tel:0353568550`）専用。`yellow-pulse` / `pink-pulse` キーフレームで発光する
- 黄=フォーム遷移、桃=電話発信、というセマンティクス

### 章セパレータ
- `.wave-divider` SVG で濃紺→明色のセクション切れ目を表現する

## Form submission status

- `fukuenyasan-lp/contact.html` の `submit` ハンドラは現在 thanks.html へリダイレクトするだけ。実際のメール送信/CRM連携は未配線。実装時は `diagnosis/mail.php` のパターン（PHP-Factoryメーラー + Chatwork通知）を流用する想定。
- `diagnosis/` 側は `mail.php` 経由で `contact@fukuenyasan.jp` 宛にメール送信 + ChatWork通知が走る本番フロー。

## 編集時の注意

- `fukuenyasan-lp/index.html` は単一巨大ファイルのため、`Edit` ツールでセレクタ単位で局所修正する。全書き換えは避ける。
- POINT 1〜3 の `.img-placeholder` 内の画像はUnsplashリンクを暫定使用中（`onerror` で placehold.co にフォールバック）。差し替え時は `loading="lazy"` を保持。
- `diagnosis/` を触るときはjQuery 1.x / jQuery Validation / Multi-Step-Form-Js APIに従う。`$('.msf').multiStepForm({...})` で初期化、`msf:viewChanged` イベントで進捗バー更新。
