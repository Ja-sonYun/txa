import "@jxa/global-type";
import { UID } from "../utils/commonTypes";
import { CalendarEventFields, CalendarFields, ModifableCalendarEventFields, NewCalendarEventFields, NewCalendarFields } from "./calendarsType";
export declare type AllOsascriptCalendarsAction = "get_calendar_names" | "get_calendar_by_key" | "create_new_calendar" | "get_events_by_key" | "create_new_event" | "update_existing_event" | "delete_existing_event";
export declare type GetCalendarNamesProps = {};
export declare type GetCalendarByKeyProps = {
    key: "name";
    value: string;
    request_field: Array<keyof CalendarFields>;
};
export declare type CreateNewCalendarProps = NewCalendarFields;
export declare type GetEventByKeyProps = ({
    key: "uid";
    value: UID;
} | {
    key: "summary";
    value: string;
} | {
    key: "startDate";
    value: Date;
    until?: Date;
}) & {
    calendar_name: string;
    request_field: Array<keyof CalendarEventFields>;
    max_size?: number;
};
export declare type CreateNewEventProps = NewCalendarEventFields & {
    calendar_name: string;
};
export declare type UpdateExistingEventProps = ModifableCalendarEventFields & {
    calendar_name: string;
    select_by_uid: UID;
};
export declare type DeleteExistingEventProps = {
    calendar_name: string;
    select_by_uid: UID;
};
export declare type OsascriptCalendarPropsType<T> = T extends "get_calendar_names" ? GetCalendarNamesProps : T extends "get_calendar_by_key" ? GetCalendarByKeyProps : T extends "create_new_calendar" ? CreateNewCalendarProps : T extends "get_events_by_key" ? GetEventByKeyProps : T extends "create_new_event" ? CreateNewEventProps : T extends "update_existing_event" ? UpdateExistingEventProps : T extends "delete_existing_event" ? DeleteExistingEventProps : never;
export declare type OsascriptCalendarReturnType<T> = T extends "get_calendar_names" ? string[] : T extends "get_calendar_by_key" ? CalendarFields : T extends "create_new_calendar" ? boolean : T extends "get_events_by_key" ? CalendarEventFields[] : T extends "create_new_event" ? UID : T extends "update_existing_event" ? boolean : T extends "delete_existing_event" ? boolean : never;
//# sourceMappingURL=calendarsCoreType.d.ts.map