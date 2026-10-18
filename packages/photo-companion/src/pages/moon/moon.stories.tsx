import type { JSXElement } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { LunarEclipse } from "~/features/lunar-eclipse";
import { Earthshine, MoonAltitude, MoonAzimuth, MoonInfo, MoonPhases, MoonProvider, MoonTimeline, MoonTimes } from "~/features/moon";
import { SunProvider } from "~/features/sun";
import { storyDatetimeConfig, storyLocationConfig } from "~/stories/story-controls";
import { withStoryProviders } from "~/stories/story-providers";

import type { StoryDatetimeArgs, StoryEnvironmentArgs } from "~/stories/story-controls";

import styles from "./moon.module.css";

const meta = {
	...storyDatetimeConfig,
	parameters: {
		layout: "fullscreen"
	},
	title: "Moon"
} satisfies Meta<StoryDatetimeArgs>;

export default meta;
type Story = StoryObj<StoryEnvironmentArgs>;

const Widget = (props: { children: JSXElement }) => (
	<SunProvider>
		<MoonProvider>
			<div class={styles.page}>{props.children}</div>
		</MoonProvider>
	</SunProvider>
);

export const Times: Story = {
	...storyLocationConfig,
	render: args => withStoryProviders(() => <Widget><MoonTimes /></Widget>, args)
};

export const Azimuth: Story = {
	...storyLocationConfig,
	render: args => withStoryProviders(() => <Widget><MoonAzimuth /></Widget>, args)
};

export const Altitude: Story = {
	...storyLocationConfig,
	render: args => withStoryProviders(() => <Widget><MoonAltitude /></Widget>, args)
};

export const Eclipse: Story = {
	...storyLocationConfig,
	render: args => withStoryProviders(() => <Widget><LunarEclipse /></Widget>, args)
};

export const Information: Story = {
	...storyLocationConfig,
	render: args => withStoryProviders(() => <Widget><MoonInfo title="Moon" /></Widget>, args)
};

export const Timeline: Story = {
	...storyLocationConfig,
	render: args => withStoryProviders(() => <Widget><MoonTimeline /></Widget>, args)
};

export const Phases: Story = {
	render: args => withStoryProviders(() => <Widget><MoonPhases /></Widget>, args)
};

export const EarthshineProbability: Story = {
	...storyLocationConfig,
	render: args => withStoryProviders(() => <Widget><Earthshine /></Widget>, args)
};

export const AllWidgets: Story = {
	...storyLocationConfig,
	render: args => withStoryProviders(() => (
		<Widget>
			<MoonTimes />
			<MoonAzimuth />
			<MoonAltitude />
			<LunarEclipse />
			<MoonInfo />
			<MoonTimeline />
			<MoonPhases />
			<Earthshine />
		</Widget>
	), args)
};
