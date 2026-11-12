import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {S, buzz, clamp, izin} from '../data';
import {ACCEPT_BTN, InCall, IncomingCall, Phone, PHONE_W} from '../Phone';
import {Caption} from '../Caption';

export const CLOSE = {left: (1080 - PHONE_W) / 2, top: 230};
const SKIN = '#E0B08A';

// Arkada bulanık koridor: kapı ve duvar
export const BlurredHall: React.FC<{dim?: number}> = ({dim = 0}) => (
	<AbsoluteFill style={{background: '#E9DFCF'}}>
		<div style={{position: 'absolute', left: 700, top: 200, width: 520, height: 1600, background: '#1E5BA8', filter: 'blur(60px)', opacity: 0.75}} />
		<div style={{position: 'absolute', left: -120, top: 500, width: 520, height: 140, background: '#8E6440', filter: 'blur(50px)', opacity: 0.6}} />
		<div style={{position: 'absolute', left: -100, top: 1500, width: 1300, height: 500, background: '#A8794F', filter: 'blur(60px)', opacity: 0.7}} />
		<AbsoluteFill style={{background: `rgba(15,27,45,${0.25 + dim})`}} />
	</AbsoluteFill>
);

// Başparmak: ucu (0,0)'da, gövdesi sağ alta doğru uzanır
const Thumb: React.FC = () => (
	<svg width={10} height={10} style={{overflow: 'visible', position: 'absolute', left: 0, top: 0}}>
		<g transform="rotate(-32)">
			<rect x={-72} y={-10} width={144} height={900} rx={72} fill={SKIN} />
			<rect x={-72} y={-10} width={36} height={900} rx={18} fill="#000" opacity={0.06} />
			<rect x={-44} y={10} width={88} height={110} rx={40} fill="#F3D3BC" />
			<path d="M -40 230 Q 0 245 40 230" stroke="#B9875F" strokeWidth={5} fill="none" opacity={0.6} />
		</g>
	</svg>
);

export const CallSceneView: React.FC<{t: number}> = ({t}) => {
	const c = S.call;
	const accepted = t >= c.acceptAt;
	const b = accepted ? {x: 0, r: 0} : buzz(t, c.start, 0.6);
	const push = interpolate(t, [c.start, c.end], [1, 1.05], clamp);

	// başparmak: gelir, düğmenin üstünde bekler, basar, çekilir
	const btn = {x: CLOSE.left + 20 + ACCEPT_BTN.x, y: CLOSE.top + 20 + ACCEPT_BTN.y};
	const enter = interpolate(t, [c.thumbAt, c.thumbAt + 0.7], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const press = interpolate(t, [c.acceptAt - 0.18, c.acceptAt], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
	const leave = interpolate(t, [c.acceptAt + 0.15, c.acceptAt + 0.8], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
	const hover = Math.sin(t * 2.4) * 10 * (1 - press);
	const tx = btn.x + 40 * (1 - press) + 420 * (1 - enter) + 500 * leave;
	const ty = btn.y + 110 * (1 - press) + hover + 700 * (1 - enter) + 700 * leave;

	return (
		<AbsoluteFill>
			<BlurredHall />
			<div
				style={{
					position: 'absolute',
					left: CLOSE.left,
					top: CLOSE.top,
					transform: `scale(${push})`,
					transformOrigin: '50% 40%',
				}}
			>
				<Phone shakeX={b.x} shakeR={b.r * 0.4}>
					{accepted ? (
						<InCall caller={izin.caller} clock={c.clock} elapsed={t - c.acceptAt} />
					) : (
						<IncomingCall caller={izin.caller} clock={c.clock} date={c.date} t={t} pressed={press} />
					)}
				</Phone>
			</div>
			{enter > 0 && leave < 1 ? (
				<div style={{position: 'absolute', left: tx, top: ty, filter: 'drop-shadow(0 20px 30px rgba(10,16,28,0.35))'}}>
					<Thumb />
				</div>
			) : null}
			<Caption text={S.hallway.caption} t={t} at={S.hallway.captionAt} until={S.hallway.captionUntil} />
		</AbsoluteFill>
	);
};
