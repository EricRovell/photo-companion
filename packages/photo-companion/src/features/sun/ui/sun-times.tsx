import { Sun } from "~/entities/sun";
import { RiseSetWidget } from "~/entities/widget-rise-set";
import { useDatetime } from "~/features/datetime-query";
import { LinkQuery } from "~/features/navigation";
import { createQueryDate } from "~/shared/lib/query-date";

import { useSunService } from "../model";

const SUN_SIZE = 64;

export function SunTimes() {
	const { getDatetime } = useDatetime();
	const { altitude, belowHorizonInterval, nextRise, riseSetTimes } = useSunService();

	return (
		<RiseSetWidget
			aboveHorizon={altitude() >= 0}
			belowHorizonInterval={belowHorizonInterval()}
			date={getDatetime()}
			entity="sun"
			nextRise={nextRise()}
			renderTime={(date, children, label) => (
				<LinkQuery
					aria-label={label}
					href="/sun"
					noScroll
					query={new URLSearchParams({ datetime: createQueryDate(date) })}
				>
					{children}
				</LinkQuery>
			)}
			rise={riseSetTimes().rise}
			set={riseSetTimes().set}
		>
			<Sun height={SUN_SIZE} width={SUN_SIZE} />
		</RiseSetWidget>
	);
}
