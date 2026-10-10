import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {fitText} from '@remotion/layout-utils';
import {INTER} from '../fonts';
import {C, FPS, NightScene as NightData, SAFE} from '../data';
import {useFontsReady} from '../useFontsReady';

const GROUND = 1180;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Stars: React.FC<{t: number}> = ({t}) => (
	<>
		{Array.from({length: 46}).map((_, i) => {
			const x = random(`sx${i}`) * 1080;
			const y = 250 + random(`sy${i}`) * 300;
			const r = 1.5 + random(`sr${i}`) * 2.5;
			const tw = 0.45 + 0.55 * Math.abs(Math.sin(t * (0.8 + random(`st${i}`) * 1.6) + i));
			return <circle key={i} cx={x} cy={y} r={r} fill={C.paper} opacity={0.25 + 0.5 * tw} />;
		})}
	</>
);

const Hospital: React.FC<{t: number}> = ({t}) => {
	const x0 = 110;
	const x1 = 470;
	const top = 560;
	const cols = 4;
	const rows = 6;
	const ww = 58;
	const wh = 58;
	const gx = (x1 - x0 - cols * ww) / (cols + 1);
	return (
		<g>
			{/* yan kanat */}
			<rect x={x0 - 20} y={top + 230} width={60} height={GROUND - top - 230} fill="#1A2D4A" />
			<rect x={x0} y={top} width={x1 - x0} height={GROUND - top} fill="#22385A" />
			<rect x={x0 - 12} y={top - 26} width={x1 - x0 + 24} height={30} fill="#2B4469" />
			{Array.from({length: rows}).map((_, r) =>
				Array.from({length: cols}).map((__, c) => {
					const lit = random(`w${r}-${c}`) > 0.28;
					const flicker = lit ? 0.85 + 0.15 * Math.sin(t * 3 + r * 2 + c) : 1;
					const x = x0 + gx + c * (ww + gx);
					const y = top + 40 + r * (wh + 30);
					return (
						<rect
							key={`${r}-${c}`}
							x={x}
							y={y}
							width={ww}
							height={wh}
							rx={4}
							fill={lit ? '#F4D27A' : '#16263F'}
							opacity={flicker}
							filter={lit ? 'url(#glow)' : undefined}
						/>
					);
				}),
			)}
			{/* giriş */}
			<rect x={(x0 + x1) / 2 - 60} y={GROUND - 120} width={120} height={120} fill="#F4D27A" opacity={0.9} filter="url(#glow)" />
			<rect x={(x0 + x1) / 2 - 90} y={GROUND - 140} width={180} height={22} fill="#2B4469" />
		</g>
	);
};

// Elinde çantayla yürüyen sade siluet. Ayak tabanı (0,0)'da.
const Walker: React.FC<{phase: number; walking: number}> = ({phase, walking}) => {
	const swing = Math.sin(phase) * 22 * walking;
	const bob = Math.abs(Math.cos(phase)) * 5 * walking;
	const fill = '#060C16';
	return (
		<g transform={`translate(0 ${-bob})`}>
			{/* bacaklar */}
			<g transform={`translate(0 -125) rotate(${swing})`}>
				<rect x={-12} y={0} width={24} height={128} rx={12} fill={fill} />
			</g>
			<g transform={`translate(0 -125) rotate(${-swing})`}>
				<rect x={-12} y={0} width={24} height={128} rx={12} fill={fill} />
			</g>
			{/* gövde */}
			<rect x={-34} y={-262} width={68} height={150} rx={28} fill={fill} />
			{/* boş kol */}
			<g transform={`translate(0 -245) rotate(${swing * 0.8})`}>
				<rect x={-11} y={0} width={22} height={112} rx={11} fill={fill} />
			</g>
			{/* çantalı kol */}
			<g transform={`translate(8 -245) rotate(${-swing * 0.35})`}>
				<rect x={-11} y={0} width={22} height={112} rx={11} fill={fill} />
				<g transform={`translate(0 112) rotate(${swing * 0.35})`}>
					<path d="M -14 4 Q 0 -16 14 4" stroke={fill} strokeWidth={6} fill="none" />
					<rect x={-38} y={2} width={76} height={58} rx={8} fill={fill} />
				</g>
			</g>
			{/* baş */}
			<circle cx={4} cy={-298} r={32} fill={fill} />
		</g>
	);
};

