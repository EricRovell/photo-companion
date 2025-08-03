import { Meta, Title } from "@solidjs/meta";

import { useTranslation } from "~/features/translation";

import { formatTitle, useMetaData } from "./page-meta.utils";

export function PageMeta() {
	const getMeta = useMetaData();
	const { lang } = useTranslation();

	return (
		<>
			<Title>{formatTitle(getMeta().TITLE)}</Title>
			<Meta name="description" content={getMeta().DESCRIPTION} />
			<Meta name="keywords" content={getMeta().KEYWORDS.join(", ")} />
			<Meta name="og:title" content={formatTitle(getMeta().TITLE)} />
			<Meta name="og:locale" content={lang()} />
			<Meta name="og:description" content={getMeta().DESCRIPTION} />
			<Meta name="twitter:title" content={formatTitle(getMeta().TITLE)} />
			<Meta name="twitter:description" content={getMeta().DESCRIPTION} />
		</>
	);
}
