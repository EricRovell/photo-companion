import type { ParentProps } from "solid-js";

import { formatTimeShort } from "@stores/lang";
import { Gauge } from "./gauge";
import { getAngleFromTime } from "@lib/helpers";

interface Props {
	date: Date;
	timeStart: Nullish<Date>;
	timeEnd: Nullish<Date>;
	pointerAngle?: number;
}

export function GaugeTime(props: ParentProps<Props>) {

	return (
		<Gauge
			angleStart={getAngleFromTime(props.timeStart)}
			angleEnd={getAngleFromTime(props.timeEnd)}
			labelStart={formatTimeShort(props.timeStart)}
			labelEnd={formatTimeShort(props.timeEnd)}
			pointerAngle={getAngleFromTime(props.date)}
		>
			{props.children}
		</Gauge>
	);
}
