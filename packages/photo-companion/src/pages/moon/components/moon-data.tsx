import { Show } from "solid-js";

import { CardEntry, CardInfo } from "~/components";
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
			<CardEntry property={t().LABEL.MOON_PHASE}>
				{t().MOON_PHASE[phaseName()]}
			</CardEntry>
			<Show when={fullMoonName()}>
				{name => (
					<CardEntry property={t().LABEL.FULL_MOON_NAME}>
						{t().MOON_NAME[name()]}
					</CardEntry>
				)}
			</Show>
			<CardEntry property={t().LABEL.MOONRISE_TIME}>
				<Show fallback="—" when={moonrise()}>
					{value => format().timeShort(value())}
				</Show>
			</CardEntry>
			<CardEntry property={t().LABEL.MOONSET_TIME}>
				<Show fallback="—" when={moonset()}>
					{value => format().timeShort(value())}
				</Show>
			</CardEntry>
			<CardEntry property={t().LABEL.MOON_ILLUMINATION}>
				{format().percent(fraction())}
			</CardEntry>
			<CardEntry property={t().LABEL.ZENITH}>
				{format().degrees(zenith())}
			</CardEntry>
			<CardEntry property={t().LABEL.ALTITUDE}>
				{format().degrees(altitude())}
			</CardEntry>
			<CardEntry property={t().LABEL.AZIMUTH}>
				{format().degrees(azimuth())}
			</CardEntry>
			<CardEntry property={t().LABEL.DISTANCE}>
				{format().kilometers(distance())}
			</CardEntry>
			<CardEntry property={t().LABEL.PARALLACTIC_ANGLE}>
				{format().degrees(parallacticAngle())}
			</CardEntry>
		</CardInfo>
	);
}
