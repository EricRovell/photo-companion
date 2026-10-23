import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { Button } from "./button";

const meta = {
	args: {
		children: "Calculate"
	},
	component: Button,
	globals: { language: "en" },
	title: "Shared UI/Button"
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Appearances: Story = {
	render: args => (
		<div class="storybook-row">
			<Button {...args} appearance="fill">Fill</Button>
			<Button {...args} appearance="outline">Outline</Button>
			<Button {...args} appearance="ghost">Ghost</Button>
		</div>
	)
};

export const SemanticStates: Story = {
	render: args => (
		<div class="storybook-row">
			<Button {...args} variant="success">Save</Button>
			<Button {...args} variant="danger">Delete</Button>
			<Button {...args} disabled>Disabled</Button>
			<Button {...args} pending>Pending</Button>
		</div>
	)
};
