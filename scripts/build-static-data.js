import fs from 'fs';
import path from 'path';

const sessionsDir = './sessions';
const outputsDir = './outputs';
const dataDir = './public/data';
const dataSessionsDir = path.join(dataDir, 'sessions');
const dataOutputsDir = path.join(dataDir, 'outputs');

// データディレクトリとサブディレクトリを作成
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(dataSessionsDir)) {
  fs.mkdirSync(dataSessionsDir, { recursive: true });
}
if (!fs.existsSync(dataOutputsDir)) {
  fs.mkdirSync(dataOutputsDir, { recursive: true });
}

// sessions/の各jsonをpublic/data/sessions/{id}.jsonとしてコピー
const sessionFiles = fs.readdirSync(sessionsDir).filter(file => file.endsWith('.json'));
let sessionCount = 0;
for (const file of sessionFiles) {
  try {
    const srcPath = path.join(sessionsDir, file);
    const destPath = path.join(dataSessionsDir, file);
    fs.copyFileSync(srcPath, destPath);
    sessionCount++;
  } catch (error) {
    console.error(`Error copying session file ${file}:`, error);
  }
}
console.log(`Copied ${sessionCount} session files to ${dataSessionsDir}`);
// index.jsonを出力
fs.writeFileSync(path.join(dataSessionsDir, 'index.json'), JSON.stringify(sessionFiles, null, 2));
console.log(`Created index.json with ${sessionFiles.length} session files`);

// outputs/の各mdをpublic/data/outputs/{filename}.mdとしてコピー
const outputFiles = fs.readdirSync(outputsDir).filter(file => file.endsWith('.md'));
let outputCount = 0;
for (const file of outputFiles) {
  try {
    const srcPath = path.join(outputsDir, file);
    const destPath = path.join(dataOutputsDir, file);
    fs.copyFileSync(srcPath, destPath);
    outputCount++;
  } catch (error) {
    console.error(`Error copying output file ${file}:`, error);
  }
}
console.log(`Copied ${outputCount} output files to ${dataOutputsDir}`); 