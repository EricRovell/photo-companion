import { IconShadow } from "ui/icons";

import { useTranslation } from "~/services/translation";

import { Error } from "./components/error/error";
import { Form } from "./components/form/form";
import { Output } from "./components/output/output";
import { FormProvider } from "./height-by-shadow.context";

import styles from "./height-by-shadow.module.css";

export function PageHeightByShadow() {
	const { t } = useTranslation();

	return (
		<FormProvider>
			<div class={styles.page}>
				<IconShadow class={styles.icon} />
				<h1 class={styles.title}>
					{t().TITLE.HEIGHT_BY_SHADOW_FULL}
				</h1>
				<Form>
					<Error />
				</Form>
				<Output />
			</div>
		</FormProvider>
	);
}

export default PageHeightByShadow;
