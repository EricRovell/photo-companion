import { SunTimes } from "./sun-times";
import { SunAltitude } from "./sun-altitude";
import { SunData } from "./sun-data";
import { SunTimeline } from "./sun-timeline";
import { useDatetime } from "@lib/hooks";

import styles from "./sun.module.css";
import { useSunData } from "./use-sun-data";

export function PageSun() {
	const { getDatetime } = useDatetime();
	const { getSunData } = useSunData();

	return (
		<div class={styles.page}>
			<SunTimes date={getDatetime()} state={getSunData()} />
			<SunAltitude date={getDatetime()} />
			<SunData state={getSunData()} />
			<SunTimeline date={getDatetime()} />
		</div>
	);
}
