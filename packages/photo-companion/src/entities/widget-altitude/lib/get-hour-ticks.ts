import { ALTITUDE_WIDGET_CONFIG } from "../config";

const { hourStep } = ALTITUDE_WIDGET_CONFIG.axis;

export function getHourTicks(start: number) {
	return Array.from({ length: 24 / hourStep + 1 }, (_, index) => {
		const hour = index * hourStep;
		const date = new Date(start);
		date.setHours(hour);

		return {
			label: String(hour).padStart(2, "0"),
			timestamp: date.getTime()
		};
	});
}
