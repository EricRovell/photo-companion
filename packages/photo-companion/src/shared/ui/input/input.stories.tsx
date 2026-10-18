import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { Input } from "./input";

const meta = {
	args: {
		children: "Date",
		name: "date",
		type: "date",
		value: "2026-06-21"
	},
	component: Input,
	title: "Shared UI/Input"
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Error: Story = {
	args: {
		error: true
	}
};

export const Disabled: Story = {
	args: {
		disabled: true
	}
};
