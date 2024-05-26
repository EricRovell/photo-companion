import { MoonTimes } from "./moon-times";
import { MoonAltitude } from "./moon-altitude";
import { MoonData } from "./moon-data";
import { MoonTimeline } from "./moon-timeline";
import { MoonPhases } from "./moon-phases";
import { useDatetime } from "@lib/hooks";

import styles from "./moon.module.css";
import { useMoonData } from "./use-moon-data";

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
