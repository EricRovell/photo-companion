import { getSeasonEvents } from "moon-sun-calc";
import { createMemo, For } from "solid-js";

import { useDatetime } from "~/features/datetime-query";
import { LinkQuery } from "~/features/navigation";
import { useTranslation } from "~/features/translation";
import { createQueryDate } from "~/shared/lib/query-date";
import { PropertyList, Text } from "~/shared/ui";

import { SeasonGraph } from "../season-graph";

import styles from "./sun-seasons.module.css";

export function SunSeasons() {
	const { getDatetime } = useDatetime();
	const { format, t } = useTranslation();
	const datetime = createMemo(getDatetime);
	const year = createMemo(() => datetime().getFullYear());
	const events = createMemo(() => getSeasonEvents(year()));

	return (
		<PropertyList data-label="seasons">
			<PropertyList.Header>{t().SEASONS.TITLE}</PropertyList.Header>
			<SeasonGraph datetime={datetime()} events={events()} />
			<PropertyList.Body>
				<For each={events()}>
					{event => (
						<PropertyList.Item>
							<PropertyList.Label>{t().SEASONS[event.name]}</PropertyList.Label>
							<PropertyList.Value>
								<LinkQuery
									href="/sun"
									noScroll
									query={new URLSearchParams({ datetime: createQueryDate(event.time) })}
								>
									<Text as="time" class={styles.datetime} datetime={event.time.toISOString()} numeric>
										<Text variant="text-s">{format().dateShort(event.time)}</Text>
										<Text color="secondary" variant="text-xs">{format().timeShort(event.time)}</Text>
									</Text>
								</LinkQuery>
							</PropertyList.Value>
						</PropertyList.Item>
					)}
				</For>
			</PropertyList.Body>
		</PropertyList>
	);
}
