import { Navigate } from "@solidjs/router";
import { Show } from "solid-js";

import { SupportsLights } from "@lib/components";
import { ROUTES } from "@lib/consts/routes";
import { useSupportsLights } from "@lib/hooks";

import { LightGauge, LightsInfo, LightsTimeline } from "./components";

import styles from "./lights.module.css";

export function PageLights() {
	const supports = useSupportsLights();

	return (
		<Show when={supports()} fallback={<Navigate href={ROUTES.NOT_FOUND} />}>
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
