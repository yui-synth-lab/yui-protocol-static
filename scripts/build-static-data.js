import fs from 'fs';
import path from 'path';

// sessionsディレクトリからJSONファイルを読み込んでマージ
const sessionsDir = './sessions';
const outputsDir = './outputs';
const dataDir = './outputs/data';

// データディレクトリを作成
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// sessions.jsonを作成
const sessionFiles = fs.readdirSync(sessionsDir).filter(file => file.endsWith('.json'));
const sessions = [];

for (const file of sessionFiles) {
  try {
    const sessionData = JSON.parse(fs.readFileSync(path.join(sessionsDir, file), 'utf8'));
    sessions.push(sessionData);
  } catch (error) {
    console.error(`Error reading session file ${file}:`, error);
  }
}

// セッションを更新日時でソート（新しい順）
sessions.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

fs.writeFileSync(path.join(dataDir, 'sessions.json'), JSON.stringify(sessions, null, 2));
console.log(`Created sessions.json with ${sessions.length} sessions`);

// outputs.jsonを作成
const outputFiles = fs.readdirSync(outputsDir).filter(file => file.endsWith('.md'));
const outputs = {};

for (const file of outputFiles) {
  try {
    const content = fs.readFileSync(path.join(outputsDir, file), 'utf8');
    const filename = path.basename(file, '.md');
    outputs[filename] = content;
  } catch (error) {
    console.error(`Error reading output file ${file}:`, error);
  }
}

fs.writeFileSync(path.join(dataDir, 'outputs.json'), JSON.stringify(outputs, null, 2));
console.log(`Created outputs.json with ${Object.keys(outputs).length} outputs`); 