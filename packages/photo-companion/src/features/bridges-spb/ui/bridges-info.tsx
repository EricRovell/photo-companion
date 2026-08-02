import { Show } from "solid-js";

import { PropertyList } from "~/shared/ui";

import { useBridges } from "../model";
import { BridgesStateAll } from "./bridge-state-all";
import { BridgeStateList } from "./bridge-state-list/bridge-state-list";
import { NavigationState } from "./navigation-state";
import { NextBridgeCountdown } from "./next-bridge-countdown";

interface Props {
	title?: string;
}

export function BridgesInfo(props: Props) {
	const { getNavigationState, isAllBridgesLiftedDown } = useBridges();

	return (
		<PropertyList>
			<Show when={props.title}>
				{title => (
					<PropertyList.Header>
						{title()}
					</PropertyList.Header>
				)}
			</Show>
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
