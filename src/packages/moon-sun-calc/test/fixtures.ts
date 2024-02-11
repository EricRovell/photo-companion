import { SunEventName } from "@shared/types";

interface SolarFixture {
	event: SunEventName;
	dateString: string;
}

export const DATE = new Date(Date.UTC(2013, 2, 5, 0, 0, 0 ,0 ));
export const LAT = 50.5; // 50° 30"
export const LNG = 30.5; // 30° 30"
export const HEIGHT = 2000;

// https://www.suncalc.org/#/-34,151,8/2013.03.06/11:00/1/0
export const LAT_SOUTHERN_HEMISPHERE = -34; // -34° - southern hemisphere
export const LNG_SOUTHERN_HEMISPHERE = 151; // 151° - southern hemisphere

export const TIMES_NORTH_HEMISPHERE: SolarFixture[] = [
	{
		event: "SOLAR_NOON",
		dateString: "2013-03-05T10:10:57Z"
	},
	{
		event: "NADIR",
		dateString: "2013-03-05T22:10:57Z"
	},
	{
		event: "SUNRISE_START",
		dateString: "2013-03-05T04:34:56Z"
	},
	{
		event: "SUNSET_END",
		dateString: "2013-03-05T15:46:57Z"
	},
	{
		event: "SUNRISE_END",
		dateString: "2013-03-05T04:38:19Z"
	},
	{
		event: "SUNSET_START",
		dateString: "2013-03-05T15:43:34Z"
	},
	{
		event: "CIVIL_DAWN",
		dateString: "2013-03-05T04:02:17Z"
	},
	{
		event: "CIVIL_DUSK",
		dateString: "2013-03-05T16:19:36Z"
	},
	{
		event: "NAUTICAL_DAWN",
		dateString: "2013-03-05T03:24:31Z"
	},
	{
		event: "NAUTICAL_DUSK",
		dateString: "2013-03-05T16:57:22Z"
	},
	{
		event: "ASTRONOMICAL_DAWN",
		dateString: "2013-03-05T02:46:17Z"
	},
	{
		event: "ASTRONOMICAL_DUSK",
		dateString: "2013-03-05T17:35:36Z"
	},
	{
		event: "GOLDEN_HOUR_END_DAWN",
		dateString: "2013-03-05T05:19:01Z"
	},
	{
		event: "GOLDEN_HOUR_START_DUSK",
		dateString: "2013-03-05T15:02:52Z"
	}
];

export const TIMES_SOUTH_HEMISPHERE: SolarFixture[] = [
	{
		event: "SOLAR_NOON",
		dateString: "2013-03-05T02:09:01.832Z"
	},
	{
		event: "NADIR",
		dateString: "2013-03-05T14:09:01.832Z"
	},
	{
		event: "GOLDEN_HOUR_START_DUSK",
		dateString: "2013-03-05T07:56:33.416Z"
	},
	{
		event: "GOLDEN_HOUR_END_DAWN",
		dateString: "2013-03-04T20:21:30.248Z"
	},
	{
		event: "SUNSET_START",
		dateString: "2013-03-05T08:27:05.997Z"
	},
	{
		event: "SUNRISE_END",
		dateString: "2013-03-04T19:50:57.667Z"
	},
	{
		event: "SUNSET_END",
		dateString: "2013-03-05T08:29:41.731Z"
	},
	{
		event: "SUNRISE_START",
		dateString: "2013-03-04T19:48:21.933Z"
	},
	{
		event: "GOLDEN_HOUR_END_DUSK",
		dateString: "2013-03-05T08:30:30.554Z"
	},
	{
		event: "GOLDEN_HOUR_START_DAWN",
		dateString: "2013-03-04T19:47:33.110Z"
	},
	{
		event: "BLUE_HOUR_START_DUSK",
		dateString: "2013-03-05T08:45:10.179Z"
	},
	{
		event: "BLUE_HOUR_END_DAWN",
		dateString: "2013-03-04T19:32:53.485Z"
	},
	{
		event: "CIVIL_DUSK",
		dateString: "2013-03-05T08:54:59.722Z"
	},
	{
		event: "CIVIL_DAWN",
		dateString: "2013-03-04T19:23:03.942Z"
	},
	{
		event: "BLUE_HOUR_END_DUSK",
		dateString: "2013-03-05T09:04:52.263Z"
	},
	{
		event: "BLUE_HOUR_START_DAWN",
		dateString: "2013-03-04T19:13:11.401Z"
	},
	{
		event: "NAUTICAL_DUSK",
		dateString: "2013-03-05T09:24:48.289Z"
	},
	{
		event: "NAUTICAL_DAWN",
		dateString: "2013-03-04T18:53:15.375Z"
	},
	{
		event: "ASTRONOMICAL_DUSK",
		dateString: "2013-03-05T09:55:18.657Z"
	},
	{
		event: "ASTRONOMICAL_DAWN",
		dateString: "2013-03-04T18:22:45.007Z"
	}
];

export const HEIGHT_TIMES: SolarFixture[] = [
	{
		event: "SOLAR_NOON",
		dateString: "2013-03-05T10:10:57Z"
	},
	{
		event: "NADIR",
		dateString: "2013-03-05T22:10:57Z"
	},
	{
		event: "SUNRISE_START",
		dateString: "2013-03-05T04:25:07Z"
	},
	{
		event: "SUNSET_END",
		dateString: "2013-03-05T15:56:46Z"
	}
];
