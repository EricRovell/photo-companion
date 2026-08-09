import { Show } from "solid-js";

import { useTranslation } from "~/features/translation";
import { PropertyList } from "~/shared/ui";

import { useMoonService } from "../model";

interface Props {
	title?: string;
}

export function MoonInfo(props: Props) {
	const { format, t } = useTranslation();
	const {
		altitude,
		azimuth,
		distance,
		fraction,
		fullMoonName,
		moonrise,
		moonset,
		parallacticAngle,
		phaseName,
		zenith
	} = useMoonService();

	return (
		<PropertyList>
			<Show when={props.title}>
				<PropertyList.Header>
					{props.title}
				</PropertyList.Header>
			</Show>
			<PropertyList.Body>
				<PropertyList.Item>
					<PropertyList.Label>{t().LABEL.MOON_PHASE}</PropertyList.Label>
					<PropertyList.Value>{t().MOON_PHASE[phaseName()]}</PropertyList.Value>
				</PropertyList.Item>

				<Show when={fullMoonName()}>
					{name => (
						<PropertyList.Item>
							<PropertyList.Label>{t().LABEL.FULL_MOON_NAME}</PropertyList.Label>
							<PropertyList.Value>{t().MOON_NAME[name()]}</PropertyList.Value>
						</PropertyList.Item>
					)}
				</Show>

				<PropertyList.Item>
					<PropertyList.Label>{t().LABEL.MOONRISE_TIME}</PropertyList.Label>
					<PropertyList.Value>
						<Show fallback="—" when={moonrise()}>
							{value => format().timeShort(value())}
						</Show>
					</PropertyList.Value>
				</PropertyList.Item>

				<PropertyList.Item>
					<PropertyList.Label>{t().LABEL.MOONSET_TIME}</PropertyList.Label>
					<PropertyList.Value>
						<Show fallback="—" when={moonset()}>
							{value => format().timeShort(value())}
						</Show>
					</PropertyList.Value>
				</PropertyList.Item>

				<PropertyList.Item>
					<PropertyList.Label>{t().LABEL.MOON_ILLUMINATION}</PropertyList.Label>
					<PropertyList.Value>{format().percent(fraction())}</PropertyList.Value>
				</PropertyList.Item>

				<PropertyList.Item>
					<PropertyList.Label>{t().LABEL.ZENITH}</PropertyList.Label>
					<PropertyList.Value>{format().degrees(zenith())}</PropertyList.Value>
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
					<PropertyList.Label>{t().LABEL.DISTANCE}</PropertyList.Label>
					<PropertyList.Value>{format().kilometers(distance())}</PropertyList.Value>
				</PropertyList.Item>

				<PropertyList.Item>
					<PropertyList.Label>{t().LABEL.PARALLACTIC_ANGLE}</PropertyList.Label>
					<PropertyList.Value>{format().degrees(parallacticAngle())}</PropertyList.Value>
				</PropertyList.Item>
			</PropertyList.Body>
		</PropertyList>
	);
}
