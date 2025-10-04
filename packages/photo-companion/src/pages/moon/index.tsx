import { MoonProvider } from "~/features/moon";

import { MoonAltitude } from "./ui/moon-altitude";
import { MoonData } from "./ui/moon-data";
import { MoonPhases } from "./ui/moon-phases";
import { MoonTimeline } from "./ui/moon-timeline";
import { MoonTimes } from "./ui/moon-times";

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
