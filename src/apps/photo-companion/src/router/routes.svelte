<script lang="ts">
	import Router from "./router.svelte";
	import Route from "./route.svelte";
	import { App } from "@lib/layout";
	import { WithDateURL, Article } from "@lib/layout";

	import { default as PageAbout } from "../pages/about/about.page.mdx";
	import { default as PageBridges } from "../pages/bridges/bridges.page.svelte";
	import { default as PageChangelog } from "../pages/changelog.page.mdx";
	import { default as PageLights } from "../pages/lights/lights.page.svelte";
	import { default as PageMoon } from "../pages/moon/moon.page.svelte";
	import { default as PageSettings } from "../pages/settings/settings.page.svelte";
	import { default as PageSun } from "../pages/sun/sun.page.svelte";
	import { default as PageTimeline } from "../pages/timeline/timeline.page.svelte";
</script>

<Router root="{App}">
	<Route path="{[ "timeline", "lights", "sun", "moon" ]}">
		<WithDateURL let:date>
			<Route path="timeline" component="{PageTimeline}" props={{ date }} />
			<Route path="lights" component="{PageLights}" props={{ date }} />
			<Route path="sun" component="{PageSun}" props={{ date }} />
			<Route path="moon" component="{PageMoon}" props={{ date }} />
		</WithDateURL>
	</Route>
	<Route path="{[ "about", "changelog" ]}">
		<Article>
			<Route path="about" component="{PageAbout}" />
			<Route path="changelog" component="{PageChangelog}" />
		</Article>
	</Route>
	<Route path="settings" component="{PageSettings}" />
	<Route path="bridges" component="{PageBridges}" />
</Router>
