import { Navigate } from "@solidjs/router";
import { isBridgeException, SUPPORTED_BRIDGES_NAME_SET } from "bridge-schedule";
import { For, Show } from "solid-js";

import { BridgesInfo } from "~/components/bridges-info/bridges-info";
import { ROUTES } from "~/consts/routes";
import { useSettings } from "~/services/settings";
import { useTranslation } from "~/services/translation";

import { CardBridge } from "./components";

import styles from "./bridges.module.css";

const BridgeList = () => (
	<ul class={styles["bridge-list"]}>
		<For each={Array.from(SUPPORTED_BRIDGES_NAME_SET)}>
			{name => (
				<li>
					<CardBridge
						exception={isBridgeException(name)}
						name={name}
					/>
				</li>
			)}
		</For>
	</ul>
);

export function PageBridges() {
	const { t } = useTranslation();
	const { isSupportsBridges } = useSettings();

	return (
		<Show when={isSupportsBridges()} fallback={<Navigate href={ROUTES.NOT_FOUND} />}>
			<div class={styles.page}>
				<div class={styles.wrapper}>
					<h2 class={styles.title} id="bridge-schedule">
						{t().TITLE.BRIDGES_SCHEDULE_SPB}
					</h2>
					<BridgeList />
				</div>
				<aside class={styles.info}>
					<BridgesInfo />
				</aside>
			</div>
		</Show>
	);
}

export default PageBridges;
