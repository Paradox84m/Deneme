import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {INTER} from '../fonts';
import {C, FinaleScene as FinaleData, FPS, reel, SAFE} from '../data';
import {ZoomedListBoard} from './ListBoard';
import {HandBox} from '../components/HandBox';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Başlıkta "Sağlıkçılar Evi" geçen kısmı kırmızıyla vurgular
const Highlight: React.FC<{text: string; word: string}> = ({text, word}) => {
	const i = text.indexOf(word);
	if (i < 0) return <>{text}</>;
	return (
		<>
			{text.slice(0, i)}
			<span style={{color: C.red}}>{word}</span>
			{text.slice(i + word.length)}
		</>
	);
};

export const FinaleSceneView: React.FC<{scene: FinaleData}> = ({scene}) => {
	const frame = useCurrentFrame();
	const t = scene.start + frame / FPS;

	const zoom = interpolate(t, [scene.start, scene.closingAt - 0.3], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const questionFade = interpolate(t, [scene.start, scene.start + 0.6], [1, 0], clamp);

	// slogan ve neşter kesiği
	const sloganIn = interpolate(t, [scene.start + 0.25, scene.start + 0.75], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const cut = interpolate(t, [scene.start + 0.9, scene.start + 1.6], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	const sloganOut = interpolate(t, [scene.closingAt - 0.25, scene.closingAt], [1, 0], clamp);

	// kapanış kartı
	const cf = Math.round((t - scene.closingAt) * FPS);
	const cardIn = t >= scene.closingAt ? spring({frame: cf, fps: FPS, config: {damping: 15, stiffness: 120}}) : 0;
	const ctaIn = t >= scene.closingAt + 0.5 ? spring({frame: cf - Math.round(0.5 * FPS), fps: FPS, config: {damping: 11, stiffness: 160}}) : 0;
	const handleIn = interpolate(t, [scene.closingAt + 0.9, scene.closingAt + 1.3], [0, 1], clamp);

	const CUT_W = 760;
	const cutY = 745;

	return (
		<AbsoluteFill style={{backgroundColor: C.paper}}>
			<ZoomedListBoard t={t} zoom={zoom} questionFade={questionFade} />

			{/* slogan: arkasında kâğıt renginde yumuşak bir şerit, liste yazılarıyla karışmasın */}
			<AbsoluteFill style={{opacity: sloganIn * sloganOut}}>
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: 330,
						height: 520,
						background: `linear-gradient(180deg, rgba(250,247,240,0) 0%, ${C.paper} 18%, ${C.paper} 82%, rgba(250,247,240,0) 100%)`,
					}}
				/>
				<div
					style={{
						position: 'absolute',
						left: SAFE.left,
						width: SAFE.right - SAFE.left,
						top: 470,
						textAlign: 'center',
						fontFamily: INTER,
						fontWeight: 800,
						fontSize: 84,
						lineHeight: 1.16,
						color: C.night,
						transform: `translateY(${(1 - sloganIn) * 24}px)`,
						textShadow: `0 0 24px ${C.paper}, 0 0 12px ${C.paper}`,
					}}
				>
					{scene.slogan}
				</div>
				<svg width={1080} height={60} style={{position: 'absolute', left: 0, top: cutY - 30}}>
					<defs>
						<linearGradient id="cutGrad" x1="0" x2="1">
							<stop offset="0%" stopColor={C.red} stopOpacity={0.2} />
							<stop offset="15%" stopColor={C.red} />
							<stop offset="100%" stopColor={C.red} />
						</linearGradient>
					</defs>
					<path
						d={`M ${540 - CUT_W / 2} 30 Q 540 ${30 - 3} ${540 + CUT_W / 2} 30`}
						stroke="url(#cutGrad)"
						strokeWidth={5}
						strokeLinecap="round"
						fill="none"
						pathLength={1}
						strokeDasharray={1}
						strokeDashoffset={1 - cut}
					/>
					{cut > 0 && cut < 1 ? (
						<circle cx={540 - CUT_W / 2 + CUT_W * cut} cy={30} r={7} fill="#fff" opacity={0.9} />
					) : null}
				</svg>
			</AbsoluteFill>

			{/* kapanış kartı */}
			{cardIn > 0 ? (
				<AbsoluteFill style={{backgroundColor: C.blue, opacity: Math.min(1, cardIn * 1.6)}}>
					<AbsoluteFill
						style={{backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.045) 0 2px, transparent 2px 36px)'}}
					/>
					<div
						style={{
							position: 'absolute',
							left: SAFE.left,
							width: SAFE.right - SAFE.left,
							top: 400,
							padding: '70px 56px 64px',
							boxSizing: 'border-box',
							borderRadius: 40,
							background: C.paper,
							boxShadow: '0 30px 60px rgba(8,22,45,0.35)',
							transform: `translateY(${(1 - cardIn) * 160}px)`,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<div style={{position: 'relative', width: 96, height: 96, marginBottom: 46}}>
							<HandBox size={96} seed="closing-box" color={C.blue} strokeWidth={7} />
						</div>
						<div
							style={{
								fontFamily: INTER,
								fontWeight: 800,
								fontSize: 84,
								lineHeight: 1.14,
								color: C.night,
								textAlign: 'center',
							}}
						>
							<Highlight text={scene.closingTitle} word={reel.list.emptyItem} />
						</div>
						<div
							style={{
								marginTop: 54,
								padding: '24px 46px',
								borderRadius: 999,
								background: C.red,
								color: C.paper,
								fontFamily: INTER,
								fontWeight: 800,
								fontSize: 54,
								whiteSpace: 'nowrap',
								transform: `scale(${ctaIn})`,
							}}
						>
							{scene.closingCta}
						</div>
					</div>
					<div
						style={{
							position: 'absolute',
							left: SAFE.left,
							width: SAFE.right - SAFE.left,
							top: 1385,
							textAlign: 'center',
							fontFamily: INTER,
							fontWeight: 600,
							fontSize: 40,
							letterSpacing: 1,
							color: C.paper,
							opacity: handleIn * 0.9,
						}}
					>
						{scene.handle}
					</div>
				</AbsoluteFill>
			) : null}
		</AbsoluteFill>
	);
};
