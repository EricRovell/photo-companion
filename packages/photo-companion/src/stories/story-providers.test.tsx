import { render, waitFor } from "@solidjs/testing-library";
import { createStore } from "solid-js/store";
import { beforeEach, describe, expect, it } from "vitest";

import { useDatetime } from "~/features/datetime-query";
import { useSettings } from "~/features/settings";

import { withStoryProviders } from "./story-providers";

import type { StoryEnvironmentArgs } from "./story-controls";

function EnvironmentProbe() {
	const { getDatetimeQuery } = useDatetime();
	const { settings } = useSettings();

	return (
		<output
			data-datetime={getDatetimeQuery()}
			data-latitude={settings.latitude}
			data-longitude={settings.longitude}
		/>
	);
}

describe("story providers", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("reacts to datetime and location control updates", async () => {
		const [ options, setOptions ] = createStore<StoryEnvironmentArgs>({
			datetime: new Date(2026, 5, 21, 12).getTime(),
			latitude: 59.844404,
			longitude: 30.3131
		});
		const view = render(() => withStoryProviders(() => <EnvironmentProbe />, options));

		await waitFor(() => {
			expect(view.container.querySelector("output")).toHaveAttribute("data-datetime", "2026-06-21T12:00:00");
		});

		setOptions({
			datetime: new Date(2027, 3, 5, 12, 45, 36).getTime(),
			latitude: -33.8688,
			longitude: 151.2093
		});

		await waitFor(() => {
			const output = view.container.querySelector("output");

			expect(output).toHaveAttribute("data-datetime", "2027-04-05T12:45:36");
			expect(output).toHaveAttribute("data-latitude", "-33.8688");
			expect(output).toHaveAttribute("data-longitude", "151.2093");
		});
	});
});
