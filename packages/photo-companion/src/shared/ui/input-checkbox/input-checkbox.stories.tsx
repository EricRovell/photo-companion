import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { InputCheckbox } from "./input-checkbox";

const meta = {
	args: {
		label: "Golden hour",
		name: "golden-hour"
	},
	component: InputCheckbox,
	globals: { language: "en" },
	title: "Shared UI/Input Checkbox"
} satisfies Meta<typeof InputCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};

export const Checked: Story = {
	args: {
		checked: true
	}
};

export const Indeterminate: Story = {
	args: {
		indeterminate: true
	}
};

export const Disabled: Story = {
	args: {
		disabled: true
	}
};
