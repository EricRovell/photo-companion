import { createMemo, For, Show } from "solid-js";
import { isNullable } from "utils/validators";

import type {
	LunarEclipseNoticeability,
	LunarEclipsePhase,
	LunarEclipseType,
	LunarEclipseVisibility
} from "moon-sun-calc";

import { useTranslation } from "~/features/translation";

import { getContactStages } from "../../lib";
import { LunarEclipseContact } from "../lunar-eclipse-contact";

import type { LunarEclipseDetailsProps } from "../../types";

import styles from "./lunar-eclipse-details.module.css";

export function LunarEclipseDetails(props: LunarEclipseDetailsProps) {
	const { format, t } = useTranslation();

	const labelType = (type: LunarEclipseType) => t().LUNAR_ECLIPSE[type];
	const labelPhase = (phase: LunarEclipsePhase) => t().LUNAR_ECLIPSE[`PHASE_${phase}`];
	const labelVisibility = (visibility: LunarEclipseVisibility) => t().LUNAR_ECLIPSE[`VISIBILITY_${visibility}`];

	const labelNoticeability = (noticeability: LunarEclipseNoticeability) =>
		t().LUNAR_ECLIPSE[`NOTICEABILITY_${noticeability}`];

	const contacts = createMemo(() => {
		const event = props.event;

		if (isNullable(event)) {
			return [];
		}

		return getContactStages(event, t().LUNAR_ECLIPSE);
	});

	return (
		<div aria-live="polite" class={styles.summary}>
			<Show
				fallback={<p class={styles.empty}>{t().LUNAR_ECLIPSE.NO_ECLIPSE}</p>}
				when={props.event}
			>
				{event => (
					<>
						<div class={styles["event-header"]}>
							<div class={styles["event-title"]}>
								<span>{t().LUNAR_ECLIPSE.EVENT_TYPE}</span>
								<strong>{labelType(event().type)}</strong>
							</div>
							<div class={styles["event-date"]}>
								<span>{t().LABEL.DATE}</span>
								<time datetime={event().peak.time.toISOString()}>{format().date(event().peak.time)}</time>
							</div>
						</div>

						<dl class={styles.metrics}>
							<div class={styles.metric}>
								<dt>{t().LUNAR_ECLIPSE.CURRENT_PHASE}</dt>
								<dd>{labelPhase(props.state.phase)}</dd>
							</div>
							<div class={styles.metric}>
								<dt>{t().LUNAR_ECLIPSE.MAXIMUM_MOON_ALTITUDE}</dt>
								<dd>{format().degrees(event().peak.moonAltitude)}</dd>
							</div>
							<div class={styles.metric}>
								<dt>{t().LUNAR_ECLIPSE.VISIBILITY}</dt>
								<dd>{labelVisibility(event().visibility)}</dd>
							</div>
							<div class={styles.metric}>
								<dt>{t().LUNAR_ECLIPSE.NOTICEABILITY}</dt>
								<dd>{labelNoticeability(event().noticeability)}</dd>
							</div>
						</dl>

						<section class={styles["contacts-section"]} data-page-swipe="ignore">
							<h3>{t().LUNAR_ECLIPSE.CONTACTS}</h3>
							<div class={styles["contacts-scroll"]}>
								<ol
									aria-label={t().LUNAR_ECLIPSE.CONTACTS}
									class={styles.contacts}
									style={{ "--contact-count": contacts().length }}
								>
									<For each={contacts()}>
										{stage => (
											<LunarEclipseContact
												code={stage.code}
												contact={stage.contact}
												label={stage.label}
												position={stage.position}
											/>
										)}
									</For>
								</ol>
							</div>
						</section>
					</>
				)}
			</Show>
		</div>
	);
}
