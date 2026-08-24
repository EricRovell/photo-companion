import { Show } from "solid-js";

import { useTranslation } from "~/features/translation";
import { PropertyList } from "~/shared/ui";

import { useSunService } from "../model";

export function SunInfo(props: { title?: string }) {
	const { format, t } = useTranslation();
	const { altitude, azimuth, dayDuration, declination, distance, sunrise, sunset, zenith } = useSunService();

	return (
		<PropertyList>
			<Show when={props.title}>
				<PropertyList.Header>
					{props.title}
				</PropertyList.Header>
			</Show>
			<PropertyList.Body>
				<PropertyList.Item>
					<PropertyList.Label>{t().LABEL.SUNRISE_TIME}</PropertyList.Label>
					<PropertyList.Value>{format().timeShort(sunrise())}</PropertyList.Value>
				</PropertyList.Item>

				<PropertyList.Item>
					<PropertyList.Label>{t().LABEL.SUNSET_TIME}</PropertyList.Label>
					<PropertyList.Value>{format().timeShort(sunset())}</PropertyList.Value>
				</PropertyList.Item>

				<PropertyList.Item>
					<PropertyList.Label>{t().LABEL.DURATION_DAYLIGHT}</PropertyList.Label>
					<PropertyList.Value>{format().timeDuration(dayDuration())}</PropertyList.Value>
				</PropertyList.Item>

				<PropertyList.Item>
					<PropertyList.Label>{t().LABEL.ALTITUDE}</PropertyList.Label>
					<PropertyList.Value>{format().degrees(altitude())}</PropertyList.Value>
				</PropertyList.Item>

				<PropertyList.Item>
					<PropertyList.Label>{t().LABEL.AZIMUTH}</PropertyList.Label>
					<PropertyList.Value>{format().degrees(azimuth())}</PropertyList.Value>
				</PropertyList.Item>

				<PropertyList.Item>
					<PropertyList.Label>{t().LABEL.DECLINATION}</PropertyList.Label>
					<PropertyList.Value>{format().degrees(declination())}</PropertyList.Value>
				</PropertyList.Item>

				<PropertyList.Item>
					<PropertyList.Label>{t().LABEL.DISTANCE}</PropertyList.Label>
					<PropertyList.Value>{format().kilometers(distance())}</PropertyList.Value>
				</PropertyList.Item>

				<PropertyList.Item>
					<PropertyList.Label>{t().LABEL.ZENITH}</PropertyList.Label>
					<PropertyList.Value>{format().degrees(zenith())}</PropertyList.Value>
				</PropertyList.Item>
			</PropertyList.Body>
		</PropertyList>
	);
}
