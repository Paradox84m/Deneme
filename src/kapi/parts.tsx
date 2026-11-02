import React from 'react';
import {AbsoluteFill, Easing, staticFile, useCurrentFrame} from 'remotion';
import {INTER} from '../fonts';
import {H, K, KC, map, ramp, rnd, W} from './k';

// Film greni: hazır gürültü dokusu her karede rastgele kaydırılır (filtre hesaplamaktan çok daha hızlı)
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.09}) => {
	const frame = useCurrentFrame();
	const x = Math.floor(rnd(frame) * 540);
	const y = Math.floor(rnd(frame + 1000) * 960);
	return (
		<AbsoluteFill
			style={{
				opacity,
				mixBlendMode: 'overlay',
				pointerEvents: 'none',
				backgroundImage: `url(${staticFile('kapi/gren.jpg')})`,
				backgroundSize: '1080px 1920px',
				backgroundPosition: `${x * 2}px ${y * 2}px`,
				backgroundRepeat: 'repeat',
			}}
		/>
	);
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.55}) => (
	<AbsoluteFill
		style={{
			pointerEvents: 'none',
			background: `radial-gradient(ellipse 75% 60% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`,
		}}
	/>
);

// Hikâye yazıları: sadece yumuşak belirme + hafif yukarı kayma
export const StoryTexts: React.FC<{t: number}> = ({t}) => {
	const line = K.texts.find((l) => t >= l.start && t < l.end);
	if (!line) return null;
	const inP = ramp(t, line.start, line.start + 0.4, Easing.out(Easing.cubic));
	const out = 1 - ramp(t, line.end - 0.3, line.end, Easing.in(Easing.quad));
	const o = inP * out;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 1080,
					height: 520,
					opacity: o,
					background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.62) 40%, rgba(0,0,0,0.62) 62%, rgba(0,0,0,0) 100%)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: K.safeArea.left,
					width: K.safeArea.right - K.safeArea.left,
					top: 1260,
					textAlign: 'center',
					fontFamily: INTER,
					fontWeight: 600,
					fontSize: 62,
					lineHeight: 1.2,
					textWrap: 'balance',
					letterSpacing: -0.5,
					color: KC.text,
					opacity: o,
					transform: `translateY(${(1 - inP) * 14}px)`,
					textShadow: '0 2px 18px rgba(0,0,0,0.75), 0 0 4px rgba(0,0,0,0.5)',
				}}
			>
				{line.text}
			</div>
		</AbsoluteFill>
	);
};

// ---------- Çay masası (yukarıdan) ----------

export type Glass = {x: number; y: number; hot: boolean; drunk?: number};

export const TeaGlass: React.FC<{g: Glass; t: number; i: number; scale: number}> = ({g, t, i, scale}) => {
	const r = 62 * scale;
	const level = 1 - (g.drunk ?? 0);
	return (
		<g>
			<ellipse cx={g.x + 14} cy={g.y + 20} rx={r * 1.55} ry={r * 1.45} fill="rgba(40,20,5,0.35)" filter="url(#soft)" />
			<circle cx={g.x} cy={g.y} r={r * 1.45} fill="url(#saucer)" stroke="rgba(120,110,95,0.5)" strokeWidth={2} />
			<circle cx={g.x} cy={g.y} r={r * 1.05} fill="none" stroke="rgba(150,140,120,0.35)" strokeWidth={2} />
			{/* kaşık */}
			<g transform={`rotate(${-35 + i * 23} ${g.x} ${g.y})`}>
				<rect x={g.x + r * 1.0} y={g.y - 5 * scale} width={r * 1.15} height={10 * scale} rx={5 * scale} fill="url(#metal)" />
				<ellipse cx={g.x + r * 0.95} cy={g.y} rx={16 * scale} ry={11 * scale} fill="url(#metal)" />
			</g>
			{/* bardak ve çay */}
			<circle cx={g.x} cy={g.y} r={r} fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.75)" strokeWidth={3 * scale} />
			{level > 0 ? <circle cx={g.x} cy={g.y} r={r * 0.86 * Math.sqrt(level)} fill="url(#tea)" /> : null}
			<path
				d={`M ${g.x - r * 0.62} ${g.y - r * 0.45} A ${r * 0.78} ${r * 0.78} 0 0 1 ${g.x + r * 0.2} ${g.y - r * 0.76}`}
				stroke="rgba(255,255,255,0.7)"
				strokeWidth={5 * scale}
				fill="none"
				strokeLinecap="round"
			/>
			{g.hot ? <Steam x={g.x} y={g.y} t={t} i={i} scale={scale} /> : null}
		</g>
	);
};

