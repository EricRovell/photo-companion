import { onSettled } from "solid-js";

import { useNavigationService } from "~/features/navigation";

export function PageRoot() {
	const { navigateHome } = useNavigationService();

	onSettled(() => navigateHome());

	return null;
}
