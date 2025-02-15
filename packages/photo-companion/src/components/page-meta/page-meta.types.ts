import type { ROUTE_VALUE } from "~/services/navigation";

export interface PageMetaData {
	DESCRIPTION: string;
	KEYWORDS: string[];
	TITLE: MaybeArray<string>;
}

export type PageMetaDict = Record<ROUTE_VALUE, PageMetaData>;
