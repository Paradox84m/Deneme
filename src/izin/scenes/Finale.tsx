import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring} from 'remotion';
import {INTER} from '../../fonts';
import {IC, IFPS, S, clamp, izin} from '../data';

const SAFE = izin.safeArea;

export const FinaleView: React.FC<{t: number}> = ({t}) => {
	const f = S.finale;
	const sp = (at: number, damping = 14, stiffness = 140) =>
		t >= at ? spring({frame: Math.round((t - at) * IFPS), fps: IFPS, config: {damping, stiffness}}) : 0;

	const qIn = sp(f.start + 0.1);
	const ctaIn = sp(f.ctaAt, 11, 170);
	const cardIn = sp(f.start + 0.5, 16, 120);
	const typed = t >= f.answerTypeAt && t < f.answerAt;
	const bubble = sp(f.answerAt, 8, 170);
	const handleIn = interpolate(t, [f.answerAt + 0.4, f.answerAt + 0.8], [0, 1], clamp);
	const cursor = Math.floor(t * 2.2) % 2 === 0;

	return (
		<AbsoluteFill style={{backgroundColor: IC.blue}}>
			<AbsoluteFill
				style={{backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.045) 0 2px, transparent 2px 36px)'}}
			/>
			{/* soru */}
			<div
				style={{
					position: 'absolute',
					left: SAFE.left,
					width: SAFE.right - SAFE.left,
					top: SAFE.top + 20,
					fontFamily: INTER,
					fontWeight: 900,
					fontSize: 92,
					lineHeight: 1.1,
					color: IC.paper,
					textAlign: 'center',
					opacity: Math.min(1, qIn * 1.4),
					transform: `translateY(${(1 - qIn) * 40}px)`,
				}}
			>
				{f.question}
			</div>
			{/* çağrı */}
			<div
				style={{
					position: 'absolute',
					left: SAFE.left,
					width: SAFE.right - SAFE.left,
					top: 640,
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<div
					style={{
						padding: '22px 44px',
						borderRadius: 999,
						background: IC.red,
						color: IC.paper,
						fontFamily: INTER,
						fontWeight: 800,
						fontSize: 54,
						whiteSpace: 'nowrap',
						transform: `scale(${ctaIn})`,
					}}
				>
					{f.cta}
				</div>
			</div>
			{/* DM kartı */}
			<div
				style={{
					position: 'absolute',
					left: SAFE.left + 30,
					width: SAFE.right - SAFE.left - 60,
					top: 800,
					height: 520,
					borderRadius: 44,
					background: IC.paper,
					boxShadow: '0 30px 60px rgba(8,22,45,0.35)',
					overflow: 'hidden',
					opacity: Math.min(1, cardIn * 1.5),
					transform: `translateY(${(1 - cardIn) * 140}px)`,
					fontFamily: INTER,
				}}
			>
				<div style={{height: 120, display: 'flex', alignItems: 'center', gap: 22, padding: '0 36px', borderBottom: '2px solid rgba(15,27,45,0.08)'}}>
					<div
						style={{
							width: 72,
							height: 72,
							borderRadius: 40,
							background: IC.blue,
							color: '#fff',
							fontWeight: 800,
							fontSize: 34,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						G
					</div>
					<div style={{fontSize: 40, fontWeight: 700, color: IC.night}}>{f.handle}</div>
				</div>
				{/* gönderilen balon */}
				<div style={{position: 'absolute', right: 40, top: 160, display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
					{bubble > 0 ? (
						<div
							style={{
								minWidth: 170,
								height: 170,
								padding: '0 40px',
								boxSizing: 'border-box',
								borderRadius: 60,
								borderBottomRightRadius: 16,
								background: IC.blue,
								color: '#fff',
								fontWeight: 900,
								fontSize: 120,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								transform: `scale(${bubble})`,
								transformOrigin: 'bottom right',
							}}
						>
							{f.answer}
						</div>
					) : null}
				</div>
				{/* giriş kutusu */}
				<div
					style={{
						position: 'absolute',
						left: 30,
						right: 30,
						bottom: 30,
						height: 96,
						borderRadius: 50,
						border: '3px solid rgba(15,27,45,0.12)',
						display: 'flex',
						alignItems: 'center',
						padding: '0 36px',
						fontSize: 40,
						fontWeight: 500,
						color: typed ? IC.night : '#9A9A9A',
					}}
				>
					<span>{typed ? f.answer : 'Mesaj gönder…'}</span>
					{t >= f.answerTypeAt - 0.6 && t < f.answerAt ? (
						<span style={{width: 3, height: 46, background: IC.blue, marginLeft: 4, opacity: cursor ? 1 : 0}} />
					) : null}
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
					color: IC.paper,
					opacity: handleIn * 0.9,
					transform: `translateY(${interpolate(handleIn, [0, 1], [12, 0], {easing: Easing.out(Easing.quad)})}px)`,
				}}
			>
				{f.handle}
			</div>
		</AbsoluteFill>
	);
};
