import { useTranslation } from "~/features/translation";
import { Text } from "~/shared/ui";
import { IconWarning } from "~/shared/ui/icons";

import styles from "./no-events.module.css";

export function NoEvents() {
	const { t } = useTranslation();

	return (
		<article class={styles.warning}>
			<Text align="center" as="h2" balance variant="heading-m">{t().MESSAGE.EVENTS_ARE_DISABLED}</Text>
			<IconWarning />
		</article>
	);
}
