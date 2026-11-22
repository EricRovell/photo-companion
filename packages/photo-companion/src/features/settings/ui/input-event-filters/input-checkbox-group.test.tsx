import { cleanup, fireEvent, render } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { SettingsProvider, useSettings } from "../../model/settings";
import { SettingsFormProvider, useSettingsForm } from "../../model/settings-form";
import { InputCheckboxGroup } from "./input-checkbox-group";

afterEach(cleanup);
beforeEach(() => localStorage.clear());

function Filters() {
	const { handleChange, handleReset, handleSubmit, settingsStore } = useSettingsForm();
	const { settings } = useSettings();

	return (
		<>
			<InputCheckboxGroup
				groupLabel="All lights events"
				groupValue="lights"
				name="events_lights"
				onChange={handleChange}
				options={[
					{
						label: "Lights on",
						value: "LIGHTS_START"
					},
					{
						label: "Lights off",
						value: "LIGHTS_END"
					}
				]}
				value={settingsStore.events_lights}
			/>
			<button onClick={handleReset}>Reset</button>
			<button onClick={handleSubmit}>Save</button>
			<output data-testid="form">
				{JSON.stringify(settingsStore.events_lights)}
			</output>
			<output data-testid="saved">
				{JSON.stringify(settings.events_lights)}
			</output>
		</>
	);
}

function renderFilters() {
	return render(() => (
		<SettingsProvider>
			<SettingsFormProvider>
				<Filters />
			</SettingsFormProvider>
		</SettingsProvider>
	));
}

describe("InputCheckboxGroup", () => {
	it("updates and saves the named field through the form handler", () => {
		const view = renderFilters();

		flush(() => fireEvent.click(view.getByLabelText("Lights on")));
		expect(view.getByTestId("form")).toHaveTextContent("[\"LIGHTS_START\"]");
		flush(() => fireEvent.click(view.getByText("Save")));
		expect(view.getByTestId("saved")).toHaveTextContent("[\"LIGHTS_START\"]");
		expect(JSON.parse(localStorage.getItem("settings:4") ?? "null").events_lights).toEqual([ "LIGHTS_START" ]);
	});

	it("preserves all, individual, and empty filter states", () => {
		const view = renderFilters();

		flush(() => fireEvent.click(view.getByLabelText("All lights events")));
		expect(view.getByTestId("form")).toHaveTextContent("null");
		flush(() => fireEvent.click(view.getByLabelText("Lights on")));
		expect(view.getByTestId("form")).toHaveTextContent("[\"LIGHTS_END\"]");
		flush(() => fireEvent.click(view.getByLabelText("Lights on")));
		expect(view.getByTestId("form")).toHaveTextContent("null");
		flush(() => fireEvent.click(view.getByLabelText("All lights events")));
		expect(view.getByTestId("form")).toHaveTextContent("[]");
	});

	it("synchronizes checkbox state when the form resets", () => {
		const view = renderFilters();

		flush(() => fireEvent.click(view.getByLabelText("Lights on")));
		flush(() => fireEvent.click(view.getByText("Reset")));

		expect(view.getByTestId("form")).toHaveTextContent("[]");
		expect(view.getByLabelText("Lights on")).not.toBeChecked();
		expect(view.getByLabelText("All lights events")).not.toBeChecked();
	});
});
