import type { Translation } from "./translation.type";

export const t = {
	BRIDGE_NAME_SPB: {
		ALEXANDER_NEVSKY: "Alexander Nevsky",
		ANNUNCIATION: "Annunciation",
		BOLSHEOKHTINSKY: "Bolsheokhtinsky",
		EXCHANGE: "Exchange",
		GRENADERSKY: "Grenadersky",
		KANTEMIROVSKY: "Kantemirovsky",
		LITEYNY: "Liteyny",
		PALACE: "Palace",
		SAMPSONIEVSKY: "Sampsonievsky",
		TRINITY: "Trinity",
		TUCHKOV: "Tuchkov",
		VOLODARSKY: "Volodarsky"
	},
	BRIDGE_SPB_EVENTS: {
		ALEXANDER_NEVSKY_CLOSE: "Lifting down the Alexander Nevskiy bridge",
		ALEXANDER_NEVSKY_OPEN: "Lifting up the Alexander Nevskiy bridge",
		ANNUNCIATION_CLOSE: "Lifting down the Annunciation bridge",
		ANNUNCIATION_OPEN: "Lifting up the Annunciation bridge",
		BOLSHEOKHTINSKY_CLOSE: "Lifting down the Bolsheokhtinsky bridge",
		BOLSHEOKHTINSKY_OPEN: "Lifting up the Bolsheokhtinsky bridge",
		EXCHANGE_CLOSE: "Lifting down the Exchange bridge",
		EXCHANGE_OPEN: "Lifting up the Exchange bridge",
		GRENADERSKY_CLOSE: "Lifting down the Grenadersky bridge",
		GRENADERSKY_OPEN: "Lifting up the Grenadersky bridge",
		KANTEMIROVSKY_CLOSE: "Lifting down the Kantemirovsky bridge",
		KANTEMIROVSKY_OPEN: "Lifting up the Kantemirovsky bridge",
		LITEYNY_CLOSE: "Lifting down the Liteyny bridge",
		LITEYNY_OPEN: "Lifting up the Liteyny bridge",
		PALACE_CLOSE: "Lifting down the Palace bridge",
		PALACE_OPEN: "Lifting up the Palace bridge",
		SAMPSONIEVSKY_CLOSE: "Lifting down the Sampsonievsky bridge",
		SAMPSONIEVSKY_OPEN: "Lifting up the Sampsonievsky bridge",
		TRINITY_CLOSE: "Lifting down the Trinity bridge",
		TRINITY_OPEN: "Lifting up the Trinity bridge",
		TUCHKOV_CLOSE: "Lifting down the Tuchkov bridge",
		TUCHKOV_OPEN: "Lifting up the Tuchkov bridge",
		VOLODARSKY_CLOSE: "Lifting down the Volodarsky bridge",
		VOLODARSKY_OPEN: "Lifting up the Volodarsky bridge"
	},
	CITIES: {
		MOSCOW: "Moscow, Russia",
		OTHER: "Other",
		SAINT_PETERSBURG: "Saint-Petersburg, Russia"
	},
	ERRORS: {
		DATE: "Invalid date",
		LATITUDE: "Invalid latitude value",
		LENGTH_SHADOW: "Shadow length should be a non-negative number",
		LEVEL_OBJECT: "Object sea-level should be a non-negative number",
		LEVEL_SHADOW: "Shadow sea-level should be a non-negative number",
		LONGITUDE: "Invalid longitude value",
		NEGATIVE_HEIGHT: "Negative result. Possibly, invalid input",
		SUN_IS_BELOW: "Sun is below the horizon",
		TIME: "Invalid time",
		TIMEZONE: "Invalid timezone"
	},
	LABEL: {
		ALL_BRIDGES_LIFTED_DOWN: "All drawbridges are lifted down",
		ALL_BRIDGES_LIFTED_UP: "All drawbridges are lifted up",
		ALTITUDE: "Altitude",
		ALWAYS: "Always",
		ASK_DEVICE_GEOLOCATION: "Ask device for geolocation",
		AZIMUTH: "Azimuth",
		BRIDGE: "Bridge",
		BRIDGE_CLOSED: "Lifted down",
		BRIDGE_CLOSING: "Lifting down",
		BRIDGE_OPENED: "Lifted up",
		BRIDGE_OPENING: "Lifting up",
		BRIDGES_LIFTED_DOWN: "Lifted down bridges",
		BRIDGES_LIFTED_UP: "Lifted up bridges",
		BRIDGES_SPB: "Saint-Petersburg Drawbridges",
		CALCULATE: "Calculate",
		CITY: "City",
		DATE: "Date",
		DATETIME: "Date and time",
		DECLINATION: "Declination",
		DEGREES: "Degrees",
		DISTANCE: "Distance",
		DURATION_DAYLIGHT: "Daylight duration",
		DURATION_LIGHTS: "Lights duration",
		DURATION_MOONLIGHT: "Moonlight duration",
		EVENT_ALLOW_LIST: "Event allow list",
		FULL_MOON_NAME: "Full Moon Name",
		GEOLOCATION: "Geolocation",
		GO_HOME: "Go Home",
		HEIGHT: "Height",
		LANGUAGE: "Language",
		LATITUDE: "Latitude",
		LIGHTS_CITY: "City lights",
		LONGITUDE: "Longitude",
		MENU: "Menu",
		MINUTES: "Minutes",
		MOON_ILLUMINATION: "Moon illumination",
		MOON_PHASE: "Moon phase",
		MOONRISE_TIME: "Moonrise time",
		MOONSET_TIME: "Moonset time",
		NAVIGATION: "Navigation",
		NAVIGATION_CLOSED_SHORT: "Closed",
		NAVIGATION_OPENED_SHORT: "Opened",
		NEXT_DAY: "Next day",
		NOW: "Now",
		OBJECT_LEVEL: "Object level, m",
		PARALLACTIC_ANGLE: "Parallactic angle",
		PREVIOUS_DAY: "Previous day",
		RELOAD: "Reload",
		RESET: "Reset",
		SAVE: "Save",
		SECONDS: "Seconds",
		SHADOW_LENGTH: "Shadow length, m",
		SHADOW_LEVEL: "Shadow level, m",
		STATE: "State",
		SUNRISE_TIME: "Sunrise time",
		SUNSET_TIME: "Sunset time",
		TABS: "Tabs",
		TILL_TURNED_OFF: "Till turning off",
		TILL_TURNED_ON: "Till turning on",
		TIME: "Time",
		TIME_OFF: "Shutdown time",
		TIME_ON: "On time",
		TIMEZONE: "Timezone",
		TURNED_OFF: "Turned off",
		TURNED_ON: "Turned on",
		WANING: "Waning",
		WAXING: "Waxing",
		ZENITH: "Zenith"
	},
	LIGHTS_EVENTS: {
		LIGHTS_END: "City lights switched off",
		LIGHTS_START: "City Lights switched on"
	},
	MESSAGE: {
		BRIDGE_EXCEPTION: "Lifting up this bridge is carried out upon prior request 2 days in advance.",
		BRIDGE_WILL_CLOSE_WITHIN: "The bridge will be lifted down within",
		BRIDGE_WILL_OPEN_WITHIN: "The bridge will be lifted up within",
		CHECK_DATE_INPUT: "Please, check out the date-time input and choose it right",
		DATA_UPDATE_ERROR: "Error: could not get the data",
		DATA_UPDATE_SUCCESS: "Data was updated successfully",
		EVENTS_ARE_DISABLED: "All events are disabled",
		NAVIGATION_ENDS_AT: "Navigation ends in",
		NAVIGATION_STARTS_AT: "Navigation starts after",
		NO_EVENTS: "No more events for this date",
		PAGE_404: "Unfortunately, such page does not exist...",
		SET_CURRENT_DATE_ADVICE: "Set the current date and time using the button below",
		SET_CURRENT_DATETIME: "Set the current date and time",
		TAB_LIMITS: "Select at least 1 tab",
		UPDATE: "Update is ready to be installed. To get it ready, please, reload the application or the web page.",
		WRONG_DATE: "Error: incorrect date-time value.",
		WRONG_DATE_URL: "Please, check the URL for correct date-time format"
	},
	MOON_NAME: {
		BEAVER: "Beaver",
		BUCK: "Buck",
		COLD: "Cold",
		CORN: "Corn",
		FLOWER: "Flower",
		HUNTER: "Hunter",
		PINK: "Pink",
		SNOW: "Snow",
		STRAWBERRY: "Strawberry",
		STURGEON: "Sturgeon",
		WOLF: "Wolf",
		WORM: "Worm"
	},
	MOON_PHASE: {
		FIRST_QUARTER: "First Quarter",
		FULL_MOON: "Full Moon",
		NEW_MOON: "New Moon",
		THIRD_QUARTER: "Third Quarter",
		WANING_CRESCENT: "Waning Crescent",
		WANING_GIBBOUS: "Waning Gibbous",
		WAXING_CRESCENT: "Waxing Crescent",
		WAXING_GIBBOUS: "Waxing Gibbous"
	},
	MOON_TIMES: {
		MOONRISE: "Moonrise",
		MOONSET: "Moonset"
	},
	SUN_TIMES: {
		ASTRONOMICAL_DAWN: "Astronomical dawn",
		ASTRONOMICAL_DAWN_TITLE: "The night ends",
		ASTRONOMICAL_DUSK: "Night begins",
		ASTRONOMICAL_DUSK_TITLE: "Astronomical dusk ends",
		BLUE_HOUR: "Blue hour",
		BLUE_HOUR_END_DAWN: "Dawn blue hour",
		BLUE_HOUR_END_DAWN_TITLE: "Dawn blue hour ends",
		BLUE_HOUR_END_DUSK: "Dusk blue hour ends",
		BLUE_HOUR_START_DAWN: "Dawn blue hour starts",
		BLUE_HOUR_START_DUSK: "Dusk blue hour",
		BLUE_HOUR_START_DUSK_TITLE: "Dusk golden hour ends",
		CIVIL_DAWN: "Civil dawn",
		CIVIL_DAWN_TITLE: "Nautical dawn ends",
		CIVIL_DUSK: "Civil dusk",
		CIVIL_DUSK_TITLE: "Civil dusk ends",
		GOLDEN_HOUR: "Golden hour",
		GOLDEN_HOUR_END_DAWN: "Dawn golden hour ends",
		GOLDEN_HOUR_END_DAWN_TITLE: "The daytime begins",
		GOLDEN_HOUR_END_DUSK: "Civil twilight",
		GOLDEN_HOUR_START_DAWN: "Dawn golden hour",
		GOLDEN_HOUR_START_DAWN_TITLE: "Civil dawn ends",
		GOLDEN_HOUR_START_DUSK: "Dusk golden hour",
		GOLDEN_HOUR_START_DUSK_TITLE: "The daytime ends",
		NADIR: "Nadir",
		NADIR_TITLE: "Darkest moment of the night",
		NAUTICAL_DAWN: "Nautical dawn",
		NAUTICAL_DAWN_TITLE: "Nautical dawn ends",
		NAUTICAL_DUSK: "Astronomical dusk",
		NAUTICAL_DUSK_TITLE: "Nautical dusk ends",
		NIGHT: "Night",
		SOLAR_NOON: "Solar noon",
		SUNRISE_END: "Sunrise ends",
		SUNRISE_END_TITLE: "The Sun disk is above the horizon",
		SUNRISE_START: "Sunrise starts",
		SUNRISE_START_TITLE: "The Sun disk shows up at the horizon",
		SUNSET_END: "Sunset ends",
		SUNSET_END_TITLE: "The Sun disk is below the horizon",
		SUNSET_START: "Sunset starts",
		SUNSET_START_TITLE: "The Sun disk touches the horizon"
	},
	TITLE: {
		ABOUT: "FAQ",
		BRIDGES: "Bridges",
		BRIDGES_FULL: "Saint-Petersburg Drawbridges",
		BRIDGES_SCHEDULE_SPB: "Saint-Petersburg drawbridges schedule",
		CHANGELOG: "Changelog",
		ELEVATION_MOON: "The Moon Elevation",
		ELEVATION_SUN: "The Sun Elevation",
		ERROR: "Error",
		HEIGHT_BY_SHADOW: "Height by shadow",
		HEIGHT_BY_SHADOW_FULL: "Height by shadow length calculator",
		LIGHTS: "City Lights",
		LIGHTS_DATA_BY_DATE: "City Lights Schedule by Date",
		LIGHTS_FULL: "City Lights",
		MOON: "The Moon",
		MOON_PHASE_CALENDAR: "The Moon Phases Calendar",
		MOON_TIMES: "The Moon Times",
		NAVIGATION_CLOSED: "The navigation is closed",
		NAVIGATION_OPENED: "The navigation is opened",
		NOW: "Now",
		SETTINGS: "Settings",
		SUN: "The Sun",
		SUN_TIMES: "The Sun Times",
		THE_CLOSEST_EVENT: "The closest event",
		TIMELINE: "Timeline",
		UPDATE: "Update"
	}
} as const satisfies Translation;
