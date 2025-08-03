import { type ParentProps, Show } from "solid-js";

import { CityLightsProvider } from "~/features/city-lights";
import { useSettings } from "~/features/settings";

export function SupportsLights(props: ParentProps) {
	const { isSupportsCityLights } = useSettings();

	return (
		<Show when={isSupportsCityLights()}>
			<CityLightsProvider>
				{props.children}
			</CityLightsProvider>
		</Show>
	);
};
