import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { LightsSchedule, LightsTimeline, SupportsLights } from "~/features/city-lights";
import { storyEnvironmentConfig } from "~/stories/story-controls";
import { withStoryProviders } from "~/stories/story-providers";

import type { StoryEnvironmentArgs } from "~/stories/story-controls";

import styles from "./lights.module.css";

const meta = {
	...storyEnvironmentConfig,
	args: {
		...storyEnvironmentConfig.args,
		city: "MOSCOW",
		datetime: new Date(2026, 9, 24, 20, 40).getTime()
	},
	title: "City Lights"
} satisfies Meta<StoryEnvironmentArgs>;

export default meta;
type Story = StoryObj<StoryEnvironmentArgs>;

export const Schedule: Story = {
	render: args => withStoryProviders(() => (
		<SupportsLights>
			<div class={styles.page}>
				<LightsSchedule />
			</div>
		</SupportsLights>
	), args)
};

export const Timeline: Story = {
	render: args => withStoryProviders(() => (
		<SupportsLights>
			<div class={styles.page}><LightsTimeline /></div>
		</SupportsLights>
	), args)
};

export const AllWidgets: Story = {
	render: args => withStoryProviders(() => (
		<SupportsLights>
			<div class={styles.page}>
				<LightsSchedule />
				<LightsTimeline />
			</div>
		</SupportsLights>
	), args)
};
