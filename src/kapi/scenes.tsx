import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame} from 'remotion';
import {INTER} from '../fonts';
import {H, K, KC, map, proj, pts, ramp, rnd, W} from './k';
import {DoorShot, Glass, TableDefs, TeaGlass, TeaTable} from './parts';

type P = [number, number];

// =====================================================================
// SAHNE 1 | 0-5 sn | Karanlık koridor, uçta kapı altından sızan ışık
// =====================================================================

export const Corridor: React.FC<{t: number}> = ({t}) => {
	const frame = useCurrentFrame();
	const f = 430;
	const cx = 540;
	const cy = 900;
	const Wd = 1.5;
	const C = -1.6;
	const F = 1.4;
	const zn = 0.3;
	const zf = 5;
	const p = (X: number, Y: number, z: number) => proj(X, Y, z, f, cx, cy);
	const quad = (a: [number, number, number][]) => pts(a.map(([X, Y, z]) => p(X, Y, z)));

	const lit = ramp(t, 1.0, 2.6, Easing.inOut(Easing.quad));
	const zoom = 1 + 0.5 * ramp(t, 0.8, 5.0, Easing.inOut(Easing.sin));
	const sway = Math.sin(t * 1.3) * 0.25;

	// ilk tüp titreyerek yanar, üçüncüsü bozuk
	const flick = t > 1.05 && t < 1.9 ? (rnd(frame * 3.1) > 0.45 ? 1 : 0.15) : t >= 1.9 ? 1 : 0;
	const panels = [
		{z: 1.2, on: flick},
		{z: 2.4, on: lit},
		{z: 3.6, on: 0.08},
		{z: 4.6, on: lit * 0.8},
	];

	const [dl] = p(-0.42, F, zf);
	const [dr, dy] = p(0.42, F, zf);
	// kapının arkasında dolaşan birinin ayak gölgesi
	const feet = map(t, [0.2, 4.6], [0.15, 0.62]);

	return (
		<AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `scale(${zoom}) rotate(${sway}deg)`, transformOrigin: `${cx}px ${cy}px`}}>
				<svg width={W} height={H}>
					<defs>
						<filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
							<feGaussianBlur stdDeviation="18" />
						</filter>
						<filter id="glowS" x="-100%" y="-100%" width="300%" height="300%">
							<feGaussianBlur stdDeviation="5" />
						</filter>
						<linearGradient id="floorG" x1="0" y1="1" x2="0" y2="0">
							<stop offset="0%" stopColor="#3a3f38" />
							<stop offset="100%" stopColor="#6d7466" />
						</linearGradient>
						<linearGradient id="wallL" x1="0" x2="1">
							<stop offset="0%" stopColor="#2e3b38" />
							<stop offset="100%" stopColor="#5d6f69" />
						</linearGradient>
						<linearGradient id="wallR" x1="1" x2="0">
							<stop offset="0%" stopColor="#2a3533" />
							<stop offset="100%" stopColor="#56675f" />
						</linearGradient>
					</defs>
					<g opacity={lit * 0.92}>
						<polygon points={quad([[-Wd, C, zn], [Wd, C, zn], [Wd, C, zf], [-Wd, C, zf]])} fill="#3c4744" />
						<polygon points={quad([[-Wd, F, zn], [Wd, F, zn], [Wd, F, zf], [-Wd, F, zf]])} fill="url(#floorG)" />
						{/* karo derzleri */}
						{[0.6, 0.9, 1.3, 1.8, 2.4, 3.1, 4.0].map((z) => (
							<polyline key={z} points={pts([p(-Wd, F, z), p(Wd, F, z)])} stroke="rgba(0,0,0,0.25)" strokeWidth={2} />
						))}
						{[-1, -0.5, 0, 0.5, 1].map((X) => (
							<polyline key={X} points={pts([p(X, F, zn), p(X, F, zf)])} stroke="rgba(0,0,0,0.2)" strokeWidth={2} />
						))}
						<polygon points={quad([[-Wd, C, zn], [-Wd, C, zf], [-Wd, F, zf], [-Wd, F, zn]])} fill="url(#wallL)" />
						<polygon points={quad([[Wd, C, zn], [Wd, C, zf], [Wd, F, zf], [Wd, F, zn]])} fill="url(#wallR)" />
						{/* süpürgelik */}
						<polygon points={quad([[-Wd, F - 0.12, zn], [-Wd, F - 0.12, zf], [-Wd, F, zf], [-Wd, F, zn]])} fill="#1f2624" />
						<polygon points={quad([[Wd, F - 0.12, zn], [Wd, F - 0.12, zf], [Wd, F, zf], [Wd, F, zn]])} fill="#1f2624" />
						{/* yan kapılar */}
						{[
							{X: -Wd, z1: 1.5, z2: 2.0},
							{X: Wd, z1: 2.7, z2: 3.15},
							{X: -Wd, z1: 3.7, z2: 4.0},
						].map((d, i) => (
							<g key={i}>
								<polygon points={quad([[d.X, -0.8, d.z1], [d.X, -0.8, d.z2], [d.X, F, d.z2], [d.X, F, d.z1]])} fill="#26302e" />
								<polygon points={quad([[d.X, -0.55, d.z1 + 0.15], [d.X, -0.55, d.z1 + 0.28], [d.X, 0.1, d.z1 + 0.28], [d.X, 0.1, d.z1 + 0.15]])} fill="#11181a" />
							</g>
						))}
						{/* kalorifer peteği */}
						<polygon points={quad([[Wd, 0.55, 1.1], [Wd, 0.55, 1.75], [Wd, 1.15, 1.75], [Wd, 1.15, 1.1]])} fill="#c9cdc5" opacity={0.55} />
						{Array.from({length: 9}).map((_, i) => {
							const z = 1.1 + (i + 0.5) * (0.65 / 9);
							return <polyline key={i} points={pts([p(Wd, 0.55, z), p(Wd, 1.15, z)])} stroke="rgba(0,0,0,0.35)" strokeWidth={3} />;
						})}
						{/* boş sedye, sol duvar dibinde */}
						<polygon points={quad([[-Wd + 0.1, 0.62, 2.3], [-Wd + 0.75, 0.62, 2.3], [-Wd + 0.75, 0.62, 3.3], [-Wd + 0.1, 0.62, 3.3]])} fill="#d7dcd6" opacity={0.6} />
						<polygon points={quad([[-Wd + 0.1, 0.62, 2.3], [-Wd + 0.75, 0.62, 2.3], [-Wd + 0.75, 0.74, 2.3], [-Wd + 0.1, 0.74, 2.3]])} fill="#8e948f" opacity={0.7} />
						{[2.35, 3.25].map((z) => (
							<polyline key={z} points={pts([p(-Wd + 0.42, 0.74, z), p(-Wd + 0.42, F - 0.05, z)])} stroke="#555" strokeWidth={4} />
						))}
						{/* bitiş duvarı ve kapı */}
						<polygon points={quad([[-Wd, C, zf], [Wd, C, zf], [Wd, F, zf], [-Wd, F, zf]])} fill="#2b3432" />
						<polygon points={quad([[-0.46, -0.8, zf], [0.46, -0.8, zf], [0.46, F, zf], [-0.46, F, zf]])} fill="#1a2120" />
						<polygon points={quad([[-0.4, -0.74, zf], [0.4, -0.74, zf], [0.4, F, zf], [-0.4, F, zf]])} fill="#3b4744" />
						{/* tavan lambaları */}
						{panels.map((pn, i) => (
							<g key={i} opacity={pn.on}>
								<polygon points={quad([[-0.32, C, pn.z - 0.22], [0.32, C, pn.z - 0.22], [0.32, C, pn.z + 0.22], [-0.32, C, pn.z + 0.22]])} fill="#e9f7ee" filter="url(#glowS)" />
								<polygon points={quad([[-0.32, C, pn.z - 0.22], [0.32, C, pn.z - 0.22], [0.32, C, pn.z + 0.22], [-0.32, C, pn.z + 0.22]])} fill="#f4fff8" />
								{(() => {
									const [x, y] = p(0, F, pn.z + 0.3);
									const r = (1.0 * f) / (pn.z + 0.3);
									return <ellipse cx={x} cy={y} rx={r} ry={r * 0.22} fill="rgba(200,235,215,0.22)" filter="url(#glow)" />;
								})()}
								{(() => {
									const [x, y] = p(0, C + 0.6, pn.z);
									const r = (1.2 * f) / pn.z;
									return <ellipse cx={x} cy={y} rx={r} ry={r * 0.55} fill="rgba(190,230,210,0.10)" filter="url(#glow)" />;
								})()}
							</g>
						))}
					</g>
					{/* kapı altındaki ışık şeridi: sahnenin tek sıcak noktası */}
					<ellipse cx={(dl + dr) / 2} cy={dy + 6} rx={(dr - dl) * 0.95} ry={14} fill={KC.warm} opacity={0.55} filter="url(#glow)" />
					<rect x={dl} y={dy - 3} width={dr - dl} height={4} fill="#ffd9a6" />
					<rect x={dl + (dr - dl) * feet} y={dy - 3.5} width={(dr - dl) * 0.09} height={5} fill="#120d08" />
					<rect x={dl + (dr - dl) * (feet + 0.14)} y={dy - 3.5} width={(dr - dl) * 0.09} height={5} fill="#120d08" />
				</svg>
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 55% at 50% 47%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.75) 100%)'}} />
		</AbsoluteFill>
	);
};

