export type NotificationVariant = "error" | "info" | "neutral" | "success" | "warning";

type NotificationDismissReason = "action" | "dismiss" | "timeout";

type NotificationPosition =
	| "bottom-center"
	| "bottom-left"
	| "bottom-right"
	| "top-center"
	| "top-left"
	| "top-right";

interface NotificationAction {
	dismiss?: boolean;
	label: string;
	onClick: () => void;
}

interface NotificationContent {
	cleanup?: () => void;
	element: HTMLElement;
}

export interface NotificationOptions {
	action?: NotificationAction;
	content?: () => NotificationContent;
	description?: string;
	/** Milliseconds; Infinity keeps the notification until explicitly dismissed. */
	duration?: number;
	id?: string;
	onDismiss?: (reason: NotificationDismissReason) => void;
	title: string;
	variant?: NotificationVariant;
}

export interface NotificationEntry extends NotificationOptions {
	readonly id: string;
}

export interface NotificationCenter {
	clear: () => void;
	dismiss: (id: string, reason?: NotificationDismissReason) => void;
	/** Reusing an ID updates the notification in place and restarts its duration. */
	show: (options: NotificationOptions) => string;
	subscribe: (listener: (entries: readonly NotificationEntry[]) => void) => () => void;
	update: (id: string, options: Partial<Omit<NotificationOptions, "id">>) => void;
}

export interface CreateNotificationParams {
	center?: NotificationCenter;
}

type NotificationValue = false | Nullable<Omit<NotificationOptions, "id">>;

/** Pass options directly or return them reactively; falsy values dismiss. */
export type NotificationSource = (() => NotificationValue) | NotificationValue;

export interface NotificationViewportOptions {
	/** Position within a relatively positioned parent, useful for embedded previews. */
	contained?: boolean;
	dismissLabel?: string;
	duration?: number;
	expanded?: boolean;
	label?: string;
	position?: NotificationPosition;
	stackLabel?: string;
	/** Maximum visible cards (default 3).
	 * Overflow waits until a visible card is dismissed.
	*/
	visibleCount?: number;
}

export interface MountNotificationsParams {
	center: NotificationCenter;
	host: HTMLElement;
	viewportOptions?: NotificationViewportOptions;
}

export interface NotificationCard {
	content: HTMLDivElement;
	dispose: () => void;
	element: HTMLLIElement;
	readonly entry: NotificationEntry;
	isLeaving: () => boolean;
	leave: (onRemove: () => void) => void;
	pause: () => void;
	resume: () => void;
	update: (entry: NotificationEntry) => HTMLButtonElement | undefined;
}

interface NotificationElements {
	list: HTMLOListElement;
	region: HTMLElement;
	toggle: HTMLButtonElement;
}

export interface NotificationDragChange {
	dragging: boolean;
	id: string;
}

export interface CreateNotificationCardParams {
	center: NotificationCenter;
	entry: NotificationEntry;
	onDragChange: (change: NotificationDragChange) => void;
	viewportOptions: NotificationViewportOptions;
}

export interface NotificationTimerState {
	duration: number;
	remaining: number;
	running: boolean;
}

export interface CreateNotificationTimerParams {
	onChange: (state: NotificationTimerState) => void;
	onTimeout: () => void;
}

export interface CreateNotificationStackParams {
	host: HTMLElement;
	viewportOptions: NotificationViewportOptions;
}

export interface UpdateNotificationStackParams {
	cards: readonly NotificationCard[];
	expanded: boolean;
}

export interface CreateNotificationInteractionsParams {
	center: NotificationCenter;
	elements: NotificationElements;
	expanded?: boolean;
	onChange: () => void;
	onPauseChange: () => void;
}

export interface NotificationPointer {
	id: number;
	startedAt: number;
	x: number;
	y: number;
}
