import type { ParentProps } from "solid-js";
import { InputDatetime } from "ui-solid";

import { useTranslation } from "@lib/context";
import { getDateTimeString, parseDateTimeString } from "@lib/helpers";

import styles from "./with-date.module.css";
import { useDatetime } from "@lib/hooks";

export function WithDate(props: ParentProps) {
	const { getDatetime, setDatetimeQuery } = useDatetime();
	const { t } = useTranslation();

	const value = () => getDateTimeString(getDatetime());

	const handleDatetimeChange = (input: string) => {
		setDatetimeQuery(parseDateTimeString(input));
	};

	const dict = () => {
		const tr = t();

		return {
			DATETIME: tr.LABEL.DATETIME,
			NEXT_DAY: tr.LABEL.NEXT_DAY,
			PREVIOUS_DAY: tr.LABEL.PREVIOUS_DAY,
			NOW: tr.LABEL.NOW
		};
	};

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
