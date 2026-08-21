import { EclipseNavigation } from "~/entities/eclipse";
import { useTranslation } from "~/features/translation";

import type { SolarEclipseNavigationProps } from "../model";

export function SolarEclipseNavigation(props: SolarEclipseNavigationProps) {
	const { t } = useTranslation();

	return (
		<EclipseNavigation
			ariaLabel={t().SOLAR_ECLIPSE.TITLE}
			nextLabel={t().SOLAR_ECLIPSE.NEXT}
			onNext={props.onNext}
			onPrevious={props.onPrevious}
			previousLabel={t().SOLAR_ECLIPSE.PREVIOUS}
		/>
	);
}
