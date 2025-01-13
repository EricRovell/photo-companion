import { isAllBridgesLiftedDown } from "bridge-schedule";
import { Show } from "solid-js";

import { CardInfo } from "@lib/components";
import { useDatetime } from "@lib/hooks";

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

	return (
		<CardInfo title={props.title}>
			<NavigationState />
			<NextBridgeCountdown />
			<Show fallback={<BridgesStateAll allLiftedDown />} when={!isAllLiftedDown()}>
				<BridgeStateList />
			</Show>
		</CardInfo>
	);
}
