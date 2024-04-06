import { settings } from "@stores/settings";
import { initLightsProvider } from "lights-schedule";

export const provider = () => initLightsProvider(settings().lights_city);
