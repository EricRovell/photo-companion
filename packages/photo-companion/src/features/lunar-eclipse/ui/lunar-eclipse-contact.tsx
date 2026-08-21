import { EclipseContact, getEclipseContactLinkTime } from "~/entities/eclipse";
import { LinkQuery } from "~/features/navigation";
import { useTranslation } from "~/features/translation";
import { createQueryDate } from "~/shared/lib/query-date";

import type { LunarEclipseContactProps } from "../types";

export function LunarEclipseContact(props: LunarEclipseContactProps) {
	const { format, t } = useTranslation();

	const altitude = () => format().degrees(props.contact.moonAltitude);

	const query = () => new URLSearchParams({
		datetime: createQueryDate(getEclipseContactLinkTime(props.contact.time, props.position))
	});

	return (
		<EclipseContact
			detail={altitude()}
			label={props.code === undefined ? props.label : `${props.label} (${props.code})`}
			note={props.contact.visible ? undefined : t().LUNAR_ECLIPSE.BELOW_HORIZON}
			peak={props.position === "peak"}
			visible={props.contact.visible}
		>
			<LinkQuery href="/moon" noScroll query={query()}>
				<time datetime={props.contact.time.toISOString()}>{format().time(props.contact.time)}</time>
			</LinkQuery>
		</EclipseContact>
	);
}
