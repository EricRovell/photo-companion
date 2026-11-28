import type { useDatetime } from "./model/use-datetime";

type DatetimeState = ReturnType<typeof useDatetime>;

export interface DatetimeMock {
	useDatetime: () => { getDatetime: () => ReturnType<DatetimeState["getDatetime"]> };
}
