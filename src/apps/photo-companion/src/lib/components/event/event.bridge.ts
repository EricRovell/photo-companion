import Bridge from "../bridge/bridge.svelte";
import { dict } from "@lib/dict";
import type { BridgeEvent } from "@shared/types";
import type { EventComponent } from "@lib/types";

export function bridgeEventComponent(event: BridgeEvent): EventComponent<{ open: boolean }> {
	return {
		component: Bridge,
		props: {
			open: event.data.open
		},
		message: event.data.open ? dict.LABEL.BRIDGE_OPENING : dict.LABEL.BRIDGE_CLOSING,
		title: `${dict.BRIDGE_NAME_SPB[event.data.bridgeName]} мост`
	};
}
