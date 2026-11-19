import { cleanup, render, within } from "@solidjs/testing-library";
import { createSignal, Show } from "solid-js";
import { afterEach, describe, expect, it } from "vitest";

import { Notifications, notifications } from "~/shared/ui/notifications";

import { DeviceHeadingToggle } from "./device-heading-toggle";

import type { DeviceHeadingError } from "../../../../shared/types/device-heading";

const labels = {
	align: "Align compass",
	alignBlocked: "Compass blocked",
	alignDenied: "Compass permission denied",
	alignDeniedReason: "Allow motion and orientation access in browser settings.",
	aligned: "Compass aligned",
	alignTimeout: "Compass timed out",
	alignUnavailable: "Compass unavailable"
};

afterEach(() => {
	cleanup();
	notifications.clear();
});

describe("device heading notifications", () => {
	it("updates one error notification and dismisses it when the error clears or the control unmounts", () => {
		const [ error, setError ] = createSignal<DeviceHeadingError | null>("denied");
		const [ mounted, setMounted ] = createSignal(true);
		const view = render(() => (
			<>
				<Show when={mounted()}>
					<DeviceHeadingToggle
						active={false}
						error={error()}
						labels={labels}
						onToggle={() => undefined}
						pending={false}
					/>
				</Show>
				<Notifications center={notifications} />
			</>
		));
		const list = within(view.getByRole("list"));

		expect(list.getByText(labels.alignDenied)).toBeInTheDocument();
		expect(list.getByText(labels.alignDeniedReason)).toBeInTheDocument();
		expect(view.getByRole("button", { name: `Dismiss: ${labels.alignDenied}` })).toBeInTheDocument();
		expect(view.getByRole("listitem")).toHaveAttribute("data-variant", "error");
		setError("timeout");
		expect(list.getByText(labels.alignTimeout)).toBeInTheDocument();
		expect(list.queryByText(labels.alignDenied)).not.toBeInTheDocument();
		expect(list.queryByText(labels.alignDeniedReason)).not.toBeInTheDocument();
		expect(view.getAllByRole("listitem")).toHaveLength(1);

		setError(null);
		expect(view.queryByRole("listitem")).not.toBeInTheDocument();
		setError("blocked");
		expect(list.getByText(labels.alignBlocked)).toBeInTheDocument();
		setMounted(false);
		expect(view.queryByRole("listitem")).not.toBeInTheDocument();
	});
});
