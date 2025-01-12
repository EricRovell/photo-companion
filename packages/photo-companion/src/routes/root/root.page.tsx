import { useLocation, useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";

import { ROUTE_ROOT } from "@lib/consts";
import { useSettings } from "@lib/context/settings";

export function PageRoot() {
	const location = useLocation();
	const navigate = useNavigate();

	onMount(() => {
		if (location.pathname !== ROUTE_ROOT) {
			return;
		}

		const { getSettings } = useSettings();
		const rootTab = `/${getSettings().tabs[0].toLowerCase()}${location.search}`;

		navigate(rootTab, { replace: true });
	});

	return <></>;
}
