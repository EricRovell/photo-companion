import { type ParentProps, Show } from "solid-js";

import { useSettings } from "~/features/settings";

import { CityLightsProvider } from "./city-lights";

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
