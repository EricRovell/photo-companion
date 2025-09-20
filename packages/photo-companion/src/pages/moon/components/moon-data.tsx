import { Show } from "solid-js";

import { CardInfo } from "~/entities/card-info";
import { useMoonService } from "~/features/moon";
import { useTranslation } from "~/features/translation";

interface Props {
	title?: string;
}

export function MoonData(props: Props) {
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
		<CardInfo title={props.title}>
			<CardInfo.Entry property={t().LABEL.MOON_PHASE}>
				{t().MOON_PHASE[phaseName()]}
			</CardInfo.Entry>
			<Show when={fullMoonName()}>
				{name => (
					<CardInfo.Entry property={t().LABEL.FULL_MOON_NAME}>
						{t().MOON_NAME[name()]}
					</CardInfo.Entry>
				)}
			</Show>
			<CardInfo.Entry property={t().LABEL.MOONRISE_TIME}>
				<Show fallback="—" when={moonrise()}>
					{value => format().timeShort(value())}
				</Show>
			</CardInfo.Entry>
			<CardInfo.Entry property={t().LABEL.MOONSET_TIME}>
				<Show fallback="—" when={moonset()}>
					{value => format().timeShort(value())}
				</Show>
			</CardInfo.Entry>
			<CardInfo.Entry property={t().LABEL.MOON_ILLUMINATION}>
				{format().percent(fraction())}
			</CardInfo.Entry>
			<CardInfo.Entry property={t().LABEL.ZENITH}>
				{format().degrees(zenith())}
			</CardInfo.Entry>
			<CardInfo.Entry property={t().LABEL.ALTITUDE}>
				{format().degrees(altitude())}
			</CardInfo.Entry>
			<CardInfo.Entry property={t().LABEL.AZIMUTH}>
				{format().degrees(azimuth())}
			</CardInfo.Entry>
			<CardInfo.Entry property={t().LABEL.DISTANCE}>
				{format().kilometers(distance())}
			</CardInfo.Entry>
			<CardInfo.Entry property={t().LABEL.PARALLACTIC_ANGLE}>
				{format().degrees(parallacticAngle())}
			</CardInfo.Entry>
		</CardInfo>
	);
}
