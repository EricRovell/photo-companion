import type { Component } from "solid-js";

export interface EventComponent<Props> {
	component: Component<Props>;
	message?: string;
	props: Props;
	title: string;
	type?: "bridge" | "lights" | "moon" | "sun";
}