// =====================================================================
// SAHNE 2 | 5-10 sn | Kapı açılıyor, içeride çay
// =====================================================================

export const DoorOpening: React.FC<{t: number}> = ({t}) => {
	if (t < 8.5) {
		return <DoorShot t={t} start={5} color="#8fa39a" handleAt={5.6} open={[6.4, 8.0]} push={[1.0, 1.35]} />;
	}
	const glasses: Glass[] = [
		{x: 420, y: 640, hot: true},
		{x: 700, y: 820, hot: true},
	];
	const zoom = map(t, [8.5, 10], [1.0, 1.06]);
	const fade = ramp(t, 8.5, 8.68);
	return (
		<AbsoluteFill style={{opacity: fade, backgroundColor: '#000'}}>
			<TeaTable t={t} glasses={glasses} paper={{at: 8.75}} zoom={zoom} />
		</AbsoluteFill>
	);
};

// =====================================================================
// SAHNE 3 | 10-16 sn | Servis servis, kurum kurum
// =====================================================================

const NightDesk: React.FC<{t: number}> = ({t}) => {
	const zoom = map(t, [10.7, 11.4], [1.04, 1.0]);
	const scribble = (x: number, y: number, w: number, seed: number) => {
		let d = `M ${x} ${y}`;
		for (let i = 1; i <= 12; i++) d += ` L ${x + (w * i) / 12} ${y + (rnd(seed + i) - 0.5) * 10}`;
		return d;
	};
	return (
		<AbsoluteFill style={{backgroundColor: '#0c0b0a', transform: `scale(${zoom})`}}>
			<svg width={W} height={H}>
				<TableDefs />
				<defs>
					<radialGradient id="lamp" cx="45%" cy="45%" r="55%">
						<stop offset="0%" stopColor="rgba(255,214,160,0.55)" />
						<stop offset="100%" stopColor="rgba(0,0,0,0)" />
					</radialGradient>
					<radialGradient id="chest" cx="35%" cy="35%">
						<stop offset="0%" stopColor="#ffffff" />
						<stop offset="60%" stopColor="#9da3a8" />
						<stop offset="100%" stopColor="#4b5055" />
					</radialGradient>
				</defs>
				<rect width={W} height={H} fill="#3a2c22" />
				<g transform="rotate(-8 540 900)">
					<rect x={150} y={520} width={390} height={560} fill="#e9e2d2" />
					<rect x={545} y={520} width={390} height={560} fill="#efe9db" />
					<rect x={536} y={520} width={12} height={560} fill="rgba(0,0,0,0.25)" />
					{Array.from({length: 11}).map((_, i) => (
						<React.Fragment key={i}>
							<path d={scribble(185, 580 + i * 44, 300 - rnd(i) * 90, i * 13)} stroke="rgba(30,40,90,0.55)" strokeWidth={4} fill="none" />
							<path d={scribble(580, 580 + i * 44, 300 - rnd(i + 50) * 120, i * 17 + 5)} stroke="rgba(30,40,90,0.55)" strokeWidth={4} fill="none" />
						</React.Fragment>
					))}
				</g>
				{/* stetoskop */}
				<path d="M 120 1600 C 300 1450, 260 1250, 520 1210 S 860 1260, 900 1080" stroke="#151515" strokeWidth={22} fill="none" strokeLinecap="round" />
				<path d="M 120 1600 C 300 1450, 260 1250, 520 1210 S 860 1260, 900 1080" stroke="rgba(255,255,255,0.18)" strokeWidth={5} fill="none" strokeLinecap="round" transform="translate(-4 -6)" />
				<path d="M 900 1080 C 930 980, 860 900, 800 880 M 900 1080 C 980 1000, 1010 930, 990 860" stroke="#b9bec2" strokeWidth={9} fill="none" strokeLinecap="round" />
				<circle cx={120} cy={1620} r={70} fill="url(#chest)" />
				<circle cx={120} cy={1620} r={48} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={4} />
				{/* yarım kalmış çay */}
				<TeaGlass g={{x: 860, y: 1500, hot: false, drunk: 0.55}} t={t} i={3} scale={0.95} />
				<rect x={330} y={1360} width={360} height={18} rx={9} fill="#1b3f8f" transform="rotate(-20 510 1369)" />
				<rect width={W} height={H} fill="url(#lamp)" style={{mixBlendMode: 'screen'}} />
			</svg>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 45% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%)'}} />
		</AbsoluteFill>
	);
};

