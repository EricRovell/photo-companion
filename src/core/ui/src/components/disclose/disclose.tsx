import { type JSX, mergeProps, type ParentProps, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import styles from "./disclose.module.css";

interface DiscloseProps<
	T extends keyof HTMLElementTagNameMap = "div"
> extends JSX.HTMLAttributes<HTMLElementTagNameMap[T]> {
	as?: keyof HTMLElementTagNameMap;
	when?: Nullable<boolean>;
}

const DEFAULT_PROPS: DiscloseProps = {
	as: "div",
	when: false
};

export function Disclose(allProps: ParentProps<DiscloseProps>) {
	const merged = mergeProps(DEFAULT_PROPS, allProps);
	const [ props, rest ] = splitProps(merged, [ "as", "children", "when" ]);

	return (
		<Dynamic
			aria-expanded={props.when ? "true" : undefined}
			class={styles.disclose}
			component={props.as}
			{...rest}
		>
			{props.children}
		</Dynamic>
	);
}
