import React from 'react';
import {Composition, Still} from 'remotion';
import {reel} from './data';
import {Reel} from './Reel';
import {Cover} from './Cover';
import {Kapi, KapiKapak} from './kapi/Kapi';
import {K} from './kapi/k';

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

			{/* Bir kapı daha… (Kastamonu Şubesi açılışı), ayarları kapi.json'da */}
			<Composition
				id="KapiYazili"
				component={Kapi}
				defaultProps={{yazili: true}}
				width={K.video.width}
				height={K.video.height}
				fps={K.video.fps}
				durationInFrames={K.video.durationSeconds * K.video.fps}
			/>
			<Composition
				id="KapiYazisiz"
				component={Kapi}
				defaultProps={{yazili: false}}
				width={K.video.width}
				height={K.video.height}
				fps={K.video.fps}
				durationInFrames={K.video.durationSeconds * K.video.fps}
			/>
			<Still id="KapiKapak" component={KapiKapak} width={K.video.width} height={K.video.height} />
		</>
	);
};
