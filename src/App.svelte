<script lang="ts">
	import { click, pattern, url }from "svelte-pathfinder";
	import Pages from "./pages/pages.svelte";
	import { Link, Icon } from "@lib/components";
	import { iconGithub } from "@lib/icons";
	import { title } from "@lib/constants";
	import { version } from "../package.json";
	import { dict } from "@lib/dict";
	import {
		routeAbout,
		routeLights,
		routeMoon,
		routeSun,
		routeTimeline,
		urlGithub
	} from "@lib/routes";
	import styles from "./app.module.css";

	const sections = [
		{ label: "timeline", href: routeTimeline, root: true },
		{ label: "lights", href: routeLights },
		{ label: "sun", href: routeSun },
		{ label: "moon", href: routeMoon },
		{ label: "about", href: routeAbout }
	];

	const handleClick = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};
</script>

<svelte:window on:click="{click}" />

<header class="{styles.title}">
	<Link href="/">
		<h1>{title}</h1>
	</Link>
</header>
<main>
	<header class="{styles.header}">
		{#each sections as { label, href, root }}
			<Link
				current="{($pattern(href) || ($url === "/" && root)) ? "page" : undefined}"
				className="{styles.link}"
				{href}
				on:click="{handleClick}"
			>
				{dict[label]}
			</Link>
		{/each}
	</header>
	<Pages />
</main>
<footer>
	<p>{title}, v.{version}</p>
	<Link href="{urlGithub}">
		<Icon path="{iconGithub}" viewBox="0 0 36 36"/>
		<span>Github</span>
	</Link>
</footer>
