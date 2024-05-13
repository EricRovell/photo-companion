import { getNextBridgeEvent } from "bridge-schedule";
import { createMemo, createSignal } from "solid-js";
import { classnames } from "utils";

import { Countdown } from "@lib/components";
import { t } from "@stores/lang";
import styles from "./next-bridge-event.module.css";

export function NextBridgeEvent() {
	const [ getDate, setDate ] = createSignal<number>(Date.now());
	const state = createMemo(() => getNextBridgeEvent(new Date(getDate())));

	const getNextTimestamp = () => {
		setDate(Date.now());
		return state().timestamp;
	};

	return (
		<article class={classnames("card", styles["next-event-info"])}>
			<header>
				<h2>{t().TITLE.THE_CLOSEST_EVENT}</h2>
			</header>
			<p>
				{t().BRIDGE_SPB_EVENTS[`${state().name}_${!state().open ? "OPEN" : "CLOSE"}`]}
			</p>
			<Countdown
				initialTimestamp={state().timestamp}
				callback={getNextTimestamp}
			/>
		</article>
	);
}
