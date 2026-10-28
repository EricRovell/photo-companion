import { fireEvent, render, within } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { degreesFormatter } from "utils/formatters";
import { describe, expect, it, vi } from "vitest";

import { ALTITUDE_WIDGET_CONFIG } from "../../config";
import { AltitudeWidget } from "../../index";

import type { AltitudeEntity } from "../../types";

const degrees = degreesFormatter("en");

vi.mock("~/features/translation", async () => {
	const { t } = await import("~/features/translation/consts/translation.en");
	return {
		useTranslation: () => ({
			format: () => ({
				dateShort: (date: Date) => date.toISOString().slice(0, 10),
				degrees: degreesFormatter("en"),
				timeShort: (date: DateLike) => new Date(date).toISOString().slice(11, 16)
			}),
			lang: () => "en",
			t: () => t
		})
	};
});

function Preview(props: { date: Date;
moon?: boolean }) {
	const entities: AltitudeEntity[] = [
		{
			getPosition: ({ instant }) => ({ apparentAltitude: new Date(instant).getUTCHours() - 12 }),
			id: "sun",
			label: "Sun"
		},
		{
			getPosition: () => ({ apparentAltitude: -30 }),
			id: "moon",
			label: "Moon"
		}
	];
	return (
		<AltitudeWidget
			date={props.date}
			entities={entities.filter(entity => props.moon !== false || entity.id === "sun")}
			latitude={0}
			longitude={0}
			title="Altitude"
		>
			<AltitudeWidget.Header />
			<AltitudeWidget.Content>
				<AltitudeWidget.Chart>
					<AltitudeWidget.Grid />
					<AltitudeWidget.Path />
					<AltitudeWidget.Cursor />
				</AltitudeWidget.Chart>
				<AltitudeWidget.Legend />
			</AltitudeWidget.Content>
		</AltitudeWidget>
	);
}

