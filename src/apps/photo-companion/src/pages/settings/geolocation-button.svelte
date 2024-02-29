<script lang="ts">
	import { onDestroy } from "svelte";
	import { Button } from "ui";
	import { getUserLocation } from "@lib/helpers";
	import { dict } from "@lib/dict";

	export let handleLocation: (lat: number, lon: number) => void;

	let disabled = false;
	let message = dict.LABEL.ASK_DEVICE_GEOPOSITION;
	let status: Nullable<"success" | "danger"> = undefined;
	let timer: Optional<number> = undefined;

	const handleResetState = () => {
		timer = window.setTimeout(() => {
			message = dict.LABEL.ASK_DEVICE_GEOPOSITION;
			status = undefined;
			disabled = false;
		}, 2500);
	};

	const handleGetGeolocation = async () => {
		try {
			disabled = true;
			message = "В процессе";
			const position = await getUserLocation();

			if (position) {
				handleLocation(position.lat, position.lon);
				status = "success";
				message = dict.MESSAGE.DATA_UPDATE_SUCCESS;
			}
		} catch (error) {
			console.warn(`Could not get location: ${JSON.stringify(error)}`);
			status = "danger";
			message = dict.MESSAGE.DATA_UPDATE_ERROR;
		} finally {
			handleResetState();
		}
	};

	onDestroy(() => {
		window.clearTimeout(timer);
	});
</script>

<Button
	appearance="outline"
	color="{status}"
	{disabled}
	on:click="{handleGetGeolocation}"
	type="button"
>
	{message}
</Button>
