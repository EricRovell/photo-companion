import { GaugeTime } from "~/entities/gauge";
import { Sun } from "~/entities/sun";
import { useDatetime } from "~/features/datetime-query";
import { useTranslation } from "~/features/translation";
import { Text } from "~/shared/ui";

import { useSunService } from "../model";

const SUN_SIZE = 30;

export function SunTimes() {
	const { t } = useTranslation();
	const { getDatetime } = useDatetime();
	const { sunrise, sunset } = useSunService();

	return (
		<section class={"card"} data-label="sun">
			<header>
				<Text as="h2" variant="heading-l">{t().TITLE.SUN_TIMES}</Text>
			</header>
			<GaugeTime
				date={getDatetime()}
				timeEnd={sunset()}
				timeStart={sunrise()}
			>
				<Sun
					height={SUN_SIZE}
					width={SUN_SIZE}
					x={-SUN_SIZE / 2}
					y={-SUN_SIZE / 2}
				/>
			</GaugeTime>
		</section>
	);
}
