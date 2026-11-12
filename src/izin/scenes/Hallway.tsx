import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {IC, S, buzz, clamp, izin} from '../data';
import {BuzzLines, IncomingCall, Phone, PHONE_H, PHONE_W} from '../Phone';
import {Caption} from '../Caption';

const SKIN = '#E0B08A';
const SLEEVE = '#3E5878';
const FLOOR_Y = 1500;

const Keys: React.FC = () => (
	<g>
		<circle cx={0} cy={0} r={22} fill="none" stroke="#8C939C" strokeWidth={7} />
		<g transform="translate(-6 18) rotate(12)">
			<rect x={-14} y={0} width={28} height={34} rx={8} fill="#C9A447" />
			<rect x={-5} y={30} width={10} height={70} fill="#C9A447" />
			<rect x={4} y={74} width={14} height={8} fill="#C9A447" />
			<rect x={4} y={88} width={10} height={8} fill="#C9A447" />
		</g>
		<g transform="translate(12 16) rotate(-14)">
			<rect x={-13} y={0} width={26} height={30} rx={13} fill="#A9B0B8" />
			<rect x={-5} y={26} width={10} height={62} fill="#A9B0B8" />
			<rect x={4} y={64} width={12} height={8} fill="#A9B0B8" />
		</g>
	</g>
);

// Soldan uzanan kol. (0,0) omuz tarafı; el sağa doğru.
const Arm: React.FC<{len: number}> = ({len}) => (
	<g>
		<rect x={-40} y={-56} width={len} height={112} rx={50} fill={SLEEVE} />
		<rect x={len - 70} y={-60} width={34} height={120} rx={16} fill="#2E4462" />
		{/* el: avuç ve açık parmaklar */}
		<g transform={`translate(${len - 44} 0)`}>
			<rect x={0} y={-44} width={92} height={88} rx={36} fill={SKIN} />
			{[-34, -12, 10].map((y, i) => (
				<rect key={i} x={70} y={y} width={78 - i * 4} height={24} rx={12} fill={SKIN} />
			))}
			<rect x={30} y={-66} width={66} height={26} rx={13} fill={SKIN} transform="rotate(-24 30 -54)" />
		</g>
	</g>
);

// t: videonun mutlak zamanı. Loop kuyruğunda negatif zamanlar da gelir.
export const HallwayView: React.FC<{t: number}> = ({t}) => {
	const h = S.hallway;
	// kol: video başlamadan uzanmaya başlamış gibi; titreşimle donar
	const reach = interpolate(t, [-0.7, h.buzzAt + 0.15], [0, 0.82], {...clamp, easing: Easing.out(Easing.quad)});
	const freeze = t > h.buzzAt + 0.15 ? Math.sin(t * 40) * 1.2 : 0;
	const armLen = interpolate(reach, [0, 1], [180, 520]) + freeze;

	const b = buzz(t, h.buzzAt);
	const lit = interpolate(t, [h.buzzAt - 0.05, h.buzzAt + 0.1], [0, 1], clamp);
	const PS = 0.2;

	return (
		<AbsoluteFill style={{background: '#EFE7DA'}}>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				{/* duvar şeritleri */}
				{Array.from({length: 14}).map((_, i) => (
					<rect key={i} x={i * 80} y={0} width={40} height={FLOOR_Y} fill="#E6DCCB" opacity={0.6} />
				))}
				{/* süpürgelik ve zemin */}
				<rect x={0} y={FLOOR_Y} width={1080} height={420} fill="#A8794F" />
				{Array.from({length: 6}).map((_, i) => (
					<line key={i} x1={0} x2={1080} y1={FLOOR_Y + 40 + i * 70} y2={FLOOR_Y + 40 + i * 70} stroke="#94683F" strokeWidth={4} />
				))}
				<rect x={0} y={FLOOR_Y - 34} width={1080} height={34} fill="#F7F2E8" />
				{/* kapı */}
				<rect x={640} y={430} width={360} height={FLOOR_Y - 430} fill="#D9CFBE" />
				<rect x={662} y={452} width={316} height={FLOOR_Y - 452} fill={IC.blue} />
				<rect x={700} y={500} width={240} height={360} rx={10} fill="none" stroke="#174B8D" strokeWidth={8} />
				<rect x={700} y={920} width={240} height={480} rx={10} fill="none" stroke="#174B8D" strokeWidth={8} />
				<rect x={682} y={900} width={22} height={70} rx={10} fill="#C9A447" />
				{/* anahtarlık panosu */}
				<rect x={150} y={600} width={400} height={56} rx={10} fill="#8E6440" />
				{[220, 350, 480].map((x) => (
					<rect key={x} x={x - 6} y={650} width={12} height={34} rx={6} fill="#5C5F66" />
				))}
				<g transform="translate(350 700)">
					<Keys />
				</g>
				{/* konsol masa */}
				<rect x={110} y={1180} width={470} height={34} rx={8} fill="#7A5235" />
				<rect x={140} y={1214} width={22} height={FLOOR_Y - 1214 - 34} fill="#6A4529" />
				<rect x={528} y={1214} width={22} height={FLOOR_Y - 1214 - 34} fill="#6A4529" />
				{/* saksı */}
				<path d="M 150 1180 L 170 1080 L 260 1080 L 280 1180 Z" fill="#C0283C" opacity={0.85} />
				<ellipse cx={215} cy={1030} rx={70} ry={60} fill="#3F7A52" />
				<ellipse cx={180} cy={990} rx={36} ry={52} fill="#4F8D61" />
				<ellipse cx={250} cy={985} rx={34} ry={50} fill="#4F8D61" />
			</svg>

			{/* masadaki telefon, duvara yaslı */}
			<div
				style={{
					position: 'absolute',
					left: 450 - (PHONE_W * PS) / 2,
					top: 1180 - PHONE_H * PS + 6,
					width: PHONE_W * PS,
					height: PHONE_H * PS,
				}}
			>
				<div style={{transform: `scale(${PS}) rotate(-4deg)`, transformOrigin: '0 0'}}>
					<Phone shakeX={(b.x / PS) * 0.5} shakeR={b.r} glow={lit * 0.8}>
						{/* arama gelmeden önce: kararmış kilit ekranı */}
						<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(170deg, #1F3B66 0%, #0B1527 100%)', opacity: 0.55}} />
						<div style={{position: 'absolute', inset: 0, opacity: lit}}>
							<IncomingCall caller={izin.caller} clock="08:47" date={S.call.date} t={t} />
						</div>
					</Phone>
				</div>
				<BuzzLines on={b.on} w={PHONE_W * PS} h={PHONE_H * PS} />
			</div>

			{/* kol: anahtara uzanır */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<g transform="translate(-60 760) rotate(-9)">
					<Arm len={armLen} />
				</g>
			</svg>

			<Caption text={h.caption} t={t} at={h.captionAt} until={h.captionUntil} />
		</AbsoluteFill>
	);
};
