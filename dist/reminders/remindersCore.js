"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessReminderOsascript = void 0;
require("@jxa/global-type");
const run_1 = require("@jxa/run");
const common_1 = require("../utils/common");
const remindersType_1 = require("./remindersType");
const accessReminderOsascript = async (action, param) => {
    const _that = {
        action: action,
        param: param,
        typemap: {
            reminder_list: remindersType_1.RemindersListSerializableTypeMap,
            reminder_todo: remindersType_1.RemindersTodoSerializableTypeMap,
        },
    };
    const [result, is_obj = false, is_ary = false] = await (0, run_1.run)((that) => {
        var _a, _b, _c, _d;
        const zipObject = (requested_fields, obj, props_type) => {
            const buffer = {};
            if (obj === undefined) {
                return buffer;
            }
            requested_fields.forEach((key) => {
                buffer[key] = [obj[key](), props_type[key]];
            });
            return buffer;
        };
        const Reminders = Application("Reminders");
        const get_under_reminders = (arg) => {
            const reminders_obj = Reminders[arg];
            const reminders_ary = Array.apply(null, reminders_obj);
            return reminders_ary;
        };
        const get_under_reminders_list = (list_name) => {
            const reminders_list_obj = Reminders.lists[list_name].reminders;
            const reminders_list_ary = Array.apply(null, reminders_list_obj);
            return reminders_list_ary;
        };
        switch (that.action) {
            case "get_list_names": {
                const reminders_ary_gln = get_under_reminders("lists");
                const buff = [];
                for (let i = 0; i < reminders_ary_gln.length; i++) {
                    if (reminders_ary_gln[i] === undefined)
                        break;
                    buff.push(reminders_ary_gln[i].name());
                }
                return [buff, false, true];
            }
            case "get_list_by_key":
                const param_glbk = that.param;
                return [
                    zipObject(param_glbk.request_field, Reminders.lists[param_glbk.value], that.typemap.reminder_list),
                    true,
                    false,
                ];
            case "get_todo_by_key":
                const param_gtbk = that.param;
                const reminders_list_obj_gtbk = Reminders.lists[param_gtbk.list_name].reminders;
                const todoObj = (() => {
                    switch (param_gtbk.key) {
                        case "id":
                            return reminders_list_obj_gtbk.byId(param_gtbk.value);
                        case "name":
                            return reminders_list_obj_gtbk[param_gtbk.value];
                    }
                })();
                return [
                    zipObject(param_gtbk.request_field, todoObj, that.typemap.reminder_todo),
                    true,
                    false,
                ];
            case "get_todos_by_list_name":
                const param_gtbln = that.param;
                const reminders_list_ary_gtbln = get_under_reminders_list(param_gtbln.list_name);
                const buffer = [];
                const max_size = param_gtbln.max_size
                    ? param_gtbln.max_size < reminders_list_ary_gtbln.length
                        ? param_gtbln.max_size
                        : reminders_list_ary_gtbln.length
                    : reminders_list_ary_gtbln.length;
                for (let i = 0; i < max_size; i++) {
                    if (reminders_list_ary_gtbln[i] === undefined)
                        break;
                    const todoObj = reminders_list_ary_gtbln[i];
                    buffer.push(zipObject(param_gtbln.request_field, todoObj, that.typemap.reminder_todo));
                }
                return [buffer, true, true];
            case "create_new_todo":
                const param_cnt = that.param;
                const entry = {
                    name: param_cnt.name,
                    body: (_a = param_cnt.body) !== null && _a !== void 0 ? _a : "",
                    dueDate: param_cnt.dueDate ? new Date(param_cnt.dueDate) : undefined,
                    completed: (_b = param_cnt.completed) !== null && _b !== void 0 ? _b : false,
                    priority: (_c = param_cnt.priority) !== null && _c !== void 0 ? _c : 0,
                    flagged: (_d = param_cnt.flagged) !== null && _d !== void 0 ? _d : false,
                };
                const id = Reminders.lists[param_cnt.list_name].reminders.push(Reminders.Reminder(entry));
                return [id, false, false];
            case "update_existing_todo":
                const param_uet = that.param;
                const reminders_list_obj = Reminders.lists[param_uet.list_name].reminders;
                console.log(param_uet.select_by_id);
                const todo = reminders_list_obj.byId(param_uet.select_by_id);
                console.log("1");
                const update_query = param_uet;
                console.log("1");
                delete update_query.select_by_id;
                console.log("1");
                delete update_query.list_name;
                console.log("2");
                console.log(update_query);
                let result = false;
                try {
                    for (const [key, value] of Object.entries(update_query)) {
                        todo[key] = value;
                    }
                    result = true;
                }
                finally {
                    return [result, false, false];
                }
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
exports.accessReminderOsascript = accessReminderOsascript;
//# sourceMappingURL=remindersCore.js.map