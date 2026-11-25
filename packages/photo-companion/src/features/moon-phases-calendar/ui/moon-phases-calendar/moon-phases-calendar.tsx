import { createUniqueId } from "solid-js";

import { useTranslation } from "~/features/translation";
import { Card, Text } from "~/shared/ui";

import { createMoonCalendar } from "../../model";
import { MoonCalendarGrid } from "../moon-calendar-grid/moon-calendar-grid";
import { MoonCalendarHeader } from "../moon-calendar-header";

import styles from "./moon-phases-calendar.module.css";

export function MoonPhasesCalendar() {
	const { t } = useTranslation();
	const calendar = createMoonCalendar();
	const monthId = createUniqueId();

	return (
		<Card data-label="phases-calendar">
			<Card.Header>
				<Text as="h2" variant="heading-l">
					{t().TITLE.MOON_PHASE_CALENDAR}
				</Text>
			</Card.Header>
			<div class={styles.body}>
				<div class={styles.navigation}>
					<MoonCalendarHeader
						canGoBack={calendar.canGoBack()}
						canGoNext={calendar.canGoNext()}
						month={calendar.month()}
						monthId={monthId}
						onNavigate={calendar.navigate}
					/>
				</div>
				<MoonCalendarGrid
					monthId={monthId}
					selectedDay={calendar.selectedDay()}
					weeks={calendar.weeks()}
				/>
			</div>
		</Card>
	);
}
