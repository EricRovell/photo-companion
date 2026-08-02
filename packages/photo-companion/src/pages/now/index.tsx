import { ErrorBoundary, lazy, Suspense } from "solid-js";

import { SupportsBridges } from "~/features/bridges-spb";
import { SupportsLights } from "~/features/city-lights";
import { MoonInfo, MoonProvider } from "~/features/moon";
import { SunInfo, SunProvider } from "~/features/sun";
import { useTranslation } from "~/features/translation";
import { ErrorMessage  } from "~/shared/ui";
import { Loader } from "~/shared/ui";

import styles from "./now.module.css";

const NowLights = lazy(() => import("./ui/now-lights"));
const NowBridges = lazy(() => import("./ui/now-bridges"));

export function PageNow() {
	const { t } = useTranslation();

	return (
		<div class={styles.page}>
			<SunProvider>
				<SunInfo title={t().TITLE.SUN} />
			</SunProvider>
			<MoonProvider>
				<MoonInfo title={t().TITLE.MOON} />
			</MoonProvider>
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
}

export default PageNow;
