<script lang="ts">
	import { click, pattern, url }from "svelte-pathfinder";
	import Pages from "./pages/pages.svelte";
	import { Link, Icon } from "@lib/components";
	import { iconGithub, iconQuestion, iconTimeline, iconLights, iconSun, iconMoon } from "@lib/icons";
	import {routeAbout, routeLights, routeMoon, routeSun, routeTimeline, urlGithub } from "@lib/routes";
	import { version } from "../package.json";
	import { title } from "@lib/constants";
	import { dict } from "@lib/dict";
	import styles from "./app.module.css";

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

<svelte:window on:click="{click}" />

<header class="{styles.header}">
	<div class="{styles.content}">
		<Link href="/">
			<h1>{title}</h1>
		</Link>
		<Link className="{styles.faq}" href="{routeAbout}" title="FAQ">
			<Icon path="{iconQuestion}" viewBox="0 0 256 256" />
		</Link>
	</div>
</header>
<nav class="{styles.navigation}">
	<ul class="{styles.content}">
		{#each sections as { label, href, icon, root }}
			<li>
				<Link
					current="{($pattern(href) || ($url === "/" && root)) ? "page" : undefined}"
					className="{styles.link}"
					{href}
					on:click="{handleClick}"
				>
					<Icon path="{icon}" viewBox="0 0 256 256" />
					{dict[label]}
				</Link>
			</li>
		{/each}
	</ul>
</nav>
<main>
	<Pages />
</main>
<footer class="{styles.footer}">
	<div class="{styles.content}">
		<p>{title}, v.{version}</p>
		<Link href="{urlGithub}">
			<Icon path="{iconGithub}" viewBox="0 0 36 36"/>
			<span>Github</span>
		</Link>
	</div>
</footer>
