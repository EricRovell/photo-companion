import { createMemo, For } from "solid-js";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { Timeline, TimelineGroup } from "~/entities/timeline";
import { TimelineEventEmpty } from "~/entities/timeline-event/ui/timeline-empty/timeline-event-empty";
import { TimelineEvent } from "~/entities/timeline-event/ui/timeline-event/timeline-event";
import { getSunEvents } from "~/features/timeline";
import {
	DEFAULT_STORY_DATETIME,
	DEFAULT_STORY_LATITUDE,
	DEFAULT_STORY_LONGITUDE,
	storyEnvironmentConfig
} from "~/stories/story-controls";
import { withStoryProviders } from "~/stories/story-providers";

import type { StoryEnvironmentArgs } from "~/stories/story-controls";

import styles from "./timeline.module.css";

function ExampleTimeline(props: StoryEnvironmentArgs) {
	const datetime = createMemo(() => new Date(props.datetime ?? DEFAULT_STORY_DATETIME));
	const events = createMemo(() => getSunEvents(
		datetime(),
		props.latitude ?? DEFAULT_STORY_LATITUDE,
		props.longitude ?? DEFAULT_STORY_LONGITUDE
	));

	return (
		<div class={styles.page}>
			<TimelineGroup>
				<Timeline date={datetime().toLocaleDateString("en", { dateStyle: "long" })}>
					<For each={events().slice(0, 6)}>
						{event => <TimelineEvent event={event} href="/sun" />}
					</For>
				</Timeline>
			</TimelineGroup>
		</div>
	);
}

const meta = {
	title: "Timeline"
} satisfies Meta;

export default meta;
type Story = StoryObj;
type EnvironmentStory = StoryObj<StoryEnvironmentArgs>;

export const SunEvents: EnvironmentStory = {
	...storyEnvironmentConfig,
	render: args => withStoryProviders(
		() => <ExampleTimeline {...args} />,
		args
	)
};

export const Empty: Story = {
	render: () => withStoryProviders(() => (
		<div class={styles.page}>
			<TimelineGroup>
				<Timeline date="June 22, 2026">
					<TimelineEventEmpty />
				</Timeline>
			</TimelineGroup>
		</div>
	))
};
