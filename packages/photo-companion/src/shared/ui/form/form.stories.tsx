import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { Button } from "../button/button";
import { Input } from "../input/input";
import { Fieldset, Form } from "./form";

const meta = {
	component: Form,
	title: "Shared UI/Form"
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Form class="storybook-stack">
			<Fieldset legend="Observer">
				<Input name="name" placeholder="Name">Name</Input>
			</Fieldset>
			<Button type="submit">Save</Button>
		</Form>
	)
};

export const FieldsetWithoutLegend: Story = {
	render: () => (
		<Form class="storybook-stack">
			<Fieldset>
				<Input name="azimuth" type="number" value="180">Azimuth</Input>
			</Fieldset>
		</Form>
	)
};
