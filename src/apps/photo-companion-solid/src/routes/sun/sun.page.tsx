import { SunTimes } from "./sun-times";
import { SunAltitude } from "./sun-altitude";
import { SunData } from "./sun-data";
import { SunTimeline } from "./sun-timeline";
import { useDatetime } from "@lib/hooks";

import styles from "./sun.module.css";
import { useSunData } from "./use-sun-data";

export function PageSun() {
	const { date } = useDatetime();
	const { getSunData } = useSunData();

	return (
		<div class={styles.page}>
			<SunTimes date={date()} state={getSunData()} />
			<SunAltitude date={date()} />
			<SunData state={getSunData()} />
			<SunTimeline date={date()} />
		</div>
	);
}
