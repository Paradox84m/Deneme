import {random} from 'remotion';

// Elle çizilmiş gibi hafif titrek bir kare yolu (0..size koordinatlarında).
export function roughSquare(size: number, seed: string, wobble = 3.5) {
	const r = (k: string) => (random(`${seed}-${k}`) - 0.5) * 2 * wobble;
	const p = [
		[r('a') - 2, r('b')],
		[size + r('c'), r('d') - 1],
		[size + r('e') + 1, size + r('f')],
		[r('g'), size + r('h') + 1],
		[r('i') + 1, r('j') - 4],
	];
	let d = `M ${p[0][0]} ${p[0][1]}`;
	for (let i = 1; i < p.length; i++) {
		const [x0, y0] = p[i - 1];
		const [x1, y1] = p[i];
		const mx = (x0 + x1) / 2 + r(`m${i}x`) * 0.8;
		const my = (y0 + y1) / 2 + r(`m${i}y`) * 0.8;
		d += ` Q ${mx} ${my} ${x1} ${y1}`;
	}
	return d;
}
