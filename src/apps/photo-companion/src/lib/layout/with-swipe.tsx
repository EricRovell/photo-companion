import { useLocation, useNavigate } from "@solidjs/router";
import { createMemo, type ParentProps } from "solid-js";
import { useSwipe } from "ui/primitives";

import { useNavigationTabs } from "@lib/hooks";

export function useSwipeTab() {
	const { getTabLinks } = useNavigationTabs();
	const navigate = useNavigate();
	const location = useLocation();
	const pathname = createMemo(() => location.pathname);

	const index = createMemo(() => getTabLinks().findIndex(tab => tab.href === pathname()));

	const navigateTab = (step: -1 | 1 = 1) => {
		let nextIndex = index() + step;
		
		if (nextIndex < 0) {
			nextIndex = getTabLinks().length - 1;
		} else if (nextIndex > getTabLinks().length - 1) {
			nextIndex = 0;
		}

		navigate(getTabLinks()[nextIndex].href);
	};

	return navigateTab;
}

export function WithSwipe(props: ParentProps) {
	const navigate = useSwipeTab();

	useSwipe(undefined, {
		onSwipeEnd(_, direction) {
			if (direction === "LEFT") {
				navigate(1);
			} else if (direction === "RIGHT") {
				navigate(-1);
			}
		}
	});

	return (
		<>
			{props.children}
		</>
	);
}
