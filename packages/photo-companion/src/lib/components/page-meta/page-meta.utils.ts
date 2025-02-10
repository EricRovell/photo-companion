import { useLocation } from "@solidjs/router";
import { createMemo } from "solid-js";
import { isNonEmptyString } from "utils/validators";

import type { ROUTE_VALUE } from "~/services/navigation";

import { useTranslation } from "@lib/context/translation";

import { PAGE_META as PAGE_META_EN } from "./page-meta.en";
import { PAGE_META as PAGE_META_RU } from "./page-meta.ru";

export function formatTitle(title: MaybeArray<string>, separator = " | "): string {
	return isNonEmptyString(title)
		? title
		: title.join(separator);
}

export function useMetaData() {
	const location = useLocation();
	const getPathname = createMemo(() => location.pathname as ROUTE_VALUE);

	const { lang } = useTranslation();
	const dict = createMemo(() => lang() === "en" ? PAGE_META_EN : PAGE_META_RU);

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	const meta = createMemo(() => dict()[getPathname()] ?? dict()["/404"]);

	return meta;
}
