import { Button, IconArrowDown, IconArrowUp, InputCheckbox } from "ui"; 

import { type ROUTE_PRIMARY_LABEL } from "@lib/consts/routes";
import { useTranslation } from "@lib/context";

import styles from "./input-tabs-select.module.css";

interface TabSelectProps {
	active: boolean;
	disabled?: boolean;
	disabledDown: boolean;
	disabledUp?: boolean;
	index: number;
	onMove: (event: Event) => void;
	onSelect: (event: Event) => void;
	tab: ROUTE_PRIMARY_LABEL;
}

export function TabSelect(props: TabSelectProps) {
	const { t } = useTranslation();

	return (
		<li
			class={styles.entry}
			data-index={props.index}
			data-tab={props.tab}
		>
			<InputCheckbox
				checked={props.active}
				disabled={props.disabled}
				label={t().TITLE[props.tab]}
				onChange={props.onSelect}
			/>
			<Button
				appearance="ghost"
				class={styles.button}
				data-step={-1}
				disabled={props.disabledDown}
				onClick={props.onMove}
				type="button"
			>
				<IconArrowDown />
			</Button>
			<Button
				appearance="ghost"
				class={styles.button}
				data-step={1}
				disabled={props.disabledUp}
				onClick={props.onMove}
				type="button"
			>
				<IconArrowUp />
			</Button>
		</li>
	);
}
