import { createMemo, splitProps } from "solid-js";
import { classnames, setAttribute } from "utils";

import type { JSX} from "solid-js";

import { useSettings } from "~/features/settings";

import { createObjectCoordsGetter } from "../../lib";

import type { AltitudeGetter } from "../../types";

import styles from "./pointer.module.css";

interface Props extends JSX.SvgSVGAttributes<SVGCircleElement> {
	date: Date;
	getAltitude: AltitudeGetter;
	pointerSize?: number;
}

const DEFAULT_SIZE = 6;

export function Pointer(allProps: Props) {
	const [ props, rest ] = splitProps(allProps, [ "class", "getAltitude", "date", "pointerSize" ]);
	const { settings } = useSettings();

	const getPosition = () => createObjectCoordsGetter(props.getAltitude);
	const position = createMemo(() => getPosition()(props.date, settings.latitude, settings.longitude));

	return (
		<circle
			class={classnames(styles.pointer, props.class)}
			cx={position().x}
			cy={position().y}
			data-above={setAttribute(position().y >= 0)}
			r={props.pointerSize ?? DEFAULT_SIZE}
			{...rest}
		/>
	);
}
