import "@jxa/global-type";
import { run } from "@jxa/run";
import { convertSerializableDict, deserializeObj } from "../utils/common";
import {
  Types,
  SerializedType,
  FieldsWithSerializableTypes,
} from "../utils/commonTypes";
import { Rgb } from "../utils/hex";
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
import {
  CalendarEventFields,
  CalendarEventObject,
  CalendarEventSerializableTypeMap,
  CalendarFields,
  CalendarObject,
  CalendarSerializableTypeMap,
  NewCalendarEventFields,
} from "./calendarsType";

/*
 * asd
 */
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
    const zipObject = <T, O extends Record<keyof T, any>>(
      requested_fields: Array<keyof T>,
      obj: O,
      props_type: Record<keyof T, Types>
    ): FieldsWithSerializableTypes<T> => {
      const buffer: FieldsWithSerializableTypes<T> = {};
      requested_fields.forEach((key) => {
        buffer[key] = [obj[key](), props_type[key]];
      });
      return buffer;
    };

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
        const foundedCalendar_gcbk: CalendarObject = (() => {
          switch (param_gcbk.key) {
            // case "cid":
            //   return Calendars.byId[param_gcbk.value];
            case "name":
              return Calendars.byName(param_gcbk.value);
          }
        })();
        // TODO: currently didn't consider the calendars that have duplicated name
        return [
          zipObject<CalendarFields, CalendarObject>(
            param_gcbk.request_field,
            foundedCalendar_gcbk,
            CalendarSerializableTypeMap
          ),
          true,
        ];
      // Calendar
      case "create_new_calendar":
        // TODO: not working yet
        const param_cnc = that.param as CreateNewCalendarProps;
        const newCalendarInfo: CreateNewCalendarProps = {
          name: param_cnc.name,
          color: param_cnc.color ?? ("(0, 0, 0)" as unknown as Rgb),
          description: param_cnc.description ?? undefined,
          writable: param_cnc.writable ?? true,
        };
        const result = Calendar.Calendar(newCalendarInfo);
        return [result, true];
      case "get_events_by_key":
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
            case "startDate":
              const key: {
                startDate: { _greaterThan: Date };
                endDate?: { _lessThanEquals: Date };
              } = {
                startDate: { _greaterThan: new Date(param_gebk.value) },
              };
              if (param_gebk.until) {
                key["endDate"] = {
                  _lessThanEquals: new Date(param_gebk.until),
                };
              }
              return fromCalendar_gebk.events.whose(key);
          }
        })();
        const buf: any = [];
        let max_size = param_gebk.key === "uid" ? 1 : foundedEvent.length;
        if (param_gebk.max_size && max_size > param_gebk.max_size) {
          max_size = param_gebk.max_size;
        }
        for (let i = 0; i < max_size; i++) {
          const event: CalendarEventObject =
            param_gebk.key === "uid" ? foundedEvent : foundedEvent[i];
          const zippedObject = zipObject<
            CalendarEventFields,
            CalendarEventObject
          >(param_gebk.request_field, event, CalendarEventSerializableTypeMap);
          buf.push(zippedObject);
        }
        return [buf, true, true];
      // CalendarEvent
      case "create_new_event":
        const param_cne = that.param as SerializedType<CreateNewEventProps>;
        const newEventInfo: NewCalendarEventFields = {
          startDate: new Date(param_cne.startDate),
          endDate: new Date(param_cne.endDate),
          summary: param_cne.summary,
          description: param_cne.description ?? "",
          location: param_cne.location ?? "",
          alldayEvent: param_cne.alldayEvent,
          url: param_cne.url ?? "",
        };
        const newEvent = Calendar.Event(newEventInfo);
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
