import { schedule as scheduleMoscow } from "./lights-moscow";
import { schedule as scheduleSPb } from "./lights-saint-petersburg";

import type { CityLightsSchedule } from "../types";

export const data: Record<string, CityLightsSchedule> = {
	[scheduleMoscow.city]: scheduleMoscow,
	[scheduleSPb.city]: scheduleSPb
};
