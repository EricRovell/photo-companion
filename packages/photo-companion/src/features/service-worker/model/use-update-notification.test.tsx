import { cleanup, fireEvent, render, renderHook, within } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Notifications, notifications } from "~/shared/ui/notifications";

import { useUpdateNotification } from "./use-update-notification";

const { useServiceWorker, useTranslation } = vi.hoisted(() => ({
	useServiceWorker: vi.fn(),
	useTranslation: vi.fn()
}));

vi.mock("./service-worker-context", () => ({ useServiceWorker }));
vi.mock("~/features/translation", () => ({ useTranslation }));

function setup() {
	const [ suggestUpdate, setSuggestUpdate ] = createSignal(false);
	const [ dictionary, setDictionary ] = createSignal({
		LABEL: { UPDATE: "Update" },
		MESSAGE: { UPDATE: "Update is ready to be installed." }
	});
	const handleReload = vi.fn();
	useServiceWorker.mockReturnValue({
		getSuggestUpdate: suggestUpdate,
		handleReload,
		setSuggestUpdate
	});
	useTranslation.mockReturnValue({ t: dictionary });
	const hook = renderHook(useUpdateNotification);
	const view = render(() => <Notifications center={notifications} />);

	return {
		dispose: hook.cleanup,
		handleReload,
		setDictionary,
		setSuggestUpdate,
		suggestUpdate,
		...view
	};
}

afterEach(() => {
	cleanup();
	notifications.clear();
	vi.clearAllMocks();
	vi.useRealTimers();
});

describe("service worker update notification", () => {
	it("stays open until dismissed and keeps the update prompt while requesting a reload", () => {
		vi.useFakeTimers();
		const view = setup();
		expect(view.queryByRole("listitem")).not.toBeInTheDocument();
		view.setSuggestUpdate(true);
		vi.advanceTimersByTime(60000);
		expect(view.getByRole("listitem")).toHaveTextContent("Update is ready to be installed.");

		fireEvent.click(view.getByRole("button", { name: "Update" }));
		expect(view.handleReload).toHaveBeenCalledOnce();
		expect(view.suggestUpdate()).toBe(true);
		expect(view.getByRole("listitem")).toBeInTheDocument();

		fireEvent.click(view.getByRole("button", { name: "Dismiss: Update is ready to be installed." }));
		expect(view.suggestUpdate()).toBe(false);
		expect(view.queryByRole("listitem")).not.toBeInTheDocument();
	});

	it("refreshes translated text in place and dismisses when the update suggestion is withdrawn", () => {
		const view = setup();
		view.setSuggestUpdate(true);
		view.setDictionary({
			LABEL: { UPDATE: "Обновить" },
			MESSAGE: { UPDATE: "Обновление готово к установке." }
		});
		expect(view.getAllByRole("listitem")).toHaveLength(1);
		expect(within(view.getByRole("list")).getByText("Обновление готово к установке.")).toBeInTheDocument();
		expect(view.getByRole("button", { name: "Обновить" })).toBeInTheDocument();

		view.setSuggestUpdate(false);
		expect(view.queryByRole("listitem")).not.toBeInTheDocument();
	});

	it("removes its notification when its owner is disposed and stops reacting", () => {
		const view = setup();
		view.setSuggestUpdate(true);
		expect(view.getByRole("listitem")).toBeInTheDocument();
		view.dispose();
		expect(view.suggestUpdate()).toBe(false);
		expect(view.queryByRole("listitem")).not.toBeInTheDocument();
		view.setSuggestUpdate(true);
		expect(view.queryByRole("listitem")).not.toBeInTheDocument();
	});
});
