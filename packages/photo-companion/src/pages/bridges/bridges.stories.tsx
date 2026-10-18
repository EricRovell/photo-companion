import type { BridgeScheduleEntry } from "bridge-schedule";
import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { BridgesInfo, BridgesProvider, CardBridge } from "~/features/bridges-spb";
import { storyDatetimeConfig } from "~/stories/story-controls";
import { withStoryProviders } from "~/stories/story-providers";

import type { StoryDatetimeArgs } from "~/stories/story-controls";

import styles from "./bridges.module.css";

interface BridgeCardStoryArgs extends StoryDatetimeArgs {
	intervals: BridgeScheduleEntry;
	liftedUp: boolean;
}

const meta = {
	...storyDatetimeConfig,
	title: "Bridges"
} satisfies Meta<StoryDatetimeArgs>;

export default meta;
type Story = StoryObj<StoryDatetimeArgs>;
type BridgeCardStory = StoryObj<BridgeCardStoryArgs>;

export const Information: Story = {
	render: args => withStoryProviders(() => (
		<BridgesProvider>
			<div class="storybook-stack">
				<BridgesInfo title="Saint Petersburg bridges" />
			</div>
		</BridgesProvider>
	), args)
};

export const BridgeCard: BridgeCardStory = {
	args: {
		intervals: [[ 1, 10, 2, 50 ], [ 3, 10, 4, 45 ]],
		liftedUp: false
	},
	argTypes: {
		intervals: {
			control: "object",
			description: "Lift intervals as [open hour, open minute, close hour, close minute] tuples",
			name: "Lift intervals"
		},
		liftedUp: {
			control: "boolean",
			description: "Whether the bridge is lifted up",
			name: "Lifted up"
		}
	},
	render: args => withStoryProviders(() => (
		<BridgesProvider>
			<ul class={styles["bridge-list"]}>
				<li>
					<CardBridge
						name="PALACE"
						open={args.liftedUp}
						schedule={args.intervals}
					/>
				</li>
			</ul>
		</BridgesProvider>
	), args)
};

export const BridgeException: Story = {
	render: args => withStoryProviders(() => (
		<BridgesProvider>
			<ul class={styles["bridge-list"]}>
				<li><CardBridge exception name="PALACE" /></li>
			</ul>
		</BridgesProvider>
	), args)
};
