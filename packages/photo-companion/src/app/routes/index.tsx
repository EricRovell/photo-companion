import { createRouter, intentPreload } from "@solidjs/router";
import { lazy, Loading } from "solid-js";

import { LayoutDatetime } from "~/features/datetime-query";
import { LayoutSwipe, NavigationServiceProvider } from "~/features/navigation";
import { PageLights } from "~/pages/lights";
import { PageMoon } from "~/pages/moon";
import { PageNow } from "~/pages/now";
import { PageRoot } from "~/pages/root";
import { PageSun } from "~/pages/sun";
import { PageTimeline } from "~/pages/timeline";
import { ROUTES } from "~/shared/consts";
import { Loader } from "~/shared/ui";

import { Layout } from "../layout";

const Page404 = lazy(() => import("~/pages/404"));
const PageAbout = lazy(() => import("~/pages/about"));
const PageBridges = lazy(() => import("~/pages/bridges"));
const PageSettings = lazy(() => import("~/pages/settings"));
const PageHeightByShadow = lazy(() => import("~/pages/height-by-shadow"));

const Router = createRouter({
	preloadLinks: intentPreload(),
	routes: [
		{
			component: PageRoot,
			path: ROUTES.ROOT
		},
		{
			children: [
				{
					children: [
						{
							component: PageTimeline,
							path: ROUTES.TIMELINE
						},
						{
							component: PageLights,
							path: ROUTES.LIGHTS
						},
						{
							component: PageMoon,
							path: ROUTES.MOON
						},
						{
							component: PageSun,
							path: ROUTES.SUN
						},
						{
							component: PageNow,
							path: ROUTES.NOW
						},
						{
							component: PageBridges,
							path: ROUTES.BRIDGES
						}
					],
					component: LayoutDatetime
				},
				{
					component: PageHeightByShadow,
					path: ROUTES.HEIGHT_BY_SHADOW
				}
			],
			component: LayoutSwipe
		},
		{
			component: PageSettings,
			path: ROUTES.SETTINGS
		},
		{
			component: PageAbout,
			path: ROUTES.ABOUT
		},
		{
			component: Page404,
			path: [ ROUTES.NOT_FOUND, "*404" ]
		}
	]
});

export function Routes() {
	return (
		<Router>{props => (
			<NavigationServiceProvider>
				<Layout>
					<Loading
						fallback={<Loader style={{ "--loader-size": "2rem" }} />}
					>
						{props.children}
					</Loading>
				</Layout>
			</NavigationServiceProvider>
		)}</Router>
	);
}
