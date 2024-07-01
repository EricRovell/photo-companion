import { createEffect, createSignal, For, mergeProps } from "solid-js";
import { Button, IconArrowDown, IconArrowUp, InputCheckbox } from "ui"; 

import { type ROUTE_PRIMARY_LABEL, ROUTES_PRIMARY } from "@lib/consts/routes";
import { useTranslation } from "@lib/context";

import type { NavigationTabName } from "@lib/types";

import styles from "./tabs-select.module.css";

type ChangeHandler = (name: string, value: NavigationTabName[]) => void;

interface TabsSelectProps {
	initialTabs: ROUTE_PRIMARY_LABEL[];
	name: string;
	onChange: ChangeHandler;
}

interface TabSelectProps {
	index: number;
	onMove: (event: Event) => void;
	onSelect: (event: Event) => void;
	tab: ROUTE_PRIMARY_LABEL;
	value: ROUTE_PRIMARY_LABEL[];
}

const OPTIONS_MIN_COUNT = 1;

export function TabSelect(props: TabSelectProps) {
	const { t } = useTranslation();
	const checked = () => props.value.includes(props.tab);
	const disabledDown = () => props.index >= props.value.length - 1;
	const disabledUp = () => props.index === 0 || props.index > props.value.length - 1;
	const itemDisabled = () => checked() && props.value.length <= OPTIONS_MIN_COUNT;

	return (
		<li
			class={styles.entry}
			data-index={props.index}
			data-tab={props.tab}
		>
			<InputCheckbox
				checked={checked()}
				disabled={itemDisabled()}
				label={t().TITLE[props.tab]}
				onChange={props.onSelect}
			/>
			<Button
				appearance="ghost"
				data-step={-1}
				disabled={disabledDown()}
				onClick={props.onMove}
				type="button"
			>
				<IconArrowDown />
			</Button>
			<Button
				appearance="ghost"
				data-step={1}
				disabled={disabledUp()}
				onClick={props.onMove}
				type="button"
			>
				<IconArrowUp />
			</Button>
		</li>
	);
}

export function InputTabsSelect(allProps: TabsSelectProps) {
	const props = mergeProps({ initialTabs: [] }, allProps);
	const initialInactiveTabs = ROUTES_PRIMARY.filter(item => !props.initialTabs.includes(item));

	const [ getTabs, setTabs ] = createSignal<ROUTE_PRIMARY_LABEL[]>(props.initialTabs);
	const [ getInactiveTabs, setInactiveTabs ] = createSignal<ROUTE_PRIMARY_LABEL[]>(initialInactiveTabs);

	createEffect(() => {
		setTabs(props.initialTabs);
		setInactiveTabs(ROUTES_PRIMARY.filter(item => !props.initialTabs.includes(item)));
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

		props.onChange(props.name, getTabs());
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

		props.onChange(props.name, getTabs());
	};

	return (
		<article class={styles["tabs-select"]}>
			<ol class={styles.entries}>
				<For each={[ ...getTabs(), ...getInactiveTabs() ]}>
					{(tab, index) => (
						<TabSelect
							index={index()}
							onMove={handleMove}
							onSelect={handleSelect}
							tab={tab}
							value={getTabs()}
						/>
					)}
				</For>
			</ol>
		</article>
	);
}
