import { useLocation } from "@solidjs/router";
import { createMemo } from "solid-js";
import { isNonEmptyString } from "utils/validators";

import { useTranslation } from "~/features/translation";

import { PAGE_META as PAGE_META_EN } from "../consts/page-meta.en";
import { PAGE_META as PAGE_META_RU } from "../consts/page-meta.ru";

import type { ROUTE_VALUE } from "~/features/navigation";

export function formatTitle(title: MaybeArray<string>, separator = " | "): string {
	return isNonEmptyString(title)
		? title
		: title.join(separator);
}

export function useMetaData() {
	const location = useLocation();
	const { lang } = useTranslation();

	const getPathname = createMemo(() => location.pathname as ROUTE_VALUE);
	const dict = createMemo(() => lang() === "en" ? PAGE_META_EN : PAGE_META_RU);

	// any unknown route means 404
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	const meta = createMemo(() => dict()[getPathname()] ?? dict()["/404"]);

	return meta;
}
