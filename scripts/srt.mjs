// Reel dosyasındaki altyazılardan UTF-8 SRT üretir (bütün satırlar, aynı zamanlamalar).
// Kullanım: node scripts/srt.mjs [izin-gunu.json]
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';

const load = (path = 'reel.json') => JSON.parse(readFileSync(path, 'utf8'));

const ts = (s) => {
	const ms = Math.round(s * 1000);
	const p = (n, w = 2) => String(n).padStart(w, '0');
	return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

export function buildSrt(reel = load()) {
	return reel.subtitles.map((s, i) => `${i + 1}\n${ts(s.start)} --> ${ts(s.end)}\n${s.text}\n`).join('\n');
}

export function writeSrt(reel = load(), path = `out/${reel.output.name}.srt`) {
	mkdirSync('out', {recursive: true});
	writeFileSync(path, buildSrt(reel), {encoding: 'utf8'});
	return path;
}

if (import.meta.url === `file://${process.argv[1]}`) {
	console.log(writeSrt(load(process.argv[2])));
}
