import type { NotificationVariant } from "../types";

export const ICON_PATHS = {
	error: "M8 3H16L21 8V16L16 21H8L3 16V8Z M9 9L15 15 M15 9L9 15",
	info: "M12 17V11 M12 7H12.01 M22 12A10 10 0 1 1 2 12A10 10 0 0 1 22 12Z",
	neutral: "M18 8A6 6 0 0 0 6 8C6 15 3 15 3 17H21C21 15 18 15 18 8Z M9 21H15",
	success: "M8 12L11 15L16 9 M22 12A10 10 0 1 1 2 12A10 10 0 0 1 22 12Z",
	warning: "M12 3L22 21H2Z M12 9V13 M12 17H12.01"
} satisfies Record<NotificationVariant, string>;
