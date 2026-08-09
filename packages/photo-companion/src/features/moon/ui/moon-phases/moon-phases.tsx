import { For } from "solid-js";

import { Moon } from "~/entities/moon";
import { LinkQuery } from "~/features/navigation";
import { useTranslation } from "~/features/translation";
import { createQueryDate } from "~/shared/lib/query-date";
import { Time } from "~/shared/ui";

import { useMoonService } from "../../model";

import styles from "./moon-phases.module.css";

const MOON_SIZE = 75;

export function MoonPhases() {
	const { format, t } = useTranslation();
	const { phases } = useMoonService();

	return (
		<section class={`card ${styles.phases}`} data-label="phases-calendar">
			<header>
				<h2>{t().TITLE.MOON_PHASE_CALENDAR}</h2>
			</header>
			<div>
				<For each={phases()}>
					{phase => (
						<LinkQuery href={"/moon"} query={new URLSearchParams({ datetime: createQueryDate(phase.timestamp) })}>
							<Moon phase={phase.phaseValue} size={MOON_SIZE} />
							<Time>
								{format().date(phase.timestamp)}
							</Time>
						</LinkQuery>
					)}
				</For>
			</div>
		</section>
	);
}
