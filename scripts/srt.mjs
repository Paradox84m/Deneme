// reel.json'daki altyazılardan UTF-8 SRT üretir (bütün satırlar, aynı zamanlamalar).
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';

const reel = JSON.parse(readFileSync(new URL('../reel.json', import.meta.url), 'utf8'));

const ts = (s) => {
	const ms = Math.round(s * 1000);
	const p = (n, w = 2) => String(n).padStart(w, '0');
	return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

export function buildSrt() {
	return reel.subtitles.map((s, i) => `${i + 1}\n${ts(s.start)} --> ${ts(s.end)}\n${s.text}\n`).join('\n');
}

export function writeSrt(path = `out/${reel.output.name}.srt`) {
	mkdirSync('out', {recursive: true});
	writeFileSync(path, buildSrt(), {encoding: 'utf8'});
	return path;
}

if (import.meta.url === `file://${process.argv[1]}`) {
	console.log(writeSrt());
}
