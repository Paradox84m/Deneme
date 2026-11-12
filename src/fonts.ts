import {staticFile} from 'remotion';

// Fontlar public/fonts altında: render sırasında internete çıkılmaz.
// latin: ç ö ü â ı  ·  latin-ext: ğ İ ş
const LATIN =
	'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const LATIN_EXT =
	'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF';

export const INTER = 'Inter';
export const CAVEAT = 'Caveat';

function load(family: string, file: string, weight: string, unicodeRange: string) {
	const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)}) format('woff2')`, {weight, unicodeRange});
	document.fonts.add(face);
	return face.load();
}

let ready: Promise<unknown> | null = null;

export const fontsReady = () => {
	if (!ready) {
		ready = Promise.all([
			load(INTER, 'inter-latin.woff2', '500 900', LATIN),
			load(INTER, 'inter-latin-ext.woff2', '500 900', LATIN_EXT),
			load(CAVEAT, 'caveat-latin.woff2', '500 700', LATIN),
			load(CAVEAT, 'caveat-latin-ext.woff2', '500 700', LATIN_EXT),
		]);
	}
	return ready;
};

// Modül yüklenir yüklenmez başlat; ölçüm yapan bileşenler useFontsReady ile bekler.
fontsReady();
