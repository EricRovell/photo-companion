import { useSearchParams } from "@solidjs/router";
import { createSignal, onMount, type ParentProps } from "solid-js";
import { InputDatetime } from "ui-solid";

import { t } from "@stores/lang";
import { parseQueryDate, createQueryDate, getDateTimeString } from "@lib/helpers";
import styles from "./with-date.module.css";
import { isNullable } from "utils/validators";

export function WithDate(props: ParentProps) {
	const [ query, setQuery ] = useSearchParams();
	const [ value, setValue ] = createSignal<string>(getDateTimeString());

	const dict = () => {
		const translation = t();

		return {
			DATETIME: translation.LABEL.DATETIME,
			NEXT_DAY: translation.LABEL.NEXT_DAY,
			PREVIOUS_DAY: translation.LABEL.PREVIOUS_DAY,
			NOW: translation.LABEL.NOW
		};
	};

	const setDateQuery = (input?: Date): void => {
		setQuery({
			date: createQueryDate(input)
		});
	};

	const handleDatetimeChange = (input: string) => {
		setValue(input);
		setDateQuery(new Date(value()));
	};

	onMount(() => {
		if (isNullable(query.date)) {
			setDateQuery();
			setValue(getDateTimeString());
		} else {
			const parsed = parseQueryDate(query.date);
			setValue(getDateTimeString(parsed));
		}
	});

	return (
		<>
			{props.children}
			<InputDatetime
				class={styles["date-input"]}
				dict={dict()}
				onDatetimeChange={handleDatetimeChange}
				value={value()}
			/>
		</>
	);
}
