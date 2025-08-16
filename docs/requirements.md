# 要件定義書

## 1. 概要
Agrow はアガベ（多肉植物）を中心とした栽培記録・共有サービスである。ユーザーは自身の保有する株を登録し、画像と共に生育状況を記録・公開できる。ラック管理機能により株の設置場所を把握し、ショートリンク機能により外部へ簡易な共有を行うことが可能である。

## 2. 用語定義
| 用語 | 説明 |
|-----|------|
| アガベ | 管理対象となる植物。株単位で登録する。|
| ラック | 株を配置する棚。ラックは複数の区画（ポジション）を持つ。|
| パップ | 子株。親株(Parent)との親子関係を持つ。|
| ショートリンク | `/sl/xxxx` の形式で発行される共有用短縮URL。|
| オーナー | アガベやラックを登録したユーザー。|
| 管理者 | システムを管理し、ショートリンク発行やニュース管理を行うユーザー。|

## 3. ユースケース
1. ユーザー登録 / ログイン
2. アガベの登録・編集・削除
3. 画像のアップロード・閲覧・削除・アイコン設定
4. ラックの追加・表示・アガベ位置設定
5. ショートリンクの発行・アガベへの紐付け
6. タイムラインでの画像閲覧
7. 管理者によるニュース投稿

## 4. 機能要件
### 4.1 認証・ユーザー管理
- Google 等の OAuth プロバイダを利用した認証 `next-auth`。【app/login/page.tsx】
- セッション管理を行い、ログイン状態に応じて表示を切り替える。
- 管理者フラグ (`isAdmin`) を保持し、管理画面へのアクセス制御に使用する。【prisma/schema.prisma】

### 4.2 アガベ管理
- アガベの登録・取得・更新・削除 API を提供する。【app/api/agave/route.ts】【app/api/agave/[slug]/route.ts】
- アガベは名前、説明、タグ、親株、ラック位置、画像を保持する。【prisma/schema.prisma】
- 親株と子株（pup）の関係を保持する。【app/agave/[slug]/page.tsx】
- 画像は Supabase ストレージに保存され、撮影日付きで管理する。【app/agave/[slug]/page.tsx】

### 4.3 ラック管理
- 利用者は自分のラック一覧を閲覧し、ラックを追加できる。【app/rack/page.tsx】
- ラックはサイズ・月額料金を持つプランに基づいて作成される。【prisma/schema.prisma】
- ラック内の各ポジションにアガベを配置する機能を提供する。【app/components/Rack.tsx】【app/components/SetAgave.tsx】

### 4.4 画像管理・共有
- アガベ画像のアップロード、削除、アイコン設定 API。【app/agave/api.ts】
- 画像詳細ページでは Open Graph メタデータを生成し、SNS での共有に対応する。【app/agave/[slug]/image/[image]/page.tsx】
- ギャラリーモーダルで画像を閲覧し、SNS への共有リンクを作成できる。【app/components/GalleryModal.tsx】

### 4.5 タイムライン・投稿
- 最新のアガベ画像やニュースをタイムライン形式で表示する。【app/timeline/page.tsx】
- 投稿やコメント機能のための `Post`, `Like`, `Follow` モデルを保持する。【prisma/schema.prisma】

### 4.6 ショートリンク
- 管理者はショートリンクを発行し、任意のアガベへ紐付けることができる。【app/admin/sl/page.tsx】【app/api/sl/route.ts】
- ショートリンクは `ShortLink` モデルで管理する。【prisma/schema.prisma】

### 4.7 管理者機能
- 管理者はショートリンクの発行、ニュースの作成・編集を行える。【app/admin/page.tsx】【app/admin/news/page.tsx】

## 5. 非機能要件
- **フロントエンドフレームワーク**: Next.js 13 (App Router)。
- **スタイル**: Tailwind CSS、Ant Design コンポーネント。
- **データベース**: PostgreSQL (Prisma)。
- **ストレージ**: Supabase を利用し画像を保存。
- **認証**: NextAuth を利用した OAuth。
- **品質**: ESLint による静的解析 `npm run lint`。
- **可用性**: Vercel 等のクラウド環境でのデプロイを想定。

## 6. システム外部要件
- Supabase、Google OAuth 等の外部サービスへの接続設定。
- `DATABASE_URL`・`NEXT_PUBLIC_APP_BASE_URL` 等の環境変数の設定。

