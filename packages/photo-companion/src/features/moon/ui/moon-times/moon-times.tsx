import { Moon } from "~/entities/moon";
import { RiseSetWidget } from "~/entities/widget-rise-set";
import { useDatetime } from "~/features/datetime-query";
import { LinkQuery } from "~/features/navigation";
import { createQueryDate } from "~/shared/lib/query-date";

import { useMoonService } from "../../model/moon.context";

const MOON_SIZE = 72;

export function MoonTimes() {
	const { getDatetime } = useDatetime();
	const { altitude, belowHorizonInterval, nextRise, phaseValue, riseSetTimes, rotation } = useMoonService();

	return (
		<RiseSetWidget
			aboveHorizon={altitude() >= 0}
			belowHorizonInterval={belowHorizonInterval()}
			date={getDatetime()}
			entity="moon"
			nextRise={nextRise()}
			renderTime={(date, children, label) => (
				<LinkQuery aria-label={label} href="/moon" noScroll query={new URLSearchParams({ datetime: createQueryDate(date) })}>
					{children}
				</LinkQuery>
			)}
			rise={riseSetTimes().rise}
			set={riseSetTimes().set}
		>
			<Moon height={MOON_SIZE} phase={phaseValue()} rotation={rotation()} size={MOON_SIZE} width={MOON_SIZE} />
		</RiseSetWidget>
	);
}
