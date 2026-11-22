import { cleanup, fireEvent, render, waitFor } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { afterEach, expect, it, vi } from "vitest";

import { SETTINGS_DEFAULT } from "~/features/settings";
import { ROUTES } from "~/shared/consts";

import { App } from "./app";

afterEach(() => {
	cleanup();

	vi.restoreAllMocks();
	vi.unstubAllGlobals();

	Reflect.deleteProperty(HTMLDialogElement.prototype, "close");
	Reflect.deleteProperty(HTMLDialogElement.prototype, "showModal");
	localStorage.clear();
});

function renderApp(
	pathname: string = ROUTES.ROOT,
	settings: Partial<typeof SETTINGS_DEFAULT> = {},
	query: Record<string, string> = {}
) {
	localStorage.setItem("settings", "4");
	localStorage.setItem("settings:4", JSON.stringify({
		...SETTINGS_DEFAULT,
		language: "en",
		...settings
	}));

	const search = new URLSearchParams({
		datetime: "2026-06-21T12:00:00",
		...query
	});
	history.replaceState(null, "", `${pathname}?${search}`);

	vi.stubGlobal("scrollTo", vi.fn());
	vi.stubGlobal("matchMedia", vi.fn(() => Object.assign(new EventTarget(), { matches: true })));

	Object.defineProperty(HTMLDialogElement.prototype, "close", {
		configurable: true,
		value(this: HTMLDialogElement) { this.removeAttribute("open"); }
	});

	Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
		configurable: true,
		value(this: HTMLDialogElement) { this.setAttribute("open", ""); }
	});

	const errors = vi.spyOn(console, "error");
	const warnings = vi.spyOn(console, "warn");

	return {
		errors,
		warnings,
		...render(() => <App />)
	};
}

it("redirects home, navigates, saves settings, and loads translated Markdown", async () => {
	const view = renderApp();

	await waitFor(() => expect(location.pathname).toBe("/now"));
	await waitFor(() => expect(view.container.querySelector("main")).toHaveTextContent("Sun"));

	for (const [ label, pathname ] of [ [ "Sun", "/sun" ], [ "Moon", "/moon" ] ]) {
		fireEvent.click(view.getAllByRole("link", { name: `The ${label}` })[0]);

		await waitFor(() => expect(location.pathname).toBe(pathname));
		await waitFor(() => expect(view.container.querySelector("main")).toHaveTextContent(label));
	}

	const settingsLink = view.getAllByRole("link", { name: "Settings" })[0];

	fireEvent.click(settingsLink);

	await waitFor(() => expect(view.getByRole("button", { name: "Save" })).toBeInTheDocument());

	flush(() => fireEvent.click(view.getByRole("radio", { name: "Moscow, Russia" })));
	flush(() => fireEvent.click(view.getByRole("button", { name: "Save" })));

	expect(JSON.parse(localStorage.getItem("settings:4") ?? "null").city).toBe("MOSCOW");

	flush(() => fireEvent.click(view.getByRole("radio", { name: "Русский" })));

	fireEvent.click(view.getByRole("button", { name: "Save" }));

	await waitFor(() => expect(document.documentElement.lang).toBe("ru"));

	flush(() => fireEvent.click(view.getByRole("radio", { name: "English" })));

	fireEvent.click(view.getByRole("button", { name: "Сохранить" }));

	await waitFor(() => expect(document.documentElement.lang).toBe("en"));

	flush(() => fireEvent.click(view.getByRole("button", { name: "Menu" })));

	fireEvent.click(view.getByRole("link", { name: "FAQ" }));

	await waitFor(() => expect(location.pathname).toBe("/about"));
	await waitFor(() => expect(view.container.querySelector("main article")).toHaveTextContent(/photograph/i));

	expect(view.errors).not.toHaveBeenCalled();
	expect(view.warnings).not.toHaveBeenCalled();
});

it("opens City Lights with valid query coordinates when saved coordinates are invalid", async () => {
	const view = renderApp(ROUTES.LIGHTS, {
		city: "OTHER",
		latitude: 91,
		longitude: 181
	}, {
		latitude: "51.5072",
		longitude: "-0.1276"
	});

	await view.findByRole("img", { name: /City lights, noon to noon/ });
	expect(location.pathname).toBe(ROUTES.LIGHTS);
	expect(JSON.parse(localStorage.getItem("settings:4") ?? "null")).toMatchObject({
		latitude: 51.5072,
		longitude: -0.1276
	});
	expect(view.errors).not.toHaveBeenCalled();
	expect(view.warnings).not.toHaveBeenCalled();
});

it.each([
	{
		pathname: ROUTES.BRIDGES,
		settings: { city: "MOSCOW" }
	},
	{
		pathname: ROUTES.LIGHTS,
		settings: {
			city: "OTHER",
			latitude: 91,
			longitude: 181
		}
	}
] as const)("redirects unsupported $pathname visits to the 404 page", async ({ pathname, settings }) => {
	const view = renderApp(pathname, settings);

	await waitFor(() => expect(location.pathname).toBe(ROUTES.NOT_FOUND));
	await waitFor(() => expect(view.getByRole("link", { name: "Go Home" })).toBeInTheDocument());

	expect(view.container.querySelector("main")).toHaveTextContent("Unfortunately, such page does not exist...");
	expect(view.errors).not.toHaveBeenCalled();
	expect(view.warnings).not.toHaveBeenCalled();
});
