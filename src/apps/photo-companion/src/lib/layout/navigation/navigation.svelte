<script lang="ts">
	import { pattern, query } from "svelte-pathfinder";
	import { settingsStore } from "@lib/settings-store";
	import { Icon, Link } from "@lib/components";
	import { dict } from "@lib/dict";
	import { iconTimeline, iconLights, iconSun, iconMoon, iconBridge } from "@lib/icons";
	import { routeBridges, routeLights, routeMoon, routeSun, routeTimeline } from "@lib/routes";
	import styles from "./navigation.module.css";

	interface Section {
		label: "timeline" | "lights" | "sun" | "moon" | "bridges";
		hidden?: boolean;
		href: string;
		icon: string;
		root?: boolean;
	}

	let sections: Section[];

	$: sections = [
		{ label: "timeline", href: routeTimeline, icon: iconTimeline, root: true },
		{ label: "lights", href: routeLights, icon: iconLights, hidden: $settingsStore["lights-city"] === "off" },
		{ label: "sun", href: routeSun, icon: iconSun },
		{ label: "moon", href: routeMoon, icon: iconMoon },
		{ label: "bridges", href: routeBridges, icon: iconBridge }
	];
</script>

<nav class="{styles.navigation}">
	<ul>
		{#each sections as { label, hidden, href, icon, root }}
			{#if !hidden}
				<li>
					<Link
						current="{($pattern(href) || ($pattern("/") && root)) ? "page" : undefined}"
						className="{styles.link}"
						href="{href}{$query}"
					>
						<Icon path="{icon}" viewBox="0 0 256 256" />
						<span>{dict[label]}</span>
					</Link>
				</li>
			{/if}
		{/each}
	</ul>
</nav>
