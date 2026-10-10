import raw from '../reel.json';

export type ListScene = {type: 'list'; start: number; end: number; firstLineAt: number; lineInterval: number};
export type ListQuestionScene = {type: 'listQuestion'; start: number; end: number; writeAt: number; pencilAt: number; questionAt: number};
export type NightScene = {type: 'night'; start: number; end: number; label: string; doors: string[]; doorsAt: number};
export type CardsScene = {
	type: 'cards'; start: number; end: number; cards: string[]; cardsAt: number; cardInterval: number;
	question: string; questionAt: number;
};
export type FinaleScene = {
	type: 'finale'; start: number; end: number; slogan: string; closingAt: number;
	closingTitle: string; closingCta: string; handle: string;
};
export type Scene = ListScene | ListQuestionScene | NightScene | CardsScene | FinaleScene;

export type Subtitle = {start: number; end: number; text: string};

export type ReelData = {
	output: {name: string};
	video: {width: number; height: number; fps: number; durationSeconds: number};
	colors: {blue: string; red: string; paper: string; night: string};
	safeArea: {left: number; right: number; top: number; bottom: number};
	list: {items: string[]; emptyItem: string};
	scenes: Scene[];
	subtitles: Subtitle[];
	subtitleStyle: {fontSize: number; maxLines: number};
	cover: {title: string};
};

export const reel = raw as ReelData;
export const C = reel.colors;
export const SAFE = reel.safeArea;
export const FPS = reel.video.fps;

export const sec = (s: number) => Math.round(s * FPS);

export function sceneOf<T extends Scene['type']>(type: T) {
	return reel.scenes.find((s) => s.type === type) as Extract<Scene, {type: T}> | undefined;
}

export const trUpper = (s: string) => s.toLocaleUpperCase('tr-TR');

// Büyük sahne yazıları: altyazıyla aynı metin aynı anda ekrandaysa altyazı videoda gizlenir.
export function bigTexts(): Subtitle[] {
	const out: Subtitle[] = [];
	for (const s of reel.scenes) {
		if (s.type === 'cards') out.push({start: s.questionAt, end: s.end, text: s.question});
		if (s.type === 'finale') {
			out.push({start: s.start, end: s.closingAt, text: s.slogan});
			out.push({start: s.closingAt, end: s.end, text: s.closingTitle});
			out.push({start: s.closingAt, end: s.end, text: s.closingCta});
		}
	}
	return out;
}

const norm = (t: string) => t.toLocaleLowerCase('tr-TR').replace(/[^\p{L}\p{N}]+/gu, '');

export function isShownOnScreen(sub: Subtitle) {
	return bigTexts().some((b) => {
		const overlap = Math.min(b.end, sub.end) - Math.max(b.start, sub.start);
		return norm(b.text) === norm(sub.text) && overlap >= (sub.end - sub.start) / 2;
	});
}
