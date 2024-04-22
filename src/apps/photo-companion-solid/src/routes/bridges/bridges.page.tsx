import { SUPPORTED_BRIDGES_NAME_SET, isBridgeException } from "bridge-schedule";
import { For } from "solid-js";
import { Button, Icon } from "ui-solid";
import { iconChevronDown } from "ui-solid/icons";

import { CardBridge } from "@lib/components/card-bridge/card-bridge";
import { t } from "@lib/stores/lang";
import { BridgeNextEvent } from "./bridges-next-event";
import { BridgesNavigationEvent } from "./bridges-navigation-event";
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
	return (
		<div class={styles.page}>
			<div>
				<h2 id="bridge-schedule">
					{t().TITLE.BRIDGES_SCHEDULE_SPB}
				</h2>
				<BridgeList />
			</div>
			<aside>
				<BridgesNavigationEvent />
				<BridgeNextEvent />
				<Button
					appearance="ghost"
					onClick={() => {
						document.querySelector("#bridge-schedule")
							?.scrollIntoView({
								behavior: "smooth"
							});
					}}
				>
					<Icon path={iconChevronDown} />
				</Button>
			</aside>
		</div>
	);
}
