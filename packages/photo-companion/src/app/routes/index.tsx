import { Route, Router } from "@solidjs/router";
import { lazy, Suspense } from "solid-js";

import { LayoutDatetime } from "~/features/datetime-query";
import { LayoutSwipe } from "~/features/navigation";
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
		<Router root={Layout}>
			<Suspense fallback={<Loader style={{ "--loader-size": "2rem" }} />}>
				<Route component={PageRoot} path={ROUTES.ROOT} />
				<Route component={LayoutSwipe} path={WITH_DATE_ROUTES}>
					<Route component={LayoutDatetime} path={WITH_DATE_ROUTES}>
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
