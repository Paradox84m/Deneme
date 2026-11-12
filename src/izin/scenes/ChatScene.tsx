import React from 'react';
import {AbsoluteFill, interpolate, spring} from 'remotion';
import {IFPS, S, clamp} from '../data';
import {Chat, Phone} from '../Phone';
import {BlurredHall, CLOSE} from './CallScene';

export const ChatSceneView: React.FC<{t: number}> = ({t}) => {
	const c = S.chat;
	const typed = interpolate(t, [c.typeFrom, c.typeTo], [0, c.message.length], clamp);
	const sent = t >= c.sendAt;
	const draft = sent ? '' : c.message.slice(0, Math.floor(typed));
	const cursor = Math.floor(t * 2.2) % 2 === 0 || (t > c.typeFrom && t < c.typeTo);
	const pop = sent ? spring({frame: Math.round((t - c.sendAt) * IFPS), fps: IFPS, config: {damping: 14, stiffness: 180}}) : 0;
	const seen = interpolate(t, [c.seenAt, c.seenAt + 0.3], [0, 1], clamp);
	const dots = interpolate(t, [c.replyTypingAt, c.replyTypingAt + 0.25], [0, 1], clamp);
	const push = interpolate(t, [c.start, c.end], [1, 1.04], clamp);

	return (
		<AbsoluteFill>
			<BlurredHall dim={0.1} />
			<div style={{position: 'absolute', left: CLOSE.left, top: CLOSE.top, transform: `scale(${push})`, transformOrigin: '50% 30%'}}>
				<Phone>
					<Chat
						contact={c.contact}
						clock={c.sentTime}
						received={c.received}
						receivedTime={c.receivedTime}
						draft={draft}
						cursor={cursor}
						sent={sent ? {text: c.message, time: c.sentTime, scale: pop} : undefined}
						seen={seen}
						typingDots={dots}
						t={t}
					/>
				</Phone>
			</div>
		</AbsoluteFill>
	);
};
