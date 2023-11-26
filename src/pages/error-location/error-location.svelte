<script lang="ts">
	import { query } from "svelte-pathfinder";
	import { Button } from "@lib/components";
	import { getUserLocation } from "@lib/helpers";
	import { dict } from "@lib/dict";
	import { LAT, LON } from "@lib/constants";
	import styles from "./error-location.module.css";

	const handleReset = () => {
		$query.lat = LAT;
		$query.lon = LON;
	};

	const getLocation = async () => {
		try {
			const position = await getUserLocation();

			if (position) {
				$query.lat = position.lat;
				$query.lon = position.lon;
			}
		} catch {
			handleReset();
		}
	};
</script>

<aside class="card {styles["error"]}">
	<header>{dict["error"]}</header>
	<p>Указана неверная геопозиция:</p>
	<p>{dict["date-error-set-current-desc"]}:</p>
	<Button on:click="{handleReset}">
		Локация по умолчанию
	</Button>
	<Button on:click="{getLocation}">
		Запросить данные у устройства
	</Button>
</aside>
