import React from 'react';
import {roughSquare} from './hand';

type Props = {
	size: number;
	seed: string;
	color: string;
	draw?: number; // 0..1 çizim ilerlemesi
	strokeWidth?: number;
	tick?: number; // 0..1 tik ilerlemesi
	tickColor?: string;
};

export const HandBox: React.FC<Props> = ({size, seed, color, draw = 1, strokeWidth = 6, tick = 0, tickColor}) => {
	const pad = size * 0.35;
	const s = size;
	return (
		<svg
			width={s + pad * 2}
			height={s + pad * 2}
			viewBox={`${-pad} ${-pad} ${s + pad * 2} ${s + pad * 2}`}
			style={{position: 'absolute', left: -pad, top: -pad, overflow: 'visible'}}
		>
			<path
				d={roughSquare(s, seed)}
				fill="none"
				stroke={color}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
				pathLength={1}
				strokeDasharray={1}
				strokeDashoffset={1 - draw}
			/>
			{tick > 0 ? (
				<path
					d={`M ${s * 0.16} ${s * 0.52} Q ${s * 0.3} ${s * 0.62} ${s * 0.42} ${s * 0.84} Q ${s * 0.62} ${s * 0.36} ${s * 1.18} ${-s * 0.12}`}
					fill="none"
					stroke={tickColor ?? color}
					strokeWidth={strokeWidth * 1.6}
					strokeLinecap="round"
					strokeLinejoin="round"
					pathLength={1}
					strokeDasharray={1}
					strokeDashoffset={1 - tick}
				/>
			) : null}
		</svg>
	);
};
