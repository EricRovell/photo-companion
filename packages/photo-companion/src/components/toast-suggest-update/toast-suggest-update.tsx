import { createEffect, on } from "solid-js";
import { toast } from "solid-sonner";

import { useServiceWorker } from "~/services/service-worker";
import { useTranslation } from "~/services/translation";
import { Button } from "~/shared/ui";

import styles from "./toast-suggest-update.module.css";

export function ToastSuggestUpdate() {
	const { t } = useTranslation();
	const { getSuggestUpdate, handleReload, setSuggestUpdate } = useServiceWorker();

	const handleClose = () => setSuggestUpdate(false);

	const Toast = () => (
		<aside class={styles.toast}>
			<p class={styles.message}>
				{t().MESSAGE.UPDATE}
			</p>
			<Button class={styles.button} onClick={handleReload} variant="success">
				{t().LABEL.UPDATE}
			</Button>
		</aside>
	);

	createEffect(on(getSuggestUpdate, state => {
		if (state) {
			toast.custom(() => <Toast />, {
				duration: Infinity,
				onDismiss: handleClose
			});
		}
	}));

	return null;
}
