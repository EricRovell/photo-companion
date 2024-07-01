import { NowBridges, NowLights, NowMoon, NowSun } from "./components";

import styles from "./now.module.css";

export function PageNow() {

	return (
		<div class={styles.page}>
			<NowSun />
			<NowMoon />
			<NowLights />
			<NowBridges />
		</div>
	);
}
