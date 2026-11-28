import { fireEvent, within } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createNotifications, mountNotifications } from "../index";

import type { NotificationViewportOptions } from "../index";

const disposers: (() => void)[] = [];

function mockCountdownAnimations() {
	const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, "animate");

	const createAnimation = () => ({
		cancel: vi.fn(),
		currentTime: 0,
		pause: vi.fn(),
		play: vi.fn()
	});

	const animations: ReturnType<typeof createAnimation>[] = [];

	const animate = vi.fn(() => {
		const animation = createAnimation();
		animations.push(animation);

		return animation;
	});

	Object.defineProperty(Element.prototype, "animate", {
		configurable: true,
		value: animate
	});

	disposers.push(() => {
		if (descriptor) {
			Object.defineProperty(Element.prototype, "animate", descriptor);
		} else {
			Reflect.deleteProperty(Element.prototype, "animate");
		}
	});

	return {
		animate,
		animations
	};
}

function itemFor(element: HTMLElement) {
	const item = element.closest("li");

	if (!item) {
		throw new Error("Expected a notification list item");
	}

	return item;
}

function setup(options?: NotificationViewportOptions) {
	const center = createNotifications();
	const host = document.createElement("div");

	document.body.append(host);

	const dispose = mountNotifications({
		center,
		host,
		viewportOptions: options
	});

	disposers.push(dispose);

	return {
		center,
		dispose,
		host,
		...within(host)
	};
}

beforeEach(() => {
	vi.useFakeTimers();
	vi.spyOn(document, "hidden", "get").mockReturnValue(false);
});

afterEach(() => {
	for (const dispose of disposers.splice(0)) {
		dispose();
	}

	document.body.replaceChildren();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
	vi.useRealTimers();
});

