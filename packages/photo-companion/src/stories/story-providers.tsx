import { createRouter, memoryHistory } from "@solidjs/router";
import { createEffect } from "solid-js";

import type { MemoryHistoryAdapter } from "@solidjs/router";
import type { Element } from "solid-js";

import { useLocationQuery } from "~/app/layout/model";
import { DatetimeProvider } from "~/features/datetime-query";
import { SettingsProvider, useSettings } from "~/features/settings";
import { createQueryDate } from "~/shared/lib/query-date";

import {
	DEFAULT_STORY_DATETIME,
	DEFAULT_STORY_LATITUDE,
	DEFAULT_STORY_LONGITUDE
} from "./story-controls";
import { StoryTranslationProvider } from "./story-language";

import type { StoryEnvironmentArgs } from "./story-controls";

function StoryLocationQuery(props: {
	children: Element;
	options: StoryEnvironmentArgs
}) {
	useLocationQuery();
	const { setSettings } = useSettings();

	createEffect(() => props.options.city, city => {
		if (city) {
			setSettings((draft) => {
				draft.city = city;
			});
		}
	});

	return <>{props.children}</>;
}

function createStoryPath(options: StoryEnvironmentArgs): string {
	const {
		datetime = DEFAULT_STORY_DATETIME,
		latitude = DEFAULT_STORY_LATITUDE,
		longitude = DEFAULT_STORY_LONGITUDE
	} = options;
	const searchParams = new URLSearchParams({
		datetime: createQueryDate(datetime),
		latitude: latitude.toString(),
		longitude: longitude.toString()
	});

	return `/?${searchParams}`;
}

function StoryQuerySync(props: {
	children: Element;
	history: MemoryHistoryAdapter;
	options: StoryEnvironmentArgs;
}) {
	createEffect(() => createStoryPath(props.options), value => {
		props.history.set({ value });
	});

	return <>{props.children}</>;
}

export function withStoryProviders(content: () => Element, options: StoryEnvironmentArgs = {}) {
	const history = memoryHistory();

	history.set({
		value: createStoryPath(options)
	});

	const Router = createRouter({
		history,
		routes: [{
			component: () => (
				<StoryQuerySync history={history} options={options}>
					<DatetimeProvider>
						<SettingsProvider>
							<StoryLocationQuery options={options}>
								<StoryTranslationProvider>
									<div class="storybook-canvas">
										{content()}
									</div>
								</StoryTranslationProvider>
							</StoryLocationQuery>
						</SettingsProvider>
					</DatetimeProvider>
				</StoryQuerySync>
			),
			path: "*"
		}]
	});
	return <Router />;
}
