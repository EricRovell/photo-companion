import { schedule } from "./schedule";

import type { BridgeName } from "./types";

/**
 * Some drawbridges has non-permanent schedule.
 * The `isBridgeException` provides a way to check
 * is the given bridge should be considered as such an exception.
 */
export function isBridgeException(name: BridgeName): boolean {
	return schedule.exception.includes(name);
}
