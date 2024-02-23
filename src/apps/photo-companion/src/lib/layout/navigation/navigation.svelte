<script lang="ts">
	import { pattern, query } from "svelte-pathfinder";
	import { settingsStore as store } from "@lib/settings-store";
	import { Icon, Link } from "@lib/components";
	import { dict } from "@lib/dict";
	import { iconTimeline, iconLights, iconSun, iconMoon, iconBridge } from "@lib/icons";
	import { routeBridges, routeLights, routeMoon, routeSun, routeTimeline } from "@lib/routes";
	import styles from "./navigation.module.css";
	import { isNavigationTime } from "bridge-schedule";

	interface Section {
		label: "TIMELINE" | "LIGHTS" | "SUN" | "MOON" | "BRIDGES";
		hidden?: boolean;
		href: string;
		icon: string;
		root?: boolean;
	}

	let sections: Section[];

	const isLightsTabHidden = () => {
		return !$store.lights_city;
	};

	const isBridgesTabHidden = () => {
		switch ($store.bridges_spb) {
			case "navigation": {
				return !isNavigationTime();
			}
			case "always": {
				return false;
			}
			default: {
				return true;
			}
		}
	};

	$: sections = [
		{ label: "TIMELINE", href: routeTimeline, icon: iconTimeline, root: true },
		{ label: "LIGHTS", href: routeLights, icon: iconLights, hidden: isLightsTabHidden() },
		{ label: "SUN", href: routeSun, icon: iconSun },
		{ label: "MOON", href: routeMoon, icon: iconMoon },
		{ label: "BRIDGES", href: routeBridges, icon: iconBridge, hidden: isBridgesTabHidden() }
	// to rebuild nav on settings store change
	], $store;
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
						<span>{dict.TITLE[label]}</span>
					</Link>
				</li>
			{/if}
		{/each}
	</ul>
</nav>