const Steam: React.FC<{x: number; y: number; t: number; i: number; scale: number}> = ({x, y, t, i, scale}) => (
	<g filter="url(#steam)" opacity={0.32}>
		{[0, 1, 2].map((k) => {
			const ph = (t * 0.45 + k / 3 + rnd(i * 7 + k) * 0.3) % 1;
			const dx = Math.sin((t + k) * 1.7 + i) * 26 * scale;
			return (
				<ellipse
					key={k}
					cx={x + dx + (k - 1) * 18 * scale}
					cy={y - ph * 170 * scale}
					rx={26 * scale * (1 + ph)}
					ry={40 * scale * (1 + ph)}
					fill="#fff"
					opacity={Math.sin(ph * Math.PI)}
				/>
			);
		})}
	</g>
);

export const TableDefs: React.FC = () => (
	<defs>
		<radialGradient id="saucer" cx="40%" cy="35%">
			<stop offset="0%" stopColor="#fbf8f2" />
			<stop offset="100%" stopColor="#d9d2c4" />
		</radialGradient>
		<radialGradient id="tea" cx="45%" cy="45%">
			<stop offset="0%" stopColor="#5a1806" />
			<stop offset="70%" stopColor="#8d2c0c" />
			<stop offset="100%" stopColor="#b8521c" />
		</radialGradient>
		<linearGradient id="metal" x1="0" x2="1">
			<stop offset="0%" stopColor="#9a9a9a" />
			<stop offset="50%" stopColor="#eeeeee" />
			<stop offset="100%" stopColor="#8a8a8a" />
		</linearGradient>
		<linearGradient id="wood" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0%" stopColor="#c9a57a" />
			<stop offset="100%" stopColor="#9c7650" />
		</linearGradient>
		<radialGradient id="window" cx="15%" cy="10%" r="90%">
			<stop offset="0%" stopColor="rgba(255,236,200,0.55)" />
			<stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
		</radialGradient>
		<filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur stdDeviation="14" />
		</filter>
		<filter id="steam" x="-100%" y="-100%" width="300%" height="300%">
			<feGaussianBlur stdDeviation="16" />
		</filter>
	</defs>
);

