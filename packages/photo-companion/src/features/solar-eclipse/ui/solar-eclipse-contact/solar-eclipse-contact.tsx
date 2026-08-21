import { EclipseContact } from "~/entities/eclipse";
import { LinkQuery } from "~/features/navigation";
import { useTranslation } from "~/features/translation";
import { createQueryDate } from "~/shared/lib/query-date";

import { getSolarEclipseContactLinkTime } from "../../lib";

import type { SolarEclipseContactProps } from "../../model";

export function SolarEclipseContact(props: SolarEclipseContactProps) {
	const { format, t } = useTranslation();
	const query = () => new URLSearchParams({
		datetime: createQueryDate(getSolarEclipseContactLinkTime(props.contact.time, props.position))
	});

	return (
		<EclipseContact
			label={props.label}
			note={props.contact.visible ? undefined : t().SOLAR_ECLIPSE.BELOW_HORIZON}
			peak={props.position === "peak"}
			visible={props.contact.visible}
		>
			<LinkQuery href="/sun" noScroll query={query()}>
				<time datetime={props.contact.time.toISOString()}>{format().time(props.contact.time)}</time>
			</LinkQuery>
		</EclipseContact>
	);
}
