import type { BridgeEvent } from "types";

import { BridgeIcon } from "~/features/bridges-spb";

import type { EventComponent } from "../types";
import type { Translation } from "~/features/translation";

export function bridgeEventComponent(event: BridgeEvent, t: Translation): EventComponent<{ open: boolean }> {
	return {
		component: BridgeIcon,
		message: event.data.open ? t.LABEL.BRIDGE_OPENING : t.LABEL.BRIDGE_CLOSING,
		props: {
			open: event.data.open
		},
		title: `${t.BRIDGE_NAME_SPB[event.data.bridgeName]} ${t.LABEL.BRIDGE.toLocaleLowerCase()}`
	};
}
