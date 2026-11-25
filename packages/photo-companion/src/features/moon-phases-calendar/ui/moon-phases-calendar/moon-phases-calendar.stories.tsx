import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { storyDatetimeConfig } from "~/stories/story-controls";
import { withStoryProviders } from "~/stories/story-providers";

import { MoonPhasesCalendar } from "./moon-phases-calendar";

import type { StoryDatetimeArgs } from "~/stories/story-controls";

interface StoryArgs extends StoryDatetimeArgs {
	width: number;
}

const meta = {
	args: {
		datetime: Date.now(),
		width: 560
	},
	argTypes: {
		...storyDatetimeConfig.argTypes,
		width: {
			control: {
				max: 960,
				min: 280,
				type: "number"
			}
		}
	},
	render: args => withStoryProviders(() => (
		<div
			style={{
				"max-width": "100%",
				width: `${args.width}px`
			}}
		>
			<MoonPhasesCalendar />
		</div>
	), args),
	title: "Widgets/Moon phases calendar"
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CurrentMonth: Story = {};
export const Mobile: Story = { args: { width: 320 } };
