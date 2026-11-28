import { cleanup, fireEvent, render, within } from "@solidjs/testing-library";
import { renderHook } from "~test";
import { flush } from "solid-js";
import { createSignal } from "solid-js";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Notifications, notifications } from "~/shared/ui/notifications";

import { useUpdateNotification } from "./use-update-notification";

const { useServiceWorker, useTranslation } = vi.hoisted(() => ({
	useServiceWorker: vi.fn(),
	useTranslation: vi.fn()
}));

vi.mock(import("./service-worker-context"), () => ({ useServiceWorker }));
vi.mock(import("~/features/translation"), () => ({ useTranslation }));

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
		flush();
		vi.advanceTimersByTime(60000);
		flush();
		expect(view.getByRole("listitem")).toHaveTextContent("Update is ready to be installed.");

		fireEvent.click(view.getByRole("button", { name: "Update" }));
		flush();
		expect(view.handleReload).toHaveBeenCalledOnce();
		expect(view.suggestUpdate()).toBe(true);
		expect(view.getByRole("listitem")).toBeInTheDocument();

		fireEvent.click(view.getByRole("button", { name: "Dismiss: Update is ready to be installed." }));
		flush();
		expect(view.suggestUpdate()).toBe(false);
		expect(view.queryByRole("listitem")).not.toBeInTheDocument();
	});

	it("refreshes translated text in place and dismisses when the update suggestion is withdrawn", () => {
		const view = setup();
		view.setSuggestUpdate(true);
		flush();
		view.setDictionary({
			LABEL: { UPDATE: "Обновить" },
			MESSAGE: { UPDATE: "Обновление готово к установке." }
		});
		flush();
		expect(view.getAllByRole("listitem")).toHaveLength(1);
		expect(within(view.getByRole("list")).getByText("Обновление готово к установке.")).toBeInTheDocument();
		expect(view.getByRole("button", { name: "Обновить" })).toBeInTheDocument();

		view.setSuggestUpdate(false);
		flush();
		expect(view.queryByRole("listitem")).not.toBeInTheDocument();
	});

	it("removes its notification when its owner is disposed and stops reacting", () => {
		const view = setup();
		view.setSuggestUpdate(true);
		flush();
		expect(view.getByRole("listitem")).toBeInTheDocument();
		view.dispose();
		flush();
		expect(view.suggestUpdate()).toBe(false);
		expect(view.queryByRole("listitem")).not.toBeInTheDocument();
		view.setSuggestUpdate(true);
		flush();
		expect(view.queryByRole("listitem")).not.toBeInTheDocument();
	});
});
