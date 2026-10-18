import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { Markdown } from "./index";
import Example from "./markdown.stories.fixture.md";

const meta = {
	component: Markdown,
	title: "Shared UI/Markdown"
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Article: Story = {
	render: () => (
		<Markdown>
			<Example />
		</Markdown>
	)
};
