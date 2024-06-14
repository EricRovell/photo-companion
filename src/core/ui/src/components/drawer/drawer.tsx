import { type ParentProps, splitProps } from "solid-js";
import { classnames } from "utils";

import { Dialog } from "../dialog/dialog";

import styles from "./drawer.module.css";

interface DrawerProps extends ParentProps {
	classes?: {
		backdrop?: string;
		dialog?: string;
		drawer?: string;
	};
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
			class={classnames(styles.dialog, props.classes?.dialog)}
			classNameBackdrop={classnames(styles.backdrop, props.classes?.backdrop)}
			{...rest}
		>
			<aside class={classnames(styles.drawer, props.classes?.drawer)}>
				{props.children}
			</aside>
		</Dialog>
	);
};
