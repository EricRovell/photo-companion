import { createMemoryHistory, MemoryRouter, Route } from "@solidjs/router";
import { createEffect } from "solid-js";

import type { MemoryHistory } from "@solidjs/router";
import type { JSXElement } from "solid-js";

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
	children: JSXElement;
	options: StoryEnvironmentArgs
}) {
	useLocationQuery();
	const { setSettings } = useSettings();

	createEffect(() => {
		if (props.options.city) {
			setSettings("city", props.options.city);
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
	children: JSXElement;
	history: MemoryHistory;
	options: StoryEnvironmentArgs;
}) {
	createEffect(() => {
		props.history.set({ value: createStoryPath(props.options) });
	});

	return <>{props.children}</>;
}

export function withStoryProviders(content: () => JSXElement, options: StoryEnvironmentArgs = {}) {
	const history = createMemoryHistory();

	history.set({
		value: createStoryPath(options)
	});

	return (
		<MemoryRouter history={history}>
			<Route
				component={() => (
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
				)}
				path="*"
			/>
		</MemoryRouter>
	);
}
