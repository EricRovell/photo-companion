import { Show } from "solid-js";

import { CardInfo } from "~/components";
import { useBridges } from "~/services/bridges-spb";

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
		<CardInfo title={props.title}>
			<NavigationState {...getNavigationState()} />
			<Show when={getNavigationState().navigation}>
				<NextBridgeCountdown />
			</Show>
			<Show fallback={<BridgesStateAll allLiftedDown />} when={!isAllBridgesLiftedDown()}>
				<BridgeStateList />
			</Show>
		</CardInfo>
	);
}
