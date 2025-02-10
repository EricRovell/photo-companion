import { useNavigationService } from "~/services/navigation";
import { onMount } from "solid-js";

export function PageRoot() {
	const { navigateHome } = useNavigationService();

	onMount(() => navigateHome());

	return null;
}
