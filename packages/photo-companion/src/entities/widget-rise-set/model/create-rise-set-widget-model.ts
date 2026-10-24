import { createMemo } from "solid-js";

import { useTranslation } from "~/features/translation";

import { buildRiseSetAriaLabel, formatRiseSetEvent, getRiseSetStatusKey } from "../lib";

import type { RiseSetWidgetProps } from "../types";

export function createRiseSetWidgetModel(props: RiseSetWidgetProps) {
	const { format, t } = useTranslation();

	const title = () => props.entity === "moon" ? t().TITLE.MOON_TIMES : t().TITLE.SUN_TIMES;
	const riseLabel = () => props.entity === "moon" ? t().MOON_TIMES.MOONRISE : t().RISE_SET.SUNRISE;
	const setLabel = () => props.entity === "moon" ? t().MOON_TIMES.MOONSET : t().RISE_SET.SUNSET;

	const eventOptions = () => ({
		date: props.date,
		formatDate: format().dateShort,
		formatTime: format().timeShort,
		labels: t().RISE_SET
	});

	const rise = createMemo(() => formatRiseSetEvent(props.rise, riseLabel(), eventOptions()));
	const set = createMemo(() => formatRiseSetEvent(props.set, setLabel(), eventOptions()));

	const status = createMemo(() => {
		const key = getRiseSetStatusKey(props);
		return key ? t().RISE_SET[key] : null;
	});

	return {
		ariaLabel: () => buildRiseSetAriaLabel(title(), rise(), set()),
		currentTime: () => format().timeShort(props.date),
		rise,
		set,
		status,
		title
	};
}
