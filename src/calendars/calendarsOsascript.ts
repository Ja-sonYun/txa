import "@jxa/global-type";
import { run } from "@jxa/run";
import { convertSerializableDict, rebuildObj } from "../utils/common";
import { Types, UID } from "../utils/commonTypes";
import {
  CalendarEventProps,
  CalendarProps,
  ModifableCalendarEventProps,
  NewCalendarEventProps,
  NewCalendarProps,
} from "./calendarsType";

type AllOsascriptCalendarsAction =
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

interface GetCalendarNamesProps {}

type GetCalendarByKeyProps =
  // cannot find calendarIdentifer property.
  // probably it has different name
  // | { key: "cid"; value: CID }
  { key: "name"; value: string };

interface CreateNewCalendarProps extends NewCalendarProps {}

type GetEventByKeyProps =
  | {
      key: "uid";
      value: UID;
      calendar_name: string;
    }
  | {
      key: "name";
      value: string;
      calendar_name: string;
    }
  | {
      key: "startDate";
      value: Date;
      calendar_name: string;
    }
  | {
      key: "endDate";
      value: Date;
      calendar_name: string;
    };

interface CreateNewEventProps extends NewCalendarEventProps {}

interface UpdateExistingEventProps extends ModifableCalendarEventProps {}

interface DeleteExistingEventProps {
  key: "uid";
  value: UID;
}

type OsascriptCalendarPropsType<T> = T extends "get_calendar_names"
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

type OsascriptCalendarReturnType<T> = T extends "get_calendar_names"
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

export const accessCalendarOsascript = async <
  T extends AllOsascriptCalendarsAction
>(
  action: T,
  param: OsascriptCalendarPropsType<T>
): Promise<OsascriptCalendarReturnType<T>> => {
  const _that = {
    action: action,
    param: convertSerializableDict(param),
  };

  // type of result is 'Record<string, [any, Type]>' if isObj is true
  // convert type via 'rebuildObj()'
  const [result, isObj] = await run<[OsascriptCalendarReturnType<T>, boolean]>(
    (that: typeof _that) => {
      // declare inner fuctions under here

      // =================================
      const Calendar = Application("Calendar");
      const Calendars = Calendar.calendars;

      switch (that.action) {
        // Calendars
        case "get_calendar_names":
          // no paramter here
          const buffer = [];
          for (let i = 0; i < Calendars.length; i++) {
            buffer.push(Calendars[i].name());
          }
          return [buffer, false];
        case "get_calendar_by_key":
          const param_gcbk = that.param as GetCalendarByKeyProps;
          const foundedCalendar = (() => {
            switch (param_gcbk.key) {
              // case "cid":
              //   return Calendars.byId[param_gcbk.value];
              case "name":
                return Calendars.byName(param_gcbk.value);
            }
          })();
          // TODO: currently didn't consider the calendars that have duplicated name
          return [
            {
              name: [foundedCalendar.name(), "string"],
              color: [foundedCalendar.color(), "Rgb"],
              writable: [foundedCalendar.writable(), "boolean"],
              description: [foundedCalendar.description(), "string"],
            },
            true,
          ];
        // Calendar
        case "create_new_calendar":
          // TODO: not working yet
          const param_cnc = that.param as CreateNewCalendarProps;
          const result = Calendar.Calendar({
            name: param_cnc.name,
            color: param_cnc.color ?? "(0, 0, 0)",
            description: param_cnc.description ?? undefined,
            writable: param_cnc.writable ?? true,
          });
          return [result, false];
        case "get_event_by_key":
          const param_gebk = that.param as GetEventByKeyProps;
          const fromCalendar = Calendars.whose({
            name: param_gebk.calendar_name,
          })[0];
          const foundedEvent = (() => {
            switch (param_gebk.key) {
              case "uid":
                return fromCalendar.events.byId(param_gebk.value);
              case "name":
                return fromCalendar.events.whose({
                  name: param_gebk.value,
                })[0];
              // case "startDate":
              //   return Calendar.eventsFrom(param_gebk.value).first;
              // case "endDate":
              //   return Calendar.eventsTo(param_gebk.value).first;
            }
          })();
          return [
            {
              // uid: [foundedEvent.uid(), "string"],
              name: [foundedEvent.summary(), "string"],
              // startDate: [foundedEvent.startDate(), "Date"],
              // endDate: [foundedEvent.endDate(), "Date"],
              // description: [foundedEvent.description(), "string"],
              // location: [foundedEvent.location(), "string"],
              // allDay: [foundedEvent.allDay(), "boolean"],
              // calendar: [
              //   {
              //     name: [fromCalendar.name(), "string"],
              //     color: [fromCalendar.color(), "Rgb"],
              //     writable: [fromCalendar.writable(), "boolean"],
              //     description: [fromCalendar.description(), "string"],
              //   },
              //   true,
              // ],
            },
            true,
          ];
        // CalendarEvent
        case "create_new_event":
          break;
        case "update_existing_event":
          break;
        case "delete_existing_event":
          break;
      }
    },
    _that
  );

  if (isObj) {
    return rebuildObj(
      result as any as Record<string, [any, Types]>
    ) as OsascriptCalendarReturnType<T>;
  }
  return result;
};
