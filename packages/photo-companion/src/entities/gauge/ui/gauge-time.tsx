import type { ParentProps } from "solid-js";

import { useTranslation } from "~/features/translation";
import { createTweened } from "~/shared/primitives";

import { checkIsPointerActive, getAngleFromTime } from "../lib";
import { Gauge } from "./index";

interface Props {
	date: Date;
	timeEnd: Nullish<DateLike>;
	timeStart: Nullish<DateLike>;
}

export function GaugeTime(props: ParentProps<Props>) {
	const { format } = useTranslation();

	const angleStart = createTweened(() => getAngleFromTime(props.timeStart));
	const angleEnd = createTweened(() => getAngleFromTime(props.timeEnd));

	return (
		<Gauge>
			<Gauge.Rail />
			<Gauge.Slice
				angleEnd={angleEnd()}
				angleStart={angleStart()}
			/>
			<Gauge.Divider isVisible={angleStart() > angleEnd()} />
			<Gauge.MarksWrapper>
				<Gauge.Marks count={24} length={10} />
				<Gauge.Marks count={4} length={15} />
			</Gauge.MarksWrapper>
			{props.children}
			<Gauge.Pointer
				angle={getAngleFromTime(props.date)}
				isActive={checkIsPointerActive(
					getAngleFromTime(props.date),
					angleStart(),
					angleEnd()
				)}
			/>
			<Gauge.Label angle={angleStart()}>
				{format().timeShort(props.timeStart)}
			</Gauge.Label>
			<Gauge.Label angle={angleEnd()}>
				{format().timeShort(props.timeEnd)}
			</Gauge.Label>
		</Gauge>
	);
}
