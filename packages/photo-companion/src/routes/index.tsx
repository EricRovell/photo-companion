import { Route, Router } from "@solidjs/router";
import { lazy, Suspense } from "solid-js";

import { ROUTES } from "~/consts";
import { Root } from "~/layout/root/root";
import { WithDate } from "~/layout/with-date/with-date";
import { WithSwipe } from "~/layout/with-swipe";
import { Loader } from "~/shared/ui";

import { PageLights } from "./lights/lights.page";
import { PageMoon } from "./moon/moon.page";
import { PageNow } from "./now/now.page";
import { PageRoot } from "./root/root.page";
import { PageSun } from "./sun/sun.page";
import { PageTimeline } from "./timeline/timeline.page";

const Page404 = lazy(() => import("./404/404.page"));
const PageAbout = lazy(() => import("./about/about.page"));
const PageBridges = lazy(() => import("./bridges/bridges.page"));
const PageSettings = lazy(() => import("./settings/settings.page"));
const PageHeightByShadow = lazy(() => import("./height-by-shadow/height-by-shadow.page"));

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
