import { SunProvider } from "~/features/sun";

import { SunAltitude } from "./ui/sun-altitude";
import { SunData } from "./ui/sun-data";
import { SunTimeline } from "./ui/sun-timeline";
import { SunTimes } from "./ui/sun-times";

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
