import { createMemo, createSignal, Show } from "solid-js";
import { unwrap } from "solid-js/store";
import { isNullable } from "utils/validators";

import { useTranslation } from "~/features/translation";
import { IconShadow } from "~/shared/ui/icons";

import { FormProvider, useForm } from "./height-by-shadow.context";
import { Error } from "./ui/error/error";
import { Form } from "./ui/form/form";
import { calcOutput, Output } from "./ui/output/output";

import styles from "./height-by-shadow.module.css";

function Calculator() {
	const { hasError, model } = useForm();

	const [ getShowOutput, setShowOutput ] = createSignal(false);
	const [ getOutput, setOutput ] = createSignal<null | ReturnType<typeof calcOutput>>(null);

	const handleSubmit = (event: SubmitEvent) => {
		event.preventDefault();

		if (hasError()) {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			navigator.vibrate?.(350);
			return;
		}

		setShowOutput(true);
		setOutput(calcOutput(unwrap(model)));
	};

	const handleInput = () => {
		setShowOutput(false);
		setOutput(null);
	};

	const outputErrors = createMemo(() => {
		const output = getOutput();

		if (isNullable(output)) {
			return [];
		}

		const errors: string[] = [];

		if (output.length === 0) {
			errors.push("SUN_AZIMUTH_NOT_VISIBLE");
		}

		if (output.some(({ height }) => height < 0)) {
			errors.push("NEGATIVE_HEIGHT");
		}

		return errors;
	});

	const hasSomeError = () => hasError() || outputErrors().length > 0;

	return (
		<>
			<Form onInput={handleInput} onSubmit={handleSubmit}>
				<Error errors={outputErrors()} />
			</Form>
			<Show when={!hasSomeError() && getShowOutput()}>
				<Output candidates={getOutput() ?? []} />
			</Show>
		</>
	);
}

export function PageHeightByShadow() {
	const { t } = useTranslation();

	return (
		<FormProvider>
			<div class={styles.page}>
				<IconShadow class={styles.icon} />
				<h1 class={styles.title}>
					{t().TITLE.HEIGHT_BY_SHADOW_FULL}
				</h1>
				<Calculator />
			</div>
		</FormProvider>
	);
}

export default PageHeightByShadow;
