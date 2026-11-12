import raw from '../../izin-gunu.json';
import type {Subtitle} from '../data';

type Span = {start: number; end: number};

export type Shot = Span & {kind: 'breakfast' | 'couch'; date: string; clock: string};

export type IzinData = {
	output: {name: string};
	compositions: {subtitled: string; clean: string; cover: string};
	checkFrames: number[];
	video: {width: number; height: number; fps: number; durationSeconds: number};
	colors: {blue: string; red: string; green: string; paper: string; night: string};
	safeArea: {left: number; right: number; top: number; bottom: number};
	caller: string;
	scenes: {
		hallway: Span & {buzzAt: number; caption: string; captionAt: number; captionUntil: number};
		call: Span & {date: string; clock: string; thumbAt: number; acceptAt: number};
		flashbacks: Span & {shots: Shot[]; question: string; questionAt: number};
		chat: Span & {
			contact: string; received: string; receivedTime: string; message: string; sentTime: string;
			typeFrom: number; typeTo: number; sendAt: number; seenAt: number; replyTypingAt: number;
		};
		finale: Span & {
			question: string; cta: string; ctaAt: number; answer: string; answerTypeAt: number; answerAt: number; handle: string;
		};
		loop: Span;
	};
	subtitles: (Subtitle & {onScreen?: boolean})[];
	subtitleStyle: {fontSize: number; maxLines: number};
	cover: {title: string};
};

export const izin = raw as IzinData;
export const IC = izin.colors;
export const S = izin.scenes;
export const IFPS = izin.video.fps;
export const isec = (s: number) => Math.round(s * IFPS);

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Telefonun titremesi: kısa darbeler halinde, aralarda durur (gerçek titreşim gibi)
export function buzz(t: number, from: number, strength = 1) {
	if (t < from) return {x: 0, r: 0, on: false};
	const local = (t - from) % 1.1;
	const on = local < 0.55;
	if (!on) return {x: 0, r: 0, on: false};
	const k = Math.sin(local * Math.PI * 2 * 22);
	return {x: k * 7 * strength, r: k * 1.4 * strength, on: true};
}
