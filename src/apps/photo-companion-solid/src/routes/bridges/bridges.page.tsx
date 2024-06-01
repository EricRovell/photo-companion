import { isBridgeException, SUPPORTED_BRIDGES_NAME_SET } from "bridge-schedule";
import { For } from "solid-js";
import { Button, IconChevronDown } from "ui-solid";

import { useTranslation } from "@lib/context";

import { CardBridge, NavigationEvent, NextBridgeEvent } from "./components";

import styles from "./bridges.module.css";

const BridgeList = () => (
	<ul>
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

	return (
		<div class={styles.page}>
			<div>
				<h2 id="bridge-schedule">
					{t().TITLE.BRIDGES_SCHEDULE_SPB}
				</h2>
				<BridgeList />
			</div>
			<aside>
				<NavigationEvent />
				<NextBridgeEvent />
				<Button
					appearance="ghost"
					onClick={() => {
						document.querySelector("#bridge-schedule")
							?.scrollIntoView({
								behavior: "smooth"
							});
					}}
				>
					<IconChevronDown />
				</Button>
			</aside>
		</div>
	);
}
