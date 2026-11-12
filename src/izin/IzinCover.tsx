import React from 'react';
import {AbsoluteFill} from 'remotion';
import {INTER} from '../fonts';
import {IC, S, izin} from './data';
import {BuzzLines, IncomingCall, Phone, PHONE_H, PHONE_W} from './Phone';
import {Paper} from '../components/Paper';
import {useFontsReady} from '../useFontsReady';

const trUpper = (s: string) => s.toLocaleUpperCase('tr-TR');

// Kapak: "BU AY / KAÇINCI?" ve altında titreyen telefon
export const IzinCover: React.FC = () => {
	useFontsReady();
	const words = trUpper(izin.cover.title).split(' ');
	const lines = words.length > 2 ? [words.slice(0, -1).join(' '), words[words.length - 1]] : words;
	const PS = 0.5;
	return (
		<Paper>
			<AbsoluteFill style={{alignItems: 'center'}}>
				<div
					style={{
						marginTop: 300,
						fontFamily: INTER,
						fontWeight: 900,
						fontSize: 170,
						lineHeight: 1.04,
						color: IC.night,
						textAlign: 'center',
					}}
				>
					{lines.map((l, i) => (
						<div key={i} style={{whiteSpace: 'nowrap', color: i === lines.length - 1 ? IC.blue : IC.night}}>
							{l.endsWith('?') ? (
								<>
									{l.slice(0, -1)}
									<span style={{color: IC.red}}>?</span>
								</>
							) : (
								l
							)}
						</div>
					))}
				</div>
				<div style={{position: 'relative', marginTop: 90, width: PHONE_W * PS, height: PHONE_H * PS, transform: 'rotate(-6deg)'}}>
					<div style={{transform: `scale(${PS})`, transformOrigin: '0 0'}}>
						<Phone shakeX={8} shakeR={1.2}>
							<IncomingCall caller={izin.caller} clock={S.call.clock} date={S.call.date} t={0.26} />
						</Phone>
					</div>
					<BuzzLines on w={PHONE_W * PS} h={PHONE_H * PS} />
				</div>
			</AbsoluteFill>
		</Paper>
	);
};
