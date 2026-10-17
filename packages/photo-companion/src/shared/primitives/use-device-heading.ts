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
	requestPermission?: (absolute?: boolean) => Promise<"denied" | "granted">;
}

interface PermissionsPolicyLike {
	allowsFeature: (feature: string) => boolean;
}

const DEFAULT_TIMEOUT = 8000;
const ORIENTATION_FEATURES = [ "accelerometer", "gyroscope", "magnetometer" ];

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

function getRequestError(error: unknown): DeviceHeadingError {
	if (!(error instanceof DOMException)) {
		return "unavailable";
	}

	if (error.name === "NotAllowedError") {
		return "denied";
	}

	return error.name === "SecurityError" ? "blocked" : "unavailable";
}

export function useDeviceHeading(options: DeviceHeadingOptions = {}) {
	const [ heading, setHeading ] = createSignal<null | number>(null);
	const [ status, setStatus ] = createSignal<DeviceHeadingStatus>("idle");

	const timeout = options.timeout ?? DEFAULT_TIMEOUT;

	let geolocationWatchId: number | undefined;
	let headingEnabled = true;
	let headingTimeoutId: number | undefined;
	let orientationListening = false;

	const orientationConstructor = () => DeviceOrientationEvent as unknown as DeviceOrientationEventWithPermission;
	const supportsGeolocation = () => "geolocation" in navigator;
	const allowsOrientation = () => {
		const policy = (document as unknown as {
			featurePolicy?: PermissionsPolicyLike;
			permissionsPolicy?: PermissionsPolicyLike;
		}).permissionsPolicy ?? (document as unknown as { featurePolicy?: PermissionsPolicyLike }).featurePolicy;

		return isNullable(policy) || ORIENTATION_FEATURES.every(feature => policy.allowsFeature(feature));
	};
	const supportsOrientation = () => window.isSecureContext
		&& "DeviceOrientationEvent" in window
		&& allowsOrientation();
	const canRequestOrientation = () => supportsOrientation()
		&& typeof orientationConstructor().requestPermission === "function";
	const supported = createMemo(() => supportsGeolocation() || supportsOrientation());
	const canAlign = createMemo(() => canRequestOrientation() || !isNullable(heading()));
	const error = createMemo<DeviceHeadingError | null>(() => {
		const currentStatus = status();

		return currentStatus === "blocked"
			|| currentStatus === "denied"
			|| currentStatus === "timeout"
			|| currentStatus === "unavailable"
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
		if (!headingEnabled) {
			return;
		}

		const nextHeading = getOrientationHeading(event as DeviceOrientationEventWithCompass);

		if (!isNullable(nextHeading)) {
			clearHeadingTimeout();
			setHeading(nextHeading);
			setStatus("active");
		}
	}

	function startOrientationHeading() {
		if (!headingEnabled || !supportsOrientation() || orientationListening) {
			return;
		}

		window.addEventListener("deviceorientation", handleOrientation);
		window.addEventListener("deviceorientationabsolute", handleOrientation);
		orientationListening = true;
	}

	function stopOrientationHeading() {
		if (!orientationListening) {
			return;
		}

		window.removeEventListener("deviceorientation", handleOrientation);
		window.removeEventListener("deviceorientationabsolute", handleOrientation);
		orientationListening = false;
	}

	function startGeolocationHeading() {
		if (!headingEnabled || !supportsGeolocation() || !isNullable(geolocationWatchId)) {
			return;
		}

		geolocationWatchId = navigator.geolocation.watchPosition(
			position => {
				if (!headingEnabled) {
					return;
				}

				if (!isNullable(position.coords.heading) && Number.isFinite(position.coords.heading)) {
					clearHeadingTimeout();
					setHeading(normalizeDegrees(position.coords.heading));
					setStatus("active");
				}
			},
			error => {
				if (!headingEnabled) {
					return;
				}

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

	function stopGeolocationHeading() {
		if (isNullable(geolocationWatchId)) {
			return;
		}

		navigator.geolocation.clearWatch(geolocationWatchId);
		geolocationWatchId = undefined;
	}

	function stopHeading() {
		headingEnabled = false;
		clearHeadingTimeout();
		stopOrientationHeading();
		stopGeolocationHeading();
		setStatus(supported() ? "idle" : "unsupported");
	}

	async function requestHeading() {
		if (!supported()) {
			setStatus("unsupported");
			return;
		}

		clearHeadingTimeout();
		headingEnabled = true;
		setStatus("requesting");

		try {
			const orientation = supportsOrientation() ? orientationConstructor() : null;

			if (typeof orientation?.requestPermission === "function") {
				const permission = await orientation.requestPermission(true);

				if (permission !== "granted") {
					setStatus("denied");
					return;
				}
			}

			startOrientationHeading();
			startGeolocationHeading();

			if (isNullable(untrack(heading))) {
				waitForHeading();
			} else {
				setStatus("active");
			}
		} catch (error) {
			clearHeadingTimeout();
			setStatus(getRequestError(error));
		}
	}

	onMount(() => {
		if (!supported()) {
			setStatus("unsupported");
			return;
		}

		if (supportsOrientation() && typeof orientationConstructor().requestPermission !== "function") {
			startOrientationHeading();
		}

		const permissions = (navigator as unknown as { permissions?: Permissions }).permissions;

		void permissions?.query({ name: "geolocation" }).then(permission => {
			if (headingEnabled && permission.state === "granted") {
				startGeolocationHeading();
			}
		}).catch(() => undefined);
	});

	onCleanup(() => {
		headingEnabled = false;
		clearHeadingTimeout();
		stopOrientationHeading();
		stopGeolocationHeading();
	});

	return {
		canAlign,
		error,
		heading,
		requestHeading,
		status,
		stopHeading
	};
}
