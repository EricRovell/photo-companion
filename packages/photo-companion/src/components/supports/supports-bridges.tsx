import { type ParentProps, Show } from "solid-js";

import { useSettings } from "~/services/settings";

export function SupportsBridges(props: ParentProps) {
	const { isSupportsBridges } = useSettings();

	return (
		<Show when={isSupportsBridges()}>
			{props.children}
		</Show>
	);
};
