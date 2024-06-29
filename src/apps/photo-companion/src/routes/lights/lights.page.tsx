import { CityLightsProvider } from "@lib/context";

import { LightGauge, LightsInfo, LightsTimeline } from "./components";

import styles from "./lights.module.css";

export const PageLights = () => (
	<CityLightsProvider>
		<div class={styles.page}>
			<LightGauge />
			<LightsInfo />
			<LightsTimeline />
		</div>
	</CityLightsProvider>
);
