import { For } from "solid-js";

import { useTranslation } from "~/features/translation";
import { createTweened } from "~/shared/primitives";

import { RISE_SET_WIDGET_CONFIG } from "../../config";
import { getRiseSetDialPoint } from "../../lib";

import type { getRiseSetMidnights } from "../../lib";

import styles from "./rise-set-dial-midnights.module.css";

interface Props {
	descriptionId: string;
	midnights: ReturnType<typeof getRiseSetMidnights>;
}

const { animation, dial, midnight: config, track } = RISE_SET_WIDGET_CONFIG;
const TICK_START = getRiseSetDialPoint(dial.angleStart, track.radius - config.tickLength / 2);
const TICK_END = getRiseSetDialPoint(dial.angleStart, track.radius + config.tickLength / 2);

export function RiseSetDialMidnights(props: Props) {
	const { format, t } = useTranslation();

	const describe = (date: Date) => {
		return `${t().RISE_SET.MIDNIGHT}: ${format().timeShort(date)}, ${format().dateShort(date)}`;
	};

	return (
		<g
			class={styles.midnights}
			style={{ "--midnight-tick-width": config.tickWidth }}
		>
			<desc id={props.descriptionId}>
				{props.midnights.map(({ date }) => describe(date)).join("; ")}
			</desc>
			<For each={props.midnights} keyed={false}>
				{midnight => {
					const position = createTweened(() => midnight().progress, { duration: animation.transitionDuration });

					return (
						<g data-rise-set-midnight={midnight().date.toISOString()}>
							<title>
								{describe(midnight().date)}
							</title>
							<line
								transform={`rotate(${position() * dial.angleSpan} ${dial.center} ${dial.center})`}
								x1={TICK_START.x}
								x2={TICK_END.x}
								y1={TICK_START.y}
								y2={TICK_END.y}
							/>
						</g>
					);
				}}
			</For>
		</g>
	);
}
