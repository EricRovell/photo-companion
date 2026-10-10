import { GaugeTime } from "~/entities/gauge";
import { Moon } from "~/entities/moon";
import { useDatetime } from "~/features/datetime-query";
import { useTranslation } from "~/features/translation";
import { Card, Text } from "~/shared/ui";

import { useMoonService } from "../../model";

import styles from "./moon-times.module.css";

const MOON_SIZE = 48;

export function MoonTimes() {
	const { t } = useTranslation();
	const { getDatetime } = useDatetime();
	const { moonrise, moonset, phaseValue, rotation } = useMoonService();

	return (
		<Card class={styles.root} data-label="moon">
			<Card.Header>
				<Text as="h2" variant="heading-l">{t().TITLE.MOON_TIMES}</Text>
			</Card.Header>
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
		</Card>
	);
}
