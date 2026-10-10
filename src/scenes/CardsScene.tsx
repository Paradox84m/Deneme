import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {fitText} from '@remotion/layout-utils';
import {INTER} from '../fonts';
import {C, CardsScene as CardsData, FPS, SAFE, trUpper} from '../data';
import {useFontsReady} from '../useFontsReady';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const CardsSceneView: React.FC<{scene: CardsData}> = ({scene}) => {
	const frame = useCurrentFrame();
	const t = scene.start + frame / FPS;
	const ready = useFontsReady();

	const exit = interpolate(t, [scene.questionAt, scene.questionAt + 0.15], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});

	// "NEREDE KALACAĞIM?": her satır güvenli alana (900 px) sığacak boyutta
	const lines = useMemo(() => trUpper(scene.question).split(' '), [scene.question]);
	const qFont = useMemo(() => {
		if (!ready) return 120;
		const w = SAFE.right - SAFE.left - 20;
		return Math.min(
			150,
			...lines.map((l) => fitText({text: l, withinWidth: w, fontFamily: INTER, fontWeight: '900', validateFontIsLoaded: true}).fontSize),
		);
	}, [ready, lines]);
	const qFrame = Math.round((t - scene.questionAt - 0.1) * FPS);
	const qIn = t >= scene.questionAt + 0.1 ? spring({frame: qFrame, fps: FPS, config: {damping: 13, stiffness: 140}}) : 0;

	const CARD_W = 640;
	const CARD_H = 190;
	const GAP = 44;
	const top0 = 520;

	return (
		<AbsoluteFill style={{backgroundColor: C.blue}}>
			<AbsoluteFill
				style={{
					backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.045) 0 2px, transparent 2px 36px)',
				}}
			/>
			{scene.cards.map((label, i) => {
				const at = scene.cardsAt + i * scene.cardInterval;
				const f = Math.round((t - at) * FPS);
				const inP = t >= at ? spring({frame: f, fps: FPS, config: {damping: 14, stiffness: 150}}) : 0;
				const rot = [-2.2, 1.6, -1.2][i % 3];
				const dir = i % 2 === 0 ? -1 : 1;
				return (
					<div
						key={label}
						style={{
							position: 'absolute',
							left: 540 - CARD_W / 2,
							top: top0 + i * (CARD_H + GAP),
							width: CARD_W,
							height: CARD_H,
							borderRadius: 28,
							background: C.paper,
							boxShadow: '0 22px 40px rgba(8,22,45,0.35)',
							display: 'flex',
							alignItems: 'center',
							overflow: 'hidden',
							opacity: inP * (1 - exit),
							transform: `translate(${dir * exit * 140}px, ${(1 - inP) * 90 + exit * 40}px) rotate(${rot + dir * exit * 8}deg) scale(${1 - exit * 0.12})`,
						}}
					>
						<div style={{width: 22, alignSelf: 'stretch', background: C.red}} />
						<div
							style={{
								flex: 1,
								textAlign: 'center',
								fontFamily: INTER,
								fontWeight: 800,
								fontSize: 92,
								color: C.night,
								paddingRight: 22,
							}}
						>
							{label}
						</div>
					</div>
				);
			})}

			{qIn > 0 ? (
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 90}}>
					<div
						style={{
							fontFamily: INTER,
							fontWeight: 900,
							fontSize: qFont,
							lineHeight: 1.12,
							color: C.paper,
							textAlign: 'center',
							transform: `scale(${0.7 + 0.3 * qIn})`,
							opacity: Math.min(1, qIn * 1.5),
							textShadow: '0 10px 30px rgba(8,22,45,0.35)',
						}}
					>
						{lines.map((l, i) => (
							<div key={i} style={{whiteSpace: 'nowrap'}}>
								{i === lines.length - 1 && l.endsWith('?') ? (
									<>
										{l.slice(0, -1)}
										<span style={{color: C.red, WebkitTextStroke: `4px ${C.paper}`, paintOrder: 'stroke fill'}}>?</span>
									</>
								) : (
									l
								)}
							</div>
						))}
					</div>
				</AbsoluteFill>
			) : null}
		</AbsoluteFill>
	);
};
