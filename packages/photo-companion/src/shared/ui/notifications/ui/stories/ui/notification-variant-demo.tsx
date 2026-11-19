import { For, onCleanup, untrack } from "solid-js";

import { Button } from "../../../../button/button";
import { createNotifications, Notifications } from "../../../index";
import { NOTIFICATIONS_STORY_CONFIG } from "../consts";

import type { NotificationVariant } from "../../../index";
import type { NotificationVariantDemoProps } from "../types";

export function NotificationVariantDemo(props: NotificationVariantDemoProps) {
	const center = createNotifications();
	const variants = untrack(() => props.variant ? [ props.variant ] : NOTIFICATIONS_STORY_CONFIG.defaultVariants);

	const show = (variant: NotificationVariant) => {
		const { description, title } = NOTIFICATIONS_STORY_CONFIG.variants[variant];
		center.show({
			description,
			duration: Infinity,
			title,
			variant
		});
	};

	const reset = () => {
		center.clear();
		for (const variant of [ ...variants ].reverse()) {
			show(variant);
		}
	};

	reset();

	onCleanup(() => center.clear());

	return (
		<div class="storybook-stack" style={{ width: "100%" }}>
			<div
				class="storybook-row"
				style={{ "justify-content": "flex-start" }}
			>
				<For each={variants}>
					{variant => <Button appearance="outline" onClick={() => show(variant)}>
						Add {NOTIFICATIONS_STORY_CONFIG.variants[variant].label.toLowerCase()}
					</Button>}
				</For>
				<Button appearance="ghost" onClick={reset}>Reset</Button>
				<Button appearance="ghost" onClick={() => center.clear()}>
					Dismiss all
				</Button>
			</div>
			<div
				style={{
					...NOTIFICATIONS_STORY_CONFIG.stageStyle,
					"min-height": variants.length > 1 ? "800px" : "260px"
				}}
			>
				<Notifications
					center={center}
					contained
					expanded={variants.length > 1}
					position="top-center"
					visibleCount={Math.max(3, variants.length)}
				/>
			</div>
		</div>
	);
}
