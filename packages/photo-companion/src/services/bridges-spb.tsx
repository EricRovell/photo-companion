import {
	getBridgeScheduleEntry,
	getBridgesState,
	getBridgeState,
	getNavigationState,
	getNextBridgeEvent,
	isAllBridgesLiftedDown,
	isBridgeException,
	SUPPORTED_BRIDGES_NAME_SET
} from "bridge-schedule";
import { createContext, createMemo } from "solid-js";
import { objectEntries } from "utils";

import type { BridgeName } from "types";

import { useDatetime } from "~/hooks";
import { useSettings } from "~/services/settings";
import { createProvider } from "~/shared/lib/create-provider";

function createBridgesState() {
	const { isSupportsBridges } = useSettings();
	const { getDatetime } = useDatetime();

	const navigationState = createMemo(() => getNavigationState(getDatetime()));
	const AllBridgesLiftedDown = createMemo(() => isAllBridgesLiftedDown(getDatetime()));

	const bridgesState = createMemo(() => {
		const currentState = getBridgesState(getDatetime());
		const output: { name: BridgeName, open: boolean }[] = [];

		for (const [ name, state ] of objectEntries(currentState)) {
			output.push({
				name,
				open: state
			});
		}

		return output;
	});

	const isSomeBridgeLiftedUp = () => bridgesState().some(bridge => bridge.open);

	return {
		getBridgeScheduleEntry,
		getBridgesState: bridgesState,
		getBridgeState,
		getNavigationState: navigationState,
		getNextBridgeEvent,
		isAllBridgesLiftedDown: AllBridgesLiftedDown,
		isBridgeException,
		isSomeBridgeLiftedUp,
		isSupportsBridges,
		SUPPORTED_BRIDGES_NAME_SET
	};
}

const BridgesContext = createContext<ReturnType<typeof createBridgesState>>();

export const [ BridgesProvider, useBridges ] = createProvider({
	consumerName: "useBridges",
	Context: BridgesContext,
	getValue: createBridgesState,
	providerName: "Bridges"
});
