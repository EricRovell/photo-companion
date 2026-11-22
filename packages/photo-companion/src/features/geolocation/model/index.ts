import { onSettled } from "solid-js";
import { createStore } from "solid-js";
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

	onSettled(() => {
		if (!isNullable(navigator.geolocation)) {
			setStore((draft) => {
				draft.supports = true;
			});
		}
	});

	function getGeolocation(onSuccess?: PositionCallback, onError?: PositionErrorCallback) {
		setStore((draft) => {
			draft.error = null;
			draft.status = "pending";
		});

		function handleSuccess(position: GeolocationPosition) {
			setStore((draft) => {
				draft.coordinates = position.coords;
				draft.status = "fulfilled";
			});

			onSuccess?.(position);
		}

		function handleError(error: GeolocationPositionError) {
			setStore((draft) => {
				draft.error = error;
				draft.status = "error";
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
