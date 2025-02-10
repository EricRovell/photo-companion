import { type ParentProps, Show } from "solid-js";

import { useSupportsLights } from "~/lib/hooks";
import { CityLightsProvider } from "~/services/city-lights";

export function SupportsLights(props: ParentProps) {
	const supports = useSupportsLights();

	return (
		<Show when={supports()}>
			<CityLightsProvider>
				{props.children}
			</CityLightsProvider>
		</Show>
	);
};