// Masa: bardak sayısı değiştikçe "çoğaldık" görünür
export const TeaTable: React.FC<{
	t: number;
	glasses: Glass[];
	scale?: number;
	paper?: {at: number} | null;
	papers?: number;
	zoom?: number;
}> = ({t, glasses, scale = 1, paper, papers = 0, zoom = 1}) => {
	const slide = paper ? ramp(t, paper.at, paper.at + 0.6, Easing.out(Easing.cubic)) : 0;
	return (
		<AbsoluteFill style={{backgroundColor: '#8f6c48', transform: `scale(${zoom})`}}>
			<svg width={W} height={H}>
				<TableDefs />
				<rect width={W} height={H} fill="url(#wood)" />
				{Array.from({length: 26}).map((_, i) => (
					<rect key={i} x={0} y={i * 76 + rnd(i) * 30} width={W} height={2 + rnd(i + 3) * 3} fill="rgba(80,50,20,0.10)" />
				))}
				{Array.from({length: papers}).map((_, i) => (
					<g key={i} transform={`rotate(${(rnd(i + 40) - 0.5) * 30} ${200 + rnd(i + 9) * 700} ${400 + rnd(i + 19) * 1100})`}>
						<rect x={60 + rnd(i + 9) * 680} y={260 + rnd(i + 19) * 1150} width={300} height={400} fill="#f3efe6" />
						{[0, 1, 2, 3, 4].map((k) => (
							<rect key={k} x={90 + rnd(i + 9) * 680} y={310 + rnd(i + 19) * 1150 + k * 46} width={200 - k * 18} height={8} fill="rgba(60,60,70,0.22)" />
						))}
					</g>
				))}
				{glasses.map((g, i) => (
					<TeaGlass key={i} g={g} t={t} i={i} scale={scale} />
				))}
				{paper ? (
					<g transform={`translate(0 ${(1 - slide) * 900}) rotate(-6 540 1350)`}>
						<rect x={300} y={1080} width={520} height={680} fill="rgba(0,0,0,0.25)" filter="url(#soft)" />
						<rect x={290} y={1060} width={520} height={680} fill="#f6f3ec" />
						{[0, 1, 2, 3, 4, 5, 6].map((k) => (
							<rect key={k} x={340} y={1130 + k * 62} width={k === 0 ? 260 : 400 - (k % 3) * 60} height={10} fill="rgba(60,60,70,0.18)" />
						))}
						<g transform="rotate(28 640 1300)">
							<rect x={420} y={1290} width={440} height={20} rx={10} fill="#1b3f8f" />
							<rect x={820} y={1292} width={70} height={16} rx={8} fill="#e8e8e8" />
						</g>
					</g>
				) : null}
				<rect width={W} height={H} fill="url(#window)" />
			</svg>
		</AbsoluteFill>
	);
};

// ---------- Kapı yakın plan ----------

const ROOM_WARM = '#f4dcb4';

// Kapının arkasındaki sıcak oda
const RoomBehind: React.FC<{light: number}> = ({light}) => (
	<AbsoluteFill style={{background: `linear-gradient(180deg, #e9cfa3 0%, ${ROOM_WARM} 45%, #b08a60 100%)`}}>
		<div
			style={{
				position: 'absolute',
				left: 520,
				top: 380,
				width: 380,
				height: 560,
				background: 'linear-gradient(180deg, #fffaf0, #ffe9c4)',
				boxShadow: `0 0 ${160 * light}px ${60 * light}px rgba(255,240,210,0.9)`,
				filter: 'blur(3px)',
			}}
		/>
		<div style={{position: 'absolute', left: 706, top: 380, width: 10, height: 560, background: 'rgba(160,130,95,0.6)'}} />
		<div style={{position: 'absolute', left: 520, top: 650, width: 380, height: 10, background: 'rgba(160,130,95,0.6)'}} />
		{/* masa kenarı ve sandalye sırtı, flu */}
		<div style={{position: 'absolute', left: 120, right: 120, top: 1330, height: 60, background: '#7a5434', filter: 'blur(6px)'}} />
		<div style={{position: 'absolute', left: 160, top: 1080, width: 200, height: 260, borderRadius: 18, background: '#5d4a3d', filter: 'blur(8px)'}} />
	</AbsoluteFill>
);

