# agrow

新規参画者が最短でローカル環境を構築し、開発を開始できるように手順をまとめています。Next.js (App Router) + Prisma + PostgreSQL + Supabase（Storage/認証）構成です。

## 必要要件

- Node.js 18+（推奨: v20〜22）
- pnpm または npm/yarn（本リポジトリは pnpm を使用）
- Docker（任意: Supabase ローカルを使う場合は supabase CLI と Docker が必要）
- supabase CLI（任意: ローカル Supabase を起動する場合）

確認例:

```bash
node -v
pnpm -v
docker -v
supabase --version
```

## 初回セットアップ

1. 依存関係のインストール

```bash
pnpm install
```

2. 環境変数の設定

- .env と .env.local を準備します（存在しない場合は作成）。
- 必須項目（例）:
  - NEXTAUTH_URL=http://localhost:3000
  - NEXTAUTH_SECRET=任意の長いランダム文字列
  - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET（Google ログイン使用時）
  - NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY（フロント用）
  - SUPABASE_SERVICE_ROLE_KEY（バケット作成や管理操作に使用・ローカル時のみ）

例（ローカル Supabase のデフォルト。supabase status --output env で確認可能）:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=（ANON_KEY）
SUPABASE_SERVICE_ROLE_KEY=（SERVICE_ROLE_KEY）
```

3. DB 接続設定（Prisma）

- prisma/schema.prisma の datasource db.url は環境変数 DATABASE_URL を参照します。
- ローカル PostgreSQL の例（Supabase ローカルのデフォルト）:

```
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

## ローカル Supabase を利用する場合（推奨）

1. Supabase 起動

```bash
supabase start
# 主要URLは下記
# API_URL=http://127.0.0.1:54321
# STUDIO_URL=http://127.0.0.1:54323
# DB_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

2. キー確認（ANON_KEY, SERVICE_ROLE_KEY）

```bash
supabase status --output env
```

上記で得た ANON_KEY / SERVICE_ROLE_KEY を .env.local 等に設定。

3. Storage バケットの準備（初回のみ）

- バケット名: photos
- すでにセットアップ済みであれば不要です。未作成なら service_role キーで作成してください。

例（Node ワンライナーで作成・確認。pnpm i @supabase/supabase-js が必要です）:

```bash
SUPABASE_URL=http://127.0.0.1:54321 \
SUPABASE_SERVICE_ROLE_KEY=（SERVICE_ROLE_KEY） \
node -e 'const {createClient}=require("@supabase/supabase-js");(async()=>{const s=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);const b="photos";const l=await s.storage.listBuckets();if(l.error)throw l.error;const ex=(l.data||[]).some(x=>x.name===b);if(!ex){const r=await s.storage.createBucket(b,{public:true});if(r.error)throw r.error;console.log("created bucket:",b);}else{console.log("bucket exists:",b)}})();'
```

4. 画像のアップロード（開発用ダミー）

- 本リポジトリの public 配下の以下を photos バケットへアップロードしてください:
  - agave/noimage.jpg（public/noimage.jpg）
  - agave/dotAgave.png（public/dotAgave.png）
  - agave/dotPup.png（public/dotPup.png）

例（Node ワンライナー。ANON でも upload 可能な RLS 設定が必要な場合があります。問題があれば service_role を使用）:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 \
NEXT_PUBLIC_SUPABASE_ANON_KEY=（ANON_KEY） \
node -e 'const fs=require("fs");const p=require("path");(async()=>{const {createClient}=require("@supabase/supabase-js");const s=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);const plan=[["public/noimage.jpg","agave/noimage.jpg"],["public/dotAgave.png","agave/dotAgave.png"],["public/dotPup.png","agave/dotPup.png"]];for(const [src,key] of plan){const buf=fs.readFileSync(src);const ext=p.extname(src).toLowerCase();const ct=ext===".jpg"||ext===".jpeg"?"image/jpeg":ext===".png"?"image/png":"application/octet-stream";const r=await s.storage.from("photos").upload(key,buf,{upsert:true,contentType:ct});if(r.error)throw r.error;console.log("uploaded:",key)}})();'
```

## DB マイグレーション

Prisma のマイグレーション適用:

```bash
pnpm prisma migrate deploy
# またはローカル新規構築時:
pnpm prisma migrate dev
```

Prisma クライアント生成:

```bash
pnpm prisma generate
```

## 開発用シードデータ投入

最初のユーザー（created_at 昇順の先頭）に紐づくダミーデータを投入します。ファイルは以下にあります:

- prisma/seed/dev-seed.sql

投入コマンド:

```bash
PGPASSWORD=postgres psql "postgresql://postgres@127.0.0.1:54322/postgres" -v ON_ERROR_STOP=1 -f prisma/seed/dev-seed.sql
```

注意:

- User テーブルに 1 件以上のユーザーが必要です（NextAuth でログインすると作成されます）。
- Storage に前述のキー（photos/agave/\*.jpg|png）が存在している必要があります。
- スキーマは prisma/schema.prisma に準拠していること。

## アプリの起動

```bash
pnpm dev
```

ポート 3000 を使用します。占有されている場合は次の空きポートにフォールバックすることがあります。ブラウザで http://localhost:3000 を開きます。

## 主要ディレクトリ構成

- app/ … Next.js App Router
- app/api/\* … Route Handlers（API エンドポイント）
- app/components/\* … UI コンポーネント
- app/hooks/\* … React Hooks
- prisma/schema.prisma … Prisma スキーマ
- prisma/migrations/\* … マイグレーション
- prisma/seed/dev-seed.sql … 開発用シード SQL
- public/\* … 公開アセット
- supabase/\* … ローカル Supabase 関連設定（config.toml, kong.yml）

## トラブルシュート

- psql 接続エラー:
  - DB_URL / DATABASE_URL を確認（127.0.0.1:54322/postgres がデフォルト）
  - Docker/Supabase が起動しているか確認（supabase start）
- Supabase Storage の署名検証エラー:
  - 使用しているキーが ANON/SERVICE_ROLE のどちらか、URL/API_URL が一致しているか確認
  - supabase status --output env で最新値を再確認
- 画像が表示されない:
  - photos バケットに該当キーが存在するか
  - バケットが public=true か、RLS が read を許可しているか
- Prisma Migration 失敗:
  - 既存スキーマと競合する場合があります。ローカルなら DB を初期化 →migrate dev を検討

## よく使うコマンド集

```bash
# 開発サーバ
pnpm dev

# Prisma
pnpm prisma migrate dev
pnpm prisma migrate deploy
pnpm prisma generate
pnpm prisma studio

# Supabase（ローカル）
supabase start
supabase stop
supabase status --output env
```

## ライセンス・コントリビュート

- PR・Issue 歓迎です。ブランチ戦略やコーディング規約はリポジトリの既存パターンに従ってください。
- コミット前に型チェック/ESLint/フォーマッタが走るよう設定されている場合があります。必要に応じて pnpm scripts を参照してください。
