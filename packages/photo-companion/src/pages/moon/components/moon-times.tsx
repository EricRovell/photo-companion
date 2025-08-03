import { classnames } from "utils";

import { GaugeTime, Moon } from "~/components";
import { useTranslation } from "~/features/translation";
import { useDatetime } from "~/hooks";
import { useMoonService } from "~/services/moon";

import styles from "../moon.module.css";

const MOON_SIZE = 48;

export function MoonTimes() {
	const { t } = useTranslation();
	const { getDatetime } = useDatetime();
	const { moonrise, moonset, phaseValue, rotation } = useMoonService();

	return (
		<section class={classnames("card", styles.root)} data-label="moon">
			<header>
				<h2>{t().TITLE.MOON_TIMES}</h2>
			</header>
			<GaugeTime
				date={getDatetime()}
				timeEnd={moonset()}
				timeStart={moonrise()}
			>
				<foreignObject
					height={MOON_SIZE}
					width={MOON_SIZE}
					x={-MOON_SIZE / 2}
					y={-MOON_SIZE / 2}
				>
					<Moon
						phase={phaseValue()}
						rotation={rotation()}
						size={MOON_SIZE}
					/>
				</foreignObject>
			</GaugeTime>
		</section>
	);
}
