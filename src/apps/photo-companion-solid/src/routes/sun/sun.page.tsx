import { createMemo } from "solid-js";

import { getSunData } from "../../services/sun";

import { SunTimes } from "./sun-times";
import { SunAltitude } from "./sun-altitude";
import { SunData } from "./sun-data";
import { SunTimeline } from "./sun-timeline";
import { useDatetime, useLocation } from "@lib/hooks";

import styles from "./sun.module.css";

export function PageSun() {
	const { date } = useDatetime();
	const { latitude, longitude } = useLocation();

	const state = createMemo(() => getSunData(date(), latitude(), longitude()));

	return (
		<div class={styles.page}>
			<SunTimes date={date()} state={state()} />
			<SunAltitude date={date()} />
			<SunData state={state()} />
			<SunTimeline
				date={date()}
				latitude={latitude()}
				longitude={longitude()}
			/>
		</div>
	);
}
