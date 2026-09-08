#!/usr/bin/env node
/*
 * Encrypts the AB-100 question bank so it can live in a public repo / on a
 * public GitHub Pages site without the questions being readable.
 *
 * Usage (interactive, password hidden, asked twice):
 *     node scripts/encrypt-bank.mjs
 *
 * Or pass the password directly (ends up in shell history / env — less safe;
 * prefix the line with a space if your shell has histignorespace):
 *     AB100_PW='your-password' node scripts/encrypt-bank.mjs
 *
 * Reads : courses/frontier-transformation-engineer/ab-100-bank.json   (plaintext, git-ignored)
 * Writes: courses/frontier-transformation-engineer/ab-100-bank.enc    (AES-256-GCM, committed)
 *
 * Scheme: PBKDF2-SHA256 (210k iterations) -> AES-256-GCM.
 * File layout (base64): salt(16) | iv(12) | ciphertext+tag
 * The browser (practice.qmd) reverses this with the Web Crypto API.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { pbkdf2Sync, randomBytes, createCipheriv } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'courses/frontier-transformation-engineer/ab-100-bank.json');
const OUT = join(ROOT, 'courses/frontier-transformation-engineer/ab-100-bank.enc');
const ITERATIONS = 210000;

const CR = '\r';
const LF = '\n';
const DEL = '\u007f';
const BS = '\u0008';
const EOT = '\u0004';
const ETX = '\u0003'; // Ctrl-C

/**
 * Read one or more hidden lines from a TTY. Handles chunked input and
 * CR / LF / CRLF line endings (the CRLF-double-delimiter bug is what made
 * "confirm password" always mismatch).
 */
function askHiddenLines(prompts) {
  return new Promise((resolve) => {
    const { stdin, stdout } = process;
    const lines = [];
    let buf = '';
    let stage = 0;
    let lastEnd = null;

    stdout.write(prompts[0]);
    stdin.resume();
    stdin.setRawMode(true);
    stdin.setEncoding('utf8');

    const finish = () => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener('data', onData);
      resolve(lines);
    };

    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ch === ETX) {
          stdout.write('\n');
          process.exit(130);
        }
        if (ch === CR || ch === LF || ch === EOT) {
          // treat CRLF (or LFCR) as a single line ending
          if ((ch === LF && lastEnd === CR) || (ch === CR && lastEnd === LF)) {
            lastEnd = null;
            continue;
          }
          lastEnd = ch;
          lines.push(buf);
          buf = '';
          stdout.write('\n');
          stage += 1;
          if (stage >= prompts.length) {
            finish();
            return;
          }
          stdout.write(prompts[stage]);
        } else {
          lastEnd = null;
          if (ch === DEL || ch === BS) buf = buf.slice(0, -1);
          else if (ch >= ' ') buf += ch;
        }
      }
    };

    stdin.on('data', onData);
  });
}

function readAllStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (d) => (data += d));
    process.stdin.on('end', () => resolve(data));
  });
}

async function getPassword() {
  if (process.env.AB100_PW) return process.env.AB100_PW;

  if (!process.stdin.isTTY) {
    const pw = (await readAllStdin()).split(/\r?\n/).find((l) => l.length);
    if (!pw) {
      console.error('Không đọc được mật khẩu từ stdin. Chạy trực tiếp trong terminal, hoặc dùng AB100_PW=...');
      process.exit(1);
    }
    return pw;
  }

  const [pw1, pw2] = await askHiddenLines(['Nhập mật khẩu: ', 'Nhập lại mật khẩu: ']);
  if (pw1.length < 6) {
    console.error('Mật khẩu quá ngắn (tối thiểu 6 ký tự).');
    process.exit(1);
  }
  if (pw1 !== pw2) {
    console.error(`Hai lần nhập không khớp (lần 1: ${pw1.length} ký tự, lần 2: ${pw2.length} ký tự).`);
    process.exit(1);
  }
  return pw1;
}

async function main() {
  if (!existsSync(SRC)) {
    console.error(`Không thấy ${SRC}\nCần file ab-100-bank.json (plaintext) để mã hoá.`);
    process.exit(1);
  }
  const plaintext = readFileSync(SRC);
  try {
    JSON.parse(plaintext.toString('utf8'));
  } catch {
    console.error('ab-100-bank.json không phải JSON hợp lệ.');
    process.exit(1);
  }

  const password = await getPassword();
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256');
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  const packed = Buffer.concat([salt, iv, ct, tag]).toString('base64');
  writeFileSync(OUT, packed);
  console.log(`OK — đã ghi ${OUT} (${(packed.length / 1024).toFixed(0)} KB base64).`);
  console.log('Commit file .enc này. KHÔNG commit ab-100-bank.json (đã git-ignore).');
}

main();
