import { For } from "solid-js";

import { Moon } from "~/entities/moon";
import { LinkQuery } from "~/features/navigation";
import { useTranslation } from "~/features/translation";
import { createQueryDate } from "~/shared/lib/query-date";
import { Card, Text } from "~/shared/ui";

import { useMoonService } from "../../model";

import styles from "./moon-phases.module.css";

const MOON_SIZE = 75;

export function MoonPhases() {
	const { format, t } = useTranslation();
	const { phases } = useMoonService();

	return (
		<Card class={styles.phases} data-label="phases-calendar">
			<Card.Header>
				<Text as="h2" variant="heading-l">{t().TITLE.MOON_PHASE_CALENDAR}</Text>
			</Card.Header>
			<div>
				<For each={phases()}>
					{phase => (
						<LinkQuery href={"/moon"} query={new URLSearchParams({ datetime: createQueryDate(phase.timestamp) })}>
							<Moon phase={phase.phaseValue} size={MOON_SIZE} />
							<Text as="time" class={styles.time} numeric variant="text-s">
								{format().date(phase.timestamp)}
							</Text>
						</LinkQuery>
					)}
				</For>
			</div>
		</Card>
	);
}
