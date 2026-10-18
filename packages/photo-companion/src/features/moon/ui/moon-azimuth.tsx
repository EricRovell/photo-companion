import { AzimuthWidget } from "~/entities/widget-azimuth";
import { useSunAzimuthPath, useSunService } from "~/features/sun/model";
import { useTranslation } from "~/features/translation";

import { useMoonAzimuthPath, useMoonService } from "../model";

export function MoonAzimuth() {
	const moon = useMoonService();
	const sun = useSunService();
	const moonAzimuthPath = useMoonAzimuthPath();
	const sunAzimuthPath = useSunAzimuthPath();
	const { format, t } = useTranslation();

	const formatters = {
		ariaEntity: (label: string, azimuth: number) => format().message(t().AZIMUTH.ARIA_ENTITY, {
			azimuth: format().degrees(azimuth),
			label
		}),
		list: (values: string[]) => format().list(values)
	};

	return (
		<AzimuthWidget
			entities={[
				{
					altitude: sun.altitude(),
					azimuth: sun.azimuth(),
					id: "sun",
					label: t().TITLE.SUN,
					path: sunAzimuthPath()
				},
				{
					altitude: moon.altitude(),
					azimuth: moon.azimuth(),
					id: "moon",
					label: t().TITLE.MOON,
					path: moonAzimuthPath()
				}
			]}
			formatters={formatters}
			labels={{
				align: t().LABEL.ALIGN_COMPASS,
				alignBlocked: t().ERRORS.DEVICE_HEADING_BLOCKED,
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
			title={format().message(t().AZIMUTH.TITLE_SUN_MOON, {
				azimuth: t().LABEL.AZIMUTH,
				moon: t().TITLE.MOON,
				sun: t().TITLE.SUN
			})}
		/>
	);
}
