import { Link } from "ui";

import { Moon } from "~/lib/components";
import { ROUTES } from "~/lib/consts";
import { useTranslation } from "~/services/translation";

import styles from "./404.module.css";

export const Page404 = () => {
	const { t } = useTranslation();

	return (
		<aside class={styles.page}>
			<p class={styles.message}>{t().MESSAGE.PAGE_404}</p>
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