const RainEntrance: React.FC<{t: number}> = ({t}) => {
	const pulse = 0.5 + 0.5 * Math.sin(t * 9);
	return (
		<AbsoluteFill style={{backgroundColor: '#0a0f15'}}>
			<svg width={W} height={H}>
				<defs>
					<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#0b1420" />
						<stop offset="100%" stopColor="#1f2a36" />
					</linearGradient>
					<linearGradient id="refl" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="rgba(255,226,180,0.55)" />
						<stop offset="100%" stopColor="rgba(255,226,180,0)" />
					</linearGradient>
					<filter id="soft2">
						<feGaussianBlur stdDeviation="3" />
					</filter>
					<filter id="blurR" x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur stdDeviation="16" />
					</filter>
				</defs>
				<rect width={W} height={1260} fill="url(#sky)" />
				<g filter="url(#soft2)" opacity={0.85}>
				<rect x={-40} y={420} width={1160} height={840} fill="#1a2027" />
				{Array.from({length: 5}).map((_, r) =>
					Array.from({length: 7}).map((__, c) => {
						const on = rnd(r * 7 + c) > 0.55;
						return (
							<rect key={`${r}-${c}`} x={40 + c * 148} y={480 + r * 110} width={90} height={60} fill={on ? (rnd(r + c * 3) > 0.5 ? '#f2d7a4' : '#bcd3d6') : '#0f1419'} opacity={on ? 0.75 : 1} />
						);
					}),
				)}
				</g>
				{/* giriş saçağı ve camlı kapı */}
				<rect x={240} y={1040} width={600} height={34} fill="#d9d4c9" />
				<rect x={330} y={1074} width={420} height={186} fill="#e9dcc0" opacity={0.9} />
				<rect x={538} y={1074} width={4} height={186} fill="#555" />
				<rect x={240} y={1060} width={600} height={210} fill="#ffe7bf" opacity={0.35} filter="url(#blurR)" />
				{/* ıslak zemin ve yansımalar */}
				<rect x={0} y={1260} width={W} height={660} fill="#0d1216" />
				<rect x={320} y={1262} width={440} height={520} fill="url(#refl)" filter="url(#blurR)" />
				<ellipse cx={130} cy={1200} rx={70} ry={70} fill="#ff2d2d" opacity={0.25 + 0.4 * pulse} filter="url(#blurR)" />
				<rect x={90} y={1262} width={80} height={380} fill="#ff2d2d" opacity={0.12 + 0.18 * pulse} filter="url(#blurR)" />
				{Array.from({length: 150}).map((_, i) => {
					const x = rnd(i) * 1120 - 20;
					const y = (rnd(i + 500) * 2000 + t * 2600) % 2000 - 60;
					return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 70} stroke="rgba(200,220,240,0.32)" strokeWidth={2} />;
				})}
			</svg>
		</AbsoluteFill>
	);
};

