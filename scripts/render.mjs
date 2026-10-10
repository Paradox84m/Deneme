// Bütün çıktıları üretir: altyazılı ve temiz MP4 (sessiz), SRT, kapak, kontrol kareleri.
// Kullanım: npm run render
import {execFileSync} from 'node:child_process';
import {mkdirSync, readFileSync} from 'node:fs';
import {writeSrt} from './srt.mjs';

const reel = JSON.parse(readFileSync(new URL('../reel.json', import.meta.url), 'utf8'));
const name = reel.output.name;
mkdirSync('out/kontrol', {recursive: true});

// Remotion kendi Chrome'unu indirir; istenirse REMOTION_BROWSER ile başka bir tarayıcı verilebilir.
const browser = process.env.REMOTION_BROWSER;
const browserArgs = browser ? [`--browser-executable=${browser}`] : [];

const run = (args) => execFileSync('npx', ['remotion', ...args], {stdio: 'inherit'});

const videos = [
	['ReelAltyazili', `out/${name}-altyazili.mp4`],
	['ReelTemiz', `out/${name}-temiz.mp4`],
];
for (const [id, file] of videos) {
	run(['render', 'src/index.ts', id, file, '--codec=h264', '--muted', ...browserArgs]);
}
run(['still', 'src/index.ts', 'Kapak', 'out/kapak.png', ...browserArgs]);
console.log('SRT:', writeSrt());

// Ses kanalı kontrolü
for (const [, file] of videos) {
	const out = execFileSync('npx', ['remotion', 'ffprobe', '-v', 'error', '-show_entries', 'stream=codec_type', '-of', 'csv=p=0', file], {
		encoding: 'utf8',
	});
	const types = out.split('\n').map((t) => t.replace(/,/g, '').trim()).filter(Boolean);
	const audio = types.filter((t) => t.trim() === 'audio').length;
	console.log(`${file}: akışlar [${types.join(', ')}] → ${audio === 0 ? 'ses kanalı YOK ✓' : 'SES KANALI VAR ✗'}`);
	if (audio) process.exitCode = 1;
}

// Kontrol kareleri
for (const s of [1, 9, 17, 24, 30]) {
	execFileSync(
		'npx',
		['remotion', 'ffmpeg', '-v', 'error', '-y', '-ss', String(s), '-i', videos[0][1], '-frames:v', '1', `out/kontrol/kare-${s}s.png`],
		{stdio: 'inherit'},
	);
}
console.log('Kontrol kareleri: out/kontrol/');
