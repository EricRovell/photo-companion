import { type ParentProps, Show } from "solid-js";

import { CityLightsProvider } from "~/lib/context/city-lights";
import { useSupportsLights } from "~/lib/hooks";

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