const Signature: React.FC<{t: number}> = ({t}) => {
	const draw = ramp(t, 12.85, 13.45, Easing.inOut(Easing.quad));
	const len = 1400;
	return (
		<AbsoluteFill style={{backgroundColor: '#efe9dc'}}>
			<svg width={W} height={H}>
				<defs>
					<radialGradient id="paperL" cx="30%" cy="25%" r="90%">
						<stop offset="0%" stopColor="rgba(255,240,215,0.5)" />
						<stop offset="100%" stopColor="rgba(60,40,20,0.45)" />
					</radialGradient>
				</defs>
				{[0, 1, 2, 3, 4, 5].map((k) => (
					<rect key={k} x={140} y={420 + k * 70} width={800 - (k % 3) * 160} height={14} fill="rgba(60,60,70,0.16)" />
				))}
				<rect x={140} y={1230} width={560} height={4} fill="rgba(60,60,70,0.4)" />
				<path
					d="M 190 1190 C 230 1080, 300 1060, 270 1180 S 300 1240, 350 1150 S 420 1080, 430 1170 S 470 1210, 520 1140 C 540 1110, 580 1120, 590 1160 S 640 1190, 700 1120 C 730 1090, 760 1100, 800 1080"
					stroke="#1b3f8f"
					strokeWidth={7}
					fill="none"
					strokeLinecap="round"
					strokeDasharray={len}
					strokeDashoffset={len * (1 - draw)}
				/>
				<rect width={W} height={H} fill="url(#paperL)" />
			</svg>
		</AbsoluteFill>
	);
};

