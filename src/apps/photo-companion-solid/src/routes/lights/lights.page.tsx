import { createMemo } from "solid-js";

import { useDatetime, useLightsProvider } from "@lib/hooks";
import { LightsTimeline } from "./lights-timeline";
import { LightsInfo } from "./lights-info";
import { LightGauge } from "./lights-gauge";

import styles from "./lights.module.css";

export function PageLights() {
	const { date } = useDatetime();
	const { getLightsProvider } = useLightsProvider();

	const schedule = createMemo(() => getLightsProvider().getScheduleByDate(date()));
	const state = createMemo(() => getLightsProvider().getStateByDate(date()));

	return (
		<div class={styles.page}>
			<LightGauge
				date={date()}
				lights={state().lights}
				schedule={schedule()}
			/>
			<LightsInfo
				city={getLightsProvider().city}
				schedule={schedule()}
				lights={state().lights}
			/>
			<LightsTimeline />
		</div>
	);
}
