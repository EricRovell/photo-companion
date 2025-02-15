import { lazy, Suspense } from "solid-js";
import { Loader } from "ui";

import { SupportsBridges, SupportsLights } from "~/components";

import { NowMoon, NowSun } from "./components";

import styles from "./now.module.css";

const NowLights = lazy(() => import("./components/now-lights"));
const NowBridges = lazy(() => import("./components/now-bridges"));

export const PageNow = () => (
	<div class={styles.page}>
		<NowSun />
		<NowMoon />
		<Suspense fallback={<Loader />}>
			<SupportsLights>
				<NowLights />
			</SupportsLights>
		</Suspense>
		<Suspense fallback={<Loader />}>
			<SupportsBridges>
				<NowBridges />
			</SupportsBridges>
		</Suspense>
	</div>
);

export default PageNow;
