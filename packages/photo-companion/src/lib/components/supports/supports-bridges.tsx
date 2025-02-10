import { type ParentProps, Show } from "solid-js";

import { useSupportsBridges } from "~/lib/hooks";

export function SupportsBridges(props: ParentProps) {
	const supports = useSupportsBridges();

	return (
		<Show when={supports()}>
			{props.children}
		</Show>
	);
};
