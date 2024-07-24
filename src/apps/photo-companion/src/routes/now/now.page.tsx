import { lazy, Suspense } from "solid-js";

import { SupportsBridges, SupportsLights } from "@lib/components";

import { NowMoon, NowSun } from "./components";

import styles from "./now.module.css";

const NowLights = lazy(() => import("./components/now-lights"));
const NowBridges = lazy(() => import("./components/now-bridges"));

export const PageNow = () => (
	<div class={styles.page}>
		<NowSun />
		<NowMoon />
		<Suspense>
			<SupportsLights>
				<NowLights />
			</SupportsLights>
			<SupportsBridges>
				<NowBridges />
			</SupportsBridges>
		</Suspense>
	</div>
);

export default PageNow;
