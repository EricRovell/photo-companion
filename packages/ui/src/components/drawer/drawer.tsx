import { type ParentProps, splitProps } from "solid-js";
import { classnames } from "utils";

import { Dialog } from "../dialog/dialog";

import type { Classes } from "../../types";

import styles from "./drawer.module.css";

interface DrawerProps extends ParentProps {
	classes?: Classes<"backdrop" | "dialog" | "drawer">;
	lightDismiss?: boolean;
	onClose?: VoidFn;
	open?: boolean;
	//position?: "BOTTOM" | "LEFT" | "RIGHT" | "TOP";
	preventPageScroll?: boolean;
}

export const Drawer = (allProps: DrawerProps) => {
	const [ props, rest ] = splitProps(allProps, [ "classes", "children" ]);

	return (
		<Dialog
			classes={{
				backdrop: classnames(styles.backdrop, props.classes?.backdrop),
				dialog: classnames(styles.dialog, props.classes?.dialog)
			}}
			{...rest}
		>
			<aside class={classnames(styles.drawer, props.classes?.drawer)}>
				{props.children}
			</aside>
		</Dialog>
	);
};
