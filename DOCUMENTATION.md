# YUI Protocol Static Site - 技術ドキュメント

## 目次
- [プロジェクト概要](#プロジェクト概要)
- [アーキテクチャ](#アーキテクチャ)
- [ディレクトリ構成](#ディレクトリ構成)
- [技術スタック](#技術スタック)
- [データフロー](#データフロー)
- [ビルドプロセス](#ビルドプロセス)
- [主要コンポーネント](#主要コンポーネント)
- [デプロイ](#デプロイ)
- [開発ガイド](#開発ガイド)

---

## プロジェクト概要

**YUI Protocol Static Site**は、YUI Protocolシステムの静的デモンストレーションサイトです。複数のAIエージェント間の協調的な対話プロセスを、GitHub Pagesで閲覧可能な静的Webサイトとして提供します。

### 主な目的
- YUI Protocolの動作デモンストレーション
- セッションデータの静的な閲覧
- エージェント間の対話プロセスの可視化
- GitHub Pagesでの公開

### 特徴
- 📚 複数のセッションを閲覧可能
- 🤖 AIエージェント間の対話を段階的に表示
- 📱 レスポンシブデザイン（モバイル対応）
- 🔍 セッション検索・選択機能
- 📖 完全な読み取り専用モード
- 📄 Markdown形式の出力プレビュー機能

---

## アーキテクチャ

### システム構成

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Pages                          │
│  (https://username.github.io/yui-protocol-static/)      │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│              Static React Application                   │
│                  (Vite + React)                         │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   AppStatic  │  │  ThreadView  │  │ OutputPreview│ │
│  │              │  │              │  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│              Static Data (JSON/MD)                      │
│  /data/sessions/    |   /data/outputs/                 │
│   - 1.json          |    - output_xxx.md               │
│   - 2.json          |    - output_yyy.md               │
│   - index.json      |                                  │
└─────────────────────────────────────────────────────────┘
```

### データフロー

1. **ビルド時** (`npm run build:static`)
   - `sessions/` と `outputs/` からデータを収集
   - `public/data/` にコピー
   - `index.json` を生成（セッション一覧）
   - Viteでアプリケーションをビルド → `dist-static/`

2. **実行時**
   - アプリケーション起動時に `index.json` を読み込み
   - 各セッションファイルを並列フェッチ
   - ユーザーがセッションを選択
   - 必要に応じて出力ファイルをフェッチ

---

## ディレクトリ構成

```
yui-protocol-static/
├── src/                          # ソースコード
│   ├── main.tsx                  # エントリーポイント
│   ├── types/
│   │   └── index.ts              # 型定義（Session, Agent, Message）
│   └── ui/
│       ├── AppStatic.tsx         # メインアプリケーション
│       ├── ThreadView.tsx        # メッセージスレッド表示
│       ├── OutputPreview.tsx     # Markdown出力プレビュー
│       └── images/               # 画像リソース
│           ├── YuiProtocol.png
│           └── github.png
│
├── sessions/                     # セッションデータ（JSON）
│   ├── 1.json
│   ├── 2.json
│   └── ... (80+セッション)
│
├── outputs/                      # 出力ファイル（Markdown）
│   ├── output_xxx.md
│   └── ... (40+ファイル)
│
├── scripts/                      # ビルドスクリプト
│   ├── build-static-data.js     # データコピースクリプト
│   └── deploy.js                # デプロイスクリプト
│
├── public/                       # 静的アセット（ビルド時生成）
│   └── data/
│       ├── sessions/
│       │   ├── index.json       # セッション一覧
│       │   └── *.json           # 各セッション
│       └── outputs/
│           └── *.md             # 各出力ファイル
│
├── dist-static/                 # ビルド出力（GitHub Pagesへデプロイ）
│
├── vite.config.static.ts        # Vite設定（静的ビルド用）
├── package.json                 # 依存関係とスクリプト
├── tailwind.config.js           # Tailwind CSS設定
└── tsconfig.json                # TypeScript設定
```

---

## 技術スタック

### フロントエンド
- **React 18.2** - UIフレームワーク
- **TypeScript 4.9** - 型安全性
- **Tailwind CSS 3.3** - スタイリング
- **React Router DOM 6.8** - ルーティング
- **React Markdown 10.1** - Markdown表示

### ビルドツール
- **Vite 4.1** - 高速ビルドツール
- **PostCSS + Autoprefixer** - CSSプロセッシング

### デプロイ
- **GitHub Pages** - 静的ホスティング

---

## データフロー

### 1. セッションデータ構造

```typescript
interface Session {
  id: string;              // 一意のセッションID
  title: string;           // セッションタイトル
  messages: Message[];     // メッセージ配列
  agents: Agent[];         // エージェント配列
  createdAt: string;       // 作成日時（ISO 8601）
  updatedAt: string;       // 更新日時（ISO 8601）
  outputFileName?: string; // 出力ファイル名（任意）
}

interface Agent {
  id: string;              // エージェントID
  name: string;            // 表示名
  role: string;            // 役割
  avatar?: string;         // アバター（絵文字など）
  color: string;           // UI表示色（HEX）
}

interface Message {
  id: string;                           // メッセージID
  role: 'user' | 'assistant' | 'system' | 'agent';
  content: string;                      // メッセージ内容（Markdown可）
  timestamp: string;                    // タイムスタンプ（ISO 8601）
  agentId?: string;                     // エージェントID（任意）
  stage?: string;                       // ステージ（任意）
  metadata?: {                          // メタデータ（任意）
    voteFor?: string;
    voteReasoning?: string;
    voteSection?: string;
  };
}
```

### 2. YUI Protocol の5段階プロセス

セッション内のメッセージは、以下の5つのステージで構成されます：

| ステージ | stage値 | 説明 | 色 |
|---------|---------|------|-----|
| 1. Individual Thought | `individual-thought` | 各エージェントが独立して思考 | 青 |
| 2. Mutual Reflection | `mutual-reflection` | エージェント間で相互に読み合い、反応 | 緑 |
| 3. Conflict Resolution | `conflict-resolution` | 意見の相違を明確化し、解決を試みる | 黄 |
| 4. Synthesis Attempt | `synthesis-attempt` | 統一的な見解の構築を試みる | 紫 |
| 5. Output Generation | `output-generation` | 最終的な回答を生成 | 藍 |

### 3. データフェッチフロー

```
アプリ起動
   ↓
index.json取得 (セッション一覧)
   ↓
全セッションファイルを並列フェッチ
   ↓
日付順ソート (updatedAt降順)
   ↓
URLパラメータからセッション選択
   ↓
セッション表示 (ThreadView)
   ↓
[任意] 出力ファイルプレビュー
```

---

## ビルドプロセス

### スクリプト一覧

```json
{
  "dev": "vite",
  "build": "vite build",
  "build:static": "node scripts/build-static-data.js && vite build --config vite.config.static.ts",
  "preview": "vite preview",
  "preview:static": "vite preview --config vite.config.static.ts",
  "deploy": "node scripts/deploy.js"
}
```

### ビルド手順

#### 1. 静的データのコピー (`build-static-data.js`)

```javascript
// 1. sessionsディレクトリの全JSONファイルをpublic/data/sessions/にコピー
sessions/*.json → public/data/sessions/*.json

// 2. index.jsonを生成（ファイル一覧）
public/data/sessions/index.json

// 3. outputsディレクトリの全MDファイルをpublic/data/outputs/にコピー
outputs/*.md → public/data/outputs/*.md
```

#### 2. Viteビルド

```bash
npm run build:static
```

- `vite.config.static.ts` を使用
- `base: '/yui-protocol-static/'` でGitHub Pages用のパス設定
- `public/` ディレクトリの内容が `dist-static/` にコピーされる
- React アプリケーションがバンドルされ `dist-static/assets/` に出力

#### 3. 出力構造 (`dist-static/`)

```
dist-static/
├── index.html
├── assets/
│   ├── main.js
│   ├── main.css
│   └── ... (画像など)
└── data/
    ├── sessions/
    │   ├── index.json
    │   └── *.json
    └── outputs/
        └── *.md
```

---

## 主要コンポーネント

### 1. AppStatic.tsx

**役割**: アプリケーションのルート

**主な機能**:
- セッション一覧の読み込み（`index.json` + 個別ファイル）
- URLパラメータ管理（`?session=xxx`, `?preview`）
- メニュー開閉状態の管理
- ヘッダーとフッター表示

**キー機能**:
```typescript
// セッション選択時にURLを更新
const selectSession = (session: Session) => {
  setCurrentSession(session);
  const url = new URL(window.location.href);
  url.searchParams.set('session', session.id);
  window.history.pushState({}, '', url.toString());
};
```

**UIコンポーネント**:
- `StaticMenu`: セッション選択メニュー（フルスクリーンオーバーレイ）
- ヘッダー: ロゴ、タイトル、5段階プロセス説明
- メインエリア: ThreadView または OutputPreview

### 2. ThreadView.tsx

**役割**: セッションのメッセージスレッド表示

**主な機能**:
- メッセージリストの表示
- エージェントアバターと色の管理
- ステージ区切りの表示
- Markdown レンダリング
- 投票情報の表示（メタデータ）
- 出力ファイルのダウンロード・プレビュー

**レンダリング**:
```typescript
// Agent IDを名前に置換
const replaceAgentIdsWithNames = (content: string): string => {
  session.agents.forEach(agent => {
    content = content.replace(new RegExp(agent.id, 'g'), agent.name);
  });
  return content;
};

// Markdownレンダリング（安全な要素のみ）
<ReactMarkdown
  components={{
    a: () => <span>[Link]</span>, // リンク無効化
    img: () => <span>[Image]</span>, // 画像無効化
    // ...
  }}
>
  {content}
</ReactMarkdown>
```

**ステージ表示**:
- 前のメッセージとステージが変わったら区切りを表示
- 各ステージごとに色分け

### 3. OutputPreview.tsx

**役割**: 出力ファイル（Markdown）のプレビュー

**主な機能**:
- 個別のMDファイルをフェッチ
- Markdownレンダリング
- スレッドビューへの戻るボタン

**フェッチロジック**:
```typescript
const response = await fetch(
  `/yui-protocol-static/data/outputs/${outputFileName}`
);
const fileContent = await response.text();
```

### 4. StaticMenu コンポーネント

**役割**: セッション選択メニュー

**特徴**:
- フルスクリーンオーバーレイ
- セッション一覧（日付順）
- エージェント数・メッセージ数の表示
- 現在選択中のセッションをハイライト

---

## デプロイ

### GitHub Pages へのデプロイ

#### 前提条件
- GitHubリポジトリが作成済み
- GitHub Pagesが有効化されている（Settings > Pages）

#### 手順

1. **ビルド**
```bash
npm run build:static
```

2. **デプロイ** (手動の場合)
```bash
# dist-staticディレクトリの内容をgh-pagesブランチにプッシュ
git subtree push --prefix dist-static origin gh-pages
```

または

```bash
npm run deploy
```

3. **確認**
- `https://<username>.github.io/yui-protocol-static/` にアクセス

#### 自動デプロイ (GitHub Actions)

`.github/workflows/deploy.yml` の例:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:static
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist-static
```

---

## 開発ガイド

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# 静的ビルド
npm run build:static

# プレビュー
npm run preview:static
```

### 新しいセッションの追加

1. `sessions/` に新しいJSONファイルを追加
2. 必要に応じて `outputs/` に出力ファイルを追加
3. ビルドスクリプトが自動的に処理

**セッションファイルの例**:
```json
{
  "id": "unique-id",
  "title": "セッションタイトル",
  "agents": [
    {
      "id": "agent-1",
      "name": "Alice",
      "role": "Analyst",
      "avatar": "🔍",
      "color": "#3b82f6"
    }
  ],
  "messages": [
    {
      "id": "msg-1",
      "role": "user",
      "content": "質問内容",
      "timestamp": "2025-01-01T12:00:00Z"
    },
    {
      "id": "msg-2",
      "role": "agent",
      "agentId": "agent-1",
      "content": "回答内容",
      "timestamp": "2025-01-01T12:01:00Z",
      "stage": "individual-thought"
    }
  ],
  "createdAt": "2025-01-01T12:00:00Z",
  "updatedAt": "2025-01-01T12:05:00Z",
  "outputFileName": "output_xxx.md"
}
```

### カスタマイズ

#### 1. 色の変更

`src/ui/ThreadView.tsx` 内の `getStageColor` 関数:

```typescript
const getStageColor = (stage: string): string => {
  const colors: { [key: string]: string } = {
    'individual-thought': 'bg-blue-900 border border-blue-700',
    // ...
  };
  return colors[stage] || 'bg-gray-800 border border-gray-600';
};
```

#### 2. ベースURLの変更

`vite.config.static.ts`:

```typescript
export default defineConfig({
  base: '/your-repo-name/', // 変更
  // ...
});
```

`src/ui/AppStatic.tsx` と `src/ui/OutputPreview.tsx` の fetch URL:

```typescript
// 変更前
fetch('/yui-protocol-static/data/sessions/index.json')

// 変更後
fetch('/your-repo-name/data/sessions/index.json')
```

#### 3. スタイルの調整

Tailwind CSS を使用しているため、各コンポーネントのクラス名を編集:

```tsx
<div className="bg-gray-900 text-gray-100">
  {/* カスタムスタイル */}
</div>
```

### トラブルシューティング

#### 問題: セッションが表示されない

**原因**: `index.json` が正しく生成されていない

**解決**:
```bash
node scripts/build-static-data.js
```

#### 問題: GitHub Pagesで404エラー

**原因**: ベースURLが間違っている

**解決**:
1. `vite.config.static.ts` の `base` を確認
2. fetch URLのパスを確認

#### 問題: 出力ファイルが見つからない

**原因**: ファイル名が一致していない

**解決**:
1. `session.outputFileName` と実際のファイル名を確認
2. `outputs/` ディレクトリにファイルが存在するか確認

---

## ライセンス

このプロジェクトは[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)ライセンスの下で公開されています。

---

## 参考リンク

- [YUI Protocol 本体](https://github.com/yui-synth-lab/yui-protocol)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
