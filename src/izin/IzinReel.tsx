import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {IC, IFPS, S, izin} from './data';
import {HallwayView} from './scenes/Hallway';
import {CallSceneView} from './scenes/CallScene';
import {FlashbacksView} from './scenes/Flashbacks';
import {ChatSceneView} from './scenes/ChatScene';
import {FinaleView} from './scenes/Finale';
import {Subtitles} from '../Subtitles';
import {useFontsReady} from '../useFontsReady';

const burnedSubs = izin.subtitles.filter((s) => !s.onScreen);

// Bütün geçişler sert kesme: sahneyi mutlak zamana göre seçeriz.
function sceneAt(t: number) {
	if (t < S.hallway.end) return <HallwayView t={t} />;
	if (t < S.call.end) return <CallSceneView t={t} />;
	if (t < S.flashbacks.end) return <FlashbacksView t={t} />;
	if (t < S.chat.end) return <ChatSceneView t={t} />;
	if (t < S.finale.end) return <FinaleView t={t} />;
	// döngü kuyruğu: videonun başına bağlanır (koridor, kol uzanmaya başlıyor)
	return <HallwayView t={t - izin.video.durationSeconds} />;
}

export const IzinReel: React.FC<{subtitles: boolean}> = ({subtitles}) => {
	useFontsReady();
	const frame = useCurrentFrame();
	const t = frame / IFPS;
	return (
		<AbsoluteFill style={{backgroundColor: IC.paper}}>
			{sceneAt(t)}
			{subtitles ? <Subtitles subs={burnedSubs} {...izin.subtitleStyle} /> : null}
		</AbsoluteFill>
	);
};
