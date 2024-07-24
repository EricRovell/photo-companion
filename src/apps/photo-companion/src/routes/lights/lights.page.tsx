import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";

import { SupportsLights } from "@lib/components";
import { useSupportsLights } from "@lib/hooks";

import { LightGauge, LightsInfo, LightsTimeline } from "./components";

import styles from "./lights.module.css";

export function PageLights() {
	const supports = useSupportsLights();
	const navigate = useNavigate();

	onMount(() => {
		if (!supports()) {
			navigate("/404", { replace: true });
		}
	});

	return (
		<SupportsLights>
			<div class={styles.page}>
				<LightGauge />
				<LightsInfo />
				<LightsTimeline />
			</div>
		</SupportsLights>
	);
}

export default PageLights;
