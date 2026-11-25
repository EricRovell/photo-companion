import { useTranslation } from "~/features/translation";
import { Button, Text } from "~/shared/ui";
import { IconChevronLeft, IconChevronRight } from "~/shared/ui/icons";

interface MoonCalendarHeaderProps {
	canGoBack: boolean;
	canGoNext: boolean;
	month: number;
	monthId: string;
	onNavigate: (amount: number) => void;
}

export function MoonCalendarHeader(props: MoonCalendarHeaderProps) {
	const { format, t } = useTranslation();

	const labels = () => t().MOON_CALENDAR;

	return (
		<>
			<Button
				appearance="ghost"
				aria-label={labels().PREVIOUS_MONTH}
				disabled={!props.canGoBack}
				icon
				onClick={() => props.onNavigate(-1)}
				title={labels().PREVIOUS_MONTH}
			>
				<IconChevronLeft aria-hidden="true" />
			</Button>
			<Text
				align="center"
				aria-live="polite"
				as="h3"
				id={props.monthId}
				variant="heading-m"
			>
				{format().monthYear(props.month)}
			</Text>
			<Button
				appearance="ghost"
				aria-label={labels().NEXT_MONTH}
				disabled={!props.canGoNext}
				icon
				onClick={() => props.onNavigate(1)}
				title={labels().NEXT_MONTH}
			>
				<IconChevronRight aria-hidden="true" />
			</Button>
		</>
	);
}