// Masadaki bardaklar: 4, sonra 10
const GLASS_POS: [number, number][] = [
	[300, 520], [720, 470], [520, 760], [860, 840], [230, 1000], [640, 1110], [400, 1320], [860, 1300], [180, 1560], [620, 1560],
];

export const ServiceCuts: React.FC<{t: number}> = ({t}) => {
	if (t < 10.7) return <DoorShot t={t} start={10} color="#6f8aa3" knocks={[10.12, 10.3]} push={[1.12, 1.08]} windowGlow={0.4} />;
	if (t < 11.4) return <NightDesk t={t} />;
	if (t < 12.1) return <RainEntrance t={t} />;
	if (t < 12.8) return <DoorShot t={t} start={12.1} color="#a39a85" open={[12.1, 12.75]} push={[1.0, 1.15]} />;
	if (t < 13.5) return <Signature t={t} />;
	if (t < 14.2) {
		const g = GLASS_POS.slice(0, 4).map(([x, y]) => ({x, y, hot: true}));
		return <TeaTable t={t} glasses={g} scale={0.9} papers={1} />;
	}
	const g = GLASS_POS.map(([x, y], i) => ({x, y, hot: i % 3 !== 1, drunk: i % 4 === 2 ? 0.4 : 0}));
	const zoom = map(t, [14.2, 16], [1.08, 1.0]);
	return <TeaTable t={t} glasses={g} scale={0.78} papers={4} zoom={zoom} />;
};

// =====================================================================
// SAHNE 4 | 16-22 sn | Salonun kapısı, ışıklar yanıyor, sandalyeler
// =====================================================================

const ROWS = Array.from({length: 9}).map((_, k) => 1.4 + k * 0.75);
const SEATS = [-3.0, -2.45, -1.9, -1.35, -0.8, 0.8, 1.35, 1.9, 2.45, 3.0];
const LIGHT_Z = [2.0, 3.5, 5.0, 6.5, 8.0];
const LIGHT_X = [-2.0, 0, 2.0];

