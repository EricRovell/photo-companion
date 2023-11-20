<script lang="ts">
	import { click, query }from "svelte-pathfinder";
	import Pages from "./pages/pages.svelte";
	import { Link, Icon } from "@lib/components";
	import { iconGithub, iconQuestion } from "@lib/icons";
	import { routeAbout, urlGithub } from "@lib/routes";
	import { Navigation } from "@lib/layout";
	import { version } from "../package.json";
	import { title } from "@lib/constants";
	import styles from "./app.module.css";
</script>

<svelte:window on:click="{click}" />

<header class="{styles.header}">
	<div class="{styles.content}">
		<Link href="/?date={$query.date}">
			<h1>{title}</h1>
		</Link>
		<Link className="{styles.faq}" href="{routeAbout}" title="FAQ">
			<Icon path="{iconQuestion}" viewBox="0 0 256 256" />
		</Link>
	</div>
</header>
<Navigation />
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
