import { createMemo, Show } from "solid-js";

import type { BridgeName, BridgeState } from "types";

import { useDatetime } from "~/features/datetime-query";
import { useTranslation } from "~/features/translation";
import { createCountdown } from "~/shared/lib/timer";
import { Card, Text } from "~/shared/ui";
import { IconWarning } from "~/shared/ui/icons";

import { useBridges } from "../../model";
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
			<footer>
				<Text align="center" as="p" color="secondary" variant="text-s">
					<Show fallback={t().MESSAGE.BRIDGE_WILL_OPEN_WITHIN} when={props.state.open}>
						{t().MESSAGE.BRIDGE_WILL_CLOSE_WITHIN}
					</Show>
				</Text>
				<Text as="output" color="secondary" numeric variant="text-s">
					{format().timeDuration(getTime())}
				</Text>
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
		<Card as="article" class={styles.card}>
			<Card.Header>
				<Text as="h2" class={styles.title} variant="heading-l">
					{t().BRIDGE_NAME_SPB[props.name]} {t().LABEL.BRIDGE}
					<Show when={props.exception}>
						<IconWarning title={t().MESSAGE.BRIDGE_EXCEPTION} />
					</Show>
				</Text>
				<Text as="output" color={getState().open ? "danger" : "success"} numeric variant="text-s">
					<Show fallback={t().LABEL.BRIDGE_CLOSED} when={getState().open}>
						{t().LABEL.BRIDGE_OPENED}
					</Show>
				</Text>
			</Card.Header>
			<BridgeSparkline schedule={getSchedule()} />
			<BridgeTimer state={getState()} />
		</Card>
	);
}
