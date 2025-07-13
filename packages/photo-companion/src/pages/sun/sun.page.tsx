import { SunProvider } from "~/services/sun";

import { SunAltitude } from "./components/sun-altitude";
import { SunData } from "./components/sun-data";
import { SunTimeline } from "./components/sun-timeline";
import { SunTimes } from "./components/sun-times";

import styles from "./sun.module.css";

export function PageSun() {
	return (
		<SunProvider>
			<div class={styles.page}>
				<SunTimes />
				<SunAltitude />
				<SunData />
				<SunTimeline />
			</div>
		</SunProvider>
	);
}

export default PageSun;
