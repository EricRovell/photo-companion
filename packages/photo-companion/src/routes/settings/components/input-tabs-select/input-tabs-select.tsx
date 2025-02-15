import { createMemo, For } from "solid-js";

import { FORM_INPUT_NAME } from "../../settings.const";
import { useSettingsForm } from "../../settings.context";
import { TabSelect } from "./input-tabs-select.tab";

import type { ROUTE_PRIMARY_LABEL } from "~/services/navigation";

import styles from "./input-tabs-select.module.css";

const OPTIONS_MIN_COUNT = 1;

interface InputTabsSelectProps {
	tabs: ROUTE_PRIMARY_LABEL[]
}

export function InputTabsSelect(props: InputTabsSelectProps) {
	const { setSettingsStore, settingsStore } = useSettingsForm();

	const state = createMemo(() => {
		const output = settingsStore.tabs.map(tab => ({ active: true, tab }));

		for (const tab of props.tabs) {
			if (!settingsStore.tabs.includes(tab)) {
				output.push({ active: false, tab });
			}
		}

		return output;
	});

	const handleMove = (event: Event) => {
		const target = event.target as HTMLButtonElement;
		const parent = target.parentElement as HTMLLIElement;
		const tab = parent.dataset.tab as ROUTE_PRIMARY_LABEL;
		const index = Number(parent.dataset.index);
		const step = Number(target.dataset.step);

		if (step > 0 && index <= 0) {
			return;
		}

		if (step < 0 && index >= settingsStore.tabs.length - 1) {
			return;
		}

		const value = [ ...settingsStore.tabs ];
		const temp = value[index - step];
		value[index - step] = tab;
		value[index] = temp;

		setSettingsStore(FORM_INPUT_NAME.TABS, value);
	};

	const handleSelect = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const parent = target.parentElement?.parentElement as HTMLLIElement;
		const tab = parent.dataset.tab as ROUTE_PRIMARY_LABEL;

		const value = target.checked
			? [ ...settingsStore.tabs, tab ]
			: [ ...settingsStore.tabs ].filter(item => item !== tab);

		setSettingsStore(FORM_INPUT_NAME.TABS, value);
	};

	return (
		<article>
			<ol class={styles.entries}>
				<For each={state()}>
					{(item, index) => (
						<TabSelect
							active={item.active}
							disabled={item.active && settingsStore.tabs.length <= OPTIONS_MIN_COUNT}
							disabledDown={index() >= settingsStore.tabs.length - 1}
							disabledUp={index() === 0 || index() > settingsStore.tabs.length - 1}
							index={index()}
							onMove={handleMove}
							onSelect={handleSelect}
							tab={item.tab}
						/>
					)}
				</For>
			</ol>
		</article>
	);
}
