<script lang="ts">
	import styles from "./seven-segment-digit.module.css";

	interface Segment {
		orientation: "horizontal" | "vertical";
		name: string;
		transform?: string;
	}

	export let digit = 0;

	const digits = [ 0x7e, 0x30, 0x6d, 0x79, 0x33, 0x5b, 0x5f, 0x70, 0x7f, 0x7b ];
	const segmentPolyline = {
		horizontal: "11 0, 37 0, 42 5, 37 10, 11 10, 6 5",
		vertical: "0 11, 5 6, 10 11, 10 34, 5 39, 0 39"
	};

	const render = (value: number, shift: number): number => {
		return (digits[value] >> shift) & 1;
	};

	const segments: Segment[] = [
		{
			orientation: "horizontal",
			name: "A"
		},
		{
			orientation: "vertical",
			name: "B",
			transform: "scale(-1,1) translate(-48, 0)"
		},
		{
			orientation: "vertical",
			name: "C",
			transform: "scale(-1,-1) translate(-48, -80)"
		},
		{
			orientation: "horizontal",
			name: "D",
			transform: "scale(-1,-1) translate(-48, -80)"
		},
		{
			orientation: "vertical",
			name: "E",
			transform: "scale(1,-1) translate(0, -80)"
		},
		{
			orientation: "vertical",
			name: "F"
		},
		{
			orientation: "horizontal",
			name: "G",
			transform: "translate(0, 35)"
		}
	];
</script>

<svg
	class="{styles.digit}"
	viewBox="0 0 48 80"
	xmlns="http://www.w3.org/2000/svg"
>
	<g fill="var(--segment-fill)">
		{#each segments as { orientation, name, transform }, i (name)}
			<polyline
				data-orientation="{orientation}"
				data-name="{name}"
				points="{segmentPolyline[orientation]}"
				data-light="{render(digit, segments.length - i - 1)}"
				{transform}
			/>
		{/each}
	</g>
</svg>
