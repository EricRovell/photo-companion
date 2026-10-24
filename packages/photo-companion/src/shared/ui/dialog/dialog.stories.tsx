import { createSignal } from "solid-js";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { Button } from "../button/button";
import { Card } from "../card";
import { Text } from "../text/text";
import { Dialog } from "./dialog";

function DialogDemo() {
	const [ open, setOpen ] = createSignal(false);

	return (
		<>
			<Button onClick={() => setOpen(true)}>Open dialog</Button>
			<Dialog onClose={() => setOpen(false)} open={open()}>
				<Card
					class="storybook-stack"
					style={{ padding: "var(--space-5)" }}
				>
					<Text as="h2" variant="heading-l">Choose a location</Text>
					<Text as="p">
						The dialog uses the native top layer and supports light dismiss.
					</Text>
					<Button onClick={() => setOpen(false)}>Close</Button>
				</Card>
			</Dialog>
		</>
	);
}

const meta = {
	component: Dialog,
	globals: { language: "en" },
	title: "Shared UI/Dialog"
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
	render: () => <DialogDemo />
};
