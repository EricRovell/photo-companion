import { createMemo } from "solid-js";

import { getMoonData } from "../../services/moon";

import { MoonTimes } from "./moon-times";
import { MoonAltitude } from "./moon-altitude";
import { MoonData } from "./moon-data";
import { MoonTimeline } from "./moon-timeline";
import { MoonPhases } from "./moon-phases";
import { useDatetime, useLocation } from "@lib/hooks";

import styles from "./moon.module.css";

export function PageMoon() {
	const { date } = useDatetime();
	const { latitude, longitude } = useLocation();

	const state = createMemo(() => getMoonData(date(), latitude(), longitude()));

	return (
		<div class={styles.page}>
			<MoonTimes date={date()} state={state()} />
			<MoonAltitude date={date()} />
			<MoonData state={state()} />
			<MoonTimeline date={date()} latitude={latitude()} longitude={longitude()} />
			<MoonPhases state={state()} />
		</div>
	);
}
