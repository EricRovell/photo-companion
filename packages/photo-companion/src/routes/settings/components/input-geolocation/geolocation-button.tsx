import { createSignal, onCleanup } from "solid-js";
import { Button } from "ui";
import { isNullable } from "utils/validators";

import { getUserLocation } from "~/lib/helpers";
import { useTranslation } from "~/services/translation";

type Status = Nullish<"danger" | "loading" | "success">;

interface GeolocationButtonProps {
	handleLocation: (latitude: number, longitude: number) => void;
}

export function GeolocationButton(props: GeolocationButtonProps) {
	const { t } = useTranslation();
	const MESSAGE = {
		danger: () => t().MESSAGE.DATA_UPDATE_ERROR,
		loading: () => "loading",
		success: () => t().MESSAGE.DATA_UPDATE_SUCCESS
	};

	const [ getState, setState ] = createSignal<Status>(null);

	const message = () => {
		const state = getState();
		return state ? MESSAGE[state]() : t().LABEL.ASK_DEVICE_GEOLOCATION;
	};

	const variant = () => {
		const state = getState();

		if (state !== "danger" && state !== "success") {
			return null;
		}

		return state;
	};

	let timerID: Undefinable<number> = undefined;
	onCleanup(() => clearInterval(timerID));

	const handleGetGeolocation = async () => {
		try {
			clearInterval(timerID);
			setState("loading");
			const position = await getUserLocation();

			if (!isNullable(position)) {
				props.handleLocation(position.latitude, position.longitude);
				setState("success");
			}
		} catch (error) {
			console.warn(`Could not get location: ${JSON.stringify(error)}`);
			setState("danger");
		} finally {
			timerID = window.setTimeout(() => setState(null), 2500);
		}
	};

	return (
		<Button
			appearance="outline"
			loading={getState() === "loading"}
			onClick={() => void handleGetGeolocation()}
			variant={variant()}
		>
			{message()}
		</Button>
	);
}
