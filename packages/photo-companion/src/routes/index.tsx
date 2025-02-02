import { Route, Router } from "@solidjs/router";
import { lazy, Suspense } from "solid-js";
import { Loader } from "ui";

import { ROUTE } from "@lib/consts";
import { Root } from "@lib/layout/root/root";
import { WithDate } from "@lib/layout/with-date/with-date";
import { WithSwipe } from "@lib/layout/with-swipe";

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
	ROUTE.ROOT,
	ROUTE.TIMELINE,
	ROUTE.LIGHTS,
	ROUTE.MOON,
	ROUTE.SUN,
	ROUTE.NOW,
	ROUTE.BRIDGES
];

export const Routes = () => (
	<Router root={Root}>
		<Suspense fallback={<Loader style={{ "--loader-size": "2rem" }} />}>
			<Route component={WithSwipe} path={WITH_DATE_ROUTES}>
				<Route component={WithDate} path={WITH_DATE_ROUTES}>
					<Route component={PageRoot} path={ROUTE.ROOT}/>
					<Route component={PageTimeline} path={ROUTE.TIMELINE} />
					<Route component={PageLights} path={ROUTE.LIGHTS} />
					<Route component={PageMoon} path={ROUTE.MOON} />
					<Route component={PageSun} path={ROUTE.SUN} />
					<Route component={PageNow} path={ROUTE.NOW} />
					<Route component={PageBridges} path={ROUTE.BRIDGES} />
				</Route>
				<Route component={PageHeightByShadow} path={ROUTE.HEIGHT_BY_SHADOW} />
			</Route>
			<Route component={PageSettings} path={ROUTE.SETTINGS} />
			<Route component={PageAbout} path={ROUTE.ABOUT} />
			<Route component={Page404} path={[ ROUTE.NOT_FOUND, "*404" ]} />
		</Suspense>
	</Router>
);
