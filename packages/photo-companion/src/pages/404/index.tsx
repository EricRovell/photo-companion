import { Moon } from "~/entities/moon";
import { useTranslation } from "~/features/translation";
import { ROUTES } from "~/shared/consts";
import { Link, Text } from "~/shared/ui";

import styles from "./404.module.css";

export const Page404 = () => {
	const { t } = useTranslation();

	return (
		<aside class={styles.page}>
			<Text align="center" as="p" balance variant="text-l">{t().MESSAGE.PAGE_404}</Text>
			<div class={styles.moon}>
				<span class={styles.digit}>4</span>
				<Moon
					phase={0.13}
					rotation={45}
				/>
				<span class={styles.digit}>4</span>
			</div>
			<Link class={styles.link} href={ROUTES.ROOT}>
				{t().LABEL.GO_HOME}
			</Link>
		</aside>
	);
};

export default Page404;
