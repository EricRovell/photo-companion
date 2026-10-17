import { LunarEclipse } from "~/features/lunar-eclipse";
import { Earthshine, MoonAltitude, MoonAzimuth, MoonInfo, MoonPhases, MoonProvider, MoonTimeline, MoonTimes } from "~/features/moon";
import { SunProvider } from "~/features/sun";

import styles from "./moon.module.css";

export function PageMoon() {
	return (
		<SunProvider>
			<MoonProvider>
				<div class={styles.page}>
					<MoonTimes />
					<MoonAzimuth />
					<MoonAltitude />
					<LunarEclipse />
					<MoonInfo />
					<MoonTimeline />
					<MoonPhases />
					<Earthshine />
				</div>
			</MoonProvider>
		</SunProvider>
	);
}
