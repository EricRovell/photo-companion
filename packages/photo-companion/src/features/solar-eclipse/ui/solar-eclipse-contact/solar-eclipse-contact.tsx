import { Show } from "solid-js";

import { LinkQuery } from "~/features/navigation";
import { useTranslation } from "~/features/translation";
import { createQueryDate } from "~/shared/lib/query-date";

import { getSolarEclipseContactLinkTime } from "../../lib";

import type { SolarEclipseContactProps } from "../../model";

import styles from "./solar-eclipse-contact.module.css";

export function SolarEclipseContact(props: SolarEclipseContactProps) {
	const { format, t } = useTranslation();
	const query = () => new URLSearchParams({
		datetime: createQueryDate(getSolarEclipseContactLinkTime(props.contact.time, props.position))
	});

	return (
		<li
			class={styles.contact}
			data-peak={props.position === "peak" ? "" : undefined}
			data-visible={props.contact.visible ? "" : undefined}
		>
			<span aria-hidden="true" class={styles.marker} />
			<span class={styles.label}>{props.label}</span>
			<LinkQuery href="/sun" noScroll query={query()}>
				<time datetime={props.contact.time.toISOString()}>{format().time(props.contact.time)}</time>
			</LinkQuery>
			<Show when={!props.contact.visible}>
				<small class={styles.note}>{t().SOLAR_ECLIPSE.BELOW_HORIZON}</small>
			</Show>
		</li>
	);
}
