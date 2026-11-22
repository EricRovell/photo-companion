import { omit, type ParentProps } from "solid-js";

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

export const Drawer = (props: DrawerProps) => {
	const rest = omit(props, "classes", "children");

	return (
		<Dialog
			classes={{
				backdrop: [ styles.backdrop, props.classes?.backdrop ],
				dialog: [ styles.dialog, props.classes?.dialog ]
			}}
			{...rest}
		>
			<aside class={[ styles.drawer, props.classes?.drawer ]}>
				{props.children}
			</aside>
		</Dialog>
	);
};
