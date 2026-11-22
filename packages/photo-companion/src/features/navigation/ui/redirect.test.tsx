import { createRouter, memoryHistory } from "@solidjs/router";
import { cleanup, render, waitFor } from "@solidjs/testing-library";
import { afterEach, expect, it, vi } from "vitest";

import { Redirect } from "./redirect";

afterEach(async () => {
	cleanup();
	// Memory history schedules scrolling after each navigation.
	await new Promise(resolve => setTimeout(resolve, 0));
	vi.unstubAllGlobals();
});

it("replaces the current history entry so Back skips the rejected page", async () => {
	vi.stubGlobal("scrollTo", vi.fn());

	const history = memoryHistory("/previous");
	const destination = "/404?reason=unsupported";

	history.set({
		replace: false,
		scroll: false,
		value: "/unsupported"
	});

	const Router = createRouter({
		history,
		routes: [
			{
				component: () => <p>Previous page</p>,
				path: "/previous"
			},
			{
				component: () => <Redirect href={destination} />,
				path: "/unsupported"
			},
			{
				component: () => <p>Page not found</p>,
				path: "/404"
			}
		]
	});
	const view = render(() => <Router />);

	await waitFor(() => expect(view.getByText("Page not found")).toBeInTheDocument());
	expect(history.get()).toBe(destination);

	history.back();

	await waitFor(() => expect(view.getByText("Previous page")).toBeInTheDocument());
	expect(history.get()).toBe("/previous");

	history.forward();

	await waitFor(() => expect(view.getByText("Page not found")).toBeInTheDocument());
	expect(history.get()).toBe(destination);
});
