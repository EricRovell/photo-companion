import type { ParentProps } from "solid-js";

import { getAngleFromTime } from "~/lib/helpers";
import { useTranslation } from "~/services/translation";

import { Gauge } from "./gauge";

interface Props {
	date: Date;
	timeEnd: Nullish<DateLike>;
	timeStart: Nullish<DateLike>;
}

export function GaugeTime(props: ParentProps<Props>) {
	const { formatters } = useTranslation();

	return (
		<Gauge
			angleEnd={getAngleFromTime(props.timeEnd)}
			angleStart={getAngleFromTime(props.timeStart)}
			labelEnd={formatters().formatTimeShort(props.timeEnd)}
			labelStart={formatters().formatTimeShort(props.timeStart)}
			pointerAngle={getAngleFromTime(props.date)}
		>
			{props.children}
		</Gauge>
	);
}
