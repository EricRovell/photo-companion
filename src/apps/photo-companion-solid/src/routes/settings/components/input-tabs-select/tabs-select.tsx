import { Button, Icon, InputCheckbox } from "ui-solid"; 
import { iconArrowDown, iconArrowUp } from "ui-solid/icons";

import { t } from "@stores/lang";
import { NAVIGATION_TABS } from "@lib/stores/navigation";
import type { NavigationTabName } from "@lib/types";
import styles from "./tabs-select.module.css";
import { For, createEffect, createSignal, mergeProps } from "solid-js";

type ChangeHandler = (name: string, value: NavigationTabName[]) => void;

interface TabsSelectProps {
	initialTabs: NavigationTabName[];
	name: string;
	onChange: ChangeHandler;
}

interface TabSelectProps {
	value: NavigationTabName[];
	index: number;
	onMove: (event: Event) => void;
	onSelect: (event: Event) => void;
	tab: NavigationTabName;
}

export function TabSelect(props: TabSelectProps) {
	const checked = () => props.value.includes(props.tab);
	const itemDisabled = () => (checked() && props.value.length <= 2) || (!checked() && props.value.length >= 5);
	const disabledDown = () => props.index >= props.value.length - 1;
	const disabledUp = () => props.index === 0 || props.index > props.value.length - 1;

	return (
		<li
			class={styles.entry}
			data-tab={props.tab}
			data-index={props.index}
		>
			<InputCheckbox
				checked={checked()}
				disabled={itemDisabled()}
				onChange={props.onSelect}
				label={t().TITLE[props.tab]}
			/>
			<Button
				appearance="ghost"
				data-step={-1}
				disabled={disabledDown()}
				onClick={props.onMove}
				type="button"
			>
				<Icon path={iconArrowDown} />
			</Button>
			<Button
				appearance="ghost"
				data-step={1}
				disabled={disabledUp()}
				onClick={props.onMove}
				type="button"
			>
				<Icon path={iconArrowUp} />
			</Button>
		</li>
	);
}

export function InputTabsSelect(allProps: TabsSelectProps) {
	const props = mergeProps({ initialTabs: [] }, allProps);
	const initialInactiveTabs = NAVIGATION_TABS.filter(item => !props.initialTabs.includes(item));

	const [ getTabs, setTabs ] = createSignal<NavigationTabName[]>(props.initialTabs);
	const [ getInactiveTabs, setInactiveTabs ] = createSignal<NavigationTabName[]>(initialInactiveTabs);

	createEffect(() => {
		setTabs(props.initialTabs);
		setInactiveTabs(NAVIGATION_TABS.filter(item => !props.initialTabs.includes(item)));
	});

	const handleMove = (event: Event) => {
		const target = event.target as HTMLButtonElement;
		const parent = target.parentElement as HTMLLIElement;
		const tab = parent.dataset.tab as NavigationTabName;
		const index = Number(parent.dataset.index);
		const step = Number(target.dataset.step);

		if (step > 0 && index <= 0) {
			return;
		}

		if (step < 0 && index >= getTabs().length - 1) {
			return;
		}

		setTabs(value => {
			const valueCopy = [ ...value ];
			const temp = valueCopy[index - step];
			valueCopy[index - step] = tab;
			valueCopy[index] = temp;

			return valueCopy;
		});

		props.onChange?.(props.name, getTabs());
	};

	const handleSelect = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const parent = target.parentElement?.parentElement as HTMLLIElement;
		const tab = parent.dataset.tab as NavigationTabName;

		if (!target.checked) {
			setTabs(value => [ ...value.filter(i => i !== tab) ]);
			setInactiveTabs(value => [ tab, ...value ]);
		} else {
			setTabs(value => [ ...value, tab ]);
			setInactiveTabs(value => [ ...value.filter(i => i !== tab) ]);
		}

		props.onChange?.(props.name, getTabs());
	};

	return (
		<article class={styles["tabs-select"]}>
			<ol class={styles.entries}>
				<For each={[ ...getTabs(), ...getInactiveTabs() ]}>
					{(tab, index) => (
						<TabSelect
							onMove={handleMove}
							onSelect={handleSelect}
							index={index()}
							tab={tab}
							value={getTabs()}
						/>
					)}
				</For>
			</ol>
		</article>
	);
}
