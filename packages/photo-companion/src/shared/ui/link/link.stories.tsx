import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { Link } from "./link";

const meta = {
	args: {
		children: "Open the sun page",
		href: "/sun"
	},
	component: Link,
	globals: { language: "en" },
	title: "Shared UI/Link"
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Internal: Story = {};

export const External: Story = {
	args: {
		children: "View source on GitHub",
		href: "https://github.com/EricRovell/photo-companion"
	}
};

export const WithQuery: Story = {
	args: {
		query: new URLSearchParams({ datetime: "2026-06-21T12:00:00" })
	}
};
