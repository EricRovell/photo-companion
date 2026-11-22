import { Show } from "solid-js";

import { LightsSchedule, LightsTimeline, SupportsLights } from "~/features/city-lights";
import { Redirect } from "~/features/navigation";
import { useSettings } from "~/features/settings";
import { ROUTES } from "~/shared/consts";

import styles from "./lights.module.css";

export function PageLights() {
	const { isSupportsCityLights } = useSettings();

	return (
		<Show
			when={isSupportsCityLights()}
			fallback={<Redirect href={ROUTES.NOT_FOUND} />}
		>
			<SupportsLights>
				<div class={styles.page}>
					<LightsSchedule />
					<LightsTimeline />
				</div>
			</SupportsLights>
		</Show>
	);
}
