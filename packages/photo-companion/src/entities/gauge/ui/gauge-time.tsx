import type { ParentProps } from "solid-js";

import { useTranslation } from "~/features/translation";

import { getAngleFromTime } from "../lib";
import { Gauge } from "./gauge/gauge";

interface Props {
	date: Date;
	timeEnd: Nullish<DateLike>;
	timeStart: Nullish<DateLike>;
}

export function GaugeTime(props: ParentProps<Props>) {
	const { format } = useTranslation();

	return (
		<Gauge
			angleEnd={getAngleFromTime(props.timeEnd)}
			angleStart={getAngleFromTime(props.timeStart)}
			labelEnd={format().timeShort(props.timeEnd)}
			labelStart={format().timeShort(props.timeStart)}
			pointerAngle={getAngleFromTime(props.date)}
		>
			{props.children}
		</Gauge>
	);
}
