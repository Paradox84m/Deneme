import React, {useMemo} from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {fitText} from '@remotion/layout-utils';
import {INTER} from '../fonts';
import {useFontsReady} from '../useFontsReady';
import {K, KC, KFPS} from './k';
import {Grain, StoryTexts, Vignette} from './parts';
import {Corridor, DoorOpening, Hall, HallView, hallCam, Invite, ServiceCuts} from './scenes';

const DRAWN = {sahne1: Corridor, sahne2: DoorOpening, sahne3: ServiceCuts, sahne4: Hall};
const STARTS = {sahne1: 0, sahne2: 5, sahne3: 10, sahne4: 16} as const;
const ENDS = {sahne1: 5, sahne2: 10, sahne3: 16, sahne4: 22} as const;

const useTitleSize = () => {
	const ready = useFontsReady();
	return useMemo(() => {
		if (!ready) return 56;
		const w = K.safeArea.right - K.safeArea.left;
		return Math.min(72, fitText({text: K.invite.title, withinWidth: w, fontFamily: INTER, fontWeight: '800', validateFontIsLoaded: true}).fontSize);
	}, [ready]);
};

// yazili=false: yazısız sürüm (yazıları CapCut'ta kendin eklemek istersen)
export const Kapi: React.FC<{yazili: boolean}> = ({yazili}) => {
	const frame = useCurrentFrame();
	const t = frame / KFPS;
	const titleSize = useTitleSize();
	const key = (Object.keys(STARTS) as (keyof typeof STARTS)[]).find((k) => t >= STARTS[k] && t < ENDS[k]);
	const clip = key ? K.clips[key] : null;
	const Drawn = key ? DRAWN[key] : null;

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			{key && clip ? (
				<Sequence from={Math.round(STARTS[key] * KFPS)} durationInFrames={Math.round((ENDS[key] - STARTS[key]) * KFPS)}>
					<OffthreadVideo src={staticFile(`kapi/klipler/${clip}`)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				</Sequence>
			) : Drawn ? (
				<Drawn t={t} />
			) : null}
			{t < 22 ? <Vignette /> : null}
			{t >= 22 ? (yazili ? <Invite t={t} titleSize={titleSize} /> : <InviteBackground t={t} />) : null}
			<Grain opacity={t >= 22 ? 0.06 : 0.1} />
			{yazili ? <StoryTexts t={t} /> : null}
		</AbsoluteFill>
	);
};

// Yazısız sürümde son 8 saniye: logo yine görünür, davet yazıları yok
const InviteBackground: React.FC<{t: number}> = ({t}) => {
	const {camX, camZ} = hallCam(22);
	const o = Math.min(1, Math.max(0, (t - 22.3) / 0.8));
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{opacity: 0.55, filter: 'blur(16px)', transform: 'scale(1.1)'}}>
				<HallView light={[1, 1, 1, 1, 1]} camX={camX} camZ={camZ} window={0} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: `${KC.navy}D9`}} />
			<Img src={staticFile('kapi/logo.png')} style={{position: 'absolute', left: 390, top: 270, width: 300, height: 300, opacity: o}} />
		</AbsoluteFill>
	);
};

export const KapiKapak: React.FC = () => {
	const {camX, camZ} = hallCam(19.5);
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<HallView light={[1, 1, 1, 1, 1]} camX={camX} camZ={camZ} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,10,30,0.35), rgba(0,10,30,0.75) 45%, rgba(0,10,30,0.75) 70%, rgba(0,10,30,0.4))'}} />
			<Vignette strength={0.6} />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: INTER, color: '#fff', textAlign: 'center'}}>
				<Img src={staticFile('kapi/logo.png')} style={{width: 230, height: 230, marginBottom: 50}} />
				<div style={{fontSize: 118, fontWeight: 800, letterSpacing: -2, textShadow: '0 4px 30px rgba(0,0,0,0.6)'}}>{K.cover.title}</div>
				<div style={{fontSize: 46, fontWeight: 500, marginTop: 26, color: '#e4e9f2'}}>{K.cover.subtitle}</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
