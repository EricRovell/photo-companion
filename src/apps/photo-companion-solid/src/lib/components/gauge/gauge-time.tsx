import type { ParentProps } from "solid-js";

import { Gauge } from "./gauge";
import { getAngleFromTime } from "@lib/helpers";
import { useTranslation } from "@lib/context";

interface Props {
	date: Date;
	timeStart: Nullish<DateLike>;
	timeEnd: Nullish<DateLike>;
}

export function GaugeTime(props: ParentProps<Props>) {
	const { formatters } = useTranslation();

	return (
		<Gauge
			angleStart={getAngleFromTime(props.timeStart)}
			angleEnd={getAngleFromTime(props.timeEnd)}
			labelStart={formatters().formatTimeShort(props.timeStart)}
			labelEnd={formatters().formatTimeShort(props.timeEnd)}
			pointerAngle={getAngleFromTime(props.date)}
		>
			{props.children}
		</Gauge>
	);
}
