import React from 'react';
import {interpolate, spring} from 'remotion';
import {INTER} from '../fonts';
import {IC, IFPS, izin, clamp} from './data';

// Ekranın üstündeki büyük yazı (altyazı değil, sahnenin parçası)
export const Caption: React.FC<{text: string; t: number; at: number; until: number}> = ({text, t, at, until}) => {
	if (t < at || t > until) return null;
	const pop = spring({frame: Math.round((t - at) * IFPS), fps: IFPS, config: {damping: 13, stiffness: 170}});
	const out = interpolate(t, [until - 0.2, until], [1, 0], clamp);
	return (
		<div
			style={{
				position: 'absolute',
				left: izin.safeArea.left,
				right: 1080 - izin.safeArea.right,
				top: izin.safeArea.top,
				display: 'flex',
				justifyContent: 'center',
				opacity: Math.min(1, pop * 1.5) * out,
				transform: `translateY(${(1 - pop) * -30}px) scale(${0.85 + 0.15 * pop})`,
			}}
		>
			<div
				style={{
					minWidth: 760,
					boxSizing: 'border-box',
					textAlign: 'center',
					padding: '22px 46px',
					borderRadius: 28,
					background: IC.paper,
					color: IC.night,
					fontFamily: INTER,
					fontWeight: 900,
					fontSize: 76,
					whiteSpace: 'nowrap',
					boxShadow: '0 16px 40px rgba(10,16,28,0.28)',
				}}
			>
				{text}
			</div>
		</div>
	);
};
