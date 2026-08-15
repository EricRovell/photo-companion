import { SolarEclipse } from "~/features/solar-eclipse";
import { SunProvider } from "~/features/sun";
import { SunAltitude, SunInfo, SunTimeline, SunTimes } from "~/features/sun";

import styles from "./sun.module.css";

export function PageSun() {
	return (
		<SunProvider>
			<div class={styles.page}>
				<SunTimes />
				<SunAltitude />
				<SolarEclipse />
				<SunInfo />
				<SunTimeline />
			</div>
		</SunProvider>
	);
}

export default PageSun;
