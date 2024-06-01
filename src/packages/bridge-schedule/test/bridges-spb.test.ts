import { describe, expect, it } from "vitest";

import { getBridgeState, isNavigationTime } from "../src";
import { SUPPORTED_BRIDGES_NAME_SET } from "../src/const";
import { schedule as data } from "../src/schedule";

import type { BridgeName } from "../src/types";

const BETWEEN_OPENINGS_GAP_MINUTES = 10;
const OPENING_GAP_MINUTES = 30;
const nav = data.navigation;

const beforeNavigation = new Date(2023, 0, 1);
const startingNavigation = new Date(2023, nav[0] - 1, nav[1]);
const duringNavigation = new Date(2023, 5, 21);
const endingNavigation = new Date(2023, nav[2] - 1, nav[3]);
const afterNavigation = new Date(2023, 11, 31);

interface Fixture {
	bridgeName: BridgeName;
	date: Date;
	open: boolean;
	timestamp: number;
	when: string;
}

const generateBridgeScheduleFixtures = (bridgeName) => {
	const scheduleList = data.bridges[bridgeName];
	const fixtures: Fixture[] = [];

	fixtures.push({
		bridgeName,
		date: new Date(data.year, 5, 21, scheduleList[0][0] - 1, scheduleList[0][1], 0, 0),
		open: false,
		timestamp: new Date(data.year, 5, 21, scheduleList[0][0], scheduleList[0][1], 0, 0).getTime(),
		when: "before first opening"
	});

	fixtures.push({
		bridgeName,
		date: new Date(data.year, 5, 21, scheduleList.at(-1)[2] + 1, scheduleList.at(-1)[3], 0, 0),
		open: false,
		timestamp: new Date(data.year, 5, 22, scheduleList[0][0], scheduleList[0][1], 0, 0).getTime(),
		when: "after last opening"
	});

	for (const [ hoursOpen, minutesOpen, hoursClose, minutesClose ] of scheduleList) {
		fixtures.push({
			bridgeName,
			date: new Date(data.year, 5, 21, hoursOpen, minutesOpen, 0, 0),
			open: true,
			timestamp: new Date(data.year, 5, 21, hoursClose, minutesClose, 0).getTime(),
			when: "at the opening"
		});

		fixtures.push({
			bridgeName,
			// ASSUMING no bridge is opened only for 30 minutes
			date: new Date(data.year, 5, 21, hoursOpen, minutesOpen + OPENING_GAP_MINUTES, 0, 0),
			open: true,
			timestamp: new Date(data.year, 5, 21, hoursClose, minutesClose, 0).getTime(),
			when: "during the opening"
		});
	}

	if (scheduleList.length > 1) {
		for (let i = 0; i < scheduleList.length - 1; i++) {
			fixtures.push({
				bridgeName,
				date: new Date(data.year, 5, 21, scheduleList[i][2], scheduleList[i][3], 0, 0),
				open: false,
				timestamp: new Date(data.year, 5, 21, scheduleList[i + 1][0], scheduleList[i + 1][1], 0).getTime(),
				when: "at closing"
			});

			fixtures.push({
				bridgeName,
				// ASSUMING no bridge is closed only for 10 minutes
				date: new Date(data.year, 5, 21, scheduleList[i][2], scheduleList[i][3] + BETWEEN_OPENINGS_GAP_MINUTES, 0, 0),
				open: false,
				timestamp: new Date(data.year, 5, 21, scheduleList[i + 1][0], scheduleList[i + 1][1], 0).getTime(),
				when: "between openings"
			});
		}
	}

	return fixtures;
};

describe("Illumination schedule, Saint-Petersburg, Russia", () => {
	describe("Navigation time", () => {
		it("Detects the no-navigation time", () => {
			expect(isNavigationTime(beforeNavigation)).toBe(false);
			expect(isNavigationTime(afterNavigation)).toBe(false);
		});
		it("Detects the navigation time", () => {
			expect(isNavigationTime(startingNavigation)).toBe(true);
			expect(isNavigationTime(duringNavigation)).toBe(true);
			expect(isNavigationTime(endingNavigation)).toBe(true);
		});
	});
	describe("Bridge state with navigation time", () => {
		it("Detects the navigation time", () => {
			// bridge name is not relevant here
			expect(getBridgeState("PALACE", beforeNavigation)).toBeNull();
			expect(getBridgeState("PALACE", startingNavigation)).not.toBeNull();
			expect(getBridgeState("PALACE", duringNavigation)).not.toBeNull();
			expect(getBridgeState("PALACE", endingNavigation)).not.toBeNull();
			expect(getBridgeState("PALACE", afterNavigation)).toBeNull();
		});
		it("Ignores the navigation schedule when specified", () => {
			// bridge name is not relevant here
			expect(getBridgeState("PALACE", beforeNavigation, true)).not.toBeNull();
			expect(getBridgeState("PALACE", startingNavigation, true)).not.toBeNull();
			expect(getBridgeState("PALACE", duringNavigation, true)).not.toBeNull();
			expect(getBridgeState("PALACE", endingNavigation, true)).not.toBeNull();
			expect(getBridgeState("PALACE", afterNavigation, true)).not.toBeNull();
		});
	});
	describe("Bridge schedule state", () => {
		for (const bridgeName of SUPPORTED_BRIDGES_NAME_SET) {
			it(`Getting the schedule of ${bridgeName}`, () => {
				const fixtures = generateBridgeScheduleFixtures(bridgeName);

				for (const { date, open, timestamp } of fixtures) {
					expect(getBridgeState(bridgeName, date, true)).toEqual({
						name: bridgeName,
						open,
						timestamp
					});
				}
			});
		}
	});
});
