import { type ParentProps, Show } from "solid-js";

import { useSettings } from "~/features/settings";

export function SupportsBridges(props: ParentProps) {
	const { isSupportsBridges } = useSettings();

	return (
		<Show when={isSupportsBridges()}>
			{props.children}
		</Show>
	);
};
