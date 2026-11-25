import { LunarEclipse } from "~/features/lunar-eclipse";
import { Earthshine, MoonAltitude, MoonAzimuth, MoonInfo, MoonProvider, MoonTimeline, MoonTimes } from "~/features/moon";
import { MoonPhasesCalendar } from "~/features/moon-phases-calendar";
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
					<MoonPhasesCalendar />
					<Earthshine />
				</div>
			</MoonProvider>
		</SunProvider>
	);
}
