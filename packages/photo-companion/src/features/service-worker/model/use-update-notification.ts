import { useTranslation } from "~/features/translation";
import { createNotification } from "~/shared/ui/notifications";

import { useServiceWorker } from "./service-worker-context";

export function useUpdateNotification() {
	const { t } = useTranslation();
	const { getSuggestUpdate, handleReload, setSuggestUpdate } = useServiceWorker();
	const handleClose = () => setSuggestUpdate(false);

	createNotification(() => getSuggestUpdate() ? {
		action: {
			dismiss: false,
			label: t().LABEL.UPDATE,
			onClick: handleReload
		},
		duration: Infinity,
		onDismiss: handleClose,
		title: t().MESSAGE.UPDATE,
		variant: "success"
	} : null);
}
