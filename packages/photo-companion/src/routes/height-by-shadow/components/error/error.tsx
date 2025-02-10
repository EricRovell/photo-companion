import { Show } from "solid-js";
import { isNonEmptyArray } from "utils/validators";

import { useTranslation } from "~/services/translation";

import { useForm } from "../../height-by-shadow.context";

import type { FormKey} from "../../height-by-shadow.context";

import styles from "./error.module.css";

type ErrorFieldNames = Exclude<FormKey, "latitude_direction" | "longitude_direction">

interface Props {
	errors?: string[];
}

export function Error(props: Props) {
	const { getInvalidFields, hasError } = useForm();
	const { t } = useTranslation();

	const hasCustomError = () => isNonEmptyArray(props.errors);
	const hasSomeError = () => hasError() || hasCustomError();

	const message = () => {
		if (hasError()) {
			const key = getInvalidFields()[0].toUpperCase() as Uppercase<ErrorFieldNames>;
			return t().ERRORS[key];
		}

		if (hasCustomError()) {
			// @ts-expect-error: TODO fix
			return t().ERRORS[props.errors?.[0]];
		}

		return "";
	};

	return (
		<Show when={hasSomeError()}>
			<aside class={styles.error}>
				<p>{message()}</p>
			</aside>
		</Show>
	);
}
