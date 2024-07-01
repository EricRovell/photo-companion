import { classnames } from "utils";

import { useTranslation } from "@lib/context";

import styles from "./event.module.css";

export function TimelineEventEmpty() {
	const { t } = useTranslation();

	return (
		<li
			class={classnames(styles.event, styles.empty)}
			data-event-name="empty"
		>
			<div class={styles.icon} data-event-icon>
				<svg fill="currentcolor" viewBox="0 0 256 256">
					<rect fill="none" height="256" width="256"/>
					<circle cx="128" cy="128" r="12"/>
					<circle cx="196" cy="128" r="12"/>
					<circle cx="60" cy="128" r="12"/>
				</svg>
			</div>
			<article>
				<p>{t().MESSAGE.NO_EVENTS}</p>
			</article>
		</li>
	);
}
