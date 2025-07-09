import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting deployment to gh-pages...');

try {
  // 1. 静的データをビルド
  console.log('📦 Building static data...');
  execSync('node scripts/build-static-data.js', { stdio: 'inherit' });

  // 2. Viteでビルド
  console.log('🔨 Building with Vite...');
  execSync('vite build --config vite.config.static.ts', { stdio: 'inherit' });

  // 3. 現在のブランチを確認
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  console.log(`📍 Current branch: ${currentBranch}`);

  // 4. gh-pagesブランチが存在するかチェック
  const branches = execSync('git branch -a', { encoding: 'utf8' });
  const hasGhPages = branches.includes('gh-pages');

  if (!hasGhPages) {
    console.log('🌿 Creating gh-pages branch...');
    execSync('git checkout -b gh-pages', { stdio: 'inherit' });
  } else {
    console.log('🌿 Switching to gh-pages branch...');
    execSync('git checkout gh-pages', { stdio: 'inherit' });
  }

  // 5. 既存のファイルを削除（.git, node_modules, dist-static, sessions, .で始まるファイル/ディレクトリは除外）
  console.log('🧹 Cleaning gh-pages branch...');
  const files = fs.readdirSync('.');
  for (const file of files) {
    if (file === '.git' || file === 'node_modules' || file === 'dist-static' || file === 'sessions' || file.startsWith('.')) continue;
    if (fs.statSync(file).isDirectory()) {
      fs.rmSync(file, { recursive: true, force: true });
    } else {
      fs.unlinkSync(file);
    }
  }

  // 6. dist-staticの内容をコピー
  console.log('📋 Copying built files...');
  const distStaticPath = './dist-static';
  if (fs.existsSync(distStaticPath)) {
    const distFiles = fs.readdirSync(distStaticPath);
    for (const file of distFiles) {
      const srcPath = path.join(distStaticPath, file);
      const destPath = path.join('.', file);
      if (fs.statSync(srcPath).isDirectory()) {
        fs.cpSync(srcPath, destPath, { recursive: true });
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  // 7. outputsフォルダをコピー
  console.log('📁 Copying outputs folder...');
  const outputsPath = './outputs';
  if (fs.existsSync(outputsPath)) {
    fs.cpSync(outputsPath, './outputs', { recursive: true });
  }

  // 8. 変更をコミット
  console.log('💾 Committing changes...');
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Deploy static site to GitHub Pages"', { stdio: 'inherit' });

  // 9. gh-pagesブランチをプッシュ（自動pushはしない）
  console.log('🚦 Push is skipped. Please review and push manually: git push origin gh-pages');

  // 10. 元のブランチに戻る
  console.log(`🔄 Switching back to ${currentBranch}...`);
  execSync(`git checkout ${currentBranch}`, { stdio: 'inherit' });

  console.log('✅ Deployment completed (push skipped).');
  console.log('🌐 Your site will be available at: https://[your-username].github.io/yui-protocol-static/');
  console.log('📝 Don\'t forget to configure GitHub Pages in your repository settings:');
  console.log('   Settings > Pages > Source: Deploy from a branch > Branch: gh-pages > Folder: / (root)');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
} 