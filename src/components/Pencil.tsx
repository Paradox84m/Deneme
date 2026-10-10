import React from 'react';
import {C} from '../data';

// Sade bir kurşun kalem; ucu (0,0) noktasında, gövde sağ üste doğru uzanır.
export const Pencil: React.FC<{length?: number}> = ({length = 230}) => {
	const w = 34;
	return (
		<svg
			width={length + 20}
			height={w + 20}
			viewBox={`-10 ${-w / 2 - 10} ${length + 20} ${w + 20}`}
			style={{overflow: 'visible', filter: 'drop-shadow(6px 10px 6px rgba(15,27,45,0.25))'}}
		>
			<polygon points={`0,0 ${w * 1.3},${-w / 2} ${w * 1.3},${w / 2}`} fill="#E9D3AE" />
			<polygon points={`0,0 ${w * 0.45},${-w * 0.17} ${w * 0.45},${w * 0.17}`} fill={C.night} />
			<rect x={w * 1.3} y={-w / 2} width={length - w * 1.3 - 52} height={w} fill={C.blue} />
			<rect x={w * 1.3} y={-w / 2} width={length - w * 1.3 - 52} height={w * 0.3} fill="rgba(255,255,255,0.18)" />
			<rect x={length - 52} y={-w / 2} width={18} height={w} fill="#B8BEC8" />
			<rect x={length - 34} y={-w / 2} width={34} height={w} rx={8} fill={C.red} />
		</svg>
	);
};
