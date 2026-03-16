#!/usr/bin/env node

/**
 * 构建静态网站
 * 扫描所有简报文件，生成包含数据的 HTML
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BRIEFS_DIR = join(__dirname, '..', 'briefs');

function scanBriefs() {
  const files = readdirSync(BRIEFS_DIR);
  const briefs = {};
  
  for (const file of files) {
    if (!file.match(/^brief-\d{4}-\d{2}-\d{2}\.md$/)) continue;
    
    const content = readFileSync(join(BRIEFS_DIR, file), 'utf-8');
    briefs[file] = content;
  }
  
  return briefs;
}

function build() {
  console.error('📂 扫描简报文件...');
  const briefs = scanBriefs();
  console.error(`   找到 ${Object.keys(briefs).length} 份简报`);
  
  console.error('📄 读取模板...');
  const template = readFileSync(join(__dirname, 'index.html'), 'utf-8');
  
  console.error('🔧 生成数据...');
  const briefsJson = JSON.stringify(briefs);
  
  const html = template.replace('__BRIEFS_DATA__', briefsJson);
  
  const outputFile = join(__dirname, 'index.html');
  writeFileSync(outputFile, html);
  
  console.error(`✅ 构建完成：${outputFile}`);
  console.error('\n🌐 用浏览器打开查看，或运行:');
  console.error(`   npx serve website\n`);
}

build();
