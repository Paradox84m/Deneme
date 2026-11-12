import React from 'react';
import {AbsoluteFill, interpolate, random, spring} from 'remotion';
import {INTER} from '../../fonts';
import {IC, IFPS, S, Shot, buzz, clamp, izin} from '../data';
import {BuzzLines, IncomingCall, Phone, PHONE_H, PHONE_W} from '../Phone';

const trUpper = (s: string) => s.toLocaleUpperCase('tr-TR');

// Kuşbakışı kahvaltı masası
const Breakfast: React.FC = () => (
	<AbsoluteFill style={{background: '#B98A5E'}}>
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
			{Array.from({length: 22}).map((_, i) => {
				const y = i * 92 + random(`wg${i}`) * 30;
				return (
					<path
						key={i}
						d={`M 0 ${y} Q 270 ${y + 18 * (random(`wa${i}`) - 0.5)} 540 ${y} T 1080 ${y}`}
						stroke="#A97A50"
						strokeWidth={4 + random(`ww${i}`) * 4}
						fill="none"
						opacity={0.7}
					/>
				);
			})}
			{/* tabak ve sahanda yumurta */}
			<circle cx={300} cy={420} r={230} fill="#F4F1EA" />
			<circle cx={300} cy={420} r={180} fill="none" stroke="#E2DCCF" strokeWidth={6} />
			<path d="M 210 380 Q 240 300 330 320 Q 410 330 400 420 Q 390 500 300 500 Q 200 495 210 380 Z" fill="#FFFDF8" />
			<circle cx={300} cy={405} r={44} fill="#F2B233" />
			<circle cx={288} cy={393} r={12} fill="#F7CD6A" />
			{/* çay bardağı, tabağıyla */}
			<circle cx={820} cy={330} r={120} fill="#F4F1EA" />
			<circle cx={820} cy={330} r={78} fill="#E8E3D8" />
			<circle cx={820} cy={330} r={62} fill="#A3341F" />
			<circle cx={800} cy={312} r={14} fill="#C9553A" opacity={0.7} />
			<rect x={900} y={300} width={110} height={14} rx={7} fill="#B8BEC8" transform="rotate(-20 900 300)" />
			{/* peynir, zeytin, ekmek */}
			<rect x={560} y={1500} width={210} height={130} rx={18} fill="#FBF6E6" transform="rotate(8 660 1560)" />
			{[0, 1, 2, 3, 4].map((i) => (
				<ellipse key={i} cx={860 + (i % 3) * 52} cy={1530 + Math.floor(i / 3) * 52} rx={24} ry={18} fill="#2B2A26" />
			))}
			<path d="M 80 1460 Q 120 1380 260 1400 Q 400 1420 400 1520 Q 390 1640 240 1650 Q 90 1650 80 1560 Z" fill="#D9A55E" />
			<path d="M 120 1480 Q 150 1430 250 1440 Q 350 1455 350 1525 Q 340 1600 240 1605 Q 130 1605 120 1545 Z" fill="#F1DDB3" />
		</svg>
	</AbsoluteFill>
);

// Koltuk minderi, battaniye ve kumanda
const Couch: React.FC = () => (
	<AbsoluteFill style={{background: '#6F7F95'}}>
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
			<defs>
				<pattern id="fabric" width={14} height={14} patternUnits="userSpaceOnUse">
					<rect width={14} height={14} fill="#6F7F95" />
					<rect width={7} height={7} fill="#6A7A90" />
				</pattern>
			</defs>
			<rect width={1080} height={1920} fill="url(#fabric)" />
			{/* minder dikişleri */}
			<rect x={-40} y={140} width={1160} height={760} rx={70} fill="none" stroke="#5D6C81" strokeWidth={10} />
			<rect x={-40} y={960} width={1160} height={900} rx={70} fill="none" stroke="#5D6C81" strokeWidth={10} />
			{/* battaniye köşesi */}
			<path d="M 640 1920 L 1080 1340 L 1080 1920 Z" fill={IC.red} opacity={0.9} />
			{Array.from({length: 6}).map((_, i) => (
				<line key={i} x1={700 + i * 70} y1={1920} x2={1080} y2={1420 + i * 92} stroke="#A11F31" strokeWidth={8} />
			))}
			{/* kumanda */}
			<g transform="translate(150 1450) rotate(-18)">
				<rect x={0} y={0} width={110} height={360} rx={40} fill="#22252B" />
				<circle cx={55} cy={60} r={18} fill={IC.red} />
				{[0, 1, 2, 3, 4, 5].map((i) => (
					<circle key={i} cx={32 + (i % 2) * 46} cy={130 + Math.floor(i / 2) * 56} r={14} fill="#4A4F58" />
				))}
			</g>
		</svg>
	</AbsoluteFill>
);

