import { getSeasonEvents } from "moon-sun-calc";
import { createMemo, For } from "solid-js";

import { useDatetime } from "~/features/datetime-query";
import { useTranslation } from "~/features/translation";
import { PropertyList, Text } from "~/shared/ui";

import styles from "./sun-seasons.module.css";

export function SunSeasons() {
	const { getDatetime } = useDatetime();
	const { format, t } = useTranslation();
	const events = createMemo(() => getSeasonEvents(getDatetime().getFullYear()));

	return (
		<PropertyList data-label="seasons">
			<PropertyList.Header>{t().SEASONS.TITLE}</PropertyList.Header>
			<PropertyList.Body>
				<For each={events()}>
					{event => (
						<PropertyList.Item>
							<PropertyList.Label>{t().SEASONS[event.name]}</PropertyList.Label>
							<PropertyList.Value>
								<Text as="time" class={styles.datetime} datetime={event.time.toISOString()} numeric>
									<Text variant="text-s">{format().dateShort(event.time)}</Text>
									<Text color="secondary" variant="text-xs">{format().timeShort(event.time)}</Text>
								</Text>
							</PropertyList.Value>
						</PropertyList.Item>
					)}
				</For>
			</PropertyList.Body>
		</PropertyList>
	);
}
