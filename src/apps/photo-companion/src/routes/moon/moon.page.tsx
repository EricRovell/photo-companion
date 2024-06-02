import { useDatetime } from "@lib/hooks";

import { MoonAltitude } from "./moon-altitude";
import { MoonData } from "./moon-data";
import { MoonPhases } from "./moon-phases";
import { MoonTimeline } from "./moon-timeline";
import { MoonTimes } from "./moon-times";
import { useMoonData } from "./use-moon-data";

import styles from "./moon.module.css";

export function PageMoon() {
	const { getDatetime } = useDatetime();
	const { getMoonData } = useMoonData();

	return (
		<div class={styles.page}>
			<MoonTimes date={getDatetime()} state={getMoonData()} />
			<MoonAltitude date={getDatetime()} />
			<MoonData state={getMoonData()} />
			<MoonTimeline date={getDatetime()} />
			<MoonPhases state={getMoonData()} />
		</div>
	);
}
