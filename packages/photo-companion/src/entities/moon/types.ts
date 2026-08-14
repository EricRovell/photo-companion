import type { MoonEventName as AstronomicalMoonEventName } from "moon-sun-calc";

export type MoonEventName = Extract<AstronomicalMoonEventName, "MOONRISE" | "MOONSET">;
