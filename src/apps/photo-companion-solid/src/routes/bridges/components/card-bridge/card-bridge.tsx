import { getBridgeScheduleEntry, getBridgeState } from "bridge-schedule";
import { createMemo, createSignal, Show } from "solid-js";
import { IconWarning } from "ui-solid";

import type { BridgeName } from "types";

import { Countdown } from "@lib/components";
import { useTranslation } from "@lib/context";

import { BridgeSparkline } from "./card-bridge-sparkline";

import styles from "./card-bridge.module.css";

interface Props {
	exception?: boolean;
	name: BridgeName;
}

export function CardBridge(props: Props) {
	const { t } = useTranslation();
	const schedule = () => getBridgeScheduleEntry(props.name);
	const [ getDate, setDate ] = createSignal(new Date());
	const state = createMemo(() => getBridgeState(props.name, getDate(), true));

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
					<Show fallback={t().LABEL.BRIDGE_CLOSED} when={state().open}>
						{t().LABEL.BRIDGE_OPENED}
					</Show>
				</output>
			</header>
			<BridgeSparkline schedule={schedule()} />
			<footer>
				<p>
					<Show fallback={t().MESSAGE.BRIDGE_WILL_OPEN_WITHIN} when={state().open}>
						{t().MESSAGE.BRIDGE_WILL_CLOSE_WITHIN}
					</Show>
				</p>
				<Countdown
					callback={() => {
						setDate(new Date());
						return state().timestamp;
					}}
					initialTimestamp={state().timestamp}
				/>
			</footer>
		</article>
	);
}
