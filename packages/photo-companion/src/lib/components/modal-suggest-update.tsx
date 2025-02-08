import { Button, Modal } from "ui";

import { useTranslation } from "@lib/context/translation";

import { useServiceWorker } from "../../services/service-worker";

export function ModalSuggestUpdate() {
	const { t } = useTranslation();
	const { getSuggestUpdate, handleReload, setSuggestUpdate } = useServiceWorker();

	const handleClose = () => setSuggestUpdate(false);

	return (
		<Modal
			onClose={handleClose}
			open={getSuggestUpdate()}
			title={t().TITLE.UPDATE}
		>
			<p>{t().MESSAGE.UPDATE}</p>
			<Button onClick={handleReload}>
				{t().LABEL.RELOAD}
			</Button>
		</Modal>
	);
}
