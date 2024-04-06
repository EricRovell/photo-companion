import { Router, Route } from "@solidjs/router";

import { Root } from "@lib/layout/root/root";
import { PageTimeline } from "./timeline/timeline.page";
import { WithDate } from "@lib/layout/with-date/with-date";

export function Routes() {


	return (
		<Router root={Root}>
			<Route path={[ "/", "timeline" ]} component={WithDate}>
				<Route path={[ "/", "timeline" ]} component={PageTimeline} />
			</Route>
		</Router>
	);
}
