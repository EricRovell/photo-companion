import { onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { isNullable } from "utils/validators";

interface GeolocationStore {
	coordinates: GeolocationCoordinates | null;
	error: GeolocationPositionError | null;
	status: "error" | "fulfilled" | "pending";
	supports: boolean;
}

const INITIAL_STATE: GeolocationStore = {
	coordinates: null,
	error: null,
	status: "fulfilled",
	supports: false
};

export function createGeolocationState() {
	const [ store, setStore ] = createStore<GeolocationStore>(INITIAL_STATE);

	onMount(() => {
		if (!isNullable(navigator.geolocation)) {
			setStore("supports", true);
		}
	});

	function getGeolocation(onSuccess?: PositionCallback, onError?: PositionErrorCallback) {
		setStore({
			error: null,
			status: "pending"
		});

		function handleSuccess(position: GeolocationPosition) {
			setStore({
				coordinates: position.coords,
				status: "fulfilled"
			});

			onSuccess?.(position);
		}

		function handleError(error: GeolocationPositionError) {
			setStore({
				error: error,
				status: "error"
			});

			onError?.(error);
		}

		navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
	}

	return {
		geolocation: store,
		getGeolocation
	};
}