export const HallView: React.FC<{light: number[]; camX: number; camZ: number; window?: number}> = ({light, camX, camZ, window = 1}) => {
	const f = 560;
	const cx = 540;
	const cy = 760;
	const Fl = 1.6;
	const Ce = -2.6;
	const Wx = 3.5;
	const zEnd = 9.2;
	const p = (X: number, Y: number, z: number) => proj(X - camX, Y, Math.max(z - camZ, 0.05), f, cx, cy);
	const quad = (a: [number, number, number][]) => pts(a.map(([X, Y, z]) => p(X, Y, z)));
	const L = light.reduce((a, b) => a + b, 0) / light.length;
	const zNear = camZ + 0.35;

	return (
		<AbsoluteFill style={{backgroundColor: '#050505', overflow: 'hidden'}}>
			<svg width={W} height={H}>
				<defs>
					<filter id="dof" x="-30%" y="-30%" width="160%" height="160%">
						<feGaussianBlur stdDeviation="9" />
					</filter>
					<filter id="hglow" x="-100%" y="-100%" width="300%" height="300%">
						<feGaussianBlur stdDeviation="14" />
					</filter>
					<linearGradient id="hallFloor" x1="0" y1="1" x2="0" y2="0">
						<stop offset="0%" stopColor="#4a3a30" />
						<stop offset="100%" stopColor="#7a6553" />
					</linearGradient>
				</defs>
				<polygon points={quad([[-Wx, Ce, zNear], [Wx, Ce, zNear], [Wx, Ce, zEnd], [-Wx, Ce, zEnd]])} fill="#cfc6b6" />
				<polygon points={quad([[-Wx, Fl, zNear], [Wx, Fl, zNear], [Wx, Fl, zEnd], [-Wx, Fl, zEnd]])} fill="url(#hallFloor)" />
				<polygon points={quad([[-Wx, Ce, zNear], [-Wx, Ce, zEnd], [-Wx, Fl, zEnd], [-Wx, Fl, zNear]])} fill="#b9ab95" />
				<polygon points={quad([[Wx, Ce, zNear], [Wx, Ce, zEnd], [Wx, Fl, zEnd], [Wx, Fl, zNear]])} fill="#a99b86" />
				{/* ahşap lambri */}
				<polygon points={quad([[-Wx, 0.4, zNear], [-Wx, 0.4, zEnd], [-Wx, Fl, zEnd], [-Wx, Fl, zNear]])} fill="#7b5636" />
				<polygon points={quad([[Wx, 0.4, zNear], [Wx, 0.4, zEnd], [Wx, Fl, zEnd], [Wx, Fl, zNear]])} fill="#6f4d30" />
				{/* arka duvar, sahne, masa, kürsü */}
				<polygon points={quad([[-Wx, Ce, zEnd], [Wx, Ce, zEnd], [Wx, Fl, zEnd], [-Wx, Fl, zEnd]])} fill="#8a7a66" />
				<polygon points={quad([[-2.6, -1.9, zEnd], [2.6, -1.9, zEnd], [2.6, 0.9, zEnd], [-2.6, 0.9, zEnd]])} fill="#e7e2d8" />
				<polygon points={quad([[-Wx, 1.1, 7.6], [Wx, 1.1, 7.6], [Wx, 1.1, zEnd], [-Wx, 1.1, zEnd]])} fill="#5e432c" />
				<polygon points={quad([[-Wx, 1.1, 7.6], [Wx, 1.1, 7.6], [Wx, Fl, 7.6], [-Wx, Fl, 7.6]])} fill="#3c2a1c" />
				<polygon points={quad([[-2.2, 0.35, 8.3], [0.5, 0.35, 8.3], [0.5, 1.1, 8.3], [-2.2, 1.1, 8.3]])} fill="#f1eee8" />
				<polygon points={quad([[-2.2, 0.35, 8.3], [0.5, 0.35, 8.3], [0.5, 0.35, 8.7], [-2.2, 0.35, 8.7]])} fill="#ffffff" />
				<polygon points={quad([[1.25, -0.15, 8.0], [1.95, -0.15, 8.0], [1.95, 1.1, 8.0], [1.25, 1.1, 8.0]])} fill="#6b4428" />
				<polygon points={quad([[1.2, -0.2, 8.0], [2.0, -0.2, 8.0], [2.0, -0.12, 8.3], [1.2, -0.12, 8.3]])} fill="#8a5c38" />
				{/* sandalyeler, uzaktan yakına */}
				{[...ROWS].reverse().map((z) => {
					const dz = z - camZ;
					if (dz < 0.32) return null;
					const blur = dz < 1.1;
					return (
						<g key={z} filter={blur ? 'url(#dof)' : undefined}>
							{SEATS.map((X) => (
								<g key={X}>
									<polygon points={quad([[X - 0.23, 0.95, z + 0.1], [X + 0.23, 0.95, z + 0.1], [X + 0.23, Fl, z + 0.1], [X - 0.23, Fl, z + 0.1]])} fill="#2a1a17" />
									<polygon points={quad([[X - 0.24, 0.5, z], [X + 0.24, 0.5, z], [X + 0.24, 1.0, z], [X - 0.24, 1.0, z]])} fill="#6e2a2e" />
									<polygon points={quad([[X - 0.24, 0.5, z], [X + 0.24, 0.5, z], [X + 0.24, 0.56, z], [X - 0.24, 0.56, z]])} fill="#9a4a4c" />
								</g>
							))}
						</g>
					);
				})}
				{/* karartma: ışık yandıkça açılır */}
				<rect width={W} height={H} fill="#030406" opacity={0.93 * (1 - L)} />
				{/* pencerelerden sızan perdeli gün ışığı */}
				{[2.4, 4.4, 6.4].map((z) => (
					<polygon key={z} points={quad([[-Wx, -1.8, z], [-Wx, -1.8, z + 0.9], [-Wx, 0.2, z + 0.9], [-Wx, 0.2, z]])} fill="#c7d6e6" opacity={(0.3 + 0.25 * (1 - L)) * window} />
				))}
				{/* tavan spotları */}
				{LIGHT_Z.map((z, k) =>
					LIGHT_X.map((X) => {
						const dz = z - camZ;
						if (dz < 0.4) return null;
						const [x, y] = p(X, Ce, z);
						const r = (0.13 * f) / dz;
						return (
							<g key={`${z}-${X}`}>
								<ellipse cx={x} cy={y} rx={r * 1.4} ry={r * 0.5} fill="#2b2b2b" />
								<ellipse cx={x} cy={y} rx={r * 1.25} ry={r * 0.42} fill="#fff6e0" opacity={light[k]} />
								<ellipse cx={x} cy={y + r} rx={r * 4} ry={r * 2} fill="#ffe2b0" opacity={light[k] * 0.35} filter="url(#hglow)" />
							</g>
						);
					}),
				)}
				<rect width={W} height={H} fill="rgba(255,170,90,0.10)" opacity={L} style={{mixBlendMode: 'soft-light'}} />
			</svg>
		</AbsoluteFill>
	);
};

