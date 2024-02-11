import type { NavigationSchedule } from "./types";

export const schedule: NavigationSchedule = {
	"year": 2024,
	"navigation": [ 4, 10, 11, 30 ],
	"exception": [
		"SAMPSONIEVSKY",
		"GRENADERSKY",
		"KANTEMIROVSKY"
	],
	"bridges": {
		"ALEXANDER_NEVSKY": [[ 2, 20, 5, 10 ]],
		"EXCHANGE": [[ 2, 0, 4, 55 ]],
		"ANNUNCIATION": [[ 1, 25, 2, 45 ], [ 3, 10, 5, 0 ]],
		"BOLSHEOKHTINSKY": [[ 2, 0, 5, 0 ]],
		"VOLODARSKY": [[ 2, 0, 3, 45 ], [ 4, 15, 5, 45 ]],
		"PALACE": [[ 1, 10, 2, 50 ],[ 3, 10, 4, 45 ]],
		"LITEYNY": [[1, 40, 4, 45]],
		"TRINITY": [[ 1, 20, 4, 50 ]],
		"TUCHKOV": [[ 2, 0, 2, 55 ], [ 3, 35, 4, 55 ]],
		"SAMPSONIEVSKY": [[ 1, 30, 4, 30 ]],
		"GRENADERSKY": [[ 1, 30, 4, 30 ]],
		"KANTEMIROVSKY": [[ 1, 30, 4, 30 ]]
	}
};
