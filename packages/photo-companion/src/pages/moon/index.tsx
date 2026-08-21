import { LunarEclipse } from "~/features/lunar-eclipse";
import { Earthshine, MoonAltitude, MoonInfo, MoonPhases, MoonProvider, MoonTimeline, MoonTimes } from "~/features/moon";

import styles from "./moon.module.css";

export function PageMoon() {
	return (
		<MoonProvider>
			<div class={styles.page}>
				<MoonTimes />
				<MoonAltitude />
				<LunarEclipse />
				<MoonInfo />
				<MoonTimeline />
				<MoonPhases />
				<Earthshine />
			</div>
		</MoonProvider>
	);
}

export default PageMoon;
