import { ErrorBoundary, lazy, Suspense } from "solid-js";

import { ErrorMessage  } from "~/components";
import { SupportsBridges } from "~/features/bridges-spb";
import { SupportsLights } from "~/features/city-lights";
import { Loader } from "~/shared/ui";

import { NowMoon, NowSun } from "./components";

import styles from "./now.module.css";

const NowLights = lazy(() => import("./components/now-lights"));
const NowBridges = lazy(() => import("./components/now-bridges"));

export const PageNow = () => (
	<div class={styles.page}>
		<NowSun />
		<NowMoon />
		<ErrorBoundary fallback={<ErrorMessage message="Something is wrong, could not load City Lights module" />}>
			<Suspense fallback={<Loader />}>
				<SupportsLights>
					<NowLights />
				</SupportsLights>
			</Suspense>
		</ErrorBoundary>
		<ErrorBoundary fallback={<ErrorMessage message="Something is wrong, could not load Bridges module" />}>
			<Suspense fallback={<Loader />}>
				<SupportsBridges>
					<NowBridges />
				</SupportsBridges>
			</Suspense>
		</ErrorBoundary>
	</div>
);

export default PageNow;