const hallLights = (t: number) => {
	const frame = Math.round(t * 24);
	return LIGHT_Z.map((_, k) => {
		const at = 17.35 + k * 0.17;
		if (t < at) return 0;
		if (t < at + 0.12) return rnd(frame * 7 + k) > 0.5 ? 1 : 0.2;
		return 1;
	});
};

export const hallCam = (t: number) => ({
	camX: map(t, [17.3, 20.0, 22.0], [-0.45, 0.1, 0.35]),
	camZ: map(t, [17.3, 20.0], [0, 0.35]) + 1.25 * ramp(t, 20.0, 22.0, Easing.inOut(Easing.sin)),
});

export const Hall: React.FC<{t: number}> = ({t}) => {
	if (t < 17.3) {
		// salon kapısı açılıyor, kamera içeri giriyor
		const open = ramp(t, 16.25, 17.0, Easing.inOut(Easing.cubic));
		const through = ramp(t, 16.8, 17.3, Easing.in(Easing.quad));
		const fadeIn = ramp(t, 16.0, 16.3);
		return (
			<AbsoluteFill style={{backgroundColor: '#000', opacity: fadeIn}}>
				<AbsoluteFill style={{transform: `scale(${1 + through * 2.2})`, transformOrigin: '540px 900px'}}>
					<AbsoluteFill style={{background: 'linear-gradient(170deg, #3f4847, #1d2322)'}} />
					<div style={{position: 'absolute', left: 230, top: 420, width: 620, height: 1100, overflow: 'hidden', perspective: 1600}}>
						<div style={{position: 'absolute', left: -230, top: -420, width: W, height: H}}>
							<HallView light={[0, 0, 0, 0, 0]} camX={-0.45} camZ={0} />
						</div>
						{[0, 1].map((s) => (
							<div
								key={s}
								style={{
									position: 'absolute',
									top: 0,
									left: s === 0 ? 0 : 310,
									width: 310,
									height: 1100,
									transformOrigin: s === 0 ? '0% 50%' : '100% 50%',
									transform: `rotateY(${(s === 0 ? 1 : -1) * open * 100}deg)`,
									background: 'linear-gradient(160deg, #6a4a32, #3b281b)',
									boxShadow: 'inset 0 0 60px rgba(0,0,0,0.6)',
								}}
							>
								<div style={{position: 'absolute', top: 520, [s === 0 ? 'right' : 'left']: 24, width: 16, height: 140, borderRadius: 8, background: 'linear-gradient(90deg, #888, #eee, #888)'} as React.CSSProperties} />
							</div>
						))}
					</div>
					<div style={{position: 'absolute', left: 200, top: 390, width: 680, height: 1130, border: '30px solid #4e4a44', borderBottom: 'none', boxSizing: 'border-box'}} />
				</AbsoluteFill>
			</AbsoluteFill>
		);
	}
	const {camX, camZ} = hallCam(t);
	return <HallView light={hallLights(t)} camX={camX} camZ={camZ} />;
};

// =====================================================================
// SAHNE 5 | 22-30 sn | Logo ve davet
// =====================================================================

