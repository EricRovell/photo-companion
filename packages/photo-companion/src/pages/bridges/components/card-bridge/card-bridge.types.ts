import type { BridgeScheduleEntry } from "bridge-schedule";

export interface SparklineProps {
	dx: number;
	dy: number;
	end: number;
	schedule: BridgeScheduleEntry;
	start: number;
}

export interface ScheduleEntry {
	fontSize: number;
	hoursEnd: number;
	hoursStart: number;
	minutesEnd: number;
	minutesStart: number;
}

export interface TimeProps {
	date: Date | number;
	fontSize: number;
	x: number;
	y: number;
}

export interface WaterPathProps {
	x1: number;
	x2: number;
}

export interface BridgeSparklineProps {
	angle?: number;
	end?: number;
	fontSize?: number;
	length?: number;
	schedule: BridgeScheduleEntry;
	start?: number;
	strokeWidth?: number;
}
