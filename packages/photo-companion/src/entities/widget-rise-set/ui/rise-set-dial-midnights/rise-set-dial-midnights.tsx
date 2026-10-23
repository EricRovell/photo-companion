import { For } from "solid-js";

import { useTranslation } from "~/features/translation";

import { RISE_SET_WIDGET_CONFIG } from "../../config";
import { getRiseSetDialPoint } from "../../lib";

import type { getRiseSetMidnights } from "../../lib";

import styles from "./rise-set-dial-midnights.module.css";

interface Props {
	descriptionId: string;
	midnights: ReturnType<typeof getRiseSetMidnights>;
}

const { dial, midnight: config, track } = RISE_SET_WIDGET_CONFIG;

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
			<For each={props.midnights}>
				{midnight => {
					const angle = dial.angleStart + midnight.progress * dial.angleSpan;
					const start = getRiseSetDialPoint(angle, track.radius - config.tickLength / 2);
					const end = getRiseSetDialPoint(angle, track.radius + config.tickLength / 2);

					return (
						<g data-rise-set-midnight={midnight.date.toISOString()}>
							<title>
								{describe(midnight.date)}
							</title>
							<line
								x1={start.x}
								x2={end.x}
								y1={start.y}
								y2={end.y}
							/>
						</g>
					);
				}}
			</For>
		</g>
	);
}
