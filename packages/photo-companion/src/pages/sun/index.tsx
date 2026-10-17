import { SolarEclipse } from "~/features/solar-eclipse";
import { SunAltitude, SunAzimuth, SunInfo, SunProvider, SunTimeline, SunTimes } from "~/features/sun";
import { SunSeasons } from "~/features/sun-seasons";

import styles from "./sun.module.css";

export function PageSun() {
	return (
		<SunProvider>
			<div class={styles.page}>
				<SunTimes />
				<SunAzimuth />
				<SunAltitude />
				<SolarEclipse />
				<SunInfo />
				<SunSeasons />
				<SunTimeline />
			</div>
		</SunProvider>
	);
}
