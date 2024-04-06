import { t } from "@stores/lang";
import styles from "./event.module.css";
import { classnames } from "utils";

export const TimelineEventEmpty = () => (
	<li
		class={classnames(styles.event, styles.empty)}
		data-event-name="empty"
	>
		<div class={styles.icon} data-event-icon>
			<svg viewBox="0 0 256 256" fill="currentcolor">
				<rect width="256" height="256" fill="none"/>
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
