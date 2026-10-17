import { createMemo, createSignal, onCleanup, onMount, untrack } from "solid-js";
import { normalizeDegrees } from "utils/math";
import { isNullable } from "utils/validators";

import type { DeviceHeadingError } from "../types/device-heading";

type DeviceHeadingStatus = "active" | "idle" | "requesting" | "unsupported" | DeviceHeadingError;

interface DeviceHeadingOptions {
	timeout?: number;
}

interface DeviceOrientationEventWithCompass extends DeviceOrientationEvent {
	webkitCompassHeading?: number;
}

interface DeviceOrientationEventWithPermission {
	requestPermission?: () => Promise<"denied" | "granted">;
}

const DEFAULT_TIMEOUT = 8000;

function getOrientationHeading(event: DeviceOrientationEventWithCompass) {
	if (typeof event.webkitCompassHeading === "number") {
		return normalizeDegrees(event.webkitCompassHeading);
	}

	if (!event.absolute || isNullable(event.alpha)) {
		return null;
	}

	const screenAngle = (screen as unknown as { orientation?: ScreenOrientation }).orientation?.angle ?? 0;

	return normalizeDegrees(360 - event.alpha + screenAngle);
}

function isPermissionError(error: unknown) {
	return (
		error instanceof DOMException &&
		(
			error.name === "NotAllowedError" ||
			error.name === "SecurityError"
		)
	);
}

export function useDeviceHeading(options: DeviceHeadingOptions = {}) {
	const [ heading, setHeading ] = createSignal<null | number>(null);
	const [ status, setStatus ] = createSignal<DeviceHeadingStatus>("idle");

	const timeout = options.timeout ?? DEFAULT_TIMEOUT;

	let geolocationWatchId: number | undefined;
	let headingTimeoutId: number | undefined;

	const orientationConstructor = () => DeviceOrientationEvent as unknown as DeviceOrientationEventWithPermission;
	const supportsGeolocation = () => "geolocation" in navigator;
	const supportsOrientation = () => "DeviceOrientationEvent" in window;
	const canRequest = createMemo(() => supportsOrientation()
		&& typeof orientationConstructor().requestPermission === "function");
	const supported = createMemo(() => supportsGeolocation() || supportsOrientation());
	const error = createMemo<DeviceHeadingError | null>(() => {
		const currentStatus = status();

		return currentStatus === "denied" || currentStatus === "timeout" || currentStatus === "unavailable"
			? currentStatus
			: null;
	});

	function clearHeadingTimeout() {
		if (!isNullable(headingTimeoutId)) {
			window.clearTimeout(headingTimeoutId);
			headingTimeoutId = undefined;
		}
	}

	function waitForHeading() {
		clearHeadingTimeout();
		setStatus("requesting");
		headingTimeoutId = window.setTimeout(() => {
			headingTimeoutId = undefined;

			if (isNullable(untrack(heading))) {
				setStatus("timeout");
			}
		}, timeout);
	}

	function handleOrientation(event: DeviceOrientationEvent) {
		const nextHeading = getOrientationHeading(event as DeviceOrientationEventWithCompass);

		if (!isNullable(nextHeading)) {
			clearHeadingTimeout();
			setHeading(nextHeading);
			setStatus("active");
		}
	}

	function startGeolocationHeading() {
		if (!supportsGeolocation() || !isNullable(geolocationWatchId)) {
			return;
		}

		geolocationWatchId = navigator.geolocation.watchPosition(
			position => {
				if (!isNullable(position.coords.heading) && Number.isFinite(position.coords.heading)) {
					clearHeadingTimeout();
					setHeading(normalizeDegrees(position.coords.heading));
					setStatus("active");
				}
			},
			error => {
				if (!supportsOrientation() && isNullable(untrack(heading))) {
					if (error.code === error.PERMISSION_DENIED) {
						setStatus("denied");
					} else if (error.code === error.TIMEOUT) {
						setStatus("timeout");
					} else {
						setStatus("unavailable");
					}
				}
			},
			{ enableHighAccuracy: true, maximumAge: 2_000, timeout }
		);
	}

	async function requestHeading() {
		if (!supportsOrientation()) {
			setStatus("unsupported");
			return;
		}

		clearHeadingTimeout();
		setStatus("requesting");

		try {
			const permission = await orientationConstructor().requestPermission?.();

			if (permission !== "granted") {
				setStatus(permission === "denied" ? "denied" : "unavailable");
				return;
			}

			if (isNullable(untrack(heading))) {
				waitForHeading();
			}
		} catch (error) {
			clearHeadingTimeout();
			setStatus(isPermissionError(error) ? "denied" : "unavailable");
		}
	}

	onMount(() => {
		if (!supported()) {
			setStatus("unsupported");
			return;
		}

		window.addEventListener("deviceorientation", handleOrientation);
		window.addEventListener("deviceorientationabsolute", handleOrientation);

		const permissions = (navigator as unknown as { permissions?: Permissions }).permissions;

		void permissions?.query({ name: "geolocation" }).then(permission => {
			if (permission.state === "granted") {
				startGeolocationHeading();
			}
		}).catch(() => undefined);
	});

	onCleanup(() => {
		clearHeadingTimeout();
		window.removeEventListener("deviceorientation", handleOrientation);
		window.removeEventListener("deviceorientationabsolute", handleOrientation);

		if (!isNullable(geolocationWatchId)) {
			navigator.geolocation.clearWatch(geolocationWatchId);
		}
	});

	return {
		canRequest,
		error,
		heading,
		requestHeading,
		status
	};
}
