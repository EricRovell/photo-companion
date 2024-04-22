import { BridgeScheduleEntry } from "bridge-schedule";

interface Params {
	schedule: BridgeScheduleEntry;
	start: number;
	end: number;
	dx: number;
	dy: number;
}

export function buildBridgeSparklinePath(params: Params): string {
	const { schedule, start, end, dx, dy } = params;

	let x = start * 60;
	let y = 0;

	const pathElements: string[] = [ `M ${x},${y}` ];

	for (const [ hoursStart, minutesStart, hoursEnd, minutesEnd ] of schedule) {
		x = hoursStart * 60 + minutesStart;
		pathElements.push(`L ${x},${y}`);

		x += dx;
		y -= dy;
		pathElements.push(`L ${x},${y}`);

		x = hoursEnd * 60 + minutesEnd - dx;
		pathElements.push(`M ${x},${y}`);

		x += dx;
		y = 0;
		pathElements.push(`L ${x},${y}`);
	}

	x = end * 60;
	pathElements.push(`L ${x},${y}`);

	return pathElements.join(" ");
}
