import { Card, Text } from "~/shared/ui";

import { useAltitudeContext } from "../model/altitude-context";

export function Header() {
	const { id, props } = useAltitudeContext();

	return (
		<Card.Header>
			<Text as="h2" id={`${id}-title`} variant="heading-l">
				{props.title}
			</Text>
		</Card.Header>
	);
}
