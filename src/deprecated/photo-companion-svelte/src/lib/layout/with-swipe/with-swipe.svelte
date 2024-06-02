<script lang="ts">
	import { path } from "svelte-pathfinder";
	import { swipable, type SwipeEvent } from "ui/actions";

	import { pageTransition } from "@lib/helpers/view-transition";
	import { navigationStore, getTabUrl } from "@lib/stores/navigation";
	import styles from "./with-swipe.module.css";
	import { scrollToTop } from "@lib/helpers";

	const handleSwipe = (e: CustomEvent<SwipeEvent>) => {
		const direction = e.detail.direction;
		const step = direction === "right" ? -1 : 1;
		const activeIndex = $navigationStore.findIndex(tab => getTabUrl(tab).includes($path[0]));
		const itemCount = $navigationStore.length;

		if (!itemCount || activeIndex < 0) {
			return;
		}

		const nextIndex = activeIndex + step;

		if (nextIndex >= itemCount) {
			const next = getTabUrl($navigationStore[0]);
			$path[0] = next.slice(1);
			return;
		} else if (nextIndex < 0) {
			const next = getTabUrl($navigationStore[itemCount - 1]);
			$path[0] = next.slice(1);
		} else {
			$path[0] = getTabUrl($navigationStore[nextIndex]).slice(1);
		}
	};

	const handlePageTransition = (e: CustomEvent<SwipeEvent>) => {
		const classNames = e.detail.direction === "right"
			? [ "back-transition" ]
			: [];

		return pageTransition(() => {
			scrollToTop();
			handleSwipe(e);
		}, classNames);
	};
</script>

<div
	class="{styles.wrapper}"
	use:swipable={{ threshold: 75, timeout: 500 }}
	on:swipe-left={handlePageTransition}
	on:swipe-right={handlePageTransition}
>
	<slot />
</div>
