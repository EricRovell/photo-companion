import { getBridgeScheduleEntry, getBridgeState } from "bridge-schedule";
import { createMemo, Show } from "solid-js";
import { IconWarning } from "ui";

import type { BridgeName } from "types";

import { useTranslation } from "@lib/context";
import { createCountdown, useDatetime } from "@lib/hooks";

import { BridgeSparkline } from "./card-bridge-sparkline";

import styles from "./card-bridge.module.css";

interface Props {
	exception?: boolean;
	name: BridgeName;
}

export function CardBridge(props: Props) {
	const { formatters, t } = useTranslation();
	const { getTimestamp } = useDatetime();

	const getSchedule = () => getBridgeScheduleEntry(props.name);
	const getState = createMemo(() => getBridgeState(props.name, getTimestamp(), true));

	const getTime = createCountdown({
		getTimestampEnd: () => getState().timestamp,
		getTimestampStart: () => getTimestamp()
	});

	const formatTime = () => formatters().formatTimeDuration(getTime());

	return (
		<article class={styles.card}>
			<header>
				<h2>
					{t().BRIDGE_NAME_SPB[props.name]} {t().LABEL.BRIDGE}
					<Show when={props.exception}>
						<IconWarning title={t().MESSAGE.BRIDGE_EXCEPTION} />
					</Show>
				</h2>
				<output>
					<Show fallback={t().LABEL.BRIDGE_CLOSED} when={getState().open}>
						{t().LABEL.BRIDGE_OPENED}
					</Show>
				</output>
			</header>
			<BridgeSparkline schedule={getSchedule()} />
			<footer>
				<p>
					<Show fallback={t().MESSAGE.BRIDGE_WILL_OPEN_WITHIN} when={getState().open}>
						{t().MESSAGE.BRIDGE_WILL_CLOSE_WITHIN}
					</Show>
				</p>
				<output class={styles.countdown}>
					{formatTime()}
				</output>
			</footer>
		</article>
	);
}
