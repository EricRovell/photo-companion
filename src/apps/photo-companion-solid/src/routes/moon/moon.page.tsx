import { MoonTimes } from "./moon-times";
import { MoonAltitude } from "./moon-altitude";
import { MoonData } from "./moon-data";
import { MoonTimeline } from "./moon-timeline";
import { MoonPhases } from "./moon-phases";
import { useDatetime } from "@lib/hooks";

import styles from "./moon.module.css";
import { useMoonData } from "./use-moon-data";

export function PageMoon() {
	const { date } = useDatetime();
	const { getMoonData } = useMoonData();

	return (
		<div class={styles.page}>
			<MoonTimes date={date()} state={getMoonData()} />
			<MoonAltitude date={date()} />
			<MoonData state={getMoonData()} />
			<MoonTimeline date={date()} />
			<MoonPhases state={getMoonData()} />
		</div>
	);
}
