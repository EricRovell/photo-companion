import { Navigate } from "@solidjs/router";
import { For, Show } from "solid-js";

import { BridgesInfo, BridgesProvider, CardBridge, useBridges } from "~/features/bridges-spb";
import { useTranslation } from "~/features/translation";
import { ROUTES } from "~/shared/consts";
import { Text } from "~/shared/ui";

import styles from "./bridges.module.css";

function BridgeList() {
	const { isBridgeException, SUPPORTED_BRIDGES_NAME_SET } = useBridges();

	return (
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
}

export function PageBridges() {
	const { t } = useTranslation();
	const { isSupportsBridges } = useBridges();

	return (
		<Show when={isSupportsBridges()} fallback={<Navigate href={ROUTES.NOT_FOUND} />}>
			<div class={styles.page}>
				<div class={styles.wrapper}>
					<Text as="h2" balance class={styles.title} id="bridge-schedule" variant="heading-2xl">
						{t().TITLE.BRIDGES_SCHEDULE_SPB}
					</Text>
					<BridgeList />
				</div>
				<aside class={styles.info}>
					<BridgesInfo />
				</aside>
			</div>
		</Show>
	);
}

export default () => (
	<BridgesProvider>
		<PageBridges />
	</BridgesProvider>
);
