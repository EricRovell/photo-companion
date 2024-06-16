import { Route, Router } from "@solidjs/router";

import { ROUTE } from "@lib/consts";
import { Root } from "@lib/layout/root/root";
import { WithDate } from "@lib/layout/with-date/with-date";
import { WithSwipe } from "@lib/layout/with-swipe";

import { PageAbout } from "./about/about.page";
import { PageBridges } from "./bridges/bridges.page";
import { PageChangelog } from "./changelog/changelog.page";
import { PageLights } from "./lights/lights.page";
import { PageMoon } from "./moon/moon.page";
import { PageSettings } from "./settings/settings.page";
import { PageSun } from "./sun/sun.page";
import { PageTimeline } from "./timeline/timeline.page";

const WITH_DATE_ROUTES = [
	ROUTE.ROOT,
	ROUTE.TIMELINE,
	ROUTE.LIGHTS,
	ROUTE.MOON,
	ROUTE.SUN
];

const WITH_SWIPE_ROUTES = [ ...WITH_DATE_ROUTES, ROUTE.BRIDGES ];

export const Routes = () => (
	<Router root={Root}>
		<Route component={WithSwipe} path={WITH_SWIPE_ROUTES}>
			<Route component={WithDate} path={WITH_DATE_ROUTES}>
				<Route component={PageTimeline} path={[ ROUTE.ROOT, ROUTE.TIMELINE ]} />
				<Route component={PageLights} path={ROUTE.LIGHTS} />
				<Route component={PageMoon} path={ROUTE.MOON} />
				<Route component={PageSun} path={ROUTE.SUN} />
			</Route>
			<Route component={PageBridges} path={ROUTE.BRIDGES} />
		</Route>
		<Route component={PageSettings} path={ROUTE.SETTINGS} />
		<Route component={PageAbout} path={ROUTE.ABOUT} />
		<Route component={PageChangelog} path={ROUTE.CHANGELOG} />
	</Router>
);
