import { For } from "solid-js";
import { Button, Link } from "ui";
import { IconClose } from "ui/icons";
import { isNullable } from "utils/validators";

import { ROUTES, VERSION } from "~/consts";
import { useNavigationService } from "~/services/navigation";
import { useTranslation } from "~/services/translation";

import { NavigationItem } from "./navigation.item";

import styles from "./navigation.menu.module.css";

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
				<h2>{t().LABEL.MENU}</h2>
				<Button icon onClick={props.onClose} type="button">
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
						<dt>Version:</dt>
						<dd>
							<Link href={ROUTES.CHANGELOG}>
								v.{VERSION}
							</Link>
						</dd>
					</div>
					<div>
						<dt>Commit:</dt>
						<dd>
							<Link href="https://github.com/ericrovell/photo-companion/commit/__COMMIT_HASH__">
								#__COMMIT_HASH__
							</Link>
						</dd>
					</div>
				</dl>
			</footer>
		</>
	);
}
