import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring} from 'remotion';
import {CAVEAT} from '../fonts';
import {C, FPS, reel, sceneOf} from '../data';
import {Paper} from '../components/Paper';
import {HandBox} from '../components/HandBox';
import {Pencil} from '../components/Pencil';

// Defter düzeni (1080x1920 üzerinde)
export const ROW_FIRST_Y = 400; // ilk satırın orta çizgisi
export const ROW_GAP = 150;
const BOX = 84;
const BOX_X = 128;
const TEXT_X = 262;
const MARGIN_X = 232;

export const boxCenter = (row: number) => ({x: BOX_X + BOX / 2, y: ROW_FIRST_Y + row * ROW_GAP});

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type Props = {
	t: number; // videonun mutlak zamanı (saniye)
	questionFade?: number; // finalde soru işaretini söndürmek için 1 → 0
};

export const ListBoard: React.FC<Props> = ({t, questionFade = 1}) => {
	const list = sceneOf('list');
	const q = sceneOf('listQuestion');
	if (!list || !q) return null;

	const rows = [
		...reel.list.items.map((text, i) => ({
			text,
			at: list.firstLineAt + i * list.lineInterval,
			ticked: true,
		})),
		{text: reel.list.emptyItem, at: q.writeAt, ticked: false},
	];
	const lastRow = rows.length - 1;
	const last = boxCenter(lastRow);

	// Kalem: kutunun üstüne gelir, duraksar, soru işareti çıkınca kalkar
	const pencilIn = interpolate(t, [q.pencilAt, q.pencilAt + 0.6], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const pencilOut = interpolate(t, [q.questionAt - 0.15, q.questionAt + 0.45], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
	const hover = Math.sin((t - q.pencilAt) * 5.5) * 7;
	const pencilX = interpolate(pencilIn, [0, 1], [820, last.x + 30]) + pencilOut * 260;
	const pencilY = interpolate(pencilIn, [0, 1], [last.y - 380, last.y - 56]) + hover * (1 - pencilOut) - pencilOut * 220;
	const pencilOpacity = Math.min(pencilIn * 1.4, 1 - pencilOut);

	const qFrame = Math.round((t - q.questionAt) * FPS);
	const qPop = t >= q.questionAt ? spring({frame: qFrame, fps: FPS, config: {damping: 9, stiffness: 160}}) : 0;

	return (
		<Paper>
			{/* defter çizgileri ve kırmızı kenar boşluğu */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				{Array.from({length: 11}).map((_, i) => {
					const y = ROW_FIRST_Y - ROW_GAP * 2 + 62 + i * ROW_GAP;
					return <line key={i} x1={0} x2={1080} y1={y} y2={y} stroke={C.blue} strokeOpacity={0.16} strokeWidth={3} />;
				})}
				<line x1={MARGIN_X} x2={MARGIN_X} y1={0} y2={1920} stroke={C.red} strokeOpacity={0.35} strokeWidth={3} />
			</svg>

			{rows.map((row, i) => {
				const {x, y} = boxCenter(i);
				const boxDraw = interpolate(t, [row.at, row.at + 0.25], [0, 1], clamp);
				const write = interpolate(t, [row.at + 0.1, row.at + 0.8], [0, 1], clamp);
				const tick = row.ticked ? interpolate(t, [row.at + 0.78, row.at + 1.0], [0, 1], {...clamp, easing: Easing.out(Easing.quad)}) : 0;
				const reveal = write * 115 - 8;
				const mask = `linear-gradient(to right, #000 ${reveal}%, transparent ${reveal + 8}%)`;
				return (
					<React.Fragment key={row.text}>
						<div style={{position: 'absolute', left: x - BOX / 2, top: y - BOX / 2, width: BOX, height: BOX}}>
							{boxDraw > 0 ? (
								<HandBox size={BOX} seed={`box-${i}`} color={C.night} draw={boxDraw} tick={tick} tickColor={C.blue} />
							) : null}
						</div>
						<div
							style={{
								position: 'absolute',
								left: TEXT_X,
								top: y - 78,
								fontFamily: CAVEAT,
								fontWeight: 700,
								fontSize: 104,
								lineHeight: '140px',
								color: C.night,
								whiteSpace: 'nowrap',
								// el yazısı sağa eğik: son harfin noktası maskeyle kesilmesin diye pay
								paddingRight: 48,
								maskImage: mask,
								WebkitMaskImage: mask,
								opacity: write > 0 ? 1 : 0,
							}}
						>
							{row.text}
						</div>
					</React.Fragment>
				);
			})}

			{/* kırmızı soru işareti */}
			{qPop > 0 ? (
				<div
					style={{
						position: 'absolute',
						left: last.x - 60,
						top: last.y - 80,
						width: 120,
						textAlign: 'center',
						fontFamily: CAVEAT,
						fontWeight: 700,
						fontSize: 150,
						lineHeight: '170px',
						color: C.red,
						transform: `scale(${qPop}) rotate(${interpolate(qPop, [0, 1], [-25, -6])}deg)`,
						opacity: questionFade,
					}}
				>
					?
				</div>
			) : null}

			{pencilOpacity > 0 ? (
				<div
					style={{
						position: 'absolute',
						left: pencilX,
						top: pencilY,
						opacity: pencilOpacity,
						transform: 'rotate(-60deg)',
						transformOrigin: '0 0',
					}}
				>
					<div style={{position: 'absolute', left: -10, top: -27}}>
						<Pencil />
					</div>
				</div>
			) : null}
		</Paper>
	);
};

// Finalde boş kutuya yakınlaşan kamera
export const ZoomedListBoard: React.FC<{t: number; zoom: number; questionFade: number}> = ({t, zoom, questionFade}) => {
	const MAX = 2.6;
	const f = boxCenter(reel.list.items.length);
	// yatayda sayfanın sol kenarı sabit kalır (tx = 0), böylece kenar ekrana girmez
	const target = {x: f.x * MAX, y: 1130};
	const s = interpolate(zoom, [0, 1], [1, MAX]);
	const tx = interpolate(zoom, [0, 1], [f.x, target.x]) - f.x * s;
	const ty = interpolate(zoom, [0, 1], [f.y, target.y]) - f.y * s;
	return (
		<AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: '0 0'}}>
			<ListBoard t={t} questionFade={questionFade} />
		</AbsoluteFill>
	);
};
