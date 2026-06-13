# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

A single static site, `fukuenyasan-lp/` (Japanese, mobile-first, Tailwind CDN + a shared CSS file). **No build step, no tests, no linter.** The site is structured to mass-produce landing pages (LP) that share one design system and a common set of destination pages.

```
fukuenyasan-lp/
├── index.html          入口ハブ（ルートURL / で表示。各LP・共通ページへ振り分け）
├── lp/                 量産する個別LP（自由な名前でOK）
│   ├── main.html         総合LP（旧 index.html。サービス全体訴求）
│   ├── diagnosis.html    復縁タイプ診断の紹介LP（独自CSS内蔵。後述）
│   ├── listing.html      Google広告(リスティング)用「超安全文言」LP（恋愛相談訴求・結果非保証明記）
│   └── _template.html    新規LPの雛形。複製して作る
├── shared/             全LP共通の到達ページ
│   ├── contact.html      無料相談フォーム（../api/mail.php へPOST）
│   ├── thanks.html       送信完了
│   └── diagnosis.html    12問インタラクティブ診断ツール（結果は ../data/ のCSV駆動）
├── assets/
│   ├── css/theme.css     共通デザインシステム（main.html から抽出した :root + 全クラス）
│   ├── js/               共通JS用（現状ほぼ空）
│   └── img/              画像（results/ に診断結果PNG群）
├── data/               診断ツールのCSV（diagnosis-axes.csv / diagnosis-results.csv）
├── api/                PHP（本番 fukuenyasan.jp でのみ動作）
│   ├── mail.php          送信ハンドラ（contact@fukuenyasan.jp へ送信。redirect 先は ../shared/thanks.html）
│   └── avm_chatwork.php  Chatwork通知フック。mail.php が require
└── .claude/launch.json プレビューサーバ定義（preview_start 用、ポート8123）
```

**注意:** 以前あった独立プロジェクト `diagnosis/`（jQuery + Multi-Step-Form-Js）は削除済み。そのメーラー（`mail.php` / `avm_chatwork.php`）は `fukuenyasan-lp/api/` に統合された。12問診断は `shared/diagnosis.html`（バニラJS + CSV）として作り直されている。

### 「diagnosis」が2つある点に注意
- `lp/diagnosis.html` — 診断を**宣伝する紹介LP**。独自のピンク/パープル系CSS（`btn-cta-main` 等）を `<style>` に内蔵し、`theme.css` は使っていない。
- `shared/diagnosis.html` — 実際に回答する**12問診断ツール本体**。`lp/diagnosis.html` や各LPからここへ誘導する。

## 画面構成 仕様

全画面の役割・主要セクション・導線。**画面を増減/改修したらこの表も更新すること。**

### ページ一覧と導線

| パス | 種別 | 役割 | 主な遷移先 |
|---|---|---|---|
| `index.html` | 入口ハブ | ルートURLの振り分け。各LP・共通ページへ誘導 | 各 `lp/*`・`shared/contact`・`shared/diagnosis` |
| `lp/main.html` | LP（総合） | サービス全体訴求 | `shared/contact`・`shared/diagnosis`・`tel:` |
| `lp/diagnosis.html` | LP（診断紹介） | 12問診断への送客（独自CSS） | `shared/diagnosis`・`shared/contact`・`tel:`・`./main.html` |
| `lp/listing.html` | LP（広告用） | Google広告向け超安全文言。相談訴求 | `shared/contact`・`tel:` |
| `lp/_template.html` | 雛形 | 新規LPの複製元 | `shared/contact`・`tel:` |
| `shared/contact.html` | 共通到達 | 無料相談フォーム（本番配線済み） | POST→`api/mail.php`→`shared/thanks.html` |
| `shared/thanks.html` | 共通到達 | 送信完了 | `lp/main.html` |
| `shared/diagnosis.html` | 共通ツール | 12問インタラクティブ診断（3状態・後述） | `shared/contact`・`tel:` |

遷移の要点: **どのLPからも `shared/contact.html`（フォーム）と `tel:0353568550`（電話）へ到達できる**。`lp/diagnosis.html` と各LPは `shared/diagnosis.html`（診断ツール）へ送客し、診断の結果画面から再び contact/tel に戻す。

### 各画面のセクション構成

