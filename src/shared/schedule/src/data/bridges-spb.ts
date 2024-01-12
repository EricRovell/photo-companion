import type { NavigationSchedule } from "../types";

export const schedule: NavigationSchedule = {
	"year": 2023,
	"navigation": [ 4, 10, 11, 30 ],
	"exception": [
		"sampsonievsky",
		"grenadersky",
		"kantemirovsky"
	],
	"bridges": {
		"alexander-nevsky": [[ 2, 20, 5, 10 ]],
		"exchange": [[ 2, 0, 4, 55 ]],
		"annunciation": [[ 1, 25, 2, 45 ], [ 3, 10, 5, 0 ]],
		"bolsheokhtinsky": [[ 2, 0, 5, 0 ]],
		"volodarsky": [[ 2, 0, 3, 45 ], [ 4, 15, 5, 45 ]],
		"palace": [[ 1, 10, 2, 50 ],[ 3, 10, 4, 45 ]],
		"liteyny": [[1, 40, 4, 45]],
		"trinity": [[ 1, 20, 4, 50 ]],
		"tuchkov": [[ 2, 0, 2, 55 ], [ 3, 35, 4, 55 ]],
		"sampsonievsky": [[ 1, 30, 4, 30 ]],
		"grenadersky": [[ 1, 30, 4, 30 ]],
		"kantemirovsky": [[ 1, 30, 4, 30 ]]
	}
};
