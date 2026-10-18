import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { storyDatetimeConfig, storyLocationConfig } from "~/stories/story-controls";
import { withStoryProviders } from "~/stories/story-providers";

import NowBridges from "./ui/now-bridges";
import NowLights from "./ui/now-lights";

import type { StoryDatetimeArgs, StoryEnvironmentArgs } from "~/stories/story-controls";

import styles from "./now.module.css";

const meta = {
	...storyDatetimeConfig,
	title: "Now"
} satisfies Meta<StoryDatetimeArgs>;

export default meta;
type Story = StoryObj<StoryEnvironmentArgs>;

export const CityLights: Story = {
	...storyLocationConfig,
	render: args => withStoryProviders(() => (
		<div class={styles.page}>
			<NowLights />
		</div>
	), args)
};

export const Bridges: Story = {
	render: args => withStoryProviders(() => (
		<div class={styles.page}>
			<NowBridges />
		</div>
	), args)
};
