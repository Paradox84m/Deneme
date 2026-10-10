import React from 'react';
import {Composition, Still} from 'remotion';
import {reel} from './data';
import {Reel} from './Reel';
import {Cover} from './Cover';

export const RemotionRoot: React.FC = () => {
	const {width, height, fps, durationSeconds} = reel.video;
	const durationInFrames = Math.round(durationSeconds * fps);
	return (
		<>
			<Composition
				id="ReelAltyazili"
				component={Reel}
				defaultProps={{subtitles: true}}
				width={width}
				height={height}
				fps={fps}
				durationInFrames={durationInFrames}
			/>
			<Composition
				id="ReelTemiz"
				component={Reel}
				defaultProps={{subtitles: false}}
				width={width}
				height={height}
				fps={fps}
				durationInFrames={durationInFrames}
			/>
			<Still id="Kapak" component={Cover} width={width} height={height} />
		</>
	);
};
