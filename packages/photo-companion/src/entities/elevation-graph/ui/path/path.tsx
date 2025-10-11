import { createMemo, splitProps } from "solid-js";
import { classnames } from "utils";
import { isSameDay } from "utils/date";

import type { JSX} from "solid-js";

import { useSettings } from "~/features/settings";

import { createPathBuilder } from "../../lib";

import type { AltitudeGetter } from "../../types";

import styles from "./path.module.css";

interface Props extends JSX.SvgSVGAttributes<SVGPathElement> {
	date: Date;
	getAltitude: AltitudeGetter;
}

const MEMO_OPTIONS = {
	equals: (prev: Date, next: Date) => isSameDay(prev, next)
};

export function Path(allProps: Props) {
	const [ props, rest ] = splitProps(allProps, [ "class", "getAltitude", "date" ]);

	const { settings } = useSettings();
	const buildPath = () => createPathBuilder(props.getAltitude);

	const path = createMemo(() => {
		return buildPath()(props.date, settings.latitude, settings.longitude);
	}, MEMO_OPTIONS);

	return (
		<path
			class={classnames(styles.graph, props.class)}
			d={path()}
			{...rest}
		/>
	);
}