- **`index.html`（入口ハブ）**: ヘッダ → LP一覧カード（MAIN / DIAGNOSIS LP / LISTING…増えたらカード追加）→ 共通ページ直行リンク（無料相談フォーム・診断・電話）→ フッタ。
- **`lp/main.html`（総合LP）**: 下記「Architecture of `lp/main.html`」の通り（Hero→痛み訴求→根拠→選ばれる理由→ステップ→費用→満足度/体験談→最終CTA/診断誘導→FAQ→会社情報→固定下部CTA）。
- **`lp/diagnosis.html`（診断紹介LP）**: HERO → PAIN POINTS（悩み）→ ABOUT THE TEST（診断とは）→ TYPE PREVIEW（タイプ一覧 `type-card`）→ HOW IT WORKS（手順）→ TRUST/STATS → FINAL CTA（**診断 + フォーム + 電話**の3導線）→ FOOTER → 固定下部CTA（診断 + フォーム）。**独自CSSを内蔵し theme.css 不使用。**
- **`lp/listing.html`（広告用・超安全文言）**: Hero → お悩み共感（不安を煽らない）→ できること（**結果非保証を明記**）→ ご相談の流れ（3ステップ）→ 安心ポイント（相談無料/秘密厳守/無理な勧誘なし）→ FAQ（「必ず復縁できますか？」に正直回答）→ 最終CTA → フッタ（運営者表記 + 免責文）→ 固定下部CTA。**断定・誇大・数値訴求・操作的表現は禁止**（詳細はファイル冒頭コメント参照）。
- **`shared/contact.html`（相談フォーム）**: `method="post" action="../api/mail.php"`。入力項目＝お名前 / ご年齢 / 性別 / 都道府県 / ご相談の種類 / 離別時期 / 現在の状況 / 状況の詳細 / ご相談内容の詳細 / ご予算 / ご不安な点 / Email / 確認用Email / ご連絡先電話番号 / 連絡可能な日時。送信後 `api/mail.php` が `shared/thanks.html` へリダイレクト。
- **`shared/thanks.html`（送信完了）**: 完了メッセージ + `lp/main.html` への戻り導線。
- **`shared/diagnosis.html`（12問診断ツール）— 3状態を JS で切替**:
  1. `#start-screen`（開始画面。`.title` スライドイン演出 → `#start-btn` で次へ）
  2. `#shindan-form`（12問・5段階リッカート。`../data/diagnosis-axes.csv` を読み込んで生成。回答で自動スクロール、最後に `#submit-btn`）
  3. `#result`（結果画面。`#result-type-title` / `#result-image`（`../assets/img/results/<type>.png`）/ `#result-description` / `#result-breakdown` / `#result-advice` + 申込CTA（**フォーム + 電話**））
  - 結果は `../data/diagnosis-results.csv` 駆動。**結果画面は崩れテストの自動対象外**（操作後にしか出ないため、回答完了させて別途確認）。

### 共通要素
- 全LP共通の**固定下部CTAバー**（黄=フォーム / 桃=電話、`cta-fixed-*` クラス）と、スクロール表示演出 `.fade-in`（IntersectionObserver）。
- `lp/diagnosis.html` 以外は `assets/css/theme.css` を共有。

## How to run / preview

ビルド不要。静的サーバで `fukuenyasan-lp/` を配信し、`/lp/main.html` などを開く（相対パス `../assets`・`../shared` がルート起点で解決するため、**フォルダのルートから配信すること**）。

```
# 任意の静的サーバ。ルートURL(/) は入口ハブ index.html
npx http-server fukuenyasan-lp -p 8123 -c-1
#   → http://localhost:8123/             入口ハブ
#   → http://localhost:8123/lp/main.html 総合LP
#   → http://localhost:8123/shared/diagnosis.html 診断ツール
```

`.claude/launch.json` に `lp`（http-server, port 8123）を定義済み。Claude Code のプレビューでは `preview_start("lp")` で起動できる。

- **PHP（`api/mail.php`・`avm_chatwork.php`）は本番 `fukuenyasan.jp` でのみ動作**。ローカルにPHP環境はなく、フォーム送信はローカルでは完結しない。
- `shared/diagnosis.html` は `fetch('../data/*.csv')` で結果データを読むため、`file://` 直開きではCORSで失敗する。必ず静的サーバ経由で開く。

## レスポンシブ崩れの自動チェック（スマホ表示テスト）

スマホ幅でのレイアウト崩れを機械的に検出する仕組み。**新LPを足したら必ず通すこと。**

- ロジック: `assets/js/layout-check.js` … 与えたページの「①横スクロール発生(page-overflow) ②要素が画面外へはみ出し(element-overflow) ③nowrapラベルの文字切れ(text-clip)」を検出する純粋関数 `layoutAudit(window)`。本番ページのコンソールに貼って単体実行も可。
- ハーネス: `tools/responsive-qa.html` … 各ページを iframe に読み込み、**幅 320〜480px を 2px 刻み＋実機プリセットで全数スイープ**して `layoutAudit` を回し、ページ×幅の合否を表示。

