import { createMemo, Show } from "solid-js";

import type { BridgeName, BridgeState } from "types";

import { useTranslation } from "~/features/translation";
import { useDatetime } from "~/hooks";
import { useBridges } from "~/services/bridges-spb";
import { createCountdown } from "~/shared/lib/timer";
import { IconWarning } from "~/shared/ui/icons";

import { BridgeSparkline } from "./card-bridge-sparkline";

import styles from "./card-bridge.module.css";

interface CardBridgeProps {
	exception?: boolean;
	name: BridgeName;
}

interface BridgeTimerProps {
	state: BridgeState;
}

function BridgeTimer(props: BridgeTimerProps) {
	const { format, t } = useTranslation();
	const { getTimestamp } = useDatetime();
	const { getNavigationState } = useBridges();

	const getTime = createCountdown({
		getTimestampEnd: () => props.state.timestamp,
		getTimestampStart: () => getTimestamp()
	});

	return (
		<Show when={getNavigationState().navigation}>
			<footer class={styles.footer}>
				<p>
					<Show fallback={t().MESSAGE.BRIDGE_WILL_OPEN_WITHIN} when={props.state.open}>
						{t().MESSAGE.BRIDGE_WILL_CLOSE_WITHIN}
					</Show>
				</p>
				<output class={styles.countdown}>
					{format().timeDuration(getTime())}
				</output>
			</footer>
		</Show>
	);
}

export function CardBridge(props: CardBridgeProps) {
	const { t } = useTranslation();
	const { getTimestamp } = useDatetime();
	const { getBridgeScheduleEntry, getBridgeState } = useBridges();

	const getSchedule = () => getBridgeScheduleEntry(props.name);
	const getState = createMemo(() => getBridgeState(props.name, getTimestamp(), true));

	return (
		<article class={styles.card}>
			<header>
				<h2>
					{t().BRIDGE_NAME_SPB[props.name]} {t().LABEL.BRIDGE}
					<Show when={props.exception}>
						<IconWarning title={t().MESSAGE.BRIDGE_EXCEPTION} />
					</Show>
				</h2>
				<output class={styles.state} data-text={getState().open ? "danger" : "success"}>
					<Show fallback={t().LABEL.BRIDGE_CLOSED} when={getState().open}>
						{t().LABEL.BRIDGE_OPENED}
					</Show>
				</output>
			</header>
			<BridgeSparkline schedule={getSchedule()} />
			<BridgeTimer state={getState()} />
		</article>
	);
}
