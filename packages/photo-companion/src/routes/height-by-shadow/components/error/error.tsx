import { Show } from "solid-js";

import { useTranslation } from "~/lib/context/translation";

import { useForm } from "../../height-by-shadow.context";

import type { FormKey} from "../../height-by-shadow.context";

import styles from "./error.module.css";

type ErrorFieldNames = Exclude<FormKey, "latitude_direction" | "longitude_direction">

export function Error() {
	const { getInvalidFields, hasError } = useForm();
	const { t } = useTranslation();

	const message = () => {
		const key = getInvalidFields()[0].toUpperCase() as Uppercase<ErrorFieldNames>;
		return t().ERRORS[key];
	};

	return (
		<Show when={hasError()}>
			<aside class={styles.error}>
				<p>{message()}</p>
			</aside>
		</Show>
	);
}