export const DoorShot: React.FC<{
	t: number;
	color: string;
	start: number;
	handleAt?: number;
	open?: [number, number];
	knocks?: number[];
	push?: [number, number];
	windowGlow?: number;
}> = ({t, color, start, handleAt, open, knocks = [], push = [1, 1.06], windowGlow = 1}) => {
	const openP = open ? ramp(t, open[0], open[1], Easing.inOut(Easing.cubic)) : 0;
	const handle = handleAt !== undefined ? map(t, [handleAt, handleAt + 0.25, handleAt + 0.9, handleAt + 1.2], [0, 1, 1, 0.2]) : 0;
	const shake = knocks.some((k) => t >= k && t < k + 0.08) ? 3 : 0;
	const end = open ? open[1] + 0.6 : start + 1.5;
	const zoom = map(t, [start, end], push);
	const flood = open ? map(t, [open[0], open[0] + 0.5, open[1] + 0.4], [0, 0.55, 0.18]) : 0;

	const DX = 170;
	const DY = 230;
	const DW = 740;
	const DH = 1640;

	return (
		<AbsoluteFill style={{backgroundColor: '#1d2428', overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `scale(${zoom}) translate(${shake}px, ${shake / 2}px)`, transformOrigin: '540px 1000px'}}>
				{/* koridor duvarı */}
				<AbsoluteFill style={{background: 'linear-gradient(160deg, #3d4a4e 0%, #232c30 60%, #161b1e 100%)'}} />
				{/* kapı boşluğu: arkada oda */}
				<div style={{position: 'absolute', left: DX, top: DY, width: DW, height: DH, overflow: 'hidden', perspective: 1700}}>
					<div style={{position: 'absolute', left: -DX, top: -DY, width: W, height: H}}>
						<RoomBehind light={openP} />
					</div>
					{/* kapı kanadı */}
					<div
						style={{
							position: 'absolute',
							inset: 0,
							transformOrigin: '0% 50%',
							transform: `rotateY(${-openP * 105}deg)`,
							background: `linear-gradient(150deg, ${color} 0%, ${color} 40%, #0f1416 140%)`,
							boxShadow: 'inset 0 0 120px rgba(0,0,0,0.45)',
						}}
					>
						{/* buzlu cam */}
						<div
							style={{
								position: 'absolute',
								left: DW / 2 - 85,
								top: 230,
								width: 170,
								height: 520,
								background: `linear-gradient(180deg, rgba(255,214,160,${0.75 * windowGlow}), rgba(255,190,120,${0.55 * windowGlow}))`,
								boxShadow: `0 0 50px rgba(255,200,140,${0.35 * windowGlow}), inset 0 0 0 10px rgba(30,30,30,0.55)`,
								filter: 'blur(1px)',
							}}
						/>
						{/* tekmelik */}
						<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 200, background: 'linear-gradient(90deg, #6f7477, #b4b8ba 45%, #5d6265)', opacity: 0.75}} />
						{/* kol */}
						<div style={{position: 'absolute', left: DW - 120, top: 860, width: 70, height: 70, borderRadius: 35, background: 'radial-gradient(circle at 35% 35%, #f2f2f2, #6c6c6c)'}} />
						<div
							style={{
								position: 'absolute',
								left: DW - 230,
								top: 880,
								width: 170,
								height: 30,
								borderRadius: 15,
								background: 'linear-gradient(180deg, #f4f4f4, #7b7b7b)',
								transformOrigin: '155px 15px',
								transform: `rotate(${-handle * 24}deg)`,
								boxShadow: '0 8px 12px rgba(0,0,0,0.45)',
							}}
						/>
					</div>
				</div>
				{/* kapı kasası */}
				<div style={{position: 'absolute', left: DX - 34, top: DY - 34, width: DW + 68, height: DH + 34, border: '34px solid #59615f', borderBottom: 'none', boxSizing: 'border-box', boxShadow: '0 0 40px rgba(0,0,0,0.5)'}} />
				{/* aralıklardan sızan ışık */}
				<div style={{position: 'absolute', left: DX + DW - 4, top: DY, width: 6, height: DH, background: KC.warm, opacity: (1 - openP) * 0.9, boxShadow: `0 0 26px 6px rgba(255,201,138,${0.45 * (1 - openP)})`}} />
				<div style={{position: 'absolute', left: DX, top: DY + DH - 6, width: DW, height: 8, background: KC.warm, opacity: (1 - openP) * 0.9, boxShadow: '0 0 40px 10px rgba(255,201,138,0.4)'}} />
			</AbsoluteFill>
			{/* ışık taşması */}
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 55% 45%, rgba(255,236,205,1), rgba(255,210,150,0.4) 60%, rgba(0,0,0,0) 100%)', opacity: flood, mixBlendMode: 'screen'}} />
		</AbsoluteFill>
	);
};
