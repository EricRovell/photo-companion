import { Show } from "solid-js";
import { isNonEmptyString } from "utils/validators";

import { Text } from "../text/text";

import styles from "./error-message.module.css";

interface Props {
	message?: string;
}

// TODO: refactor into configurable info message
export function ErrorMessage(props: Props) {
	const hasError = () => isNonEmptyString(props.message);

	return (
		<Show when={hasError()}>
			<aside class={styles.error}>
				<Text
					align="center"
					as="p"
					balance
					color="danger"
					variant="text-m"
				>
					{props.message}
				</Text>
			</aside>
		</Show>
	);
}
