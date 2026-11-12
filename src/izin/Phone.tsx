import React from 'react';
import {AbsoluteFill} from 'remotion';
import {INTER} from '../fonts';
import {IC} from './data';

// Telefon tasarım ölçüsü: 760x1580. Küçük kullanımlarda dışarıdan scale verilir.
export const PHONE_W = 760;
export const PHONE_H = 1580;
const BEZEL = 20;
export const SCREEN_W = PHONE_W - BEZEL * 2;
export const SCREEN_H = PHONE_H - BEZEL * 2;

type PhoneProps = {
	children: React.ReactNode;
	shakeX?: number;
	shakeR?: number;
	glow?: number; // 0..1 ekran ışığının çevreye yayılması
	shadow?: string;
};

export const Phone: React.FC<PhoneProps> = ({children, shakeX = 0, shakeR = 0, glow = 0, shadow}) => (
	<div
		style={{
			position: 'relative',
			width: PHONE_W,
			height: PHONE_H,
			borderRadius: 112,
			background: '#14171C',
			boxShadow: [
				shadow ?? '0 40px 80px rgba(10,16,28,0.45)',
				'inset 0 0 0 4px #2A2F38',
				glow > 0 ? `0 0 ${160 * glow}px ${30 * glow}px rgba(160,200,255,${0.35 * glow})` : '',
			]
				.filter(Boolean)
				.join(', '),
			transform: `translateX(${shakeX}px) rotate(${shakeR}deg)`,
		}}
	>
		<div
			style={{
				position: 'absolute',
				left: BEZEL,
				top: BEZEL,
				width: SCREEN_W,
				height: SCREEN_H,
				borderRadius: 94,
				overflow: 'hidden',
				background: '#000',
			}}
		>
			{children}
			{/* ön kamera adası */}
			<div
				style={{
					position: 'absolute',
					left: SCREEN_W / 2 - 100,
					top: 26,
					width: 200,
					height: 58,
					borderRadius: 30,
					background: '#000',
				}}
			/>
		</div>
	</div>
);

export const StatusBar: React.FC<{clock: string; dark?: boolean}> = ({clock, dark = false}) => {
	const color = dark ? '#111' : '#fff';
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: 30,
				height: 50,
				padding: '0 70px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				fontFamily: INTER,
				fontWeight: 700,
				fontSize: 34,
				color,
			}}
		>
			<span>{clock}</span>
			<span style={{display: 'flex', gap: 10, alignItems: 'center'}}>
				{/* sinyal */}
				<svg width={44} height={30} viewBox="0 0 44 30">
					{[0, 1, 2, 3].map((i) => (
						<rect key={i} x={i * 11} y={22 - i * 7} width={8} height={8 + i * 7} rx={2} fill={color} />
					))}
				</svg>
				{/* pil */}
				<svg width={60} height={30} viewBox="0 0 60 30">
					<rect x={1.5} y={3.5} width={50} height={23} rx={7} fill="none" stroke={color} strokeWidth={3} opacity={0.5} />
					<rect x={6} y={8} width={30} height={14} rx={3} fill={color} />
					<rect x={54} y={10} width={4} height={10} rx={2} fill={color} opacity={0.5} />
				</svg>
			</span>
		</div>
	);
};

// Ahize simgesi (Material "call", 24x24)
export const Handset: React.FC<{size: number; color?: string; rotate?: number}> = ({size, color = '#fff', rotate = 0}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" style={{transform: `rotate(${rotate}deg)`}}>
		<path
			fill={color}
			d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
		/>
	</svg>
);

const Avatar: React.FC<{text: string; size: number; bg: string}> = ({text, size, bg}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: size,
			background: bg,
			color: '#fff',
			fontFamily: INTER,
			fontWeight: 700,
			fontSize: size * 0.38,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			flexShrink: 0,
		}}
	>
		{text}
	</div>
);

const initials = (name: string) =>
	name
		.split(' ')
		.map((w) => w[0])
		.join('')
		.slice(0, 2)
		.toLocaleUpperCase('tr-TR');

