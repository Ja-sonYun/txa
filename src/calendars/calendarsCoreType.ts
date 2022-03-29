import "@jxa/global-type";
import { UID } from "../utils/commonTypes";
import {
  CalendarEventProps,
  CalendarProps,
  ModifableCalendarEventProps,
  NewCalendarEventProps,
  NewCalendarProps,
} from "./calendarsType";

export type AllOsascriptCalendarsAction =
  // Calendars
  | "get_calendar_names"
  | "get_calendar_by_key"
  // Calendar
  | "create_new_calendar"
  | "get_event_by_key"
  // CalendarEvent
  | "create_new_event"
  | "update_existing_event"
  | "delete_existing_event";

export interface GetCalendarNamesProps {}

export type GetCalendarByKeyProps =
  // cannot find calendarIdentifer property.
  // probably it has different name
  // | { key: "cid"; value: CID }
  {
    key: "name";
    value: string;
    required_keys: Array<keyof CalendarProps>;
  };

export interface CreateNewCalendarProps extends NewCalendarProps {}

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
    }
  | {
      key: "endDate";
      value: Date;
    }
) & {
  calendar_name: string;
  required_keys: Array<keyof CalendarEventProps>;
};

export interface CreateNewEventProps extends NewCalendarEventProps {
  calendar_name: string;
}

export interface UpdateExistingEventProps extends ModifableCalendarEventProps {
  calendar_name: string;
  select_by_uid: UID;
}

export interface DeleteExistingEventProps {
  calendar_name: string;
  select_by_uid: UID;
}

export type OsascriptCalendarPropsType<T> = T extends "get_calendar_names"
  ? GetCalendarNamesProps
  : T extends "get_calendar_by_key"
  ? GetCalendarByKeyProps
  : T extends "create_new_calendar"
  ? CreateNewCalendarProps
  : T extends "get_event_by_key"
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
  ? CalendarProps
  : T extends "create_new_calendar"
  ? boolean // cid is unknown, return boolean
  : T extends "get_event_by_key"
  ? CalendarEventProps[]
  : T extends "create_new_event"
  ? UID
  : T extends "update_existing_event"
  ? boolean
  : T extends "delete_existing_event"
  ? boolean
  : never;
