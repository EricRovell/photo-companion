import type { NavigationSchedule } from "./types";

export const schedule: NavigationSchedule = {
	"bridges": {
		"ALEXANDER_NEVSKY": [[ 2, 20, 5, 10 ]],
		"ANNUNCIATION": [[ 1, 25, 2, 45 ], [ 3, 10, 5, 0 ]],
		"BOLSHEOKHTINSKY": [[ 2, 0, 5, 0 ]],
		"EXCHANGE": [[ 2, 0, 4, 55 ]],
		"GRENADERSKY": [[ 1, 30, 4, 30 ]],
		"KANTEMIROVSKY": [[ 1, 30, 4, 30 ]],
		"LITEYNY": [[1, 40, 4, 45]],
		"PALACE": [[ 1, 10, 2, 50 ],[ 3, 10, 4, 45 ]],
		"SAMPSONIEVSKY": [[ 1, 30, 4, 30 ]],
		"TRINITY": [[ 1, 20, 4, 50 ]],
		"TUCHKOV": [[ 2, 0, 2, 55 ], [ 3, 35, 4, 55 ]],
		"VOLODARSKY": [[ 2, 0, 3, 45 ], [ 4, 15, 5, 45 ]]
	},
	"exception": [
		"SAMPSONIEVSKY",
		"GRENADERSKY",
		"KANTEMIROVSKY"
	],
	"navigation": [ 4, 10, 11, 30 ],
	"year": 2024
};

// Note: These constants are covered by unit tests

export const FIRST_OPENING_MINUTES = schedule.bridges.PALACE[0][0] * 60 + schedule.bridges.PALACE[0][1];
export const LAST_CLOSING_MINUTES = schedule.bridges.VOLODARSKY[1][2] * 60 + schedule.bridges.VOLODARSKY[1][3];
