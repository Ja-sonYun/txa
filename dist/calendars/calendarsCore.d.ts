import "@jxa/global-type";
import { AllOsascriptCalendarsAction, OsascriptCalendarReturnType, OsascriptCalendarPropsType } from "./calendarsCoreType";
export declare const accessCalendarOsascript: <T extends AllOsascriptCalendarsAction>(action: T, param: OsascriptCalendarPropsType<T>) => Promise<OsascriptCalendarReturnType<T>>;
