<script lang="ts">
	import Router from "./router.svelte";
	import Route from "./route.svelte";
	import { App, WithSwipe } from "@lib/layout";
	import { WithDateURL, Article } from "@lib/layout";
	import { lang } from "@stores/lang";

	import { default as PageAboutEn } from "../pages/about/about.en.page.mdx";
	import { default as PageAboutRu } from "../pages/about/about.ru.page.mdx";
	import { default as PageBridges } from "../pages/bridges/bridges.page.svelte";
	import { default as PageChangelogEn } from "../pages/changelog/changelog.en.page.mdx";
	import { default as PageChangelogRu } from "../pages/changelog/changelog.ru.page.mdx";
	import { default as PageLights } from "../pages/lights/lights.page.svelte";
	import { default as PageMoon } from "../pages/moon/moon.page.svelte";
	import { default as PageSettings } from "../pages/settings/settings.page.svelte";
	import { default as PageSun } from "../pages/sun/sun.page.svelte";
	import { default as PageTimeline } from "../pages/timeline/timeline.page.svelte";
</script>

<Router root="{App}">
	<Route path="{[ "timeline", "lights", "sun", "moon", "bridges" ]}">
		<WithSwipe>
			<Route path="{[ "timeline", "lights", "sun", "moon" ]}">
				<WithDateURL let:date>
					<Route path="timeline" component="{PageTimeline}" props={{ date }} />
					<Route path="lights" component="{PageLights}" props={{ date }} />
					<Route path="sun" component="{PageSun}" props={{ date }} />
					<Route path="moon" component="{PageMoon}" props={{ date }} />
				</WithDateURL>
			</Route>
			<Route path="bridges" component="{PageBridges}" />
		</WithSwipe>
	</Route>
	<Route path="{[ "about", "changelog" ]}">
		<Article>
			<Route
				path="about"
				component="{$lang === "en" ? PageAboutEn : PageAboutRu}"
			/>
			<Route
				path="changelog"
				component="{$lang === "en" ? PageChangelogEn : PageChangelogRu}"
			/>
		</Article>
	</Route>
	<Route path="settings" component="{PageSettings}" />
</Router>
