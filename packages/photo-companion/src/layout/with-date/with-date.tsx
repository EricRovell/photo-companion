import { InputDatetime } from "ui";

import type { ParentProps } from "solid-js";

import { getDateTimeString, parseDateTimeString } from "~/helpers";
import { useDatetime } from "~/hooks";
import { useTranslation } from "~/services/translation";

import styles from "./with-date.module.css";

export function WithDate(props: ParentProps) {
	const { getDatetime, setDatetimeQuery } = useDatetime();
	const { t } = useTranslation();

	const value = () => getDateTimeString(getDatetime());

	const handleDatetimeChange = (input: string) => {
		setDatetimeQuery(parseDateTimeString(input));
	};

	return (
		<>
			{props.children}
			<InputDatetime
				class={styles["date-input"]}
				labels={{
					DATETIME: t().LABEL.DATETIME,
					NEXT_DAY: t().LABEL.NEXT_DAY,
					NOW: t().LABEL.NOW,
					PREVIOUS_DAY: t().LABEL.PREVIOUS_DAY
				}}
				onDatetimeChange={handleDatetimeChange}
				value={value()}
			/>
		</>
	);
}
