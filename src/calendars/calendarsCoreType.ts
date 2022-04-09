import "@jxa/global-type";
import { UID } from "../utils/commonTypes";
import {
  CalendarEventFields,
  CalendarFields,
  ModifableCalendarEventFields,
  NewCalendarEventFields,
  NewCalendarFields,
} from "./calendarsType";

export type AllOsascriptCalendarsAction =
  // Calendars
  | "get_calendar_names"
  | "get_calendar_by_key"
  // Calendar
  | "create_new_calendar"
  | "get_events_by_key"
  // CalendarEvent
  | "create_new_event"
  | "update_existing_event"
  | "delete_existing_event";

export type GetCalendarNamesProps = {};

export type GetCalendarByKeyProps =
  // cannot find calendarIdentifer property.
  // probably it has different name
  // | { key: "cid"; value: CID }
  {
    key: "name";
    value: string;
    request_field: Array<keyof CalendarFields>;
  };

export type CreateNewCalendarProps = NewCalendarFields;

export type GetEventByKeyProps = (
  | {
      key: "uid";
      value: UID;
    }
  | {
      key: "summary";
      value: string;
    }
  | {
      key: "startDate";
      value: Date;
      until?: Date;
    }
) & {
  calendar_name: string;
  request_field: Array<keyof CalendarEventFields>;
  max_size?: number;
};

export type CreateNewEventProps = NewCalendarEventFields & {
  calendar_name: string;
};

export type UpdateExistingEventProps = ModifableCalendarEventFields & {
  calendar_name: string;
  select_by_uid: UID;
};

export type DeleteExistingEventProps = {
  calendar_name: string;
  select_by_uid: UID;
};

export type OsascriptCalendarPropsType<T> = T extends "get_calendar_names"
  ? GetCalendarNamesProps
  : T extends "get_calendar_by_key"
  ? GetCalendarByKeyProps
  : T extends "create_new_calendar"
  ? CreateNewCalendarProps
  : T extends "get_events_by_key"
  ? GetEventByKeyProps
  : T extends "create_new_event"
  ? CreateNewEventProps
  : T extends "update_existing_event"
  ? UpdateExistingEventProps
  : T extends "delete_existing_event"
  ? DeleteExistingEventProps
  : never;

export type OsascriptCalendarReturnType<T> = T extends "get_calendar_names"
  ? string[]
  : T extends "get_calendar_by_key"
  ? CalendarFields
  : T extends "create_new_calendar"
  ? boolean // cid is unknown, return boolean
  : T extends "get_events_by_key"
  ? CalendarEventFields[]
  : T extends "create_new_event"
  ? UID
  : T extends "update_existing_event"
  ? boolean
  : T extends "delete_existing_event"
  ? boolean
  : never;
