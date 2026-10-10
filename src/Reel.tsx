import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {C, FPS, reel, Scene, sec} from './data';
import {ListBoard} from './scenes/ListBoard';
import {NightSceneView} from './scenes/NightScene';
import {CardsSceneView} from './scenes/CardsScene';
import {FinaleSceneView} from './scenes/FinaleScene';
import {Subtitles} from './Subtitles';

const FADE = 7; // sahne girişinde kısa geçiş (kare)

const FadeIn: React.FC<{children: React.ReactNode; enabled: boolean}> = ({children, enabled}) => {
	const frame = useCurrentFrame();
	const o = enabled ? interpolate(frame, [0, FADE], [0, 1], {extrapolateRight: 'clamp'}) : 1;
	return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

const ListAtTime: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	return <ListBoard t={start + frame / FPS} />;
};

function renderScene(scene: Scene) {
	switch (scene.type) {
		case 'list':
		case 'listQuestion':
			return <ListAtTime start={scene.start} />;
		case 'night':
			return <NightSceneView scene={scene} />;
		case 'cards':
			return <CardsSceneView scene={scene} />;
		case 'finale':
			return <FinaleSceneView scene={scene} />;
	}
}

export const Reel: React.FC<{subtitles: boolean}> = ({subtitles}) => (
	<AbsoluteFill style={{backgroundColor: C.paper}}>
		{reel.scenes.map((scene, i) => {
			const prev = reel.scenes[i - 1];
			// liste sahneleri birbirinin devamı: aralarında geçiş yok
			const continuous = prev && prev.type === 'list' && scene.type === 'listQuestion';
			return (
				<Sequence key={i} from={sec(scene.start)} durationInFrames={sec(scene.end) - sec(scene.start)} name={scene.type}>
					<FadeIn enabled={i > 0 && !continuous}>{renderScene(scene)}</FadeIn>
				</Sequence>
			);
		})}
		{subtitles ? <Subtitles /> : null}
	</AbsoluteFill>
);
