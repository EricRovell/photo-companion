import { createMemo, For, Show } from "solid-js";
import { isNullable } from "utils/validators";

import type {
	LunarEclipseNoticeability,
	LunarEclipsePhase,
	LunarEclipseType,
	LunarEclipseVisibility
} from "moon-sun-calc";

import { useTranslation } from "~/features/translation";
import { Text } from "~/shared/ui";

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
				fallback={<Text align="center" as="p" balance class={styles.empty} color="secondary" variant="text-s">{t().LUNAR_ECLIPSE.NO_ECLIPSE}</Text>}
				when={props.event}
			>
				{event => (
					<>
						<div class={styles["event-header"]}>
							<div class={styles["event-title"]}>
								<Text color="secondary" variant="text-xs">{t().LUNAR_ECLIPSE.EVENT_TYPE}</Text>
								<Text as="strong" variant="heading-l">{labelType(event().type)}</Text>
							</div>
							<div class={styles["event-date"]}>
								<Text color="secondary" variant="text-xs">{t().LABEL.DATE}</Text>
								<Text as="time" datetime={event().peak.time.toISOString()} numeric variant="text-s">{format().date(event().peak.time)}</Text>
							</div>
						</div>

						<dl class={styles.metrics}>
							<div class={styles.metric}>
								<Text as="dt" color="secondary" variant="text-xs">{t().LUNAR_ECLIPSE.CURRENT_PHASE}</Text>
								<Text as="dd" numeric variant="text-s">{labelPhase(props.state.phase)}</Text>
							</div>
							<div class={styles.metric}>
								<Text as="dt" color="secondary" variant="text-xs">{t().LUNAR_ECLIPSE.MAXIMUM_MOON_ALTITUDE}</Text>
								<Text as="dd" numeric variant="text-s">{format().degrees(event().peak.moonAltitude)}</Text>
							</div>
							<div class={styles.metric}>
								<Text as="dt" color="secondary" variant="text-xs">{t().LUNAR_ECLIPSE.VISIBILITY}</Text>
								<Text as="dd" numeric variant="text-s">{labelVisibility(event().visibility)}</Text>
							</div>
							<div class={styles.metric}>
								<Text as="dt" color="secondary" variant="text-xs">{t().LUNAR_ECLIPSE.NOTICEABILITY}</Text>
								<Text as="dd" numeric variant="text-s">{labelNoticeability(event().noticeability)}</Text>
							</div>
						</dl>

						<section class={styles["contacts-section"]} data-page-swipe="ignore">
							<Text align="center" as="h3" color="secondary" variant="heading-s">{t().LUNAR_ECLIPSE.CONTACTS}</Text>
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
