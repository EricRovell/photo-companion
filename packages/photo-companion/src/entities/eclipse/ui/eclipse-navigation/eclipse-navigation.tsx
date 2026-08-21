import { Button } from "~/shared/ui";
import { IconChevronLeft, IconChevronRight } from "~/shared/ui/icons";

import styles from "./eclipse-navigation.module.css";

interface EclipseNavigationProps {
	ariaLabel: string;
	nextLabel: string;
	onNext: () => void;
	onPrevious: () => void;
	previousLabel: string;
}

export function EclipseNavigation(props: EclipseNavigationProps) {
	return (
		<nav aria-label={props.ariaLabel} class={styles.navigation}>
			<Button
				aria-label={props.previousLabel}
				class={styles["navigation-button"]}
				icon
				onClick={props.onPrevious}
				title={props.previousLabel}
			>
				<IconChevronLeft />
			</Button>
			<Button
				aria-label={props.nextLabel}
				class={styles["navigation-button"]}
				icon
				onClick={props.onNext}
				title={props.nextLabel}
			>
				<IconChevronRight />
			</Button>
		</nav>
	);
}
