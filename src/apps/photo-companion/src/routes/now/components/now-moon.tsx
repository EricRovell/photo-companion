import { Show } from "solid-js";

import { CardEntry, CardInfo } from "@lib/components";
import { useTranslation } from "@lib/context/translation";

import { useMoonData } from "../../moon/use-moon-data";

export function NowMoon() {
	const { formatters, t } = useTranslation();
	const { getMoonData } = useMoonData();

	return (
		<CardInfo title={t().TITLE.MOON}>
			<CardEntry property={t().LABEL.MOONRISE_TIME}>
				<Show fallback="—" when={getMoonData().moonrise}>
					{value => formatters().formatTimeShort(value())}
				</Show>
			</CardEntry>
			<CardEntry property={t().LABEL.MOONSET_TIME}>
				<Show fallback="—" when={getMoonData().moonset}>
					{value => formatters().formatTimeShort(value())}
				</Show>
			</CardEntry>
			<CardEntry property={t().LABEL.MOON_ILLUMINATION}>
				{getMoonData().fraction}
			</CardEntry>
			<CardEntry property={t().LABEL.MOON_PHASE}>
				{t().MOON_PHASE[getMoonData().phaseName]}
			</CardEntry>
			<Show when={getMoonData().fullMoonName}>
				{name => (
					<CardEntry property={t().LABEL.FULL_MOON_NAME}>
						{t().MOON_NAME[name()]}
					</CardEntry>
				)}
			</Show>
			<CardEntry property={t().LABEL.DURATION_MOONLIGHT}>
				{getMoonData().duration}
			</CardEntry>
			<CardEntry property={t().LABEL.ALTITUDE}>
				{getMoonData().altitude}
			</CardEntry>
			<CardEntry property={t().LABEL.AZIMUTH}>
				{getMoonData().azimuth}
			</CardEntry>
		</CardInfo>
	);
}
