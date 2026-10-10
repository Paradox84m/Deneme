import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../data';

export const Paper: React.FC<{children?: React.ReactNode}> = ({children}) => (
	<AbsoluteFill style={{backgroundColor: C.paper}}>
		<svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
			<filter id="paper-grain">
				<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={7} />
				<feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.25  0 0 0 0.09 0" />
			</filter>
			<filter id="paper-fibers">
				<feTurbulence type="fractalNoise" baseFrequency="0.012 0.06" numOctaves={2} seed={3} />
				<feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.47  0 0 0 0 0.32  0 0 0 0.06 0" />
			</filter>
			<rect width="100%" height="100%" filter="url(#paper-fibers)" />
			<rect width="100%" height="100%" filter="url(#paper-grain)" />
		</svg>
		<AbsoluteFill
			style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(90,70,40,0.13) 100%)'}}
		/>
		{children}
	</AbsoluteFill>
);
