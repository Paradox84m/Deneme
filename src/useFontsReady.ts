import {useEffect, useState} from 'react';
import {continueRender, delayRender} from 'remotion';
import {fontsReady} from './fonts';

// Yazı ölçümü (satır kırma, sığdırma) fontlar yüklendikten sonra yapılmalı.
export function useFontsReady() {
	const [handle] = useState(() => delayRender('Fontlar yükleniyor'));
	const [ready, setReady] = useState(false);
	useEffect(() => {
		fontsReady().then(() => {
			setReady(true);
			continueRender(handle);
		});
	}, [handle]);
	return ready;
}
