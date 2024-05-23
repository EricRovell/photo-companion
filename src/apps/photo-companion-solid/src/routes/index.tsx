import { Router, Route } from "@solidjs/router";

import { Root } from "@lib/layout/root/root";
import { PageTimeline } from "./timeline/timeline.page";
import { PageLights } from "./lights/lights.page";
import { WithDate } from "@lib/layout/with-date/with-date";
import { PageMoon } from "./moon/moon.page";
import { PageSun } from "./sun/sun.page";
import { PageBridges } from "./bridges/bridges.page";
import { PageSettings } from "./settings/settings.page";
import { PageAbout } from "./about/about.page";
import { ROUTE } from "@lib/consts";

const WITH_DATE_ROUTES = [
	ROUTE.ROOT,
	ROUTE.TIMELINE,
	ROUTE.LIGHTS,
	ROUTE.MOON,
	ROUTE.SUN
];

export const Routes = () => (
	<Router root={Root}>
		<Route path={WITH_DATE_ROUTES} component={WithDate}>
			<Route path={[ ROUTE.ROOT, ROUTE.TIMELINE ]} component={PageTimeline} />
			<Route path={ROUTE.LIGHTS} component={PageLights} />
			<Route path={ROUTE.MOON} component={PageMoon} />
			<Route path={ROUTE.SUN} component={PageSun} />
		</Route>
		<Route path={ROUTE.BRIDGES} component={PageBridges} />
		<Route path={ROUTE.SETTINGS} component={PageSettings} />
		<Route path={ROUTE.ABOUT} component={PageAbout} />
	</Router>
);
