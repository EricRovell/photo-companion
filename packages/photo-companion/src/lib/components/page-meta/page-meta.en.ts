import type { PageMetaDict } from "./page-meta.types";

export const PAGE_META: PageMetaDict = {
	"/": {
		DESCRIPTION: "Minimalistic photography toolkit web-application.",
		KEYWORDS: [ "photography", "the sun", "the moon", "city lights", "drawbridges" ],
		TITLE: "Photo-Companion"
	},
	"/404": {
		DESCRIPTION: "Nothing found",
		KEYWORDS: [ "404" ],
		TITLE: [ "404", "Photo-Companion" ]
	},
	"/about": {
		DESCRIPTION: "About",
		KEYWORDS: [ "faq", "documentation", "user manual" ],
		TITLE: [ "About", "Photo-Companion" ]
	},
	"/bridges": {
		DESCRIPTION: "St. Petersburg Drawbridges",
		KEYWORDS: [ "bridges", "drawbridges", "saint-petersburg", "schedule" ],
		TITLE: [ "St. Petersburg Drawbridges", "Photo-Companion" ]
	},
	"/lights": {
		DESCRIPTION: "City Lights",
		KEYWORDS: [ "city lights", "schedule" ],
		TITLE: [ "City Lights", "Photo-Companion" ]
	},
	"/moon": {
		DESCRIPTION: "The Moon calculations",
		KEYWORDS: [ "the moon", "moon phase", "moonrise", "moonset" ],
		TITLE: [ "The Moon", "Photo-Companion" ]
	},
	"/now": {
		DESCRIPTION: "Now",
		KEYWORDS: [ "dashboard", "the moon", "the sun" ],
		TITLE: [ "Now", "Photo-Companion" ]
	},
	"/settings": {
		DESCRIPTION: "Settings",
		KEYWORDS: [ "settings", "user settings", "configuration" ],
		TITLE: [ "Settings", "Photo-Companion" ]
	},
	"/sun": {
		DESCRIPTION: "The Sun",
		KEYWORDS: [ "the sun", "sunrise", "sunset" ],
		TITLE: [ "The Sun", "Photo-Companion" ]
	},
	"/timeline": {
		DESCRIPTION: "Event Timeline",
		KEYWORDS: [ "events", "event timeline", "schedule" ],
		TITLE: [ "Event Timeline", "Photo-Companion" ]
	}
};
