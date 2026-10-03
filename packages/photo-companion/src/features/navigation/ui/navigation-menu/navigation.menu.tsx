import { For } from "solid-js";
import { isNullable } from "utils/validators";

import { useTranslation } from "~/features/translation";
import { ROUTES, VERSION } from "~/shared/consts";
import { Button, Link, Text } from "~/shared/ui";
import { IconClose } from "~/shared/ui/icons";

import { useNavigationService } from "../../model";
import { NavigationItem } from "../navigation-item/navigation-item";

import styles from "./navigation-menu.module.css";

const classes = {
	link: styles.link
};

interface Props {
	onClose: VoidFunction;
}

export function NavigationMenu(props: Props) {
	const { t } = useTranslation();
	const { getNavigationMenuItems } = useNavigationService();

	const handleMenuItemClick = (e: MouseEvent) => {
		const target = e.target as HTMLElement;

		if (!isNullable(target.closest("a"))) {
			props.onClose();
		}
	};

	return (
		<>
			<header class={styles.header}>
				<Text as="h2" variant="heading-xl">{t().LABEL.MENU}</Text>
				<Button class={styles.close} icon onClick={props.onClose} type="button">
					<IconClose />
				</Button>
			</header>
			<nav class={styles.menu} onClick={handleMenuItemClick}>
				<For each={getNavigationMenuItems()}>
					{group => (
						<section class={styles.section}>
							<For each={group}>
								{item => <NavigationItem classes={classes} {...item} />}
							</For>
						</section>
					)}
				</For>
			</nav>
			<footer class={styles.footer}>
				<dl class={styles.info}>
					<div>
						<Text as="dt" color="secondary" variant="text-s">Version:</Text>
						<Text as="dd" variant="text-s">
							<Link href={ROUTES.CHANGELOG}>
								v.{VERSION}
							</Link>
						</Text>
					</div>
					<div>
						<Text as="dt" color="secondary" variant="text-s">Commit:</Text>
						<Text as="dd" variant="text-s">
							<Link href="https://github.com/ericrovell/photo-companion/commit/__COMMIT_HASH__">
								#__COMMIT_HASH__
							</Link>
						</Text>
					</div>
				</dl>
			</footer>
		</>
	);
}
