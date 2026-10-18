import type { JSXElement } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { SolarEclipse } from "~/features/solar-eclipse";
import { SunAltitude, SunAzimuth, SunInfo, SunProvider, SunTimeline, SunTimes } from "~/features/sun";
import { SunSeasons } from "~/features/sun-seasons";
import { storyDatetimeConfig, storyLocationConfig } from "~/stories/story-controls";
import { withStoryProviders } from "~/stories/story-providers";

import type { StoryDatetimeArgs, StoryEnvironmentArgs } from "~/stories/story-controls";

import styles from "./sun.module.css";

const meta = {
	...storyDatetimeConfig,
	parameters: {
		layout: "fullscreen"
	},
	title: "Sun"
} satisfies Meta<StoryDatetimeArgs>;

export default meta;
type Story = StoryObj<StoryEnvironmentArgs>;

const Widget = (props: { children: JSXElement }) => (
	<SunProvider>
		<div class={styles.page}>{props.children}</div>
	</SunProvider>
);

export const Times: Story = {
	...storyLocationConfig,
	render: args => withStoryProviders(() => <Widget><SunTimes /></Widget>, args)
};

export const Azimuth: Story = {
	...storyLocationConfig,
	render: args => withStoryProviders(() => <Widget><SunAzimuth /></Widget>, args)
};

export const Altitude: Story = {
	...storyLocationConfig,
	render: args => withStoryProviders(() => <Widget><SunAltitude /></Widget>, args)
};

export const Eclipse: Story = {
	...storyLocationConfig,
	render: args => withStoryProviders(() => <Widget><SolarEclipse /></Widget>, args)
};

export const Information: Story = {
	...storyLocationConfig,
	render: args => withStoryProviders(() => <Widget><SunInfo title="Sun" /></Widget>, args)
};

export const Seasons: Story = {
	render: args => withStoryProviders(() => <Widget><SunSeasons /></Widget>, args)
};

export const Timeline: Story = {
	...storyLocationConfig,
	render: args => withStoryProviders(() => <Widget><SunTimeline /></Widget>, args)
};

export const AllWidgets: Story = {
	...storyLocationConfig,
	render: args => withStoryProviders(() => (
		<Widget>
			<SunTimes />
			<SunAzimuth />
			<SunAltitude />
			<SolarEclipse />
			<SunInfo />
			<SunSeasons />
			<SunTimeline />
		</Widget>
	), args)
};
