# 詳細設計書

## 1. アーキテクチャ
- React 18 + Next.js 13 を使用。App Router によるファイルベースルーティングを採用。
- クライアント側データ取得は `SWR` を使用し、自動キャッシュ・再検証を行う。
- API レイヤは Next.js API Routes。Prisma を用いて DB 操作を行う。

## 2. モジュール設計
### 2.1 アガベ API (`app/api/agave`)
| メソッド/パス | 概要 | 認証 |
|---------------|------|------|
| `POST /api/agave` | アガベ新規登録。`name` 等を受け取り `Agave` を作成。| 必須 |
| `GET /api/agave/[slug]` | 指定されたアガベの詳細取得。オーナー情報・タグ・画像を含む。| 任意 |
| `PUT /api/agave/[slug]` | アガベ名称・説明・タグを更新。| 必須 |
| `DELETE /api/agave/[slug]` | アガベの論理削除。ラック位置を解除。| 必須 |
| `POST /api/agave/images/[id]` | 画像情報を `AgaveImage` として登録。| 必須 |
| `DELETE /api/agave/[slug]/image/[image]` | 指定画像を削除。| 必須 |
| `PUT /api/agave/[slug]/icon` | アイコン画像を設定。| 必須 |

### 2.2 ラック API (`app/api/rack`)
| メソッド/パス | 概要 |
|---------------|------|
| `GET /api/rack` | 自身のラック一覧を取得。SWR フック `useMyRacks` で利用。|
| `POST /api/rack` | ラックを追加。選択した `RackPlan` の `id` を受け取る。|
| `GET /api/rack/[rack]` | 特定ラックの詳細（配置されているアガベを含む）を取得。|
| `PUT /api/rack/[rack]/position/[position]` | ラックの指定位置にアガベを配置または解除。|

### 2.3 ショートリンク API (`app/api/sl`)
- `PUT /api/sl` : `link` と `agaveSlug` を受け取り、`ShortLink` を更新。認証必須。

### 2.4 ユーザー関連 API
- `GET /api/mypage` : ログインユーザーのプロフィール・権限情報を取得。
- `GET /api/user/[publicId]` : 公開 ID からユーザー情報を取得。

## 3. コンポーネント設計
### 3.1 `app/agave/[slug]/page.tsx`
- 画像プレビュー・アップロード機能
  - `input[type=file]` で選択された画像を `compressImage` でリサイズし、Supabase へ保存。
  - 投稿モーダルで撮影日を指定可能。
- ギャラリーモーダル
  - `GalleryModal` コンポーネントでスライド表示。
  - 削除・アイコン設定・SNS 共有を提供。
- 編集モード
  - `EditAgave` コンポーネントを表示し名称・説明・タグを編集。

### 3.2 `app/rack/page.tsx`
- `useMyRacks` によりラック一覧を取得。
- ラックカードをクリックすると `Rack` コンポーネントで詳細を表示。
- `SetAgave` モーダルでラック位置へのアガベ設定を行う。

### 3.3 その他主要コンポーネント
| コンポーネント | 役割 |
|----------------|------|
| `UserView` | ユーザーのアイコン・名前・公開 ID を表示。|
| `ShareButtons` | 画像やページの SNS 共有リンクを生成。|
| `ConfirmModal` | 重要操作前の確認ダイアログ。|
| `DarkModeSwitch` | Tailwind によるダークモード切替。|

## 4. データフロー例
### 4.1 アガベ画像アップロード
1. ユーザーが画像を選択すると `handleChangeFiles` が呼ばれ、ブラウザ側で圧縮してプレビュー表示。
2. 投稿モーダルで撮影日を指定し `handleUpload` を実行。
3. Supabase Storage へ画像をアップロードし、生成されたパスを `/api/agave/images/[id]` に送信して `AgaveImage` レコードを作成。
4. SWR `mutateAgave` により最新データを再取得し、画面を更新。

### 4.2 ラックへのアガベ配置
1. `Rack` コンポーネントで空きポジションをクリックすると `SetAgave` モーダルが表示。
2. アガベ検索後に配置を確定すると `/api/rack/[rack]/position/[position]` へ PUT し、`Agave.rackCode` と `rackPosition` を更新。
3. 更新後 `mutateRack` でラック情報を再取得。

### 4.3 ショートリンク発行
1. 管理者が `/admin/sl` 画面でリンクを発行 (`/api/admin/sl` に POST)。
2. 発行された ID を `agrow.jp/sl/[id]` としてコピー。
3. ユーザーが `PUT /api/sl` を呼び出し、`link` と `agaveSlug` を送信してアガベに紐付け。

## 5. エラーハンドリング
- API で認証失敗時は `401` を返却し、フロント側でログイン画面へ誘導。
- 画像アップロード時の失敗は `toast` によるユーザー通知で表示。

## 6. 環境変数
| 変数名 | 用途 |
|-------|------|
| `DATABASE_URL` | Prisma が接続する PostgreSQL の URL。|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 接続情報。|
| `NEXT_PUBLIC_APP_BASE_URL` | Open Graph 等で利用するアプリケーション公開 URL。|

