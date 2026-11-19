import type { CreateNotificationInteractionsParams, NotificationDragChange } from "../types";

export const createNotificationInteractions = ({
	center,
	elements: { list, region, toggle },
	expanded: alwaysExpanded,
	onChange,
	onPauseChange
}: CreateNotificationInteractionsParams) => {
	const dragging = new Set<string>();

	let hovered = false;
	let focused = false;
	let focusWithin = false;
	let pinned = false;
	let returnFocus: HTMLElement | undefined;

	const expanded = () => alwaysExpanded === true || hovered || focused || pinned;
	const paused = () => hovered || focusWithin || pinned || document.hidden || dragging.size > 0;

	const unpin = () => { pinned = false; };

	const reset = () => {
		pinned = false;
		hovered = false;
		focused = false;
		focusWithin = false;
		dragging.clear();
	};

	const setDragging = ({ dragging: active, id }: NotificationDragChange) => {
		if (active) {
			dragging.add(id);
		} else {
			dragging.delete(id);
		}

		onPauseChange();
	};

	const restoreFocus = (element?: HTMLElement) => {
		const origin = returnFocus;
		(element ?? origin)?.focus();
		returnFocus = origin;
	};

	const onFocusIn = (event: FocusEvent) => {
		if (event.relatedTarget instanceof HTMLElement && !region.contains(event.relatedTarget)) {
			returnFocus = event.relatedTarget;
		}

		focused = event.target instanceof Node && list.contains(event.target);
		focusWithin = true;

		onChange();
	};

	const onFocusOut = (event: FocusEvent) => {
		focused = event.relatedTarget instanceof Node && list.contains(event.relatedTarget);
		focusWithin = event.relatedTarget instanceof Node && region.contains(event.relatedTarget);

		onChange();
	};

	const onMouseEnter = () => {
		hovered = true;
		onChange();
	};

	const onMouseLeave = () => {
		hovered = false;
		onChange();
	};

	const onToggle = () => {
		pinned = !pinned;
		onChange();
	};

	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key !== "Escape") {
			return;
		}

		const item = event.target instanceof Element ? event.target.closest<HTMLLIElement>("li[data-id]") : null;

		if (item?.dataset.id) {
			event.preventDefault();
			event.stopPropagation();
			center.dismiss(item.dataset.id);
		} else {
			pinned = false;
			onChange();
		}
	};

	const init = () => {
		region.onmouseenter = onMouseEnter;
		region.onmouseleave = onMouseLeave;
		region.onkeydown = onKeyDown;
		toggle.onclick = onToggle;
		region.addEventListener("focusin", onFocusIn);
		region.addEventListener("focusout", onFocusOut);
		document.addEventListener("visibilitychange", onPauseChange);
	};

	const dispose = () => {
		region.onmouseenter = null;
		region.onmouseleave = null;
		region.onkeydown = null;
		toggle.onclick = null;
		region.removeEventListener("focusin", onFocusIn);
		region.removeEventListener("focusout", onFocusOut);
		document.removeEventListener("visibilitychange", onPauseChange);
		reset();
	};

	init();

	return {
		dispose,
		expanded,
		paused,
		reset,
		restoreFocus,
		setDragging,
		unpin
	};
};