describe("compound altitude widget", () => {
	it("updates the chart description, cursor and current readouts when the selected time changes", () => {
		const [ date, setDate ] = createSignal(new Date("2026-10-21T10:00:00Z"));
		const view = render(() => <Preview date={date()} />);
		const sun = within(view.getByRole("row", { name: /Sun/ }));
		const markerX = () => view.container.querySelector("circle")?.getAttribute("cx");
		const previousX = markerX();

		expect(view.getByRole("img")).toHaveAccessibleName("Altitude, 10:00");
		expect(view.getByRole("img")).toHaveAccessibleDescription(`Sun: ${degrees(-2)}, Below horizon. Moon: ${degrees(-30)}, Below horizon`);
		expect(sun.getByText(degrees(-2))).toBeInTheDocument();

		setDate(new Date("2026-10-21T14:00:00Z"));

		expect(view.getByRole("img")).toHaveAccessibleName("Altitude, 14:00");
		expect(view.getByRole("img")).toHaveAccessibleDescription(`Sun: ${degrees(2)}, Above horizon. Moon: ${degrees(-30)}, Below horizon`);
		expect(sun.getByText(degrees(2))).toBeInTheDocument();
		expect(sun.getByText("Above horizon")).toBeInTheDocument();
		expect(markerX()).not.toBe(previousX);
	});

	it("keeps SVG clip paths and accessible labels unique across widget instances", () => {
		const view = render(() => <>
			<Preview date={new Date("2026-10-21T10:00:00Z")} />
			<Preview date={new Date("2026-10-21T14:00:00Z")} />
		</>);
		const ids = Array.from(view.container.querySelectorAll("[id]"), element => element.id);
		expect(new Set(ids).size).toBe(ids.length);
		for (const path of view.container.querySelectorAll("[clip-path]")) {
			const id = path.getAttribute("clip-path")?.slice(5, -1);
			expect(ids).toContain(id);
		}
		expect(view.getAllByRole("img")).toHaveLength(2);
	});

	it("labels both axes without repeating the selected date or displaying a time badge", () => {
		const view = render(() => <Preview date={new Date("2026-10-21T10:00:00Z")} />);
		expect(view.getByText("Altitude (°)")).toBeInTheDocument();
		expect(view.getByText("Time (h)")).toBeInTheDocument();
		expect(view.queryByText("2026-10-21")).not.toBeInTheDocument();
		expect(view.queryByText("10:00")).not.toBeInTheDocument();
	});

	it("toggles each body's data while keeping at least one checkbox selected", () => {
		const view = render(() => <Preview date={new Date("2026-10-21T10:00:00Z")} />);
		const sun = view.getByRole("checkbox", { name: "Sun" });
		const moon = view.getByRole("checkbox", { name: "Moon" });
		expect(sun).toBeChecked();
		expect(moon).toBeChecked();

		fireEvent.click(sun);
		expect(sun).not.toBeChecked();
		expect(moon).toBeChecked();
		expect(moon).toBeDisabled();
		const sunData = view.container.querySelectorAll("[data-entity=\"sun\"][data-selected=\"false\"]");
		expect(sunData).toHaveLength(1);
		expect(view.container.querySelectorAll("svg [data-entity=\"sun\"]")).toHaveLength(0);
		expect(view.container.querySelectorAll("svg [data-entity=\"moon\"]")).toHaveLength(2);
		expect(view.getByRole("img")).toHaveAccessibleDescription(`Moon: ${degrees(-30)}, Below horizon`);
		expect(within(view.getByRole("row", { name: /Sun/ })).getByText(degrees(-2))).toBeInTheDocument();

		moon.click();
		expect(moon).toBeChecked();
		fireEvent.click(sun);
		expect(sun).toBeChecked();
		expect(view.container.querySelectorAll("svg [data-entity=\"sun\"]")).toHaveLength(2);
		expect(moon).not.toBeDisabled();
		fireEvent.click(moon);
		expect(moon).not.toBeChecked();
		expect(view.container.querySelectorAll("svg [data-entity=\"moon\"]")).toHaveLength(0);
		expect(sun).toBeChecked();
		expect(sun).toBeDisabled();
	});

	it.each([ "row", "th", "td:first-of-type span", "td:last-child time", "label", "label [aria-hidden]" ])(
		"toggles exactly once when clicking a legend %s",
		selector => {
			const view = render(() => <Preview date={new Date("2026-10-21T10:00:00Z")} />);
			const row = view.getByRole("row", { name: /Sun/ });
			const checkbox = within(row).getByRole("checkbox", { name: "Sun" });
			const target = selector === "row" ? row : row.querySelector(selector);

			if (target === null) {
				throw new Error(`Missing row click target: ${selector}`);
			}

			fireEvent.click(target);
			expect(checkbox).not.toBeChecked();
			expect(row).toHaveAttribute("data-selected", "false");
			expect(view.getByRole("img")).toHaveAccessibleDescription(`Moon: ${degrees(-30)}, Below horizon`);

			if (!selector.startsWith("label")) {
				expect(checkbox).toHaveFocus();
			}

			fireEvent.click(target);
			expect(checkbox).toBeChecked();
			expect(row).toHaveAttribute("data-selected", "true");
			expect(view.getByRole("img")).toHaveAccessibleDescription(`Sun: ${degrees(-2)}, Below horizon. Moon: ${degrees(-30)}, Below horizon`);
		}
	);

	it("keeps the last selected body locked when clicking anywhere in its row", () => {
		const view = render(() => <Preview date={new Date("2026-10-21T10:00:00Z")} />);
		const sun = view.getByRole("checkbox", { name: "Sun" });
		const moonRow = view.getByRole("row", { name: /Moon/ });
		const moon = within(moonRow).getByRole("checkbox", { name: "Moon" });

		fireEvent.click(view.getByRole("row", { name: /Sun/ }));
		fireEvent.click(moonRow);
		fireEvent.click(within(moonRow).getAllByRole("cell")[0]);
		fireEvent.click(within(moonRow).getByText("Moon"));

		expect(sun).not.toBeChecked();
		expect(moon).toBeChecked();
		expect(moon).toBeDisabled();
		expect(moonRow).toHaveAttribute("title", "Keep at least one celestial body selected.");
		expect(view.getByRole("img")).toHaveAccessibleDescription(`Moon: ${degrees(-30)}, Below horizon`);
	});

	it.each([ 30, -30 ])("keeps clips, shading and cursor in bounds when the daily altitude is %s°", altitude => {
		const view = render(() => (
			<AltitudeWidget
				date={new Date("2026-10-21T10:00:00Z")}
				entities={[ {
					getPosition: () => ({ apparentAltitude: altitude }),
					id: "sun",
					label: "Sun"
				} ]}
				latitude={0}
				longitude={0}
				title="Altitude"
			>
				<AltitudeWidget.Chart>
					<AltitudeWidget.Grid />
					<AltitudeWidget.Path />
					<AltitudeWidget.Cursor />
				</AltitudeWidget.Chart>
			</AltitudeWidget>
		));
		const chart = view.getByRole("img");
		const plot = ALTITUDE_WIDGET_CONFIG.plot;
		const above = chart.querySelector("clipPath[id$='-above'] rect");
		const below = chart.querySelector("clipPath[id$='-below'] rect");
		const sky = chart.querySelector("g[aria-hidden='true'] rect");
		const marker = chart.querySelector("circle");

		expect(above).toHaveAttribute("height", String(altitude > 0 ? plot.height : 0));
		expect(below).toHaveAttribute("height", String(altitude < 0 ? plot.height : 0));
		expect(sky).toHaveAttribute("height", String(altitude > 0 ? plot.height : 0));
		expect(marker).toHaveAttribute("cy", String(plot.top + plot.height / 2));
		expect(view.queryByText("Horizon")).not.toBeInTheDocument();
		expect(view.queryByText("0°")).not.toBeInTheDocument();
	});

	it("selects the remaining body if the active body is removed from the widget", () => {
		const [ moon, setMoon ] = createSignal(true);
		const view = render(() => <Preview date={new Date("2026-10-21T10:00:00Z")} moon={moon()} />);
		fireEvent.click(view.getByRole("checkbox", { name: "Sun" }));
		setMoon(false);
		expect(view.getByRole("checkbox", { name: "Sun" })).toBeChecked();
		expect(view.getByRole("checkbox", { name: "Sun" })).toBeDisabled();
		expect(view.queryByRole("checkbox", { name: "Moon" })).not.toBeInTheDocument();
		expect(view.container.querySelectorAll("svg [data-entity=\"moon\"]")).toHaveLength(0);
		expect(view.container.querySelectorAll("svg [data-entity=\"sun\"]")).toHaveLength(2);
	});
});
