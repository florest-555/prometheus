#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = '/home/italo/Laboratorio/Prometheus/src';

const EMOJI_MAP = {
  '📄': '[DOC]',
  '📋': '[LIST]',
  '⚠️': '[!]',
  '✂️': '[CLEAN]',
  '📸': '[PERF]',
  '✅': '[OK]',
  '🚨': '[!]',
  '🌱': '[*]',
  '🛡️': '[GUARD]',
  '📂': '[DIR]',
  '🔍': '[SCAN]',
  '🌐': '[ALL]',
  '📦': '[PKG]',
  '🚀': '[SYS]',
  '🔗': '[LINK]',
  '🛠️': '[FIX]',
  '📊': '[STATS]',
  '🎯': '[*]',
  '🔥': '[!]',
  '📌': '[*]',
  '🐘': '[PHP]',
  '🐍': '[PYTHON]',
  '🔌': '[PLUG]',
  '🔧': '[CONF]',
  '🧹': '[CLEAN]',
  '🚫': '[NO]',
  '🐘': '[PHP]',
  '🐍': '[PYTHON]',
  '🔌': '[PLUG]',
  '🔧': '[CONF]',
  '🌐': '[ALL]',
  '🧹': '[CLEAN]',
  '🚫': '[NO]',
  '📔': '[DOC]',
  '📝': '[EDIT]',
  '📐': '[MEASURE]',
  '🧪': '[TEST]',
  '🔍': '[SCAN]',
  '🤖': '[AGENT]',
  '🧠': '[AI]',
  '💬': '[MSG]',
  '🔔': '[NOTIFY]',
  '📅': '[DATE]',
  '⏰': '[TIME]',
  '🔒': '[LOCK]',
  '🔓': '[UNLOCK]',
  '💾': '[SAVE]',
  '🖥️': '[PC]',
  '📱': '[MOBILE]',
  '⌨️': '[KB]',
  '🖱️': '[MOUSE]',
  '🖨️': '[PRINT]',
  '📽️': '[VIDEO]',
  '🎞️': '[FILM]',
  '🎬': '[MOVIE]',
  '📺': '[TV]',
  '📷': '[PHOTO]',
  '📸': '[PERF]',
  '📹': '[VIDEO]',
  '📼': '[TAPE]',
  '🎨': '[ART]',
  '🧵': '[THREAD]',
  '🧶': '[YARN]',
  '🎼': '[MUSIC]',
  '🎹': '[PIANO]',
  '🥁': '[DRUM]',
  '🎸': '[GUITAR]',
  '🎻': '[VIOLIN]',
  '🎺': '[TRUMPET]',
  '🎷': '[SAX]',
  '🎸': '[GUITAR]',
  '🎻': '[VIOLIN]',
  '🎹': '[PIANO]',
  '🎺': '[TRUMPET]',
  '🎻': '[VIOLIN]',
  '🎺': '[TRUMPET]',
  '🎷': '[SAX]',
  '🎸': '[GUITAR]',
  '🎻': '[VIOLIN]',
  '🎹': '[PIANO]',
  '🎺': '[TRUMPET]',
  '🎻': '[VIOLIN]',
  '🎺': '[TRUMPET]',
  '🎷': '[SAX]',
  '🎸': '[GUITAR]',
  '🎻': '[VIOLIN]',
  '🎹': '[PIANO]',
  '🎺': '[TRUMPET]',
  '🎻': '[VIOLIN]',
  '🎺': '[TRUMPET]',
  '🎷': '[SAX]',
  '🎸': '[GUITAR]',
  '🎻': '[VIOLIN]',
  '🎹': '[PIANO]',
  '🎺': '[TRUMPET]',
  '🎻': '[VIOLIN]',
  '🎺': '[TRUMPET]',
  '🎷': '[SAX]',
  '🎸': '[GUITAR]',
  '🎻': '[VIOLIN]',
  '🎹': '[PIANO]',
  '🎺': '[TRUMPET]',
  '🎻': '[VIOLIN]',
  '🎺': '[TRUMPET]',
  '🎷': '[SAX]',
  '🎸': '[GUITAR]',
  '🎻': '[VIOLIN]',
  '🎹': '[PIANO]',
  '🎺': '[TRUMPET]',
  '🎻': '[VIOLIN]',
  '🎺': '[TRUMPET]',
  '🎷': '[SAX]',
  '🎸': '[GUITAR]',
  '🎻': '[VIOLIN]',
  '🎹': '[PIANO]',
  '🎺': '[TRUMPET]',
  '🎻': '[VIOLIN]',
  '🎺': '[TRUMPET]',
  '🎷': '[SAX]',
  '🎸': '[GUITAR]',
  '🎻': '[VIOLIN]',
  '🎹': '[PIANO]',
  '🎺': '[TRUMPET]',
  '🎻': '[VIOLIN]',
  '🎺': '[TRUMPET]',
  '🎷': '[SAX]',
  '🎸': '[GUITAR]',
  '🎻': '[VIOLIN]',
  '🎹': '[PIANO]',
  '🎺': '[TRUMPET]',
  '🎻': '[VIOLIN]',
  '🎺': '[TRUMPET]',
  '🎷': '[SAX]',
  '🎸': '[GUITAR]',
  '🎻': '[VIOLIN]',
  '🎹': '[PIANO]',
  '🎺': '[TRUMPET]',
  '🎻': '[VIOLIN]',
  '🎺': '[TRUMPET]',
  '🎷': '[SAX]',
  '🎸': '[GUITAR]',
  '🎻': '[VIOLIN]',
  '🎹': '[PIANO]',
  '🎺': '[TRUMPET]',
  '🎻': '[VIOLIN]',
  '🎺': '[TRUMPET]',
  '🎷': '[SAX]',
  '🎸': '[GUITAR]',
};

