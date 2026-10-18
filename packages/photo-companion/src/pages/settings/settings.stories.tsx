import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { GeolocationProvider } from "~/features/geolocation";
import { SettingsForm } from "~/features/settings";
import { withStoryProviders } from "~/stories/story-providers";

const meta = {
	title: "Settings"
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Form: Story = {
	render: () => withStoryProviders(() => (
		<GeolocationProvider>
			<SettingsForm />
		</GeolocationProvider>
	))
};
