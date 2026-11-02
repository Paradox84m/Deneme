import {Easing, interpolate} from 'remotion';
import raw from '../../kapi.json';

export type Line = {start: number; end: number; text: string};
export type ClipKey = 'sahne1' | 'sahne2' | 'sahne3' | 'sahne4';

export type KapiData = {
	output: {name: string};
	video: {width: number; height: number; fps: number; durationSeconds: number};
	colors: {navy: string; red: string; logoBlue: string; logoRed: string; warm: string; text: string};
	safeArea: {left: number; right: number; top: number; bottom: number};
	texts: Line[];
	invite: {
		logoAt: number; logoUpAt: number; titleAt: number; dateAt: number; placeAt: number; closingAt: number;
		union: string; title: string; subtitle: string; date: string; time: string;
		place: string; address: string; closing: string;
	};
	clips: Record<ClipKey, string | null>;
	cover: {title: string; subtitle: string};
};

export const K = raw as KapiData;
export const KC = K.colors;
export const KFPS = K.video.fps;
export const W = K.video.width;
export const H = K.video.height;

// Sahne sınırları (saniye). Klip verilen sahnede çizim yerine klip oynar.
export const SCENES: {key: ClipKey; start: number; end: number}[] = [
	{key: 'sahne1', start: 0, end: 5},
	{key: 'sahne2', start: 5, end: 10},
	{key: 'sahne3', start: 10, end: 16},
	{key: 'sahne4', start: 16, end: 22},
];

const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// t, [a, b] aralığında 0'dan 1'e gider
export const ramp = (t: number, a: number, b: number, ease: (n: number) => number = Easing.inOut(Easing.cubic)) =>
	interpolate(t, [a, b], [0, 1], {...clampOpts, easing: ease});

export const map = (t: number, inR: number[], outR: number[]) => interpolate(t, inR, outR, clampOpts);

// Basit tek boyutlu perspektif: kamera z=0'da, ileri bakıyor
export const proj = (X: number, Y: number, z: number, f: number, cx: number, cy: number): [number, number] => [
	cx + (X * f) / z,
	cy + (Y * f) / z,
];
export const pts = (p: [number, number][]) => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

// Tekrarlanabilir sözde rastgele sayı (0-1)
export const rnd = (i: number) => {
	const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};