// Simplified map for most common ones found in grep
const COMMON_MAP = {
  '📄': '[DOC]',
  '📋': '[LIST]',
  '⚠️': '[!]',
  '✂️': '[CLEAN]',
  '📸': '[PERF]',
  '✅': '[OK]',
  '🚨': '[!]',
  '🌱': '[*]',
  '🛡️': '[GUARD]',
  '📂': '[DIR]',
  '🔍': '[SCAN]',
  '🌐': '[ALL]',
  '📦': '[PKG]',
  '🚀': '[SYS]',
  '🔗': '[LINK]',
  '🛠️': '[FIX]',
  '📊': '[STATS]',
  '🎯': '[*]',
  '🔥': '[!]',
  '📌': '[*]',
  '🐘': '[PHP]',
  '🐍': '[PYTHON]',
  '🔌': '[PLUG]',
  '🔧': '[CONF]',
  '🧹': '[CLEAN]',
  '🚫': '[NO]',
  '🧼': '[CLEAN]',
  '🔕': '[MUTE]',
  '🧽': '[CLEAN]',
  '🔄': '[SYNC]',
  '❌': '[ERR]',
  '❓': '[?]',
  '⚙️': '[CONF]',
  '🔒': '[LOCK]',
  '🌟': '[*]',
  '📁': '[DIR]',
  '💡': '[DICA]',
  '💾': '[SAVE]',
  '📝': '[EDIT]',
  '📅': '[DATE]',
  '💬': '[MSG]',
  '🌿': '[CLEAN]',
  '🧪': '[TEST]',
  '📚': '[DOC]',
  '🔴': '[ERR]',
  'ℹ️': '[INFO]',
  '⚡': '[FAST]',
  '✏️': '[EDIT]',
  '✓': '[OK]',
  '✗': '[FALHA]',
  '🤝': '[OK]',
  '🟡': '[!]',
  '🔵': '[INFO]',
  '👔': '[EXEC]',
  '🏗️': '[ARQ]',
  '✨': '[*]',
  '✔': '[OK]',
  '✘': '[FALHA]',
  '📋': '[LIST]',
  '🐂': '[KERN]',
  '💻': '[HW]',
  '💾': '[DISK]',
  '🌐': '[NET]',
  '📦': '[PKG]',
  '🔌': '[PORT]',
  '🔐': '[LOCK]',
  '🌀': '[SYNC]',
  '🧮': '[HASH]',
};

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walk(filepath, callback);
    } else if (stats.isFile()) {
      callback(filepath);
    }
  });
}

// Global ROOT_DIR to scan also kit/shell
const PROJ_ROOT = '/home/italo/Laboratorio/Prometheus';

const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;

function processFile(filepath) {
  if (filepath.endsWith('.ts') || filepath.endsWith('.js') || filepath.endsWith('.md') || filepath.endsWith('.sh') || filepath.endsWith('.mjs')) {
    let content = fs.readFileSync(filepath, 'utf8');
    let hasEmoji = emojiRegex.test(content);
    if (!hasEmoji) {
      // Check for simple symbols that regex might miss or variants
      for (const emoji of Object.keys(COMMON_MAP)) {
         if (content.includes(emoji)) {
           hasEmoji = true;
           break;
         }
      }
    }

    if (hasEmoji) {
      let newContent = content;
      
      // Pass for common and specific variants
      for (const [emoji, ascii] of Object.entries(COMMON_MAP)) {
        newContent = newContent.split(emoji).join(ascii);
        // Handle variation selector 16
        newContent = newContent.split(emoji + '\uFE0F').join(ascii);
      }
      
      // Generic regex pass for any remaining in range
      newContent = newContent.replace(emojiRegex, (match) => {
        return COMMON_MAP[match] || COMMON_MAP[match + '\u{FE0F}'] || ''; // Remove if unmapped
      });

      if (content !== newContent) {
        fs.writeFileSync(filepath, newContent, 'utf8');
        console.log(`Replaced emojis in: ${filepath}`);
      }
    }
  }
}

function scanDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    if (file === 'node_modules' || file === '.git' || file === 'dist') return;
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      scanDir(filepath);
    } else if (stats.isFile()) {
      processFile(filepath);
    }
  });
}

scanDir(PROJ_ROOT);
