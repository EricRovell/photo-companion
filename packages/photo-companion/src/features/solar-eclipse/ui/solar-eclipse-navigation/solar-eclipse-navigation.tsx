import { useTranslation } from "~/features/translation";
import { Button } from "~/shared/ui";
import { IconChevronLeft, IconChevronRight } from "~/shared/ui/icons";

import type { SolarEclipseNavigationProps } from "../../model";

import styles from "./solar-eclipse-navigation.module.css";

export function SolarEclipseNavigation(props: SolarEclipseNavigationProps) {
	const { t } = useTranslation();

	return (
		<nav aria-label={t().SOLAR_ECLIPSE.TITLE} class={styles.navigation}>
			<Button
				aria-label={t().SOLAR_ECLIPSE.PREVIOUS}
				class={styles["navigation-button"]}
				icon
				onClick={props.onPrevious}
				title={t().SOLAR_ECLIPSE.PREVIOUS}
			>
				<IconChevronLeft />
			</Button>
			<Button
				aria-label={t().SOLAR_ECLIPSE.NEXT}
				class={styles["navigation-button"]}
				icon
				onClick={props.onNext}
				title={t().SOLAR_ECLIPSE.NEXT}
			>
				<IconChevronRight />
			</Button>
		</nav>
	);
}
