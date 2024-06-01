import { createMemo } from "solid-js";

import { useDatetime, useLightsProvider } from "@lib/hooks";

import { LightGauge } from "./lights-gauge";
import { LightsInfo } from "./lights-info";
import { LightsTimeline } from "./lights-timeline";

import styles from "./lights.module.css";

export function PageLights() {
	const { getDatetime } = useDatetime();
	const { getLightsProvider } = useLightsProvider();

	const schedule = createMemo(() => getLightsProvider().getScheduleByDate(getDatetime()));
	const state = createMemo(() => getLightsProvider().getStateByDate(getDatetime()));

	return (
		<div class={styles.page}>
			<LightGauge
				date={getDatetime()}
				lights={state().lights}
				schedule={schedule()}
			/>
			<LightsInfo
				city={getLightsProvider().city}
				lights={state().lights}
				schedule={schedule()}
			/>
			<LightsTimeline />
		</div>
	);
}
