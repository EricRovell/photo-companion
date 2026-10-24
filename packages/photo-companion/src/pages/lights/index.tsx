import { Navigate } from "@solidjs/router";
import { Show } from "solid-js";

import { LightsInfo, LightsSchedule, LightsTimeline, SupportsLights } from "~/features/city-lights";
import { useSettings } from "~/features/settings";
import { ROUTES } from "~/shared/consts";

import styles from "./lights.module.css";

export function PageLights() {
	const { isSupportsCityLights } = useSettings();

	return (
		<Show when={isSupportsCityLights()} fallback={<Navigate href={ROUTES.NOT_FOUND} />}>
			<SupportsLights>
				<div class={styles.page}>
					<LightsSchedule />
					<LightsInfo />
					<LightsTimeline />
				</div>
			</SupportsLights>
		</Show>
	);
}