describe("notifications", () => {
	it("commits a full-size entrance pose before moving the existing stack", () => {
		const view = setup();

		const entrances: {
			arrivingHeight?: string;
			arrivingScale?: string;
			previousObscured?: null | string;
			previousOffset?: string;
		}[] = [];

		vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
			if (this.localName === "ol") {
				const arriving = this.querySelector<HTMLLIElement>("li[data-state=entering]");
				const previous = this.querySelector<HTMLLIElement>("li[data-state=open]");

				entrances.push({
					arrivingHeight: arriving?.style.getPropertyValue("--notification-height"),
					arrivingScale: arriving?.style.getPropertyValue("--notification-scale"),
					previousObscured: previous?.getAttribute("data-obscured"),
					previousOffset: previous?.style.getPropertyValue("--notification-offset")
				});
			}

			return new DOMRect();
		});

		view.center.show({
			duration: Infinity,
			title: "First arrival"
		});

		const item = itemFor(view.getByText("First arrival"));
		expect(item).toHaveAttribute("data-state", "open");

		view.center.show({
			duration: Infinity,
			title: "Next arrival"
		});

		expect(view.host.querySelector("li[data-obscured=true]")).toBe(item);
		expect(item).toHaveAttribute("data-state", "open");
		expect(itemFor(within(view.getByRole("list")).getByText("Next arrival"))).toHaveAttribute("data-state", "open");
		expect(entrances).toStrictEqual([
			{
				arrivingHeight: "88px",
				arrivingScale: "1",
				previousObscured: undefined,
				previousOffset: undefined
			},
			{
				arrivingHeight: "88px",
				arrivingScale: "1",
				previousObscured: "false",
				previousOffset: "0px"
			}
		]);
	});

	it("keeps a dismissed card mounted until its exit finishes, even while another arrives", () => {
		const view = setup();

		const id = view.center.show({
			duration: Infinity,
			title: "Brief arrival"
		});

		const item = itemFor(view.getByText("Brief arrival"));

		vi.advanceTimersByTime(100);
		view.center.dismiss(id);
		view.center.show({
			duration: Infinity,
			title: "Next arrival"
		});

		vi.advanceTimersByTime(399);
		expect(item).toHaveAttribute("data-state", "leaving");
		expect(item).toBeInTheDocument();

		vi.advanceTimersByTime(1);
		expect(item).not.toBeInTheDocument();
	});

	it("keeps channels isolated and updates a reused ID without duplicating it", () => {
		const first = setup();
		const second = setup();

		first.center.show({
			id: "compass",
			title: "Access denied"
		});

		first.center.show({
			id: "compass",
			title: "Connected",
			variant: "success"
		});

		expect(first.getAllByRole("listitem")).toHaveLength(1);
		expect(first.getByText("Connected")).toBeInTheDocument();
		expect(second.queryByText("Connected")).not.toBeInTheDocument();
	});

	it("queues before mounting and avoids collisions with explicit IDs", () => {
		const center = createNotifications();

		center.show({
			id: "notification-1",
			title: "Explicit ID"
		});

		const id = center.show({ title: "Generated ID" });
		const host = document.createElement("div");
		disposers.push(mountNotifications({
			center,
			host
		}));

		expect(id).not.toBe("notification-1");
		expect(host.querySelectorAll("li")).toHaveLength(2);
	});

	it("prevents duplicate viewports and permits remounting after idempotent disposal", () => {
		const view = setup();
		const host = document.createElement("div");
		const cleanup = vi.fn();

		view.center.show({
			content: () => ({
				cleanup,
				element: document.createElement("div")
			}),
			duration: Infinity,
			title: "Remounted notification"
		});

		expect(() => mountNotifications({
			center: view.center,
			host
		})).toThrow("A notification channel can only have one mounted viewport.");
		expect(host).toBeEmptyDOMElement();

		view.dispose();
		view.dispose();
		expect(cleanup).toHaveBeenCalledOnce();
		expect(vi.getTimerCount()).toBe(0);

		disposers.push(mountNotifications({
			center: view.center,
			host
		}));
		expect(host.querySelectorAll("li")).toHaveLength(1);
	});

	it("expands the stack on hover and focus, hiding obscured controls until then", () => {
		const view = setup();

		for (const title of [ "First", "Second", "Third", "Fourth" ]) {
			view.center.show({
				duration: Infinity,
				title
			});
		}

		const region = view.getByRole("region", { name: "Notifications" });
		const oldest = itemFor(view.getByText("First"));
		const second = itemFor(view.getByText("Second"));

		expect(oldest.inert).toBe(true);
		expect(oldest).toHaveAttribute("data-hidden", "true");

		fireEvent.mouseEnter(region);
		expect(region).toHaveAttribute("data-expanded", "true");
		expect(oldest.inert).toBe(true);
		expect(second.inert).toBe(false);
		expect(view.getAllByRole("listitem")).toHaveLength(3);

		fireEvent.mouseLeave(region);
		view.getByRole("button", { name: "Dismiss: Fourth" }).focus();
		expect(second.inert).toBe(false);
	});

	it("supports explicit expansion on touch through the stack button", () => {
		const view = setup();
		view.center.show({ title: "First" });
		view.center.show({ title: "Second" });

		const button = view.getByRole("button", { name: "Notification stack (2)" });

		fireEvent.click(button);
		expect(button).toHaveAttribute("aria-expanded", "true");

		fireEvent.click(button);
		expect(button).toHaveAttribute("aria-expanded", "false");
	});

	it("resumes the remaining countdown when a pinned stack shrinks to one card", () => {
		const view = setup();
		const dismissed = vi.fn();
		view.center.show({
			duration: 1000,
			onDismiss: dismissed,
			title: "Waiting"
		});
		vi.advanceTimersByTime(300);
		const newer = view.center.show({
			duration: Infinity,
			title: "Newer"
		});

		fireEvent.click(view.getByRole("button", { name: "Notification stack (2)" }));
		vi.advanceTimersByTime(5000);
		view.center.dismiss(newer);
		expect(view.queryByRole("button", { name: /Notification stack/ })).not.toBeInTheDocument();
		vi.advanceTimersByTime(699);
		expect(dismissed).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1);
		expect(dismissed).toHaveBeenCalledExactlyOnceWith("timeout");
	});

	it("keeps hover pausing the final card after clearing the stack pin", () => {
		const view = setup();
		const dismissed = vi.fn();
		view.center.show({
			duration: 1000,
			onDismiss: dismissed,
			title: "Waiting"
		});
		const newer = view.center.show({
			duration: Infinity,
			title: "Newer"
		});
		const region = view.getByRole("region");
		fireEvent.mouseEnter(region);
		fireEvent.click(view.getByRole("button", { name: "Notification stack (2)" }));
		view.center.dismiss(newer);
		vi.advanceTimersByTime(5000);
		expect(dismissed).not.toHaveBeenCalled();

		fireEvent.mouseLeave(region);
		vi.advanceTimersByTime(1000);
		expect(dismissed).toHaveBeenCalledExactlyOnceWith("timeout");
	});

	it("moves focus from a disappearing stack toggle and resumes the final card on blur", () => {
		const view = setup();
		const origin = document.createElement("button");
		document.body.append(origin);
		origin.focus();
		const dismissed = vi.fn();
		view.center.show({
			duration: 1000,
			onDismiss: dismissed,
			title: "Waiting"
		});
		const newer = view.center.show({
			duration: Infinity,
			title: "Newer"
		});
		const toggle = view.getByRole("button", { name: "Notification stack (2)" });
		toggle.focus();
		fireEvent.click(toggle);
		view.center.dismiss(newer);
		expect(view.getByRole("button", { name: "Dismiss: Waiting" })).toHaveFocus();
		vi.advanceTimersByTime(5000);
		expect(dismissed).not.toHaveBeenCalled();

		origin.focus();
		vi.advanceTimersByTime(1000);
		expect(dismissed).toHaveBeenCalledExactlyOnceWith("timeout");
	});

	it("pauses on hover and resumes the remaining duration", () => {
		const { animations } = mockCountdownAnimations();
		const view = setup();
		const dismissed = vi.fn();

		view.center.show({
			duration: 1000,
			onDismiss: dismissed,
			title: "Saved"
		});

		const progress = itemFor(view.getByText("Saved")).querySelector<HTMLDivElement>("div[aria-hidden=true]");
		const animation = animations[0];
		expect(animation.play).toHaveBeenCalledOnce();
		vi.advanceTimersByTime(400);
		fireEvent.mouseEnter(view.getByRole("region"));
		expect(animation.currentTime).toBe(400);
		expect(progress?.style.clipPath).toBe("inset(0 40% 0 0)");
		expect(animation.pause).toHaveBeenCalled();
		vi.advanceTimersByTime(5000);
		expect(dismissed).not.toHaveBeenCalled();
		expect(animation.currentTime).toBe(400);
		fireEvent.mouseLeave(view.getByRole("region"));
		expect(animation.play).toHaveBeenCalledTimes(2);
		vi.advanceTimersByTime(599);
		expect(dismissed).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1);
		expect(dismissed).toHaveBeenCalledExactlyOnceWith("timeout");
		expect(animation.currentTime).toBe(1000);
		vi.advanceTimersByTime(400);
		expect(animation.cancel).toHaveBeenCalledOnce();
		expect(within(view.getByRole("list")).queryByText("Saved")).not.toBeInTheDocument();
	});

	it("restarts the countdown line on updates, hides it for persistent cards, and cancels it on unmount", () => {
		const { animate, animations } = mockCountdownAnimations();
		const view = setup();
		const id = view.center.show({
			duration: 1000,
			title: "Working"
		});
		const progress = itemFor(view.getByText("Working")).querySelector<HTMLDivElement>("div[aria-hidden=true]");
		expect(progress?.hidden).toBe(false);
		expect(animate).toHaveBeenLastCalledWith(expect.any(Array), {
			duration: 1000,
			easing: "linear",
			fill: "both"
		});

		vi.advanceTimersByTime(400);
		view.center.update(id, { title: "Still working" });
		expect(animations).toHaveLength(1);
		expect(animations[0].currentTime).toBe(0);
		expect(progress?.style.clipPath).toBe("inset(0 0% 0 0)");

		view.center.update(id, { duration: 2000 });
		expect(animations[0].cancel).toHaveBeenCalledOnce();
		expect(animations).toHaveLength(2);
		expect(animate).toHaveBeenLastCalledWith(expect.any(Array), {
			duration: 2000,
			easing: "linear",
			fill: "both"
		});

		view.center.update(id, { duration: Infinity });
		expect(progress?.hidden).toBe(true);
		expect(animations[1].cancel).toHaveBeenCalledOnce();

		view.center.update(id, { duration: 500 });
		expect(progress?.hidden).toBe(false);
		expect(animations).toHaveLength(3);
		view.dispose();
		expect(animations[2].cancel).toHaveBeenCalledOnce();
		expect(vi.getTimerCount()).toBe(0);
	});

	it("pauses while the document is hidden", () => {
		const view = setup();
		const dismissed = vi.fn();

		view.center.show({
			duration: 1000,
			onDismiss: dismissed,
			title: "Saved"
		});

		vi.advanceTimersByTime(300);
		vi.spyOn(document, "hidden", "get").mockReturnValue(true);
		fireEvent(document, new Event("visibilitychange"));
		vi.advanceTimersByTime(4000);
		expect(dismissed).not.toHaveBeenCalled();
		vi.spyOn(document, "hidden", "get").mockReturnValue(false);
		fireEvent(document, new Event("visibilitychange"));
		vi.advanceTimersByTime(700);
		expect(dismissed).toHaveBeenCalledExactlyOnceWith("timeout");
	});

	it("pauses while a keyboard user interacts with the stack and resumes on blur", () => {
		const view = setup();
		const origin = document.createElement("button");

		document.body.append(origin);
		const dismissed = vi.fn();

		view.center.show({
			duration: 1000,
			onDismiss: dismissed,
			title: "Saved"
		});

		vi.advanceTimersByTime(400);
		view.getByRole("button", { name: "Dismiss: Saved" }).focus();
		vi.advanceTimersByTime(5000);
		expect(dismissed).not.toHaveBeenCalled();
		origin.focus();
		vi.advanceTimersByTime(600);
		expect(dismissed).toHaveBeenCalledExactlyOnceWith("timeout");
	});

	it("starts the revealed card's countdown when a dragged card is dismissed", () => {
		const view = setup();
		const dismissed = vi.fn();

		view.center.show({
			duration: 1000,
			onDismiss: dismissed,
			title: "Waiting"
		});
		const id = view.center.show({
			duration: Infinity,
			title: "Dragging"
		});
		const item = itemFor(view.getByText("Dragging"));
		Object.assign(item, { setPointerCapture: vi.fn() });
		const event = new Event("pointerdown", { bubbles: true });
		Object.assign(event, {
			button: 0,
			clientX: 0,
			clientY: 0,
			pointerId: 1
		});

		vi.advanceTimersByTime(300);
		fireEvent(item, event);
		vi.advanceTimersByTime(5000);
		expect(dismissed).not.toHaveBeenCalled();

		view.center.dismiss(id);
		vi.advanceTimersByTime(999);
		expect(dismissed).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1);
		expect(dismissed).toHaveBeenCalledExactlyOnceWith("timeout");
	});

	it("expires collapsed notifications one at a time while covered countdowns stay paused", () => {
		const { animations } = mockCountdownAnimations();
		const view = setup();
		const dismissed = vi.fn();

		for (const title of [ "First", "Second", "Third" ]) {
			view.center.show({
				duration: 1000,
				onDismiss: () => dismissed(title),
				title
			});
		}

		vi.advanceTimersByTime(1000);
		expect(dismissed.mock.calls).toStrictEqual([ [ "Third" ] ]);
		expect(animations[0].currentTime).toBe(0);
		expect(animations[1].currentTime).toBe(0);

		vi.advanceTimersByTime(1000);
		expect(dismissed.mock.calls).toStrictEqual([ [ "Third" ], [ "Second" ] ]);
		expect(animations[0].currentTime).toBe(0);

		vi.advanceTimersByTime(999);
		expect(dismissed).toHaveBeenCalledTimes(2);
		vi.advanceTimersByTime(1);
		expect(dismissed.mock.calls).toStrictEqual([ [ "Third" ], [ "Second" ], [ "First" ] ]);
	});

	it("preserves elapsed time when a newer notification covers a running countdown", () => {
		const { animations } = mockCountdownAnimations();
		const view = setup();
		const olderDismissed = vi.fn();
		const newerDismissed = vi.fn();

		view.center.show({
			duration: 1000,
			onDismiss: olderDismissed,
			title: "Older"
		});
		vi.advanceTimersByTime(300);
		view.center.show({
			duration: 500,
			onDismiss: newerDismissed,
			title: "Newer"
		});
		expect(animations[0].currentTime).toBe(300);

		vi.advanceTimersByTime(500);
		expect(newerDismissed).toHaveBeenCalledExactlyOnceWith("timeout");
		expect(olderDismissed).not.toHaveBeenCalled();
		expect(animations[0].currentTime).toBe(300);
		expect(animations[0].play).toHaveBeenCalledTimes(2);

		vi.advanceTimersByTime(699);
		expect(olderDismissed).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1);
		expect(olderDismissed).toHaveBeenCalledExactlyOnceWith("timeout");
	});

	it("counts down readable notifications together in an always-expanded viewport", () => {
		const view = setup({ expanded: true });
		const firstDismissed = vi.fn();
		const secondDismissed = vi.fn();

		view.center.show({
			duration: 1000,
			onDismiss: firstDismissed,
			title: "First"
		});
		view.center.show({
			duration: 1500,
			onDismiss: secondDismissed,
			title: "Second"
		});

		vi.advanceTimersByTime(1000);
		expect(firstDismissed).toHaveBeenCalledExactlyOnceWith("timeout");
		expect(secondDismissed).not.toHaveBeenCalled();
		vi.advanceTimersByTime(500);
		expect(secondDismissed).toHaveBeenCalledExactlyOnceWith("timeout");
	});

	it.each([ false, true ])("does not expire queued notifications when expanded=%s", expanded => {
		const { animations } = mockCountdownAnimations();
		const view = setup({
			expanded,
			visibleCount: 1
		});

		const dismissed = vi.fn();

		view.center.show({
			duration: 1000,
			onDismiss: dismissed,
			title: "Queued"
		});

		const top = view.center.show({
			duration: Infinity,
			title: "Persistent"
		});

		vi.advanceTimersByTime(5000);
		expect(dismissed).not.toHaveBeenCalled();
		expect(animations[0].currentTime).toBe(0);

		view.center.dismiss(top);
		expect(animations[0].play).toHaveBeenCalledTimes(2);
		vi.advanceTimersByTime(1000);
		expect(dismissed).toHaveBeenCalledExactlyOnceWith("timeout");
		expect(animations[0].currentTime).toBe(1000);
	});

	it("restarts the timeout when updating in place and can revive a leaving notification", () => {
		const view = setup();
		const dismissed = vi.fn();

		const id = view.center.show({
			duration: 1000,
			onDismiss: dismissed,
			title: "Working"
		});

		vi.advanceTimersByTime(900);
		view.center.update(id, { title: "Done" });
		vi.advanceTimersByTime(900);
		expect(dismissed).not.toHaveBeenCalled();

		view.center.dismiss(id);

		view.center.show({
			duration: Infinity,
			id,
			title: "Working again"
		});

		vi.advanceTimersByTime(1000);
		expect(within(view.getByRole("list")).getByText("Working again")).toBeInTheDocument();
		expect(view.getAllByRole("listitem")).toHaveLength(1);
	});

	it("runs an action once and reports the dismissal reason", () => {
		const view = setup();
		const clicked = vi.fn();
		const dismissed = vi.fn();

		view.center.show({
			action: {
				label: "Update",
				onClick: clicked
			},
			duration: Infinity,
			onDismiss: dismissed,
			title: "New version"
		});

		fireEvent.click(view.getByRole("button", { name: "Update" }));
		expect(clicked).toHaveBeenCalledOnce();
		expect(dismissed).toHaveBeenCalledExactlyOnceWith("action");
	});

	it("dismisses with Escape and returns focus to the originating control", () => {
		const origin = document.createElement("button");
		document.body.append(origin);
		origin.focus();
		const view = setup();
		const dismissed = vi.fn();

		view.center.show({
			duration: Infinity,
			onDismiss: dismissed,
			title: "Update ready"
		});

		const close = view.getByRole("button", { name: "Dismiss: Update ready" });
		close.focus();

		fireEvent.keyDown(close, { key: "Escape" });
		expect(dismissed).toHaveBeenCalledExactlyOnceWith("dismiss");
		expect(origin).toHaveFocus();
	});

	it.each([ 1, 3 ])("moves focus to a visible card when arrivals exceed visibleCount=%s", visibleCount => {
		const view = setup({ visibleCount });
		const origin = document.createElement("button");
		document.body.append(origin);
		origin.focus();
		view.center.show({
			duration: Infinity,
			title: "Focused"
		});
		expect(origin).toHaveFocus();
		const close = view.getByRole("button", { name: "Dismiss: Focused" });
		close.focus();

		for (let index = 1; index < visibleCount; index++) {
			view.center.show({
				duration: Infinity,
				title: `Arrival ${index}`
			});
			expect(close).toHaveFocus();
		}

		view.center.show({
			duration: Infinity,
			title: "Newest"
		});
		expect(itemFor(close)).toHaveAttribute("aria-hidden", "true");
		expect(itemFor(close).inert).toBe(true);
		expect(view.getByRole("button", { name: "Dismiss: Newest" })).toHaveFocus();
		view.center.clear();
		expect(origin).toHaveFocus();
	});

	it("keeps keyboard focus through updates and moves it to the next card on dismissal", () => {
		const view = setup();
		const origin = document.createElement("button");
		document.body.append(origin);
		origin.focus();

		view.center.show({
			duration: Infinity,
			title: "Earlier"
		});

		const id = view.center.show({
			duration: Infinity,
			title: "Working"
		});

		view.getByRole("button", { name: "Dismiss: Working" }).focus();
		view.center.update(id, { title: "Done" });
		const close = view.getByRole("button", { name: "Dismiss: Done" });
		expect(close).toHaveFocus();
		fireEvent.keyDown(close, { key: "Escape" });
		expect(view.getByRole("button", { name: "Dismiss: Earlier" })).toHaveFocus();
		view.center.clear();
		expect(origin).toHaveFocus();
	});

	it("announces messages through separate live regions and renders text safely", () => {
		const view = setup();

		view.center.show({ title: "<img src=x>" });

		view.center.show({
			title: "Access denied",
			variant: "error"
		});

		vi.advanceTimersByTime(0);

		expect(view.getByRole("status")).toHaveTextContent("<img src=x>");
		expect(view.getByRole("alert")).toHaveTextContent("Access denied");
		expect(view.host.querySelector("img")).toBeNull();
	});

	it("announces warnings politely and changes urgency when an existing notification changes variant", () => {
		const view = setup({ expanded: true });

		const id = view.center.show({
			duration: Infinity,
			title: "Low location accuracy",
			variant: "warning"
		});

		view.center.show({
			duration: Infinity,
			title: "Photo walk reminder",
			variant: "neutral"
		});

		const item = itemFor(view.getByText("Low location accuracy"));

		vi.advanceTimersByTime(0);
		expect(view.getByRole("status")).toHaveTextContent("Low location accuracy. Photo walk reminder");
		expect(view.getByRole("alert")).toBeEmptyDOMElement();

		view.center.update(id, {
			title: "Location unavailable",
			variant: "error"
		});

		vi.advanceTimersByTime(0);

		expect(view.getByRole("alert")).toHaveTextContent("Location unavailable");
		expect(item).toHaveAttribute("data-variant", "error");

		view.center.update(id, {
			title: "Location found",
			variant: "success"
		});

		vi.advanceTimersByTime(0);

		expect(view.getByRole("alert")).toBeEmptyDOMElement();
		expect(view.getByRole("status")).toHaveTextContent("Location found");
		expect(item).toHaveAttribute("data-variant", "success");
		expect(view.getAllByRole("listitem")).toHaveLength(2);
	});

	it("cleans custom content on replacement, removal, and unmount", () => {
		const view = setup();
		const cleanup = vi.fn();

		const content = () => ({
			cleanup,
			element: document.createElement("div")
		});

		const id = view.center.show({
			content,
			duration: Infinity,
			title: "Custom"
		});

		view.center.update(id, { description: "Updated" });
		expect(cleanup).toHaveBeenCalledTimes(1);

		view.center.dismiss(id);
		vi.advanceTimersByTime(400);
		expect(cleanup).toHaveBeenCalledTimes(2);

		view.center.show({
			content,
			title: "Another"
		});

		view.dispose();

		expect(cleanup).toHaveBeenCalledTimes(3);
		expect(vi.getTimerCount()).toBe(0);
		view.center.show({ title: "After unmount" });
		expect(view.host).toBeEmptyDOMElement();
	});

	it("measures varied content heights when expanding a top stack", () => {
		vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (this: HTMLElement) {
			return this.textContent.includes("Long") ? 140 : 80;
		});

		const view = setup({
			expanded: true,
			position: "top-right"
		});

		view.center.show({ title: "Short" });
		view.center.show({ title: "Long" });

		const back = itemFor(view.getByText("Short"));
		expect(back.style.getPropertyValue("--notification-offset")).toBe("156px");
		expect(back.style.getPropertyValue("--notification-height")).toBe("82px");
	});

	it("relayouts resized content and releases observers when cards leave and the viewport unmounts", () => {
		let notifyResize: () => void = vi.fn();
		let height = 80;
		const observer = {
			disconnect: vi.fn(),
			observe: vi.fn(),
			unobserve: vi.fn()
		};
		vi.stubGlobal("ResizeObserver", vi.fn(function (callback: () => void) {
			notifyResize = callback;

			return observer;
		}));
		vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (this: HTMLElement) {
			return this.textContent.includes("Growing") ? height : 80;
		});
		const view = setup({
			expanded: true,
			position: "top-center"
		});
		view.center.show({
			duration: Infinity,
			title: "Earlier"
		});
		const id = view.center.show({
			duration: Infinity,
			title: "Growing"
		});
		const back = itemFor(view.getByText("Earlier"));
		const front = itemFor(view.getByText("Growing"));
		expect(observer.observe).toHaveBeenCalledWith(front.firstElementChild);
		expect(back.style.getPropertyValue("--notification-offset")).toBe("96px");

		height = 160;
		notifyResize();
		expect(back.style.getPropertyValue("--notification-offset")).toBe("176px");

		view.center.dismiss(id);
		vi.advanceTimersByTime(400);
		expect(observer.unobserve).toHaveBeenCalledWith(front.firstElementChild);
		view.dispose();
		expect(observer.disconnect).toHaveBeenCalledOnce();
		expect(vi.getTimerCount()).toBe(0);
	});

	it("dismisses a horizontal swipe and leaves a canceled swipe open", () => {
		const view = setup();
		const dismissed = vi.fn();

		view.center.show({
			duration: Infinity,
			onDismiss: dismissed,
			title: "Swipe me"
		});

		const item = itemFor(view.getByText("Swipe me"));
		Object.assign(item, { setPointerCapture: vi.fn() });

		const pointer = (type: string, x: number) => {
			const event = new Event(type, { bubbles: true });
			Object.assign(event, {
				button: 0,
				clientX: x,
				clientY: 0,
				pointerId: 1
			});
			fireEvent(item, event);
		};

		pointer("pointerdown", 0);
		expect(item).toHaveAttribute("data-grabbing", "true");
		pointer("pointermove", 100);
		pointer("pointercancel", 100);
		expect(item).not.toHaveAttribute("data-grabbing");
		expect(dismissed).not.toHaveBeenCalled();
		pointer("pointerdown", 0);
		pointer("pointermove", 100);
		pointer("pointerup", 100);
		expect(item).not.toHaveAttribute("data-grabbing");
		expect(dismissed).toHaveBeenCalledExactlyOnceWith("dismiss");
	});
});