const ShotView: React.FC<{shot: Shot; t: number}> = ({shot, t}) => {
	const b = buzz(t, shot.start + 0.05, 1.2);
	const punch = interpolate(t, [shot.start, shot.start + 0.25], [1.08, 1], clamp);
	const PS = 0.62;
	const rot = shot.kind === 'breakfast' ? -7 : 6;
	const cx = 540;
	const cy = shot.kind === 'breakfast' ? 980 : 880;
	return (
		<AbsoluteFill style={{transform: `scale(${punch})`}}>
			{shot.kind === 'breakfast' ? <Breakfast /> : <Couch />}
			<div
				style={{
					position: 'absolute',
					left: cx - (PHONE_W * PS) / 2,
					top: cy - (PHONE_H * PS) / 2,
					width: PHONE_W * PS,
					height: PHONE_H * PS,
					transform: `rotate(${rot}deg)`,
				}}
			>
				<div style={{transform: `scale(${PS})`, transformOrigin: '0 0'}}>
					<Phone shakeX={(b.x / PS) * 0.7} shakeR={b.r} shadow="0 30px 50px rgba(0,0,0,0.4)">
						<IncomingCall caller={izin.caller} clock={shot.clock} date={shot.date} t={t} />
					</Phone>
				</div>
				<BuzzLines on={b.on} w={PHONE_W * PS} h={PHONE_H * PS} color={IC.paper} />
			</div>
		</AbsoluteFill>
	);
};

export const FlashbacksView: React.FC<{t: number}> = ({t}) => {
	const f = S.flashbacks;
	const shot = f.shots.find((s) => t >= s.start && t < s.end) ?? f.shots[f.shots.length - 1];
	const qf = Math.round((t - f.questionAt) * IFPS);
	const qIn = t >= f.questionAt ? spring({frame: qf, fps: IFPS, config: {damping: 12, stiffness: 150}}) : 0;
	const dim = interpolate(t, [f.questionAt - 0.1, f.questionAt + 0.3], [0, 0.62], clamp);
	const words = trUpper(f.question).split(' ');
	// "BU AY" / "KAÇINCI?"
	const lines = words.length > 2 ? [words.slice(0, -1).join(' '), words[words.length - 1]] : words;
	return (
		<AbsoluteFill>
			<ShotView shot={shot} t={t} />
			<AbsoluteFill style={{background: `rgba(15,27,45,${dim})`}} />
			{qIn > 0 ? (
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 120}}>
					<div
						style={{
							fontFamily: INTER,
							fontWeight: 900,
							fontSize: 160,
							lineHeight: 1.05,
							color: IC.paper,
							textAlign: 'center',
							transform: `scale(${0.7 + 0.3 * qIn})`,
							opacity: Math.min(1, qIn * 1.5),
							textShadow: '0 12px 36px rgba(0,0,0,0.45)',
						}}
					>
						{lines.map((l, i) => (
							<div key={i} style={{whiteSpace: 'nowrap'}}>
								{l.endsWith('?') ? (
									<>
										{l.slice(0, -1)}
										<span style={{color: IC.red, WebkitTextStroke: `5px ${IC.paper}`, paintOrder: 'stroke fill'}}>?</span>
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
