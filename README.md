# YUI Protocol Static Site

YUI Protocolの静的デモンストレーションサイトです。GitHub Pagesで公開されています。

## 概要

このプロジェクトは、YUI Protocolシステムの静的デモンストレーションを提供します。既存のsessionsとoutputsデータを使用して、AIエージェント間の対話を閲覧できる静的サイトです。

## 機能

- 📚 複数のセッションを閲覧
- 🤖 AIエージェント間の対話を表示
- 📱 レスポンシブデザイン
- 🔍 セッション検索・選択
- 📖 読み取り専用モード

## 技術スタック

- **React 18** - UIフレームワーク
- **TypeScript** - 型安全性
- **Vite** - ビルドツール
- **Tailwind CSS** - スタイリング
- **React Router** - ルーティング

## 開発

### セットアップ

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### ビルド

```bash
# 静的サイトをビルド
npm run build:static

# プレビュー
npm run preview:static
```

## デプロイ

### 自動デプロイ（推奨）

```bash
# GitHub Pagesに自動デプロイ
npm run deploy
```

このコマンドは以下を自動実行します：
1. 静的データのビルド
2. Viteでのビルド
3. gh-pagesブランチの作成/更新
4. GitHub Pagesへのプッシュ

### 手動デプロイ

1. `npm run build:static` でビルド
2. `dist-static/` の内容をgh-pagesブランチにコピー
3. GitHub Pagesの設定でgh-pagesブランチを選択

## GitHub Pages設定

1. リポジトリの **Settings** タブを開く
2. **Pages** セクションに移動
3. **Source** を "Deploy from a branch" に設定
4. **Branch** を "gh-pages" に設定
5. **Folder** を "/ (root)" に設定

## データ構造

### Sessions
- `sessions/` ディレクトリのJSONファイルを自動マージ
- セッション情報、エージェント、メッセージを含む

### Outputs
- `outputs/` ディレクトリのMarkdownファイルを自動マージ
- セッションの出力結果を含む

## 注意事項

- このサイトは読み取り専用です
- AI実行機能は無効化されています
- セッション作成・編集機能は利用できません
- 静的データのみを表示します

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。 