export const Invite: React.FC<{t: number; titleSize: number}> = ({t, titleSize}) => {
	const iv = K.invite;
	const bgIn = ramp(t, iv.logoUpAt - 0.1, iv.logoUpAt + 0.6);
	const logoIn = ramp(t, iv.logoAt, iv.logoAt + 0.8, Easing.out(Easing.cubic));
	const up = ramp(t, iv.logoUpAt, iv.logoUpAt + 0.6, Easing.inOut(Easing.cubic));
	const size = 560 + (300 - 560) * up;
	const cyLogo = 860 + (420 - 860) * up;
	const sweep = map(t, [iv.logoAt + 0.6, iv.logoAt + 1.5], [-1.2, 1.2]);
	const fadeLine = (at: number) => ramp(t, at, at + 0.45, Easing.out(Easing.cubic));
	const titleIn = fadeLine(iv.titleAt);
	const dateIn = fadeLine(iv.dateAt);
	const placeIn = fadeLine(iv.placeAt);
	const closeIn = fadeLine(iv.closingAt);
	const dim = 1 - 0.45 * closeIn;
	const lift = (p: number) => `translateY(${(1 - p) * 14}px)`;
	const {camX, camZ} = hallCam(22);

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<AbsoluteFill style={{opacity: bgIn * 0.55, filter: 'blur(16px)', transform: 'scale(1.1)'}}>
				<HallView light={[1, 1, 1, 1, 1]} camX={camX} camZ={camZ} window={0} />
			</AbsoluteFill>
			<AbsoluteFill style={{opacity: bgIn, background: `linear-gradient(180deg, ${KC.navy}E6 0%, ${KC.navy}CC 50%, ${KC.navy}F2 100%)`}} />
			{/* logo */}
			<div
				style={{
					position: 'absolute',
					left: 540 - size / 2,
					top: cyLogo - size / 2,
					width: size,
					height: size,
					opacity: logoIn,
					transform: `scale(${0.94 + 0.06 * logoIn})`,
					borderRadius: '50%',
					overflow: 'hidden',
					boxShadow: `0 0 ${80 * logoIn}px rgba(255,255,255,0.12)`,
				}}
			>
				<Img src={staticFile('kapi/logo.png')} style={{width: '100%', height: '100%'}} />
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background: 'linear-gradient(115deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 60%)',
						transform: `translateX(${sweep * 100}%)`,
						mixBlendMode: 'screen',
					}}
				/>
			</div>
			{/* davet */}
			<AbsoluteFill style={{fontFamily: INTER, color: KC.text, textAlign: 'center'}}>
				<div style={{position: 'absolute', left: 90, right: 90, top: 610, opacity: titleIn * dim, transform: lift(titleIn)}}>
					<div style={{fontSize: 30, fontWeight: 600, letterSpacing: 7, color: '#a9c1ea'}}>{iv.union}</div>
					<div style={{fontSize: titleSize, fontWeight: 800, marginTop: 14, lineHeight: 1.05}}>{iv.title}</div>
					<div style={{fontSize: 38, fontWeight: 500, marginTop: 12, color: '#dfe6f2'}}>{iv.subtitle}</div>
				</div>
				<div
					style={{
						position: 'absolute',
						left: 150,
						right: 150,
						top: 860,
						padding: '26px 0 28px',
						border: '2px solid rgba(255,255,255,0.28)',
						borderLeft: `10px solid ${KC.red}`,
						borderRadius: 14,
						background: 'rgba(255,255,255,0.06)',
						opacity: dateIn * dim,
						transform: lift(dateIn),
					}}
				>
					<div style={{fontSize: 58, fontWeight: 800, letterSpacing: -0.5}}>{iv.date}</div>
					<div style={{fontSize: 50, fontWeight: 700, marginTop: 6}}>{iv.time}</div>
				</div>
				<div style={{position: 'absolute', left: 90, right: 90, top: 1110, opacity: placeIn * dim, transform: lift(placeIn)}}>
					<div style={{fontSize: 40, fontWeight: 600}}>{iv.place}</div>
					<div style={{fontSize: 34, fontWeight: 400, marginTop: 10, color: '#c8d3e6'}}>{iv.address}</div>
				</div>
				<div style={{position: 'absolute', left: 90, right: 90, top: 1300, opacity: closeIn, transform: lift(closeIn)}}>
					<div style={{width: 120, height: 3, background: KC.red, margin: '0 auto 34px'}} />
					<div style={{fontSize: 56, fontWeight: 700, lineHeight: 1.2}}>{iv.closing}</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
