import Bridge from "../bridge/bridge.svelte";
import type { BridgeEvent } from "types";
import type { EventComponent } from "@lib/types";
import type { Translation } from "@stores/lang";

export function bridgeEventComponent(event: BridgeEvent, t: Translation): EventComponent<{ open: boolean }> {
	return {
		component: Bridge,
		props: {
			open: event.data.open
		},
		message: event.data.open ? t.LABEL.BRIDGE_OPENING : t.LABEL.BRIDGE_CLOSING,
		title: `${t.BRIDGE_NAME_SPB[event.data.bridgeName]} мост`
	};
}
