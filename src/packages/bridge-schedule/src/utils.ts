import { schedule } from "./schedule";
import type { BridgeName } from "./types";

export function isBridgeException(name: BridgeName): boolean {
	return schedule.exception.includes(name);
}
