import { For } from "solid-js";
import { Time } from "ui";

import { LinkQuery, Moon } from "~/components";
import { createQueryDate } from "~/helpers";
import { useTranslation } from "~/services/translation";

import type { MoonData } from "./use-moon-data";

import styles from "./moon.module.css";

interface MoonPhasesProps {
	state: MoonData;
}

const MOON_SIZE = 75;

export function MoonPhases(props: MoonPhasesProps) {
	const { format, t } = useTranslation();

	return (
		<section class={`card ${styles.phases}`} data-label="phases-calendar">
			<header>
				<h2>{t().TITLE.MOON_PHASE_CALENDAR}</h2>
			</header>
			<div>
				<For each={props.state.phases}>
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
