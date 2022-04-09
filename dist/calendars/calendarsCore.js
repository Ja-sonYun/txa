"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessCalendarOsascript = void 0;
require("@jxa/global-type");
const run_1 = require("@jxa/run");
const common_1 = require("../utils/common");
const calendarsType_1 = require("./calendarsType");
/*
 * asd
 */
const accessCalendarOsascript = async (action, param) => {
    const _that = {
        action: action,
        param: (0, common_1.convertSerializableDict)(param),
    };
    // type of result is 'Record<string, [any, Type]>' if isObj is true
    // convert type via 'rebuildObj()'
    const [result, is_obj = false, is_ary = false] = await (0, run_1.run)((that) => {
        var _a, _b, _c, _d, _e, _f;
        const zipObject = (requested_fields, obj, props_type) => {
            const buffer = {};
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
                const param_gcbk = that.param;
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
                    zipObject(param_gcbk.request_field, foundedCalendar_gcbk, calendarsType_1.CalendarSerializableTypeMap),
                    true,
                ];
            // Calendar
            case "create_new_calendar":
                // TODO: not working yet
                const param_cnc = that.param;
                const newCalendarInfo = {
                    name: param_cnc.name,
                    color: (_a = param_cnc.color) !== null && _a !== void 0 ? _a : "(0, 0, 0)",
                    description: (_b = param_cnc.description) !== null && _b !== void 0 ? _b : undefined,
                    writable: (_c = param_cnc.writable) !== null && _c !== void 0 ? _c : true,
                };
                const result = Calendar.Calendar(newCalendarInfo);
                return [result, true];
            case "get_events_by_key":
                const param_gebk = that.param;
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
                            const key = {
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
                const buf = [];
                let max_size = param_gebk.key === "uid" ? 1 : foundedEvent.length;
                if (param_gebk.max_size && max_size > param_gebk.max_size) {
                    max_size = param_gebk.max_size;
                }
                for (let i = 0; i < max_size; i++) {
                    const event = param_gebk.key === "uid" ? foundedEvent : foundedEvent[i];
                    const zippedObject = zipObject(param_gebk.request_field, event, calendarsType_1.CalendarEventSerializableTypeMap);
                    buf.push(zippedObject);
                }
                return [buf, true, true];
            // CalendarEvent
            case "create_new_event":
                const param_cne = that.param;
                const newEventInfo = {
                    startDate: new Date(param_cne.startDate),
                    endDate: new Date(param_cne.endDate),
                    summary: param_cne.summary,
                    description: (_d = param_cne.description) !== null && _d !== void 0 ? _d : "",
                    location: (_e = param_cne.location) !== null && _e !== void 0 ? _e : "",
                    alldayEvent: param_cne.alldayEvent,
                    url: (_f = param_cne.url) !== null && _f !== void 0 ? _f : "",
                };
                const newEvent = Calendar.Event(newEventInfo);
                Calendars.byName(param_cne.calendar_name).events.push(newEvent);
                return [newEvent.id()];
            case "update_existing_event":
                const param_uee = that.param;
                const event_uee = Calendars.byName(param_uee.calendar_name).events.byId(param_uee.select_by_uid);
                for (const [key, value] of Object.entries(param_uee)) {
                    if (key == "calendar_name" || key == "select_by_uid") {
                        continue;
                    }
                    event_uee[key] = value;
                }
                return [true];
            case "delete_existing_event":
                const param_dee = that.param;
                Calendars.byName(param_dee.calendar_name)
                    .events.byId(param_dee.select_by_uid)
                    .delete();
                return [true];
        }
    }, _that);
    if (is_obj && is_ary) {
        return result.map((obj) => {
            return (0, common_1.deserializeObj)(obj);
        });
    }
    else if (is_obj) {
        return (0, common_1.deserializeObj)(result);
    }
    return result;
};
exports.accessCalendarOsascript = accessCalendarOsascript;
//# sourceMappingURL=calendarsCore.js.map