import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { Text } from "../text/text";
import { PropertyList } from "./index";

const meta = {
	component: PropertyList,
	globals: { language: "en" },
	title: "Shared UI/Property List"
} satisfies Meta<typeof PropertyList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div class="storybook-stack">
			<PropertyList>
				<PropertyList.Header>Sun</PropertyList.Header>
				<PropertyList.Body>
					<PropertyList.Item>
						<PropertyList.Label>Sunrise</PropertyList.Label>
						<PropertyList.Value>03:35</PropertyList.Value>
					</PropertyList.Item>
					<PropertyList.Item>
						<PropertyList.Label>Sunset</PropertyList.Label>
						<PropertyList.Value>22:25</PropertyList.Value>
					</PropertyList.Item>
					<PropertyList.Item>
						<PropertyList.Label>Status</PropertyList.Label>
						<PropertyList.Value>
							<Text color="success" variant="text-s">Above horizon</Text>
						</PropertyList.Value>
					</PropertyList.Item>
				</PropertyList.Body>
			</PropertyList>
		</div>
	)
};
