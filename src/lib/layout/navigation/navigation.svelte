<script lang="ts">
	import { pattern, url, query } from "svelte-pathfinder";
	import { Icon, Link } from "@lib/components";
	import { dict } from "@lib/dict";
	import { iconTimeline, iconLights, iconSun, iconMoon } from "@lib/icons";
	import { routeLights, routeMoon, routeSun, routeTimeline } from "@lib/routes";
	import styles from "./navigation.module.css";

	const sections = [
		{ label: "timeline", href: routeTimeline, icon: iconTimeline, root: true },
		{ label: "lights", href: routeLights, icon: iconLights },
		{ label: "sun", href: routeSun, icon: iconSun },
		{ label: "moon", href: routeMoon, icon: iconMoon }
	];

	const handleClick = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};
</script>

<nav class="{styles.navigation}">
	<ul>
		{#each sections as { label, href, icon, root }}
			<li>
				<Link
					current="{($pattern(href) || ($pattern("/") && root)) ? "page" : undefined}"
					className="{styles.link}"
					href="{href}?date={$query.date}"
					on:click="{handleClick}"
				>
					<Icon path="{icon}" viewBox="0 0 256 256" />
					{dict[label]}
				</Link>
			</li>
		{/each}
	</ul>
</nav>
