import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {fitText} from '@remotion/layout-utils';
import {INTER} from './fonts';
import {C, reel, SAFE, trUpper} from './data';
import {Paper} from './components/Paper';
import {HandBox} from './components/HandBox';
import {useFontsReady} from './useFontsReady';

// Kapak: "NEDEN / SAĞLIKÇILAR / EVİ YOK?" ve altında boş kutu
function coverLines(title: string) {
	const words = trUpper(title).split(' ');
	if (words.length < 3) return [words.join(' ')];
	const longest = words.reduce((a, b) => (b.length > a.length ? b : a));
	const i = words.indexOf(longest);
	return [words.slice(0, i).join(' '), longest, words.slice(i + 1).join(' ')].filter(Boolean);
}

export const Cover: React.FC = () => {
	const ready = useFontsReady();
	const lines = useMemo(() => coverLines(reel.cover.title), []);
	const fontSize = useMemo(() => {
		if (!ready) return 130;
		const w = SAFE.right - SAFE.left - 20;
		return Math.min(
			170,
			...lines.map((l) => fitText({text: l, withinWidth: w, fontFamily: INTER, fontWeight: '900', validateFontIsLoaded: true}).fontSize),
		);
	}, [ready, lines]);

	return (
		<Paper>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 60}}>
				<div
					style={{
						fontFamily: INTER,
						fontWeight: 900,
						fontSize,
						lineHeight: 1.08,
						color: C.night,
						textAlign: 'center',
					}}
				>
					{lines.map((l, i) => {
						const last = i === lines.length - 1;
						return (
							<div key={i} style={{whiteSpace: 'nowrap', color: i === 1 ? C.blue : C.night}}>
								{last && l.endsWith('?') ? (
									<>
										{l.slice(0, -1)}
										<span style={{color: C.red}}>?</span>
									</>
								) : (
									l
								)}
							</div>
						);
					})}
				</div>
				<div style={{position: 'relative', width: 230, height: 230, marginTop: 110}}>
					<HandBox size={230} seed="cover-box" color={C.night} strokeWidth={11} />
				</div>
			</AbsoluteFill>
		</Paper>
	);
};
