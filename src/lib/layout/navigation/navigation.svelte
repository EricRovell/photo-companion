<script lang="ts">
	import { pattern, query } from "svelte-pathfinder";
	import { Icon, Link } from "@lib/components";
	import { dict } from "@lib/dict";
	import { iconTimeline, iconLights, iconSun, iconMoon } from "@lib/icons";
	import { routeLights, routeMoon, routeSun, routeTimeline } from "@lib/routes";
	import styles from "./navigation.module.css";

	interface Section {
		label: "timeline" | "lights" | "sun" | "moon";
		href: string;
		icon: string;
		root?: boolean;
	}

	const sections: Section[] = [
		{ label: "timeline", href: routeTimeline, icon: iconTimeline, root: true },
		{ label: "lights", href: routeLights, icon: iconLights },
		{ label: "sun", href: routeSun, icon: iconSun },
		{ label: "moon", href: routeMoon, icon: iconMoon }
	];
</script>

<nav class="{styles.navigation}">
	<ul>
		{#each sections as { label, href, icon, root }}
			<li>
				<Link
					current="{($pattern(href) || ($pattern("/") && root)) ? "page" : undefined}"
					className="{styles.link}"
					href="{href}{$query}"
				>
					<Icon path="{icon}" viewBox="0 0 256 256" />
					{dict[label]}
				</Link>
			</li>
		{/each}
	</ul>
</nav>
