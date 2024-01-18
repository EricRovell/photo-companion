<script lang="ts">
	import { onDestroy } from "svelte";
	import { Button } from "@lib/components";
	import { getUserLocation } from "@lib/helpers";
	import { dict } from "@lib/dict";

	export let handleLocation: (lat: number, lon: number) => void;

	let disabled = false;
	let message = dict["get-geo-device"];
	let status: Nullable<"success" | "danger"> = undefined;
	let timer: Optional<number> = undefined;

	const handleResetState = () => {
		timer = window.setTimeout(() => {
			message = dict["get-geo-device"];
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
				message = dict["get-geo-device-success"];
			}
		} catch (error) {
			console.warn(`Could not get location: ${error}`);
			status = "danger";
			message = dict["get-geo-device-danger"];
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
