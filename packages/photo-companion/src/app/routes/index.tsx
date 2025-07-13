import { Route, Router } from "@solidjs/router";
import { lazy, Suspense } from "solid-js";

import { ROUTES } from "~/consts";
import { Root } from "~/layout/root/root";
import { WithDate } from "~/layout/with-date/with-date";
import { WithSwipe } from "~/layout/with-swipe";
import { PageLights } from "~/pages/lights/lights.page";
import { PageMoon } from "~/pages/moon/moon.page";
import { PageNow } from "~/pages/now/now.page";
import { PageRoot } from "~/pages/root/root.page";
import { PageSun } from "~/pages/sun/sun.page";
import { PageTimeline } from "~/pages/timeline/timeline.page";
import { Loader } from "~/shared/ui";

const Page404 = lazy(() => import("~/pages/404/404.page"));
const PageAbout = lazy(() => import("~/pages/about/about.page"));
const PageBridges = lazy(() => import("~/pages/bridges/bridges.page"));
const PageSettings = lazy(() => import("~/pages/settings/settings.page"));
const PageHeightByShadow = lazy(() => import("~/pages/height-by-shadow/height-by-shadow.page"));

const WITH_DATE_ROUTES = [
	ROUTES.ROOT,
	ROUTES.TIMELINE,
	ROUTES.LIGHTS,
	ROUTES.MOON,
	ROUTES.SUN,
	ROUTES.NOW,
	ROUTES.BRIDGES
];

export function Routes() {
	return (
		<Router root={Root}>
			<Suspense fallback={<Loader style={{ "--loader-size": "2rem" }} />}>
				<Route component={PageRoot} path={ROUTES.ROOT} />
				<Route component={WithSwipe} path={WITH_DATE_ROUTES}>
					<Route component={WithDate} path={WITH_DATE_ROUTES}>
						<Route component={PageTimeline} path={ROUTES.TIMELINE} />
						<Route component={PageLights} path={ROUTES.LIGHTS} />
						<Route component={PageMoon} path={ROUTES.MOON} />
						<Route component={PageSun} path={ROUTES.SUN} />
						<Route component={PageNow} path={ROUTES.NOW} />
						<Route component={PageBridges} path={ROUTES.BRIDGES} />
					</Route>
					<Route component={PageHeightByShadow} path={ROUTES.HEIGHT_BY_SHADOW} />
				</Route>
				<Route component={PageSettings} path={ROUTES.SETTINGS} />
				<Route component={PageAbout} path={ROUTES.ABOUT} />
				<Route component={Page404} path={[ ROUTES.NOT_FOUND, "*404" ]} />
			</Suspense>
		</Router>
	);
}
