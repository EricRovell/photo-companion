import type { BridgeScheduleEntry } from "bridge-schedule";

export interface SparklineProps {
	schedule: BridgeScheduleEntry;
	start: number;
	end: number;
	dx: number;
	dy: number;
}

export interface ScheduleEntry {
	hoursStart: number;
	minutesStart: number;
	hoursEnd: number;
	minutesEnd: number;
	fontSize: number;
}

export interface TimeProps {
	x: number;
	y: number;
	fontSize: number;
	date: Date | number;
}

export interface WaterPathProps {
	x1: number;
	x2: number;
}

export interface BridgeSparklineProps {
	schedule: BridgeScheduleEntry;
	start?: number;
	end?: number;
	angle?: number;
	length?: number;
	strokeWidth?: number;
	fontSize?: number;
}
