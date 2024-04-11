import { createMemo } from "solid-js";

import { LightsTimeline } from "./lights-timeline";
import { LightsInfo } from "./lights-info";
import { LightGauge } from "./lights-gauge";

import { useDatetime } from "@lib/hooks";
import { useLightsProvider } from "../../services/lights";

import styles from "./lights.module.css";

export function PageLights() {
	const { date } = useDatetime();
	const { provider } = useLightsProvider();

	const schedule = createMemo(() => provider().getScheduleByDate(date()));
	const state = createMemo(() => provider().getStateByDate(date()));

	return (
		<div class={styles.page}>
			<LightGauge
				date={date()}
				lights={state().lights}
				schedule={schedule()}
			/>
			<LightsInfo
				city={provider().city}
				schedule={schedule()}
				lights={state().lights}
			/>
			<LightsTimeline />
		</div>
	);
}
