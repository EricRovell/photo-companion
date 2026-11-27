import { onSettled } from "solid-js";
import { clamp } from "utils/math";

interface ScrollDirectionOptions {
	enabled?: () => boolean;
	ignoreScroll?: () => boolean;
	onCleanup?: () => void;
	onDirection: (direction: "down" | "up") => void;
}

function getPageScrollTop() {
	const { clientHeight, scrollHeight } = document.documentElement;

	return clamp(window.scrollY, 0, Math.max(0, scrollHeight - clientHeight));
}

export function useScrollDirection(options: ScrollDirectionOptions) {
	onSettled(() => {
		if (options.enabled?.() === false) {
			return;
		}

		let previousScrollTop = getPageScrollTop();
		const handleScroll = () => {
			if (options.ignoreScroll?.()) {
				return;
			}

			const scrollTop = getPageScrollTop();
			const delta = scrollTop - previousScrollTop;

			if (scrollTop === 0 || Math.abs(delta) >= 1) {
				previousScrollTop = scrollTop;
				options.onDirection(delta > 0 ? "down" : "up");
			}
		};

		window.addEventListener("scroll", handleScroll, {
			passive: true
		});

		return () => {
			window.removeEventListener("scroll", handleScroll);
			options.onCleanup?.();
		};
	});
}
