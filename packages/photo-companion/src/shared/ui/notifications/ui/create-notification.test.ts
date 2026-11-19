import { cleanup, renderHook } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createNotifications, notifications } from "../model";
import { createNotification } from "./create-notification";

import type { NotificationCenter, NotificationEntry } from "../types";

function getEntries(center: NotificationCenter) {
	let entries: readonly NotificationEntry[] = [];
	const unsubscribe = center.subscribe(value => { entries = value; });
	unsubscribe();
	return entries;
}

afterEach(() => {
	cleanup();
	notifications.clear();
});

describe("createNotification", () => {
	it("accepts plain options and cleans up when the scope is disposed", () => {
		const center = createNotifications();
		const onDismiss = vi.fn();
		const hook = renderHook(() => createNotification({
			onDismiss,
			title: "An update is ready",
			variant: "info"
		}, { center }));

		expect(getEntries(center)).toEqual([ expect.objectContaining({
			id: hook.result,
			title: "An update is ready",
			variant: "info"
		}) ]);
		expect(onDismiss).not.toHaveBeenCalled();
		hook.cleanup();
		expect(getEntries(center)).toEqual([]);
		expect(onDismiss).toHaveBeenCalledExactlyOnceWith("dismiss");
	});

	it("tracks reactive getters in an options object and updates in place", () => {
		const center = createNotifications();
		const [ title, setTitle ] = createSignal("Compass blocked");
		const hook = renderHook(() => createNotification({
			get title() { return title(); },
			variant: "error"
		}, { center }));

		expect(getEntries(center)[0]?.title).toBe("Compass blocked");
		setTitle("Compass permission denied");
		expect(getEntries(center)).toEqual([ expect.objectContaining({
			id: hook.result,
			title: "Compass permission denied"
		}) ]);
	});

	it("updates one notification without dismissing it between reactive changes", () => {
		const center = createNotifications();
		const [ title, setTitle ] = createSignal("Compass blocked");
		const onDismiss = vi.fn();
		const hook = renderHook(() => createNotification(() => ({
			onDismiss,
			title: title(),
			variant: "error"
		}), { center }));

		expect(getEntries(center)).toEqual([ expect.objectContaining({
			id: hook.result,
			title: "Compass blocked",
			variant: "error"
		}) ]);
		setTitle("Compass permission denied");
		expect(getEntries(center)).toEqual([ expect.objectContaining({
			id: hook.result,
			title: "Compass permission denied"
		}) ]);
		expect(onDismiss).not.toHaveBeenCalled();

		hook.cleanup();
		expect(getEntries(center)).toEqual([]);
		expect(onDismiss).toHaveBeenCalledExactlyOnceWith("dismiss");
		setTitle("Unmounted");
		expect(getEntries(center)).toEqual([]);
	});

	it.each([ false, null, undefined ] as const)("dismisses when the source returns %s and can show again", (hidden) => {
		const center = createNotifications();
		const [ visible, setVisible ] = createSignal(false);
		const onDismiss = vi.fn();
		const hook = renderHook(() => createNotification(() => visible() ? {
			onDismiss,
			title: "An update is ready"
		} : hidden, { center }));

		expect(getEntries(center)).toEqual([]);
		setVisible(true);
		expect(getEntries(center)).toHaveLength(1);
		setVisible(false);
		expect(getEntries(center)).toEqual([]);
		expect(onDismiss).toHaveBeenCalledExactlyOnceWith("dismiss");
		setVisible(true);
		expect(getEntries(center)[0]?.id).toBe(hook.result);
	});

	it("uses the application channel by default and only cleans up its own notification", () => {
		const externalId = notifications.show({ title: "Independent notification" });
		const first = renderHook(() => createNotification({ title: "First component" }));
		const second = renderHook(() => createNotification(() => ({ title: "Second component" })));

		expect(getEntries(notifications)).toHaveLength(3);
		expect(first.result).not.toBe(second.result);
		first.cleanup();
		expect(getEntries(notifications).map(entry => entry.id)).toEqual([ second.result, externalId ]);
		second.cleanup();
		expect(getEntries(notifications).map(entry => entry.id)).toEqual([ externalId ]);
	});

	it("does not track reactive reads in channel listeners or dismissal callbacks", () => {
		const center = createNotifications();
		const [ visible, setVisible ] = createSignal(true);
		const [ incidental, setIncidental ] = createSignal(0);
		/* eslint-disable solid/reactivity -- Deliberately read signals here to test accidental dependency tracking. */
		const unsubscribe = center.subscribe(incidental);
		const onDismiss = vi.fn(incidental);
		/* eslint-enable solid/reactivity */
		const getOptions = vi.fn();
		renderHook(() => createNotification(() => {
			getOptions();
			return visible() ? {
				onDismiss,
				title: "An update is ready"
			} : null;
		}, { center }));

		setIncidental(1);
		expect(getOptions).toHaveBeenCalledOnce();
		setVisible(false);
		expect(onDismiss).toHaveBeenCalledOnce();
		setIncidental(2);
		expect(getOptions).toHaveBeenCalledTimes(2);
		unsubscribe();
	});

	it("keeps a manually dismissed notification closed until its source changes", () => {
		const center = createNotifications();
		const [ title, setTitle ] = createSignal("Compass blocked");
		const hook = renderHook(() => createNotification(() => ({ title: title() }), { center }));

		center.dismiss(hook.result, "timeout");
		expect(getEntries(center)).toEqual([]);
		center.show({ title: "Unrelated notification" });
		expect(getEntries(center).some(entry => entry.id === hook.result)).toBe(false);
		setTitle("Compass permission denied");
		expect(getEntries(center).find(entry => entry.id === hook.result)?.title).toBe("Compass permission denied");
	});
});
