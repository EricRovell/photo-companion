import { Show } from "solid-js";
import { isNonEmptyString } from "utils/validators";

import styles from "./error-message.module.css";

interface Props {
	message?: string;
}

export function ErrorMessage(props: Props) {
	const hasError = () => isNonEmptyString(props.message);

	return (
		<Show when={hasError()}>
			<aside class={styles.error}>
				<p>{props.message}</p>
			</aside>
		</Show>
	);
}
