import { createContext, splitProps, useContext } from "solid-js";
import { isNullable } from "utils/validators";

import type { Accessor, ParentProps} from "solid-js";

interface GaugeProviderProps {
	radius: number;
	railWidth: number;
}

interface GaugeState extends GaugeProviderProps {
	railCenter: Accessor<number>;
}

const GaugeContext = createContext<GaugeState>();

export function GaugeProvider(allProps: ParentProps<GaugeProviderProps>) {
	const [ props, rest ] = splitProps(allProps, [ "children" ]);

	const railCenter = () => rest.radius + rest.railWidth / 2;

	return (
		<GaugeContext.Provider value={{ ...rest, railCenter }}>
			{props.children}
		</GaugeContext.Provider>
	);
}

export function useGauge() {
	const value = useContext(GaugeContext);

	if (isNullable(value)) {
		throw new Error("useGauge must be used with a GaugeContext.Provider");
	}

	return value;
}