export const NightSceneView: React.FC<{scene: NightData}> = ({scene}) => {
	const frame = useCurrentFrame();
	const t = scene.start + frame / FPS;
	const ready = useFontsReady();

	const doorW = 160;
	const signW = 216;
	const doorCenters = [646, 872];
	const signFont = useMemo(() => {
		if (!ready) return 30;
		return Math.min(
			38,
			...scene.doors.map(
				(d) => fitText({text: d, withinWidth: signW - 24, fontFamily: INTER, fontWeight: '700', validateFontIsLoaded: true}).fontSize,
			),
		);
	}, [ready, scene.doors]);

	const doorsIn = interpolate(t, [scene.doorsAt, scene.doorsAt + 0.45], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.4))});
	const lights = interpolate(t, [scene.doorsAt + 0.35, scene.doorsAt + 0.55], [0, 1], clamp);

	// siluet: soldan gelip Orduevi kapısına yürür, içeri girer
	const walkStart = scene.start;
	const arrive = scene.end - 1.6;
	const xStart = -90;
	const xEnd = doorCenters[0];
	const x = interpolate(t, [walkStart, arrive], [xStart, xEnd], clamp);
	const walking = t < arrive ? 1 : interpolate(t, [arrive, arrive + 0.25], [1, 0], clamp);
	const phase = (t - walkStart) * Math.PI * 2 * 0.95;
	const enter = interpolate(t, [arrive + 0.2, arrive + 1.0], [1, 0], clamp);

	const labelIn = interpolate(t, [scene.start + 0.2, scene.start + 0.6], [0, 1], clamp);

	return (
		<AbsoluteFill style={{background: `linear-gradient(180deg, ${C.night} 0%, #142540 62%, #1B2F4E 100%)`}}>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<defs>
					<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur stdDeviation="7" result="b" />
						<feMerge>
							<feMergeNode in="b" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
					<radialGradient id="spill" cx="50%" cy="0%" r="100%">
						<stop offset="0%" stopColor="#F4D27A" stopOpacity={0.45} />
						<stop offset="100%" stopColor="#F4D27A" stopOpacity={0} />
					</radialGradient>
				</defs>
				<Stars t={t} />
				{/* ay */}
				<circle cx={880} cy={430} r={58} fill={C.paper} opacity={0.92} />
				<circle cx={904} cy={414} r={52} fill="#122239" />
				<Hospital t={t} />

				{/* sağdaki iki kapı */}
				{scene.doors.map((label, i) => {
					const cx = doorCenters[i];
					const doorTop = GROUND - 300;
					return (
						<g key={label} opacity={doorsIn > 0 ? Math.min(1, doorsIn) : 0} transform={`translate(${cx} ${GROUND}) scale(${0.6 + 0.4 * doorsIn}) translate(${-cx} ${-GROUND})`}>
							<polygon
								points={`${cx - doorW / 2},${GROUND} ${cx + doorW / 2},${GROUND} ${cx + doorW},${GROUND + 160} ${cx - doorW},${GROUND + 160}`}
								fill="url(#spill)"
								opacity={lights}
							/>
							<rect x={cx - doorW / 2 - 14} y={doorTop - 14} width={doorW + 28} height={314} rx={6} fill="#2B4469" />
							<rect x={cx - doorW / 2} y={doorTop} width={doorW} height={300} fill={lights > 0 ? '#F4D27A' : '#101D31'} opacity={0.35 + 0.65 * lights} filter={lights > 0.5 ? 'url(#glow)' : undefined} />
							<line x1={cx} x2={cx} y1={doorTop} y2={GROUND} stroke="#2B4469" strokeWidth={6} />
							<circle cx={cx - 18} cy={doorTop + 160} r={6} fill="#2B4469" />
							<circle cx={cx + 18} cy={doorTop + 160} r={6} fill="#2B4469" />
						</g>
					);
				})}

				{/* zemin */}
				<rect x={0} y={GROUND} width={1080} height={1920 - GROUND} fill="#0A1322" opacity={0.85} />
				<line x1={0} x2={1080} y1={GROUND} y2={GROUND} stroke="#2B4469" strokeWidth={4} />

				<g transform={`translate(${x} ${GROUND})`} opacity={enter}>
					<Walker phase={phase} walking={walking} />
				</g>
			</svg>

			{/* kapı tabelaları (HTML: gerçek yazı tipiyle) */}
			{scene.doors.map((label, i) => (
				<div
					key={label}
					style={{
						position: 'absolute',
						left: doorCenters[i] - signW / 2,
						top: GROUND - 300 - 14 - 92,
						width: signW,
						height: 76,
						borderRadius: 12,
						background: C.paper,
						color: C.night,
						fontFamily: INTER,
						fontWeight: 700,
						fontSize: signFont,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						whiteSpace: 'nowrap',
						opacity: doorsIn > 0 ? Math.min(1, doorsIn) : 0,
						transform: `scale(${0.6 + 0.4 * doorsIn})`,
						boxShadow: `0 0 ${36 * lights}px rgba(244,210,122,${0.6 * lights})`,
					}}
				>
					{label}
				</div>
			))}

			{/* sol üst etiket */}
			<div
				style={{
					position: 'absolute',
					left: SAFE.left,
					top: SAFE.top + 10,
					padding: '14px 30px',
					borderRadius: 999,
					border: `3px solid rgba(250,247,240,0.55)`,
					color: C.paper,
					fontFamily: INTER,
					fontWeight: 700,
					fontSize: 44,
					opacity: labelIn,
					transform: `translateY(${(1 - labelIn) * -20}px)`,
				}}
			>
				{scene.label}
			</div>
		</AbsoluteFill>
	);
};
