import * as Components from "./card";

export type { CardProps } from "./card";

export const Card = Object.assign(Components.Card, {
	Header: Components.Header
});
