import { cleanup, fireEvent, render, waitFor } from "@solidjs/testing-library";
import { createSignal, flush } from "solid-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Dialog } from "./dialog";

const prototype = HTMLDialogElement.prototype;
const originalClose = Object.getOwnPropertyDescriptor(prototype, "close");
const originalShowModal = Object.getOwnPropertyDescriptor(prototype, "showModal");
const scrollToMock = vi.fn();

const showModal = vi.fn(function (this: HTMLDialogElement) {
	this.setAttribute("open", "");
});

const close = vi.fn(function (this: HTMLDialogElement) {
	if (this.open) {
		this.removeAttribute("open");
		queueMicrotask(() => this.dispatchEvent(new Event("close")));
	}
});

beforeEach(() => {
	showModal.mockClear();
	close.mockClear();
	scrollToMock.mockClear();
	vi.stubGlobal("scrollTo", scrollToMock);
	vi.stubGlobal("scrollY", 125);

	Object.defineProperty(prototype, "showModal", {
		configurable: true,
		value: showModal
	});

	Object.defineProperty(prototype, "close", {
		configurable: true,
		value: close
	});
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();

	if (originalClose) {
		Object.defineProperty(prototype, "close", originalClose);
	} else {
		Reflect.deleteProperty(prototype, "close");
	}

	if (originalShowModal) {
		Object.defineProperty(prototype, "showModal", originalShowModal);
	} else {
		Reflect.deleteProperty(prototype, "showModal");
	}
});

describe("Dialog", () => {
	it("mounts closed without notifying or scrolling", () => {
		const onClose = vi.fn();
		render(() => <Dialog onClose={onClose} open={false}>Content</Dialog>);

		expect(showModal).not.toHaveBeenCalled();
		expect(close).not.toHaveBeenCalled();
		expect(onClose).not.toHaveBeenCalled();
		expect(scrollToMock).not.toHaveBeenCalled();
		expect(document.documentElement).not.toHaveAttribute("inert");
		expect(document.body).not.toHaveAttribute("data-locked");
	});

	it("notifies once when the parent closes it", async () => {
		const [ open, setOpen ] = createSignal(true);
		const onClose = vi.fn(() => setOpen(false));

		const view = render(() => <Dialog data-testid="dialog" onClose={onClose} open={open()}>
			Content
		</Dialog>);

		const dialog = view.getByTestId<HTMLDialogElement>("dialog");

		expect(dialog).toHaveAttribute("open");
		expect(document.documentElement).toHaveAttribute("inert");
		expect(document.body).toHaveAttribute("data-locked");
		flush(() => setOpen(false));
		await waitFor(() => expect(onClose).toHaveBeenCalledOnce());

		expect(close).toHaveBeenCalledOnce();
		expect(dialog).not.toHaveAttribute("open");
		expect(document.documentElement).not.toHaveAttribute("inert");
		expect(document.body).not.toHaveAttribute("data-locked");
		expect(scrollToMock).toHaveBeenCalledWith({
			behavior: "instant",
			top: 125
		});
	});

	it("handles native close without closing or notifying twice", async () => {
		const [ open, setOpen ] = createSignal(true);
		const onClose = vi.fn(() => setOpen(false));

		const view = render(() => <Dialog data-testid="dialog" onClose={onClose} open={open()}>
			Content
		</Dialog>);

		view.getByTestId<HTMLDialogElement>("dialog").close();
		await waitFor(() => expect(onClose).toHaveBeenCalledOnce());

		expect(close).toHaveBeenCalledOnce();
		expect(document.documentElement).not.toHaveAttribute("inert");
		expect(document.body).not.toHaveAttribute("data-locked");
	});

	it.each([ true, false ])("respects lightDismiss=%s", async (lightDismiss) => {
		const onClose = vi.fn();

		const view = render(() => <Dialog lightDismiss={lightDismiss} onClose={onClose} open>
			Content
		</Dialog>);

		fireEvent.click(view.getByText("Content"));

		if (lightDismiss) {
			await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
			expect(close).toHaveBeenCalledOnce();
		} else {
			expect(onClose).not.toHaveBeenCalled();
			expect(close).not.toHaveBeenCalled();
		}
	});

	it("updates scroll locking without reopening the dialog", () => {
		const [ preventScroll, setPreventScroll ] = createSignal(true);
		render(() => <Dialog open preventPageScroll={preventScroll()}>Content</Dialog>);

		flush(() => setPreventScroll(false));
		expect(document.body).not.toHaveAttribute("data-locked");
		flush(() => setPreventScroll(true));
		expect(document.body).toHaveAttribute("data-locked");
		expect(showModal).toHaveBeenCalledOnce();
		expect(close).not.toHaveBeenCalled();
	});

	it("releases modal state when unmounted while open", () => {
		const onClose = vi.fn();
		const view = render(() => <Dialog onClose={onClose} open>Content</Dialog>);

		view.unmount();

		expect(document.documentElement).not.toHaveAttribute("inert");
		expect(document.body).not.toHaveAttribute("data-locked");
		expect(scrollToMock).toHaveBeenCalledOnce();
		expect(onClose).not.toHaveBeenCalled();
	});

	it("ignores a queued close event after the dialog reopens", async () => {
		const [ open, setOpen ] = createSignal(true);
		const onClose = vi.fn();

		const view = render(() => <Dialog data-testid="dialog" onClose={onClose} open={open()}>
			Content
		</Dialog>);

		flush(() => setOpen(false));
		flush(() => setOpen(true));
		await Promise.resolve();

		expect(view.getByTestId("dialog")).toHaveAttribute("open");
		expect(document.documentElement).toHaveAttribute("inert");
		expect(document.body).toHaveAttribute("data-locked");
		expect(onClose).not.toHaveBeenCalled();
	});
});
