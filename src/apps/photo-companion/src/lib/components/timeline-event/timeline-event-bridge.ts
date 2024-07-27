import type { BridgeEvent } from "types";

import { Bridge } from "../bridge/bridge";

import type { Translation } from "@lib/context/translation";
import type { EventComponent } from "@lib/types";

export function bridgeEventComponent(event: BridgeEvent, t: Translation): EventComponent<{ open: boolean }> {
	return {
		component: Bridge,
		message: event.data.open ? t.LABEL.BRIDGE_OPENING : t.LABEL.BRIDGE_CLOSING,
		props: {
			open: event.data.open
		},
		title: `${t.BRIDGE_NAME_SPB[event.data.bridgeName]} мост`
	};
}
