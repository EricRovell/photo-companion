import { Router, Route } from "@solidjs/router";

import { Root } from "@lib/layout/root/root";
import { PageTimeline } from "./timeline/timeline.page";
import { PageLights } from "./lights/lights.page";
import { WithDate } from "@lib/layout/with-date/with-date";
import { PageMoon } from "./moon/moon.page";
import { PageSun } from "./sun/sun.page";
import { PageBridges } from "./bridges/bridges.page";

const WITH_DATE_ROUTES = [
	"/",
	"timeline",
	"lights",
	"moon",
	"sun"
];

export function Routes() {

	return (
		<Router root={Root}>
			<Route path={WITH_DATE_ROUTES} component={WithDate}>
				<Route path={[ "/", "timeline" ]} component={PageTimeline} />
				<Route path={"/lights"} component={PageLights} />
				<Route path={"/moon"} component={PageMoon} />
				<Route path={"/sun"} component={PageSun} />
			</Route>
			<Route path={"/bridges"} component={PageBridges} />
		</Router>
	);
}
