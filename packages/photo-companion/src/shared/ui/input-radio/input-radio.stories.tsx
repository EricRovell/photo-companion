import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { InputRadio } from "./input-radio";

const OPTIONS = [
	{ label: "North", value: "N" },
	{ label: "South", value: "S" },
	{ disabled: true, label: "Unavailable", value: "disabled" }
];

const meta = {
	args: {
		name: "direction",
		options: OPTIONS,
		value: "N"
	},
	component: InputRadio,
	globals: { language: "en" },
	title: "Shared UI/Input Radio"
} satisfies Meta<typeof InputRadio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AlternateSelection: Story = {
	args: {
		value: "S"
	}
};
