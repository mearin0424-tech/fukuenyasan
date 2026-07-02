# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This repo hosts **two sibling static sites**, each independent (no shared CSS/JS):

| ディレクトリ | 種別 | 用途 |
|---|---|---|
| `fukuenyasan-lp/` | LP量産サイト | Tailwind CDN + theme.css。広告・SNS向けのコンバージョン特化LP（mobile-first） |
| `fukuenyasan-hp/` | コーポレートHP | 自前CSS（assets/css/site.css）。情報量重視の多ページ構成・SEO/権威感向け |

**両者の使い分け**: LPは「特定の訴求軸で素早く成約に導く」、HPは「会社・サービスを網羅的に知ってもらう」。フォーム送信のバックエンド（`api/mail.php`）はLP側に1本だけ存在し、HPからもLP配下の `../fukuenyasan-lp/api/mail.php` を `action` に指定して共用する。

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

### コーポレートHP `fukuenyasan-hp/` の構成

LPとは独立した、情報量重視の多ページコーポレートサイト。デザインは**`lp/diagnosis.html`系のピンク基調**（アイボリー#FBF7F4 × ピンク#FFE4E1 × ローズ#8E3E49 × 強調ピンク#FF8FA3→#C04851 グラデ）に明朝900 + Playfair Display英文を組み合わせた、可愛らしく権威も保つトーン。**LPの`theme.css`は使わず、`assets/css/site.css`に自己完結**。`pulse-glow` / `float-anim` / `pain-card` / `type-card` などのクラスも diagnosis LP と同名で揃えてある。画像はLPの `doctor.png` / `fukuenyasan-top.png` / `fukuenyasan-nayami.jpg` と `results/*.png`（16タイプ）をHP側にも複製して所有（`assets/img/`）。

```
fukuenyasan-hp/
├── index.html              トップ（ヒーロー画像doctor.png＋16タイプ診断グリッド＋5つの約束＋4サービス＋7ケース＋場面別8＋地域別12＋性別/職業別グリッド＋統計＋流れ＋声＋ニュース＋FAQ＋CTA）
├── about/index.html        私たちについて（代表メッセージ・運営姿勢）
├── company/index.html      会社概要（基本情報・沿革・アクセス）
├── service/
│   ├── index.html            サービス一覧
│   ├── counseling.html       復縁相談・カウンセリング（初回無料）
│   ├── reconciliation.html   復縁サポートプラン（月次伴走）
│   ├── consulting.html       恋愛コンサルティング（場面ごとの個別相談）
│   └── investigation.html    事前状況確認（判断材料の客観化。違法調査は明確に否定）
├── case/                   ケース別8ページ（index / lovers / ex-girlfriend / ex-boyfriend / married / separation / family / friends）
├── situation/              場面別ページ（index + 8場面：突然の別れ / 浮気 / 価値観 / 遠距離 / 喧嘩 / 倦怠期 / 結婚観 / 家族反対）
├── region/                 地域別ページ（index + 12都道府県：tokyo/kanagawa/chiba/saitama/osaka/aichi/kyoto/hyogo/fukuoka/hokkaido/miyagi/hiroshima）
├── gender/                 性別ページ（index + female / male / senior）
├── occupation/             職業別ページ（index + 8職業：会社員 / 自営業 / エグゼクティブ / 公務員 / 医療 / 看護師 / 学生 / 主婦）
├── flow/index.html         ご相談から成約までの9ステップ
├── price/index.html        料金案内（明朗会計・月々6,300円〜の分割・5つの約束）
├── voice/index.html        ご相談者の声（9事例・全件に「個人の感想です」明記）
├── faq/index.html          よくあるご質問（カテゴリ別25問前後）
├── column/                 コラム（index + 9記事程度の読み物。各4000字超）
├── recruit/index.html      採用情報
├── contact/index.html      無料相談フォーム（action=「../../fukuenyasan-lp/api/mail.php」でLPのバックエンドを共用）
├── privacy/index.html      プライバシーポリシー
├── tokushoho/index.html    特定商取引法に基づく表示
├── sitemap/index.html      サイトマップ
├── admin/                  管理画面（noindex。ナビ/フッタからはリンクしない。詳細は後述「管理画面」節）
│   ├── index.html            ダッシュボード＋編集履歴ビューア
│   ├── post.html             コラム投稿（平文/リッチテキスト/HTML貼り付け/HTMLファイルの4モード）
│   ├── edit.html             サイト編集（全ページの文章編集・画像差し替え/追加）
│   ├── admin.css / admin.js  管理UI共通スタイル・共通ロジック
│   └── history.json          編集履歴（JSON。投稿・編集のたびに追記される）
└── assets/
    ├── css/site.css          共通デザインシステム（ピンク基調・diagnosis LP系。旧 --bordeaux 系は後方互換エイリアスで残してある）
    ├── js/site.js            ハンバーガー開閉 + fade-in（時間差表示）+ ヘッダscrolled + back-to-topボタン注入
    └── img/                  LPから複製したdoctor.png / fukuenyasan-top.png / fukuenyasan-nayami.jpg + results/*.png（16タイプ）+ column/・uploads/（管理画面からの投稿画像）
```

