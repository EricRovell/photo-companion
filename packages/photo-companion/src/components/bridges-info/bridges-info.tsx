import { getNavigationState, isAllBridgesLiftedDown } from "bridge-schedule";
import { createMemo, Show } from "solid-js";

import { CardInfo } from "~/components";
import { useDatetime } from "~/hooks";

import { BridgesStateAll } from "./bridge-state-all";
import { BridgeStateList } from "./bridge-state-list";
import { NavigationState } from "./navigation-state";
import { NextBridgeCountdown } from "./next-bridge-countdown";

interface Props {
	title?: string;
}

export function BridgesInfo(props: Props) {
	const { getTimestamp } = useDatetime();
	const isAllLiftedDown = () => isAllBridgesLiftedDown(getTimestamp());
	const navigation = createMemo(() => getNavigationState(getTimestamp()));

	return (
		<CardInfo title={props.title}>
			<NavigationState {...navigation()} />
			<Show when={navigation().navigation}>
				<NextBridgeCountdown />
			</Show>
			<Show fallback={<BridgesStateAll allLiftedDown />} when={!isAllLiftedDown()}>
				<BridgeStateList />
			</Show>
		</CardInfo>
	);
}
