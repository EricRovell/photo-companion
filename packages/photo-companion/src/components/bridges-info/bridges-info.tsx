import { Show } from "solid-js";

import { useBridges } from "~/features/bridges-spb";
import { PropertyList } from "~/shared/ui";

import { BridgesStateAll } from "./bridge-state-all";
import { BridgeStateList } from "./bridge-state-list";
import { NavigationState } from "./navigation-state";
import { NextBridgeCountdown } from "./next-bridge-countdown";

interface Props {
	title?: string;
}

export function BridgesInfo(props: Props) {
	const { getNavigationState, isAllBridgesLiftedDown } = useBridges();

	return (
		<PropertyList>
			<PropertyList.Header>
				{props.title}
			</PropertyList.Header>
			<PropertyList.Body>
				<NavigationState {...getNavigationState()} />
				<Show when={getNavigationState().navigation}>
					<NextBridgeCountdown />
				</Show>
				<Show fallback={<BridgesStateAll allLiftedDown />} when={!isAllBridgesLiftedDown()}>
					<BridgeStateList />
				</Show>
			</PropertyList.Body>
		</PropertyList>
	);
}
