<script lang="ts">
	import { path } from "svelte-pathfinder";

	import { swipable, type SwipeEvent } from "@lib/actions/swipable";
	import { pageTransition } from "@lib/helpers/view-transition";
	import { navigationStore } from "@lib/stores";
	import styles from "./with-swipe.module.css";
	import { scrollToTop } from "@lib/helpers";

	const handleSwipe = (e: CustomEvent<SwipeEvent>) => {
		const direction = e.detail.direction;
		const step = direction === "right" ? -1 : 1;
		const activeIndex = $navigationStore.findIndex(i => i.current);
		const itemCount = $navigationStore.length;

		if (!itemCount || activeIndex < 0) {
			return;
		}

		const nextIndex = activeIndex + step;

		if (nextIndex >= itemCount) {
			const next = $navigationStore[0].href;
			$path[0] = next.slice(1);
			return;
		} else if (nextIndex < 0) {
			const next = $navigationStore[itemCount - 1].href;
			$path[0] = next.slice(1);
		} else {
			$path[0] = $navigationStore[nextIndex].href.slice(1);
		}
	};

	const handlePageTransition = (e: CustomEvent<SwipeEvent>) => {
		return pageTransition(() => {
			scrollToTop();
			handleSwipe(e);
		});
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
