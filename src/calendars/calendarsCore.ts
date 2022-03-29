import "@jxa/global-type";
import { run } from "@jxa/run";
import { convertSerializableDict, deserializeObj } from "../utils/common";
import { Types, SerializedType } from "../utils/commonTypes";
import {
  AllOsascriptCalendarsAction,
  OsascriptCalendarReturnType,
  OsascriptCalendarPropsType,
  GetCalendarByKeyProps,
  CreateNewCalendarProps,
  GetEventByKeyProps,
  CreateNewEventProps,
  UpdateExistingEventProps,
  DeleteExistingEventProps,
} from "./calendarsCoreType";

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
  const [result, is_obj = false, is_ary = false] = await run<
    [OsascriptCalendarReturnType<T>, boolean]
  >((that: typeof _that) => {
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
        return [buffer];
      case "get_calendar_by_key":
        const param_gcbk = that.param as GetCalendarByKeyProps;
        const foundedCalendar_gcbk = (() => {
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
            name: param_gcbk.required_keys.includes("name")
              ? [foundedCalendar_gcbk.name(), "string"]
              : undefined,
            color: param_gcbk.required_keys.includes("color")
              ? [foundedCalendar_gcbk.color(), "Rgb"]
              : undefined,
            writable: param_gcbk.required_keys.includes("writable")
              ? [foundedCalendar_gcbk.writable(), "boolean"]
              : undefined,
            description: param_gcbk.required_keys.includes("description")
              ? [foundedCalendar_gcbk.description(), "string"]
              : undefined,
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
        return [result, true];
      case "get_event_by_key":
        const param_gebk = that.param as GetEventByKeyProps;
        const fromCalendar_gebk = Calendars.byName(param_gebk.calendar_name);
        const foundedEvent = (() => {
          switch (param_gebk.key) {
            case "uid":
              return fromCalendar_gebk.events.byId(param_gebk.value);
            case "summary":
              return fromCalendar_gebk.events.whose({
                summary: param_gebk.value,
              });
            // TODO: implement below
            // case "startDate":
            //   return Calendar.eventsFrom(param_gebk.value).first;
            // case "endDate":
            //   return Calendar.eventsTo(param_gebk.value).first;
          }
        })();
        const buf = [];
        for (let i = 0; i < foundedEvent.length; i++) {
          const event = foundedEvent[i];
          buf.push({
            uid: param_gebk.required_keys.includes("uid")
              ? [event.uid(), "string"]
              : undefined,
            summary: param_gebk.required_keys.includes("summary")
              ? [event.summary(), "string"]
              : undefined,
            startDate: param_gebk.required_keys.includes("startDate")
              ? [event.startDate(), "Date"]
              : undefined,
            endDate: param_gebk.required_keys.includes("endDate")
              ? [event.endDate(), "Date"]
              : undefined,
            description: param_gebk.required_keys.includes("description")
              ? [event.description(), "string"]
              : undefined,
            location: param_gebk.required_keys.includes("location")
              ? [event.location(), "string"]
              : undefined,
            alldayEvent: param_gebk.required_keys.includes("alldayEvent")
              ? [event.alldayEvent(), "boolean"]
              : undefined,
          });
        }
        return [buf, true, true];
      // CalendarEvent
      case "create_new_event":
        const param_cne = that.param as SerializedType<CreateNewEventProps>;
        const newEvent = Calendar.Event({
          startDate: new Date(param_cne.startDate),
          endDate: new Date(param_cne.endDate),
          summary: param_cne.summary,
          description: param_cne.description ?? "",
          location: param_cne.location ?? "",
          alldayEvent: param_cne.alldayEvent,
          url: param_cne.url ?? "",
        });
        Calendars.byName(param_cne.calendar_name).events.push(newEvent);
        return [newEvent.id()];
      case "update_existing_event":
        const param_uee =
          that.param as SerializedType<UpdateExistingEventProps>;
        const event_uee = Calendars.byName(param_uee.calendar_name).events.byId(
          param_uee.select_by_uid
        );
        for (const [key, value] of Object.entries(param_uee)) {
          if (key == "calendar_name" || key == "select_by_uid") {
            continue;
          }
          event_uee[key] = value;
        }
        return [true];
      case "delete_existing_event":
        const param_dee =
          that.param as SerializedType<DeleteExistingEventProps>;
        Calendars.byName(param_dee.calendar_name)
          .events.byId(param_dee.select_by_uid)
          .delete();
        return [true];
    }
  }, _that);

  if (is_obj && is_ary) {
    return (result as any as Array<Record<string, [any, Types]>>).map((obj) => {
      return deserializeObj(obj);
    }) as OsascriptCalendarReturnType<T>;
  } else if (is_obj) {
    return deserializeObj(
      result as any as Record<string, [any, Types]>
    ) as OsascriptCalendarReturnType<T>;
  }
  return result;
};
