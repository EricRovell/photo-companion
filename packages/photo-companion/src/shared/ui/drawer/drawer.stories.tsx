import { createSignal } from "solid-js";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { Button } from "../button/button";
import { Text } from "../text/text";
import { Drawer } from "./drawer";

function DrawerDemo() {
	const [ open, setOpen ] = createSignal(false);

	return (
		<>
			<Button onClick={() => setOpen(true)}>Open drawer</Button>
			<Drawer onClose={() => setOpen(false)} open={open()}>
				<div class="storybook-stack" style={{ padding: "var(--space-5)" }}>
					<Text as="h2" variant="heading-l">Photography tools</Text>
					<Text as="p">Sun, moon, lights, bridges, and shadow height.</Text>
					<Button onClick={() => setOpen(false)}>Close</Button>
				</div>
			</Drawer>
		</>
	);
}

const meta = {
	component: Drawer,
	globals: { language: "en" },
	title: "Shared UI/Drawer"
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
	render: () => <DrawerDemo />
};
