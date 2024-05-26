import { For } from "solid-js";
import { Time } from "ui-solid";

import { useTranslation } from "@lib/context";
import { LinkQuery, Moon } from "@lib/components";
import type { MoonData } from "./use-moon-data";

import styles from "./moon.module.css";
import { createQueryDate } from "@lib/helpers";

interface MoonPhasesProps {
	state: MoonData;
}

const MOON_SIZE = 75;

export function MoonPhases(props: MoonPhasesProps) {
	const { t, formatters } = useTranslation();

	return (
		<section data-label="phases-calendar" class={`card ${styles.phases}`}>
			<header>
				<h2>{t().TITLE.MOON_PHASE_CALENDAR}</h2>
			</header>
			<div>
				<For each={props.state.phases}>
					{phase => (
						<LinkQuery href={"/moon"} query={new URLSearchParams({ date: createQueryDate(phase.timestamp) })}>
							<Moon phase={phase.phaseValue} size={MOON_SIZE}
							/>
							<Time>
								{formatters().formatDate(phase.timestamp)}
							</Time>
						</LinkQuery>
					)}
				</For>
			</div>
		</section>
	);
}
