import { onMount } from "solid-js";

import { useNavigationService } from "~/services/navigation";

export function PageRoot() {
	const { navigateHome } = useNavigationService();

	onMount(() => navigateHome());

	return null;
}
