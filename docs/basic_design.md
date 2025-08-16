# 基本設計書

## 1. システム構成
- **フロントエンド**: Next.js 13 (App Router)。React 18 のクライアント／サーバーコンポーネントを併用する。
- **バックエンド**: Next.js API Routes を使用し、Prisma を介して PostgreSQL にアクセスする。
- **認証**: `next-auth` による OAuth 認証。`SessionProvider` によりクライアント側でセッションを保持。【app/_app.tsx】
- **画像ストレージ**: Supabase Storage を利用し、画像のアップロード・公開 URL を生成する。【app/agave/[slug]/page.tsx】
- **インフラ**: Vercel 等のホスティングを想定。

## 2. ディレクトリ構成
```
app/
  admin/            管理者用画面
  agave/            アガベ詳細・API
  components/       汎用コンポーネント
  hooks/            SWR を利用したデータ取得
  login/            ログイン画面
  mypage/           マイページ
  rack/             ラック関連画面
  timeline/         タイムライン画面
  user/             ユーザー情報
  api/              サーバーサイド API ルート
```

## 3. データベース設計
Prisma schema から主要テーブルを抜粋。

| テーブル | 主な項目 | 説明 |
|---------|---------|------|
| `User` | `id`, `name`, `email`, `publicId`, `isAdmin` | 利用者情報。管理者フラグで権限を管理。|
| `Agave` | `id`, `slug`, `name`, `description`, `ownerId`, `parentId`, `rackCode`, `iconUrl` | 登録された株。親子関係・ラック位置・画像を保持。|
| `AgaveImage` | `id`, `url`, `agaveId`, `shotDate`, `ownerId` | アガベの画像。撮影日と紐付く。|
| `Rack` | `code`, `name`, `ownerId`, `size`, `rackPlanId` | 株を配置するラック。|
| `RackPlan` | `id`, `name`, `size`, `monthlyFee` | ラックの料金プラン。|
| `Tag` / `TagsOnAgaves` | | アガベに付与されるタグ。|
| `ShortLink` | `link`, `agaveSlug` | ショートリンクとアガベの紐付け。|
| `Post`, `Like`, `Follow` | | タイムライン投稿関連。|
| `News` | `id`, `title`, `content` | 管理者が発信するニュース。|

## 4. 主要機能の概要
### 4.1 アガベ管理
- `app/agave/api.ts` にクライアントから利用する API ラッパーを実装。
- 登録・更新・削除は `app/api/agave/*` で提供。認証済みユーザーのみ利用可能。
- アガベ詳細画面では画像一覧、タグ、親子関係、ラック位置を表示する。【app/agave/[slug]/page.tsx】

### 4.2 ラック管理
- `app/rack/page.tsx` でユーザーの保有ラックを表示し、ラック内の各ポジションにアガベを配置。
- ラックの追加はモーダルを通じて `RackPlan` から選択する。

### 4.3 画像管理
- 画像アップロードはブラウザで圧縮後に Supabase へ送信し、URL を `AgaveImage` として保存。【app/agave/[slug]/page.tsx】
- ギャラリー表示・削除・アイコン設定を `GalleryModal` コンポーネントで提供。

### 4.4 ショートリンク
- 管理者が `/admin/sl` 画面でショートリンク ID を発行しクリップボードへコピー。【app/admin/sl/page.tsx】
- 発行されたリンクは `/api/sl` を通じて特定のアガベへ紐付ける。

### 4.5 ニュース管理
- `/admin/news` でニュース記事を作成・編集。`News` テーブルに保存され、タイムラインなどで表示する。

## 5. 認証・権限
- `next-auth` を利用し、OAuth プロバイダ（例: Google）でログインする。
- API ルートでは `getServerSession` を利用して認証状態を確認し、未認証時は `401 Unauthorized` を返す。【app/api/agave/route.ts】
- 管理者機能は `User.isAdmin` を参照してアクセスを制限する。【app/api/mypage】

## 6. 外部サービス連携
- **Supabase**: 画像のアップロード・公開 URL 発行。
- **OAuth Provider**: Google 等。

## 7. URL パターン
| 画面 | URL 例 | 説明 |
|------|--------|------|
| ログイン | `/login` | 認証画面。|
| タイムライン | `/timeline` | 画像やニュースの時系列表示。|
| アガベ詳細 | `/agave/[slug]` | 個別の株を表示。|
| 画像共有 | `/agave/[slug]/image/[image]` | SNS共有用ページ。|
| ラック | `/rack` | 自身のラック一覧。|
| 管理トップ | `/admin` | 管理者メニュー。|

