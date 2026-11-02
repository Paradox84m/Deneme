// "Bir kapı daha…" videosunu üretir: yazılı ve yazısız MP4 (sessiz), kapak, kontrol kareleri.
// Kullanım: npm run render:kapi
import {execFileSync} from 'node:child_process';
import {mkdirSync, readFileSync} from 'node:fs';

const kapi = JSON.parse(readFileSync(new URL('../kapi.json', import.meta.url), 'utf8'));
const name = kapi.output.name;
mkdirSync('out/kontrol', {recursive: true});

const browser = process.env.REMOTION_BROWSER;
const browserArgs = browser ? [`--browser-executable=${browser}`] : [];
const run = (args) => execFileSync('npx', ['remotion', ...args], {stdio: 'inherit'});

const videos = [
	['KapiYazili', `out/${name}.mp4`],
	['KapiYazisiz', `out/${name}-yazisiz.mp4`],
];
for (const [id, file] of videos) {
	run(['render', 'src/index.ts', id, file, '--codec=h264', '--crf=20', '--concurrency=4', '--muted', ...browserArgs]);
}
run(['still', 'src/index.ts', 'KapiKapak', `out/${name}-kapak.png`, ...browserArgs]);

for (const s of [1, 3, 7, 12, 15, 19, 21, 26, 29]) {
	execFileSync(
		'npx',
		['remotion', 'ffmpeg', '-v', 'error', '-y', '-ss', String(s), '-i', videos[0][1], '-frames:v', '1', `out/kontrol/${name}-${s}s.png`],
		{stdio: 'inherit'},
	);
}
console.log('Tamam: out/ klasörüne bak.');
