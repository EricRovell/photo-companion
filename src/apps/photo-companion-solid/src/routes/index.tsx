import { Router, Route } from "@solidjs/router";

import { Root } from "@lib/layout/root/root";
import { PageTimeline } from "./timeline/timeline.page";
import { PageLights } from "./lights/lights.page";
import { WithDate } from "@lib/layout/with-date/with-date";

const WITH_DATE_ROUTES = [
	"/",
	"timeline",
	"lights"
];

export function Routes() {

	return (
		<Router root={Root}>
			<Route path={WITH_DATE_ROUTES} component={WithDate}>
				<Route path={[ "/", "timeline" ]} component={PageTimeline} />
				<Route path={[ "lights" ]} component={PageLights} />
			</Route>
		</Router>
	);
}
