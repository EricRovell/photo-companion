<script lang="ts">
	import { query } from "svelte-pathfinder";
	import { Link, Icon } from "ui";
	import { iconGithub, iconQuestion, iconSettings } from "ui/icons";

	import { version } from "@lib/constants";
	import { routeAbout, routeChangelog, routeSettings, urlGithub } from "@lib/routes";
	import { navigationStore, getTabUrl } from "@lib/stores/navigation";
	import { Navigation } from "@lib/layout";
	import { title } from "@lib/constants";
	import { t } from "@stores/lang";
	import { scrollToTop } from "@lib/helpers";
	import styles from "./app.layout.module.css";
</script>

<header class="{styles.header}">
	<div class="{styles.content}">
		<Link href="{getTabUrl($navigationStore[0])}{$query}">
			<h1>{title}</h1>
		</Link>
		<nav>
			<Link
				className="{styles.icon}"
				href="{routeSettings}{$query}"
				on:click={scrollToTop}
				title="{$t.TITLE.SETTINGS}"
			>
				<Icon path="{iconSettings}" viewBox="0 0 256 256" />
			</Link>
			<Link
				className="{styles.icon}"
				href="{routeAbout}{$query}"
				on:click={scrollToTop}
				title="{$t.TITLE.ABOUT}"
			>
				<Icon path="{iconQuestion}" viewBox="0 0 256 256" />
			</Link>
		</nav>
	</div>
</header>
<Navigation />
<main>
	<slot />
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
