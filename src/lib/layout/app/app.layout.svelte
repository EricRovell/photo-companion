<script lang="ts">
	import { query }from "svelte-pathfinder";
	import Pages from "../../../pages/pages.svelte";
	import { Link, Icon } from "@lib/components";
	import { version } from "@lib/constants";
	import { iconGithub, iconQuestion } from "@lib/icons";
	import { routeAbout, routeChangelog, urlGithub } from "@lib/routes";
	import { Navigation } from "@lib/layout";
	import { title } from "@lib/constants";
	import styles from "./app.layout.module.css";
</script>

<header class="{styles.header}">
	<div class="{styles.content}">
		<Link href="/{$query}">
			<h1>{title}</h1>
		</Link>
		<Link className="{styles.faq}" href="{routeAbout}{$query}" title="FAQ">
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
		<p>
			{title}, <Link href="{routeChangelog}{$query}">v.{version}</Link> 
			<Link href="https://github.com/ericrovell/photo-companion/commit/__COMMIT_HASH__">#__COMMIT_HASH__</Link>
		</p>
		<Link href="{urlGithub}">
			<Icon path="{iconGithub}" viewBox="0 0 36 36"/>
			<span>Github</span>
		</Link>
	</div>
</footer>