```
npx http-server fukuenyasan-lp -p 8123 -c-1
→ http://localhost:8123/tools/responsive-qa.html   （開くと自動実行）
```

- **新LPを追加したら** `tools/responsive-qa.html` の `PAGES` 配列にパスを1行足す。
- 検出時の注意（誤検出を避けるための設計）:
  - 測定前に iframe を縦スクロールし、`IntersectionObserver` 連動の表示演出（`.fade-in` 等）を発火させてから測る。これをしないと未表示状態を誤検出する。
  - 横スクロール領域（`overflow:auto/scroll/hidden`）内の要素（体験談カルーセル等）は意図的なので element-overflow から除外。
  - text-clip は `white-space:nowrap` のラベルのみ対象（`btn-premium-3d` 等の `overflow:hidden` な箱は装飾擬似要素 `::after` で scrollWidth が膨らみ誤検出するため）。
- 限界: **表示中のDOMしか見ない**。`shared/diagnosis.html` の「結果画面」など操作後にしか出ない画面は、回答完了後に別途確認する。

## LP量産フロー

1. `lp/_template.html` を複製（例 `lp/reconcile-30s.html`）
2. `<title>` / `<meta description>` と `<!-- LP本文 -->` を差し替え。デザインは `../assets/css/theme.css` を共有（個別CSSは原則書かない）
3. `index.html`（入口ハブ）の LP一覧にカードを1枚追記
4. デザイン変更は `assets/css/theme.css` の1ファイルで全LPに反映される

共通リンク規約（`lp/` 配下からの相対パス）: CSS=`../assets/css/theme.css` / 画像=`../assets/img/…` / 無料相談=`../shared/contact.html` / 12問診断=`../shared/diagnosis.html` / トップLP=`./main.html`。

**どのLPにも無料相談フォーム（`shared/contact.html`）への導線を必ず入れること**（本文CTA or 固定下部バー）。

## Architecture of `lp/main.html`（総合LP）

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

## Design system conventions

スタイルは **`assets/css/theme.css`** を編集する（main.html の旧インラインstyleを抽出したもの）。`lp/main.html` / `_template.html` / `index.html` がこれを `<link>` で共有。例外: `lp/diagnosis.html` だけは独自CSSを内蔵し theme.css を使わない。

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
- **黄=フォーム遷移（`shared/contact.html`）、桃=電話発信（`tel:0353568550`）** というセマンティクス。`yellow-pulse` / `pink-pulse` キーフレームで発光する
- `btn-yellow` は**上品なシャンパンゴールド**（`#F7E7B0→#C49A3E`）。ローズと調和させた色。レモン黄には戻さない
- **固定下部CTAバー**は狭幅スマホで崩れやすいため、専用クラス `.cta-fixed-btn` / `.cta-fixed-main` / `.cta-fixed-num`（`@media(max-width:360px)` で縮小）を使う。電話番号は `cta-fixed-num`（`letter-spacing:0`）で `text-xl` を使わない — そうしないと半幅ボタンから溢れて末尾が切れる

### 章セパレータ
- `.wave-divider` SVG で濃紺→明色のセクション切れ目を表現する

## Form submission status

- `shared/contact.html` は `method="post" action="../api/mail.php"` で**本番フローに配線済み**（JSによる thanks.html リダイレクトはしない）。`api/mail.php` が `contact@fukuenyasan.jp` へ送信 + Chatwork通知し、完了後 `../shared/thanks.html` へリダイレクトする。
- ローカルではPHPが動かないため送信テストは本番でのみ可能。

## 編集時の注意

- `lp/main.html` は大きいファイル。`Edit` ツールでセレクタ単位の局所修正にとどめ、全書き換えは避ける。
- 共通CSSの変更は必ず `assets/css/theme.css`（全LPに波及する点に留意）。`lp/diagnosis.html` のスタイルだけは同ファイル内の `<style>` を直接いじる。
- ファイル移動でURLが変わると本番の広告/QRリンクが切れ得る。`shared/` `lp/` `api/` の公開パスを変える際は影響範囲を確認する。
- POINT 1〜3 の `.img-placeholder` 内の画像はUnsplashリンクを暫定使用中（`onerror` で placehold.co にフォールバック）。差し替え時は `loading="lazy"` を保持。
