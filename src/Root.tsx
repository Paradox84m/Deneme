import React from 'react';
import {Composition, Still} from 'remotion';
import {reel} from './data';
import {Reel} from './Reel';
import {Cover} from './Cover';
import {izin} from './izin/data';
import {IzinReel} from './izin/IzinReel';
import {IzinCover} from './izin/IzinCover';

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

			{/* İzin günü reeli (izin-gunu.json) */}
			<Composition
				id={izin.compositions.subtitled}
				component={IzinReel}
				defaultProps={{subtitles: true}}
				width={izin.video.width}
				height={izin.video.height}
				fps={izin.video.fps}
				durationInFrames={Math.round(izin.video.durationSeconds * izin.video.fps)}
			/>
			<Composition
				id={izin.compositions.clean}
				component={IzinReel}
				defaultProps={{subtitles: false}}
				width={izin.video.width}
				height={izin.video.height}
				fps={izin.video.fps}
				durationInFrames={Math.round(izin.video.durationSeconds * izin.video.fps)}
			/>
			<Still id={izin.compositions.cover} component={IzinCover} width={izin.video.width} height={izin.video.height} />
		</>
	);
};
