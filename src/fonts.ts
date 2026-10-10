import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadCaveat} from '@remotion/google-fonts/Caveat';

// latin: ç ö ü â  ·  latin-ext: ğ ı İ ş
const inter = loadInter('normal', {
	weights: ['500', '600', '700', '800', '900'],
	subsets: ['latin', 'latin-ext'],
});

const caveat = loadCaveat('normal', {
	weights: ['500', '700'],
	subsets: ['latin', 'latin-ext'],
});

export const INTER = inter.fontFamily;
export const CAVEAT = caveat.fontFamily;
export const fontsReady = () =>
	Promise.all([inter.waitUntilDone(), caveat.waitUntilDone()]);
