import { getBridgeScheduleEntry, getBridgeState } from "bridge-schedule";
import { Show, createMemo, createSignal } from "solid-js";
import { Icon } from "ui-solid";
import { iconWarning } from "ui-solid/icons";

import { Countdown } from "@lib/components";
import { t } from "@lib/stores/lang";
import type { BridgeName } from "types";
import { BridgeSparkline } from "./card-bridge-sparkline";
import styles from "./card-bridge.module.css";

interface Props {
	exception?: boolean;
	name: BridgeName;
}

export function CardBridge(props: Props) {
	const schedule = () => getBridgeScheduleEntry(props.name);
	const [ getDate, setDate ] = createSignal(new Date());
	const state = createMemo(() => getBridgeState(props.name, getDate(), true));

	return (
		<article class={styles.card}>
			<header>
				<h2>
					{t().BRIDGE_NAME_SPB[props.name]} {t().LABEL.BRIDGE}
					<Show when={props.exception}>
						<Icon
							path={iconWarning}
							title={t().MESSAGE.BRIDGE_EXCEPTION}
						/>
					</Show>
				</h2>
				<output>
					<Show when={state().open} fallback={t().LABEL.BRIDGE_CLOSED}>
						{t().LABEL.BRIDGE_OPENED}
					</Show>
				</output>
			</header>
			<BridgeSparkline schedule={schedule()} />
			<footer>
				<p>
					<Show when={state().open} fallback={t().MESSAGE.BRIDGE_WILL_OPEN_WITHIN}>
						{t().MESSAGE.BRIDGE_WILL_CLOSE_WITHIN}
					</Show>
				</p>
				<Countdown
					initialTimestamp={state().timestamp}
					callback={() => {
						setDate(new Date());
						return state().timestamp;
					}}
				/>
			</footer>
		</article>
	);
}