**HP編集時の注意**:
- 全ページがヘッダ/フッタ/固定CTA帯を丸ごとコピペで持っている（静的サイト・ビルドなし）。ナビ項目・フッタリンクを変える場合は全ページに反映が必要。ナビは8項目固定：私たちについて / サービス / ケース別 / 場面別 / 地域別 / 料金 / コラム / FAQ。
- ヘッダのCTAボタン文言は「▶ 無料相談」、固定下部CTA帯は「▶ 無料相談フォーム」と「📞 03-5356-8550」。**固定CTA帯（`.mobile-cta`）はモバイルだけでなく全画面幅で常時表示**（デスクトップは中央寄せ・ボタン最大340px。`body{padding-bottom:76px}` とセット。クラス名は歴史的経緯で mobile-cta のまま）。
- フッタは4カラム：ブランド+所在地 / サービス・ケース / 地域・プロフィール別 / 会社情報・サポート。
- 文言ポリシーはLPの`listing.html`と同等の「結果非保証・断定なし・最上級なし」を全ページ徹底。「必ず復縁できる」「業界最安」「100%」「成功率」等は一切使わない。「工作」「別れさせ」「心理戦略」「接触工作」も使わない（recreation/状況分析/お話を伺うで置き換え）。
- お客様の声・体験談には必ず`<p class="voice-disclaimer">※個人の感想です。同様の結果を保証するものではありません。</p>`を付ける。
- 価格訴求は事実ベース（月々6,300円〜、自社分割、明朗会計）のみ。
- 16タイプ診断（type-card grid）は `../../fukuenyasan-lp/shared/diagnosis.html` へ誘導。HPはLPの診断ツールを再利用する設計。
- お問い合わせフォームの`action`は`../../fukuenyasan-lp/api/mail.php`を相対指定。LP側のメーラーを再利用する形（HP単独で配信する場合は別途バックエンドが必要）。
- CSS変数の `--bordeaux` / `--bordeaux-dark` / `--bordeaux-soft` は site.css 内で `--accent-rose` / `--primary-rose` / `--bg-soft-pink` へエイリアスしてある（旧デザイン時代のインラインstyleが残る箇所への安全装置）。

### 管理画面（`fukuenyasan-hp/admin/`）

サーバ不要・クライアントサイド完結の簡易CMS。**File System Access API（Chrome/Edge）でローカルの `fukuenyasan-hp/` フォルダに直接読み書きする**方式のため、本番に置いても第三者は書き込めない（フォルダを選択できるのは管理者本人のみ）。全ページ `noindex` で、サイト内ナビ/フッタ/サイトマップからはリンクしない。非対応ブラウザでは生成HTMLのダウンロードにフォールバック。