// Kilit ekranında gelen arama. Butonların konumu dışarıdan bilinsin diye sabit.
export const ACCEPT_BTN = {x: SCREEN_W - 150, y: 900, r: 82}; // ekran koordinatı (merkez)

export const IncomingCall: React.FC<{caller: string; clock: string; date: string; t: number; pressed?: number}> = ({
	caller,
	clock,
	date,
	t,
	pressed = 0,
}) => {
	const pulse = 1 + 0.08 * Math.max(0, Math.sin(t * 6));
	return (
		<AbsoluteFill style={{background: 'linear-gradient(170deg, #1F3B66 0%, #142744 55%, #0B1527 100%)'}}>
			<StatusBar clock={clock} />
			<div style={{position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', fontFamily: INTER, color: '#fff'}}>
				<div style={{fontSize: 40, fontWeight: 600, opacity: 0.85}}>{date}</div>
				<div style={{fontSize: 170, fontWeight: 700, letterSpacing: -4, lineHeight: 1.05}}>{clock}</div>
			</div>
			<div
				style={{
					position: 'absolute',
					top: 420,
					left: 0,
					right: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					fontFamily: INTER,
					color: '#fff',
				}}
			>
				<Avatar text={initials(caller)} size={150} bg="#5A7092" />
				<div style={{marginTop: 34, fontSize: 64, fontWeight: 700, textAlign: 'center', lineHeight: 1.1, padding: '0 40px'}}>{caller}</div>
				<div style={{marginTop: 14, fontSize: 38, fontWeight: 500, opacity: 0.75}}>arıyor…</div>
			</div>
			{/* butonlar */}
			{[
				{x: 150, color: IC.red, label: 'Reddet', rot: 135},
				{x: ACCEPT_BTN.x, color: IC.green, label: 'Yanıtla', rot: 0},
			].map((b, i) => {
				const isAccept = i === 1;
				const s = isAccept ? pulse * (1 - 0.12 * pressed) : 1;
				return (
					<div key={b.label} style={{position: 'absolute', left: b.x - ACCEPT_BTN.r, top: ACCEPT_BTN.y - ACCEPT_BTN.r, width: ACCEPT_BTN.r * 2}}>
						<div
							style={{
								width: ACCEPT_BTN.r * 2,
								height: ACCEPT_BTN.r * 2,
								borderRadius: 999,
								background: b.color,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								transform: `scale(${s})`,
								boxShadow: isAccept ? `0 0 0 ${14 * pressed}px rgba(46,158,91,0.35)` : undefined,
							}}
						>
							<Handset size={84} rotate={b.rot} />
						</div>
						<div style={{marginTop: 18, textAlign: 'center', fontFamily: INTER, fontWeight: 600, fontSize: 34, color: '#fff'}}>{b.label}</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

const mmss = (s: number) => {
	const n = Math.max(0, Math.floor(s));
	return `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
};

export const InCall: React.FC<{caller: string; clock: string; elapsed: number}> = ({caller, clock, elapsed}) => (
	<AbsoluteFill style={{background: 'linear-gradient(170deg, #1F3B66 0%, #142744 55%, #0B1527 100%)'}}>
		<StatusBar clock={clock} />
		<div
			style={{
				position: 'absolute',
				top: 190,
				left: 0,
				right: 0,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				fontFamily: INTER,
				color: '#fff',
			}}
		>
			<Avatar text={initials(caller)} size={170} bg="#5A7092" />
			<div style={{marginTop: 36, fontSize: 66, fontWeight: 700}}>{caller}</div>
			<div style={{marginTop: 14, fontSize: 44, fontWeight: 500, opacity: 0.8, fontVariantNumeric: 'tabular-nums'}}>{mmss(elapsed)}</div>
		</div>
		<div
			style={{
				position: 'absolute',
				top: 580,
				left: 90,
				right: 90,
				display: 'grid',
				gridTemplateColumns: 'repeat(3, 1fr)',
				rowGap: 46,
				justifyItems: 'center',
				fontFamily: INTER,
				color: '#fff',
			}}
		>
			{['Sessiz', 'Tuşlar', 'Hoparlör'].map((l) => (
				<div key={l} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
					<div style={{width: 130, height: 130, borderRadius: 999, background: 'rgba(255,255,255,0.14)'}} />
					<div style={{fontSize: 30, fontWeight: 500, opacity: 0.85}}>{l}</div>
				</div>
			))}
		</div>
		<div
			style={{
				position: 'absolute',
				left: SCREEN_W / 2 - 82,
				top: 900 - 82,
				width: 164,
				height: 164,
				borderRadius: 999,
				background: IC.red,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Handset size={84} rotate={135} />
		</div>
	</AbsoluteFill>
);

// Mesajlaşma ekranı
const KEY_ROWS = ['ERTYUIOPĞÜ', 'ASDFGHJKLŞİ', 'ZCVBNMÖÇ'];

const Bubble: React.FC<{side: 'in' | 'out'; text: string; time: string; scale?: number; opacity?: number}> = ({
	side,
	text,
	time,
	scale = 1,
	opacity = 1,
}) => (
	<div style={{display: 'flex', justifyContent: side === 'in' ? 'flex-start' : 'flex-end', opacity}}>
		<div
			style={{
				maxWidth: 520,
				padding: '22px 28px 16px',
				borderRadius: 34,
				borderBottomLeftRadius: side === 'in' ? 10 : 34,
				borderBottomRightRadius: side === 'out' ? 10 : 34,
				background: side === 'in' ? '#fff' : IC.blue,
				color: side === 'in' ? '#111' : '#fff',
				fontFamily: INTER,
				fontSize: 40,
				fontWeight: 500,
				lineHeight: 1.25,
				boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
				transform: `scale(${scale})`,
				transformOrigin: side === 'in' ? 'bottom left' : 'bottom right',
			}}
		>
			{text}
			<div style={{fontSize: 26, opacity: 0.6, textAlign: 'right', marginTop: 6}}>{time}</div>
		</div>
	</div>
);

export const Chat: React.FC<{
	contact: string;
	clock: string;
	received: string;
	receivedTime: string;
	draft: string; // giriş kutusundaki yazı
	cursor: boolean;
	sent?: {text: string; time: string; scale: number};
	seen: number; // 0..1
	typingDots: number; // 0..1 görünürlük
	t: number;
}> = ({contact, clock, received, receivedTime, draft, cursor, sent, seen, typingDots, t}) => (
	<AbsoluteFill style={{background: '#EAE4D9'}}>
		{/* mesajlar */}
		<div style={{position: 'absolute', left: 36, right: 36, top: 250, bottom: SCREEN_H - 810, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 22}}>
			<div
				style={{
					alignSelf: 'center',
					padding: '8px 22px',
					borderRadius: 999,
					background: 'rgba(0,0,0,0.07)',
					fontFamily: INTER,
					fontSize: 28,
					fontWeight: 600,
					color: '#555',
				}}
			>
				Bugün
			</div>
			<Bubble side="in" text={received} time={receivedTime} />
			{sent ? <Bubble side="out" text={sent.text} time={sent.time} scale={sent.scale} opacity={Math.min(1, sent.scale * 2)} /> : null}
			{sent ? (
				<div style={{textAlign: 'right', fontFamily: INTER, fontSize: 28, fontWeight: 600, color: '#6B6B6B', opacity: seen, marginTop: -10}}>
					Görüldü
				</div>
			) : null}
			{typingDots > 0 ? (
				<div style={{display: 'flex', opacity: typingDots}}>
					<div style={{padding: '26px 30px', borderRadius: 34, borderBottomLeftRadius: 10, background: '#fff', display: 'flex', gap: 12}}>
						{[0, 1, 2].map((i) => (
							<div
								key={i}
								style={{
									width: 18,
									height: 18,
									borderRadius: 9,
									background: '#9A9A9A',
									opacity: 0.4 + 0.6 * Math.max(0, Math.sin(t * 7 - i * 0.9)),
								}}
							/>
						))}
					</div>
				</div>
			) : null}
		</div>
		{/* başlık */}
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: 0,
				height: 230,
				background: '#F7F4EE',
				borderBottom: '2px solid rgba(0,0,0,0.06)',
			}}
		>
			<StatusBar clock={clock} dark />
			<div style={{position: 'absolute', left: 40, top: 108, display: 'flex', alignItems: 'center', gap: 24, fontFamily: INTER}}>
				<svg width={30} height={50} viewBox="0 0 30 50">
					<path d="M24 4 L6 25 L24 46" stroke={IC.blue} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
				<Avatar text={contact[0]} size={92} bg="#C07A4E" />
				<div>
					<div style={{fontSize: 44, fontWeight: 700, color: '#111'}}>{contact}</div>
					<div style={{fontSize: 30, fontWeight: 500, color: IC.green}}>çevrimiçi</div>
				</div>
			</div>
		</div>
		{/* giriş kutusu */}
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: 830,
				height: 120,
				background: '#F7F4EE',
				display: 'flex',
				alignItems: 'center',
				padding: '0 30px',
				gap: 20,
			}}
		>
			<div
				style={{
					flex: 1,
					minHeight: 76,
					borderRadius: 40,
					background: '#fff',
					border: '2px solid rgba(0,0,0,0.08)',
					padding: '14px 28px',
					fontFamily: INTER,
					fontSize: 36,
					fontWeight: 500,
					color: draft ? '#111' : '#9A9A9A',
					display: 'flex',
					alignItems: 'center',
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					justifyContent: 'flex-end',
				}}
			>
				<span style={{flexShrink: 0}}>{draft || 'Mesaj'}</span>
				<span style={{width: 3, height: 44, background: IC.blue, marginLeft: 3, opacity: cursor ? 1 : 0, flexShrink: 0}} />
				<span style={{flex: draft ? 0 : 1}} />
			</div>
			<div style={{width: 76, height: 76, borderRadius: 40, background: IC.blue, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<svg width={40} height={40} viewBox="0 0 40 40">
					<path d="M6 20 L34 6 L26 34 L20 22 Z" fill="#fff" />
				</svg>
			</div>
		</div>
		{/* klavye */}
		<div style={{position: 'absolute', left: 0, right: 0, top: 950, bottom: 0, background: '#D3D6DC', padding: '26px 10px 0'}}>
			{KEY_ROWS.map((row, r) => (
				<div key={r} style={{display: 'flex', justifyContent: 'center', gap: 9, marginBottom: 20}}>
					{row.split('').map((k) => (
						<div
							key={k}
							style={{
								width: 56,
								height: 92,
								borderRadius: 12,
								background: '#fff',
								boxShadow: '0 2px 0 rgba(0,0,0,0.2)',
								fontFamily: INTER,
								fontSize: 36,
								fontWeight: 500,
								color: '#222',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							{k}
						</div>
					))}
				</div>
			))}
			<div style={{display: 'flex', justifyContent: 'center'}}>
				<div style={{width: 400, height: 92, borderRadius: 12, background: '#fff', boxShadow: '0 2px 0 rgba(0,0,0,0.2)'}} />
			</div>
		</div>
	</AbsoluteFill>
);

// Telefon titrerken yanlarda çıkan titreşim çizgileri
export const BuzzLines: React.FC<{on: boolean; w: number; h: number; color?: string}> = ({on, w, h, color = IC.night}) =>
	on ? (
		<svg width={w + 200} height={h} style={{position: 'absolute', left: -100, top: 0, overflow: 'visible'}}>
			{[-1, 1].map((side) =>
				[0, 1].map((i) => {
					const x = side < 0 ? 70 - i * 26 : w + 130 + i * 26;
					const y0 = h * 0.34;
					const y1 = h * 0.5;
					const bend = side * (18 + i * 8);
					return (
						<path
							key={`${side}-${i}`}
							d={`M ${x} ${y0} Q ${x + bend} ${(y0 + y1) / 2} ${x} ${y1}`}
							stroke={color}
							strokeWidth={7}
							strokeLinecap="round"
							fill="none"
							opacity={0.75 - i * 0.25}
						/>
					);
				}),
			)}
		</svg>
	) : null;
