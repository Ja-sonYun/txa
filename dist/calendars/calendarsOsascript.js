"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessCalendarOsascript = void 0;
require("@jxa/global-type");
const run_1 = require("@jxa/run");
const common_1 = require("../utils/common");
const accessCalendarOsascript = async (action, param) => {
    const _that = {
        action: action,
        param: (0, common_1.convertSerializableDict)(param),
    };
    // type of result is 'Record<string, [any, Type]>' if isObj is true
    // convert type via 'rebuildObj()'
    const [result, isObj] = await (0, run_1.run)((that) => {
        // declare inner fuctions under here
        var _a, _b, _c;
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
                const param_gcbk = that.param;
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
                const param_cnc = that.param;
                const result = Calendar.Calendar({
                    name: param_cnc.name,
                    color: (_a = param_cnc.color) !== null && _a !== void 0 ? _a : "(0, 0, 0)",
                    description: (_b = param_cnc.description) !== null && _b !== void 0 ? _b : undefined,
                    writable: (_c = param_cnc.writable) !== null && _c !== void 0 ? _c : true,
                });
                return [result, false];
            case "get_event_by_key":
                const param_gebk = that.param;
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
                        name: [foundedEvent.id(), "string"],
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
    }, _that);
    if (isObj) {
        return (0, common_1.rebuildObj)(result);
    }
    return result;
};
exports.accessCalendarOsascript = accessCalendarOsascript;
//# sourceMappingURL=calendarsOsascript.js.map