import { For } from "solid-js";
//import { useSearchParams } from "@solidjs/router";
import { Link, Time } from "ui-solid";

import { useTranslation } from "@lib/context";
import { Moon } from "@lib/components";
import type { MoonData } from "./use-moon-data";

import styles from "./moon.module.css";

interface MoonPhasesProps {
	state: MoonData;
}

const MOON_SIZE = 75;

export function MoonPhases(props: MoonPhasesProps) {
	const { t, formatters } = useTranslation();
	//const [ searchParams ] = useSearchParams();

	return (
		<section data-label="phases-calendar" class={`card ${styles.phases}`}>
			<header>
				<h2>{t().TITLE.MOON_PHASE_CALENDAR}</h2>
			</header>
			<div>
				<For each={props.state.phases}>
					{phase => (
						<Link href={"/moon"}>
							<Moon phase={phase.phaseValue} size={MOON_SIZE}
							/>
							<Time>
								{formatters().formatDate(phase.timestamp)}
							</Time>
						</Link>
					)}
				</For>
			</div>
		</section>
	);
}