- `admin/index.html` — ダッシュボード。フォルダ接続と**編集履歴ビューア**（種別フィルタ・変更前後の差分表示・JSONダウンロード）。
- `admin/post.html` — コラム投稿。①リッチテキスト（ツールバー＋contenteditable）②平文（`##`見出し・`-`箇条書き等の簡易記法を自動変換）③HTML貼り付け（本文のみ or 完全ページ）④HTMLファイルアップロード（本文抽出 or そのまま保存）の4モード。テンプレート（標準8項目ナビ＋4カラムフッタ＋CTA帯）に流し込んで `column/<slug>.html` を生成し、**`column/index.html` のカード一覧とトップ `index.html` の news-list へ自動掲載**。プレビュー（スマホ/タブレット/PC幅）と**NGワード検査**（文言ポリシー違反の警告・非ブロック）つき。挿入画像は `assets/img/column/` へ保存。
- `admin/edit.html` — サイト編集。対象ページを `sandbox`（スクリプト無効）iframe に読み込み、**文章はクリックでその場編集、画像はクリックで差し替え/alt編集/削除、「画像を追加」で任意位置に挿入**（画像は `assets/img/uploads/` へ保存）。保存時に管理用の注入物（base/style/contenteditable等）を除去してファイルへ書き戻す。
- `admin/history.json` — 全投稿・編集の履歴。`{entries:[{id,timestamp,action,page,summary,changes:[{type,target,before,after}]}]}` 形式で先頭に追記。フォルダ未接続時は localStorage に記録（entry に note が付く）。
- 編集対象ページの読み書きは admin.js の `Admin.readText/writeText/writeBlob/appendHistory` を使う。フォルダハンドルは IndexedDB に永続化。

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
- **`lp/listing.html`（広告用・超安全文言／静謐エディトリアルデザイン）**: Hero（kicker＋明朝の行マスク見出し＋トラストタグ `#月々6,300円〜` 等＋`fukuenyasan-top.png`）→ お悩み共感（`fukuenyasan-nayami.jpg`・不安を煽らない）→ **専門家からのメッセージ（カウンセラー名＋顔写真＋審査セーフな寄り添い文。結果保証・数値・「心理戦略/工作」等は使わない）** → 私たちが大切にしていること（専門特化／明朗会計／勧誘なしの3点）→ 無料診断誘導（`doctor.png`）→ **費用面（月々6,300円〜の分割／「1日あたり約210円＝6,300÷30の事実換算・カフェ1杯分」カウントアップ／無料相談／明朗会計）** → ご相談の流れ（3ステップ）→ **ご相談者の声（横スクロールカード・顔写真付き・審査セーフな感想＋「個人の感想です。効果・結果を保証しません」明記。"成功者の声"ではなく"ご相談者の声"とする）** → FAQ（「必ず復縁できますか？」に正直回答）→ 最終CTA（フォーム+電話）→ フッタ（運営者表記 + 免責文）→ 固定下部CTA。デザインは theme.css 不使用の独自CSS（アイボリー×明朝×ボルドー1色）＋エディトリアル系モーション（行マスク・ブラーイン・ヘアラインのドロー・スクロール進捗バー・数値カウントアップ。`prefers-reduced-motion` 対応）。**断定・誇大・数値訴求・操作的表現・最上級は禁止**（詳細はファイル冒頭コメント参照）。専門家/相談者の声も結果非保証で書く。価格の割安訴求は事実換算（1日◯円）のみ。
- **`shared/contact.html`（相談フォーム）**: `method="post" action="../api/mail.php"`。入力項目＝お名前 / ご年齢 / 性別 / 都道府県 / ご相談の種類 / 離別時期 / 現在の状況 / 状況の詳細 / ご相談内容の詳細 / ご予算 / ご不安な点 / Email / 確認用Email / ご連絡先電話番号 / 連絡可能な日時。送信後 `api/mail.php` が `shared/thanks.html` へリダイレクト。
- **`shared/thanks.html`（送信完了）**: 完了メッセージ + `lp/main.html` への戻り導線。
- **`shared/diagnosis.html`（12問診断ツール）— 3状態を JS で切替**:
  1. `#start-screen`（開始画面。`.title` スライドイン演出 → `#start-btn` で次へ）
  2. `#shindan-form`（12問・5段階リッカート。`../data/diagnosis-axes.csv` を読み込んで生成。回答で自動スクロール、最後に `#submit-btn`）
  3. `#result`（結果画面。`#result-type-title` / `#result-image`（`../assets/img/results/<type>.png`）/ `#result-description` / `#result-breakdown` / `#result-advice` + 申込CTA（**フォーム + 電話**））
  - 結果は `../data/diagnosis-results.csv` 駆動。**結果画面は崩れテストの自動対象外**（操作後にしか出ないため、回答完了させて別途確認）。

### 共通要素
- 全LP共通の**固定下部CTAバー**（黄=フォーム / 桃=電話、`cta-fixed-*` クラス）と、スクロール表示演出 `.fade-in`（IntersectionObserver）。
- `lp/diagnosis.html` と `lp/listing.html` 以外は `assets/css/theme.css` を共有（この2つは独自CSSを内蔵）。

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
- **HP（`fukuenyasan-hp/`）のプレビュー**: この開発機には Node / Python が無いため、PowerShell HttpListener 製の静的サーバ `fukuenyasan-hp/.claude/serve.ps1` を用意してある（`fukuenyasan-hp/.claude/launch.json` の `hp`、ポート8124、配信ルート＝`fukuenyasan-hp/`）。Claude Code のプレビューでは `preview_start("hp")` で起動できる。

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

スタイルは **`assets/css/theme.css`** を編集する（main.html の旧インラインstyleを抽出したもの）。`lp/main.html` / `_template.html` / `index.html` がこれを `<link>` で共有。例外: `lp/diagnosis.html` と `lp/listing.html` は独自CSSを内蔵し theme.css を使わない（listing は「静謐エディトリアル」デザイン＝アイボリー×明朝×ボルドー1色＋エディトリアル系モーションを `<style>` に自己完結）。

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
