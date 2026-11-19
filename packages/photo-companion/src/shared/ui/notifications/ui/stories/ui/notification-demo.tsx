import { Button } from "../../../../button/button";
import { Text } from "../../../../text/text";
import { Notifications } from "../../../index";
import { NOTIFICATIONS_STORY_CONFIG } from "../consts";
import { createNotificationDemo } from "../model";

import type { NotificationDemoProps } from "../types";

export function NotificationDemo(props: NotificationDemoProps) {
	const { add, addThree, center, clear, reset } = createNotificationDemo({ getMode: () => props.mode });

	return (
		<div
			style={{
				...NOTIFICATIONS_STORY_CONFIG.stageStyle,
				"padding-top": props.position?.startsWith("top") ? "340px" : "24px"
			}}
		>
			<div class="storybook-stack" style={{ width: "100%" }}>
				<Text as="h2" variant="heading-m">
					A little space for updates
				</Text>
				<Text as="p" color="secondary" variant="text-s">
					Hover or focus to spread the stack. On touch, use the stack button.
					Swipe sideways or press Escape inside a notification to dismiss it.
					Up to three cards are visible; dismiss one to reveal the next queued update.
				</Text>
				<div
					class="storybook-row"
					style={{ "justify-content": "flex-start" }}
				>
					<Button onClick={add}>Add notification</Button>
					<Button
						appearance="outline"
						onClick={addThree}
					>
						Add three
					</Button>
					<Button appearance="ghost" onClick={clear}>
						Dismiss all
					</Button>
					<Button appearance="ghost" onClick={reset}>Reset</Button>
				</div>
				{props.mode === "stack" && (
					<Button
						appearance="outline"
						onClick={() => center.update("compass", {
							description: "North is now aligned with your device.",
							title: "Compass connected",
							variant: "success"
						})}
					>
						Resolve compass error in place
					</Button>
				)}
				{props.mode === "timers" && (
					<Text as="p" color="secondary" variant="text-xs">
						The line shows time remaining. Hover, focus, drag, or switch tabs to pause it.
						Only the front card counts down while stacked; covered cards keep their remaining time.
					</Text>
				)}
			</div>
			<Notifications
				center={center}
				contained
				expanded={props.mode === "expanded"}
				position={props.position}
			/>
		</div>
	);
}
