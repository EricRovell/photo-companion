import { AzimuthWidget } from "~/entities/widget-azimuth";
import { useTranslation } from "~/features/translation";

import { useSunAzimuthPath, useSunService } from "../model";

export function SunAzimuth() {
	const { altitude, azimuth } = useSunService();
	const azimuthPath = useSunAzimuthPath();
	const { t } = useTranslation();

	return (
		<AzimuthWidget
			entities={[
				{
					altitude: altitude(),
					azimuth: azimuth(),
					id: "sun",
					label: t().TITLE.SUN,
					path: azimuthPath()
				}
			]}
			labels={{
				align: t().LABEL.ALIGN_COMPASS,
				alignDenied: t().ERRORS.DEVICE_HEADING_PERMISSION_DENIED,
				alignTimeout: t().ERRORS.DEVICE_HEADING_TIMEOUT,
				alignUnavailable: t().ERRORS.DEVICE_HEADING_UNAVAILABLE,
				altitude: t().LABEL.ALTITUDE,
				azimuth: t().LABEL.AZIMUTH,
				celestialBody: t().LABEL.CELESTIAL_BODY,
				east: t().LABEL.LONGITUDE_EAST,
				north: t().LABEL.LATITUDE_NORTH,
				south: t().LABEL.LATITUDE_SOUTH,
				west: t().LABEL.LONGITUDE_WEST
			}}
			title={`${t().TITLE.SUN} · ${t().LABEL.AZIMUTH}`}
		/>
	);
}
