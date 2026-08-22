import type { ParentProps } from "solid-js";

import { InputDatetime } from "~/entities/input-datetime";
import { useTranslation } from "~/features/translation";
import { createQueryDate } from "~/shared/lib/query-date";

import { parseDateTimeString } from "../../lib";
import { useDatetime } from "../../model";

import styles from "./layout-datetime.module.css";

export function LayoutDatetime(props: ParentProps) {
	const { getDatetime, setDatetimeQuery } = useDatetime();
	const { lang, t } = useTranslation();

	const value = () => createQueryDate(getDatetime());

	const handleDatetimeChange = (input: string) => {
		setDatetimeQuery(parseDateTimeString(input));
	};

	const handleDatetimeReset = () => {
		setDatetimeQuery();
	};

	return (
		<>
			{props.children}
			<InputDatetime
				class={styles["date-input"]}
				labels={{
					DATETIME: t().LABEL.DATETIME,
					DATETIME_STEP: t().LABEL.DATETIME_STEP,
					DATETIME_TIMELINE: t().LABEL.DATETIME_TIMELINE,
					DAY: t().LABEL.DAY,
					HOUR: t().LABEL.HOUR,
					MINUTE: t().LABEL.MINUTE,
					MONTH: t().LABEL.MONTH,
					NOW: t().LABEL.NOW,
					OPEN_DATETIME_PICKER: t().LABEL.OPEN_DATETIME_PICKER,
					YEAR: t().LABEL.YEAR
				}}
				locale={lang()}
				onDatetimeChange={handleDatetimeChange}
				onReset={handleDatetimeReset}
				value={value()}
			/>
			<div aria-hidden="true" class={styles["date-input-spacer"]} />
		</>
	);
}
