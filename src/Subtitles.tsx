import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {measureText} from '@remotion/layout-utils';
import {INTER} from './fonts';
import {FPS, isShownOnScreen, reel, SAFE, Subtitle} from './data';
import {useFontsReady} from './useFontsReady';

const PAD_X = 34;
const PAD_Y = 16;
const LINE_H = 1.22;
const BOX_MAX_W = SAFE.right - SAFE.left;

type Page = {start: number; end: number; lines: string[]};

// Kelimeleri gerçek yazı tipi genişliğiyle satırlara böler.
function wrap(text: string, fontSize: number) {
	const maxW = BOX_MAX_W - PAD_X * 2;
	const w = (s: string) =>
		measureText({text: s, fontFamily: INTER, fontSize, fontWeight: '700', validateFontIsLoaded: true}).width;
	const lines: string[] = [];
	let cur = '';
	for (const word of text.split(/\s+/)) {
		const next = cur ? `${cur} ${word}` : word;
		if (cur && w(next) > maxW) {
			lines.push(cur);
			cur = word;
		} else {
			cur = next;
		}
	}
	if (cur) lines.push(cur);
	return lines;
}

// En fazla maxLines satırlık sayfalara böler; metin değişmez, süre karakter sayısına göre paylaştırılır.
function paginate(sub: Subtitle, fontSize: number, maxLines: number): Page[] {
	const lines = wrap(sub.text, fontSize);
	if (lines.length <= maxLines) return [{start: sub.start, end: sub.end, lines}];
	const groups: string[][] = [];
	const pageCount = Math.ceil(lines.length / maxLines);
	// sayfaları dengeli dağıt (ör. 3 satır → 2 + 1 yerine kelime bazında yeniden dengele)
	const words = sub.text.split(/\s+/);
	const perPage = Math.ceil(words.length / pageCount);
	for (let p = 0; p < pageCount; p++) {
		const chunk = words.slice(p * perPage, (p + 1) * perPage).join(' ');
		if (chunk) groups.push(wrap(chunk, fontSize));
	}
	// dengeli bölme bir sayfayı 2 satırdan fazlaya taşırsa açgözlü bölmeye dön
	const pages = groups.some((g) => g.length > maxLines)
		? Array.from({length: pageCount}, (_, p) => lines.slice(p * maxLines, (p + 1) * maxLines))
		: groups;
	const total = pages.reduce((n, g) => n + g.join(' ').length, 0);
	let t = sub.start;
	return pages.map((g) => {
		const d = ((sub.end - sub.start) * g.join(' ').length) / total;
		const page = {start: t, end: t + d, lines: g};
		t += d;
		return page;
	});
}

export const Subtitles: React.FC = () => {
	const frame = useCurrentFrame();
	const ready = useFontsReady();
	const {fontSize, maxLines} = reel.subtitleStyle;

	const pages = useMemo(() => {
		if (!ready) return [];
		return reel.subtitles.filter((s) => !isShownOnScreen(s)).flatMap((s) => paginate(s, fontSize, maxLines));
	}, [ready, fontSize, maxLines]);

	const t = frame / FPS;
	const page = pages.find((p) => t >= p.start && t < p.end);
	if (!page) return null;

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: SAFE.left,
					width: BOX_MAX_W,
					bottom: 1920 - SAFE.bottom,
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<div
					style={{
						padding: `${PAD_Y}px ${PAD_X}px`,
						borderRadius: 22,
						background: 'rgba(10, 18, 32, 0.72)',
						color: '#FFFFFF',
						fontFamily: INTER,
						fontWeight: 700,
						fontSize,
						lineHeight: LINE_H,
						textAlign: 'center',
						maxWidth: BOX_MAX_W,
						boxSizing: 'border-box',
					}}
				>
					{page.lines.map((l, i) => (
						<div key={i} style={{whiteSpace: 'nowrap'}}>
							{l}
						</div>
					))}
				</div>
			</div>
		</AbsoluteFill>
	);
};
