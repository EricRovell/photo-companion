<script lang="ts">
	import { renderDatetime, getDate, round } from "@lib/helpers";
	import { createWavyPath } from "@lib/helpers/svg";
	import type { BridgeShedule } from "@shared/schedule";
	import styles from "./card-bridge.module.css";

	export let schedule: BridgeShedule;
	export let start = 1;
	export let end = 6;
	export let angle = Math.PI / 4;
	export let length = 25;
	export let stroke = 0.5;
	export let fontSize = 5;

	let dx = round(length * Math.cos(angle), 2);
	let dy = round(length * Math.sin(angle));
	let viewBox = `${start * 60} -${dy} ${(end - start) * 60} ${dy + stroke + fontSize * 2}`;

	const buildBridgeSparklinePath = (schedule: BridgeShedule): string => {
		let x = start * 60;
		let y = 0;

		const pathElements: string[] = [ `M ${x},${y}` ];

		for (const [ hoursStart, minutesStart, hoursEnd, minutesEnd ] of schedule) {
			x = hoursStart * 60 + minutesStart;
			pathElements.push(`L ${x},${y}`);

			x += dx;
			y -= dy;
			pathElements.push(`L ${x},${y}`);

			x = hoursEnd * 60 + minutesEnd - dx;
			pathElements.push(`M ${x},${y}`);

			x += dx;
			y = 0;
			pathElements.push(`L ${x},${y}`);
		}

		x = end * 60;
		pathElements.push(`L ${x},${y}`);

		return pathElements.join(" ");
	};
</script>

<svg
	class="{styles.sparkline}"
	{viewBox}
>
	<path
		d="{buildBridgeSparklinePath(schedule)}"
		stroke-width="{stroke}"
		stroke-linecap="round"
		fill="none"
	/>
	{#each schedule as [ hoursStart, minutesStart, hoursEnd, minutesEnd ]}
		{@const x1 = hoursStart * 60 + minutesStart}
		{@const x2 = hoursEnd * 60 + minutesEnd}
		{@const dateStart = getDate({ hours: hoursStart, minutes: minutesStart, seconds: 0 })}
		{@const dateEnd = getDate({ hours: hoursEnd, minutes: minutesEnd, seconds: 0 })}
		<path
			data-stroke-water
			d="{createWavyPath(`M ${x1 + 6},0 L ${x2 - 6},${0}`, 5, 2)}"
			stroke-width="{stroke}"
			stroke-linecap="round"
			fill="none"
		/>
		<text
			x="{x1 - fontSize}"
			y="{fontSize * 1.5}"
			font-size="{fontSize}"
			fill="white"
		>
			{renderDatetime(dateStart, { timeStyle: "short" })}
			<title>
				{renderDatetime(dateStart, { timeStyle: "long" })}
			</title>
		</text>
		<text
			x="{x2 - fontSize}"
			y="{fontSize * 1.5}"
			font-size="{fontSize}"
			fill="white"
		>
			{renderDatetime(dateEnd, { timeStyle: "short" })}
			<title>
				{renderDatetime(dateEnd, { timeStyle: "long" })}
			</title>
		</text>
	{/each}
</svg>
