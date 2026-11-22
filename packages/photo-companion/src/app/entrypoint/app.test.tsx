import { cleanup, fireEvent, render, waitFor, within } from "@solidjs/testing-library";
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

it("redirects home and navigates to the Sun and Moon pages", async () => {
	const view = renderApp();

	await waitFor(() => {
		expect(location.pathname).toBe(ROUTES.NOW);
		expect(view.container.querySelector("main")).toHaveTextContent("Sun");
	});

	const navigation = within(view.getAllByRole("navigation")[0]);

	for (const [ label, pathname ] of [ [ "Sun", ROUTES.SUN ], [ "Moon", ROUTES.MOON ] ]) {
		fireEvent.click(navigation.getByRole("link", { name: `The ${label}` }));

		await waitFor(() => {
			expect(location.pathname).toBe(pathname);
			expect(view.container.querySelector("main")).toHaveTextContent(label);
		});
	}

	expect(view.errors).not.toHaveBeenCalled();
	expect(view.warnings).not.toHaveBeenCalled();
});

it("saves the selected city and renders the chosen language", async () => {
	const view = renderApp(ROUTES.NOT_FOUND);
	const [ settingsLink ] = await view.findAllByRole("link", { name: "Settings" });

	fireEvent.click(settingsLink);

	const save = await view.findByRole("button", { name: "Save" });
	expect(location.pathname).toBe(ROUTES.SETTINGS);

	flush(() => fireEvent.click(view.getByLabelText("Moscow, Russia")));
	flush(() => fireEvent.click(save));

	expect(JSON.parse(localStorage.getItem("settings:4") ?? "null").city).toBe("MOSCOW");

	flush(() => fireEvent.click(view.getByLabelText("Русский")));
	fireEvent.click(save);

	const russianSave = await view.findByRole("button", { name: "Сохранить" });
	expect(document.documentElement.lang).toBe("ru");

	flush(() => fireEvent.click(view.getByLabelText("English")));
	fireEvent.click(russianSave);

	await view.findByRole("button", { name: "Save" });
	expect(document.documentElement.lang).toBe("en");

	expect(view.errors).not.toHaveBeenCalled();
	expect(view.warnings).not.toHaveBeenCalled();
});

it("loads translated Markdown from the navigation drawer", async () => {
	const view = renderApp(ROUTES.NOT_FOUND);
	const menu = await view.findByRole("button", { name: "Menu" });

	flush(() => fireEvent.click(menu));
	fireEvent.click(await view.findByRole("link", { name: "FAQ" }));

	await waitFor(() => {
		expect(location.pathname).toBe(ROUTES.ABOUT);
		expect(view.container.querySelector("main article")).toHaveTextContent(/photograph/i);
	});

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
