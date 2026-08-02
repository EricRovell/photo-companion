import { MoonAltitude, MoonInfo, MoonPhases, MoonProvider, MoonTimeline, MoonTimes } from "~/features/moon";

import styles from "./moon.module.css";

export function PageMoon() {
	return (
		<MoonProvider>
			<div class={styles.page}>
				<MoonTimes />
				<MoonAltitude />
				<MoonInfo />
				<MoonTimeline />
				<MoonPhases />
			</div>
		</MoonProvider>
	);
}

export default PageMoon;
