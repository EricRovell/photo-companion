import { GaugeTime, Sun } from "~/components";
import { useDatetime } from "~/hooks";
import { useSunService } from "~/services/sun";
import { useTranslation } from "~/services/translation";

const SUN_SIZE = 30;

export function SunTimes() {
	const { t } = useTranslation();
	const { getDatetime } = useDatetime();
	const { sunrise, sunset } = useSunService();

	return (
		<section class={"card"} data-label="sun">
			<header>
				<h2>{t().TITLE.SUN_TIMES}</h2>
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
