import { MoonProvider } from "~/features/moon";

import { MoonAltitude } from "./components/moon-altitude";
import { MoonData } from "./components/moon-data";
import { MoonPhases } from "./components/moon-phases";
import { MoonTimeline } from "./components/moon-timeline";
import { MoonTimes } from "./components/moon-times";

import styles from "./moon.module.css";

export function PageMoon() {
	return (
		<MoonProvider>
			<div class={styles.page}>
				<MoonTimes />
				<MoonAltitude />
				<MoonData />
				<MoonTimeline />
				<MoonPhases />
			</div>
		</MoonProvider>
	);
}

export default PageMoon;
