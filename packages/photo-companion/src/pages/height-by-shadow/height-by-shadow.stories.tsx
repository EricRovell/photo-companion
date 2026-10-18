import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { withStoryProviders } from "~/stories/story-providers";

import { FormProvider } from "./height-by-shadow.context";
import { Error } from "./ui/error/error";
import { Form as HeightByShadowForm } from "./ui/form/form";
import { Output } from "./ui/output/output";

import styles from "./height-by-shadow.module.css";

const meta = {
	title: "Height by Shadow"
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const CalculatorForm: Story = {
	render: () => withStoryProviders(() => (
		<FormProvider>
			<div class={styles.page}>
				<HeightByShadowForm />
			</div>
		</FormProvider>
	))
};

export const Result: Story = {
	render: () => withStoryProviders(() => (
		<div class={styles.page}>
			<Output candidates={[
				{
					altitude: 42.35,
					height: 4.56,
					time: new Date(2026, 5, 21, 9, 30)
				},
				{
					altitude: 31.18,
					height: 3.03,
					time: new Date(2026, 5, 21, 18, 45)
				}
			]} />
		</div>
	))
};

export const ValidationError: Story = {
	render: () => withStoryProviders(() => (
		<FormProvider>
			<div class={styles.page}>
				<Error errors={[ "SUN_AZIMUTH_NOT_VISIBLE" ]} />
			</div>
		</FormProvider>
	))
};
