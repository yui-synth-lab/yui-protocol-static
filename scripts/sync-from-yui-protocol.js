import fs from 'fs';
import path from 'path';

// ソースリポジトリのパス
const sourceRepo = 'E:\\Projects\\Git\\github\\yui-protocol';
const sourceSessions = path.join(sourceRepo, 'sessions');
const sourceOutputs = path.join(sourceRepo, 'outputs');

// コピー先のパス
const destSessions = './sessions';
const destOutputs = './outputs';

// コピー先ディレクトリを作成
if (!fs.existsSync(destSessions)) {
  fs.mkdirSync(destSessions, { recursive: true });
}
if (!fs.existsSync(destOutputs)) {
  fs.mkdirSync(destOutputs, { recursive: true });
}

// sessionsフォルダの存在確認とコピー
let sessionCount = 0;
if (fs.existsSync(sourceSessions)) {
  const sessionFiles = fs.readdirSync(sourceSessions).filter(file => file.endsWith('.json'));
  for (const file of sessionFiles) {
    try {
      const srcPath = path.join(sourceSessions, file);
      const destPath = path.join(destSessions, file);
      fs.copyFileSync(srcPath, destPath);
      sessionCount++;
    } catch (error) {
      console.error(`Error copying session file ${file}:`, error);
    }
  }
  console.log(`✓ Copied ${sessionCount} session files from ${sourceSessions} to ${destSessions}`);
} else {
  console.warn(`⚠ Source sessions directory not found: ${sourceSessions}`);
}

// outputフォルダの存在確認とコピー
let outputCount = 0;
if (fs.existsSync(sourceOutputs)) {
  const outputFiles = fs.readdirSync(sourceOutputs).filter(file => file.endsWith('.md'));
  for (const file of outputFiles) {
    try {
      const srcPath = path.join(sourceOutputs, file);
      const destPath = path.join(destOutputs, file);
      fs.copyFileSync(srcPath, destPath);
      outputCount++;
    } catch (error) {
      console.error(`Error copying output file ${file}:`, error);
    }
  }
  console.log(`✓ Copied ${outputCount} output files from ${sourceOutputs} to ${destOutputs}`);
} else {
  console.warn(`⚠ Source outputs directory not found: ${sourceOutputs}`);
}

console.log('\nSync completed!');
console.log(`Total: ${sessionCount} sessions, ${outputCount} outputs`);
