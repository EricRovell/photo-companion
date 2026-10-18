export interface StoryDatetimeArgs {
	datetime?: number;
}

interface StoryLocationArgs {
	latitude?: number;
	longitude?: number;
}

export interface StoryEnvironmentArgs extends StoryDatetimeArgs, StoryLocationArgs {}

export const DEFAULT_STORY_DATETIME = new Date(2026, 5, 21, 12).getTime();
export const DEFAULT_STORY_LATITUDE = 59.844404;
export const DEFAULT_STORY_LONGITUDE = 30.3131;

export const storyDatetimeConfig = {
	args: {
		datetime: DEFAULT_STORY_DATETIME
	},
	argTypes: {
		datetime: {
			control: "date",
			description: "Datetime used by the widget through the application query parameter"
		}
	}
} as const;

export const storyLocationConfig = {
	args: {
		latitude: DEFAULT_STORY_LATITUDE,
		longitude: DEFAULT_STORY_LONGITUDE
	},
	argTypes: {
		latitude: {
			control: { max: 90, min: -90, step: 0.000001, type: "number" },
			description: "Observer latitude in decimal degrees"
		},
		longitude: {
			control: { max: 180, min: -180, step: 0.000001, type: "number" },
			description: "Observer longitude in decimal degrees"
		}
	}
} as const;

export const storyEnvironmentConfig = {
	args: {
		...storyDatetimeConfig.args,
		...storyLocationConfig.args
	},
	argTypes: {
		...storyDatetimeConfig.argTypes,
		...storyLocationConfig.argTypes
	}
} as const;
