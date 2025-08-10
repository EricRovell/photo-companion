import { useTranslation } from "~/features/translation";
import { IconWarning } from "~/shared/ui/icons";

import styles from "./no-events.module.css";

export function NoEvents() {
	const { t } = useTranslation();

	return (
		<article class={styles.warning}>
			<h2>{t().MESSAGE.EVENTS_ARE_DISABLED}</h2>
			<IconWarning />
		</article>
	);
}
