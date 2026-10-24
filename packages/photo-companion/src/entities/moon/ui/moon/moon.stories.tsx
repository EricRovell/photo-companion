import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { Moon } from "./moon";

const meta = {
	args: {
		phase: 0.25
	},
	argTypes: {
		phase: {
			control: {
				max: 1,
				min: 0,
				step: 0.01,
				type: "number"
			},
			description: "Lunar phase from 0 (new moon) through 0.5 (full moon) to 1"
		}
	},
	component: Moon,
	render: args => <Moon height={100} phase={args.phase} width={100} />,
	title: "Moon/Entity"
} satisfies Meta<typeof Moon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Phase: Story = {};
