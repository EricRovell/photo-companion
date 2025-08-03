import { Navigate } from "@solidjs/router";
import { Show } from "solid-js";

import { SupportsLights } from "~/components";
import { ROUTES } from "~/consts/routes";
import { useSettings } from "~/features/settings";

import { LightGauge, LightsInfo, LightsTimeline } from "./components";

import styles from "./lights.module.css";

export function PageLights() {
	const { isSupportsCityLights } = useSettings();

	return (
		<Show when={isSupportsCityLights()} fallback={<Navigate href={ROUTES.NOT_FOUND} />}>
			<SupportsLights>
				<div class={styles.page}>
					<LightGauge />
					<LightsInfo />
					<LightsTimeline />
				</div>
			</SupportsLights>
		</Show>
	);
}

export default PageLights;
