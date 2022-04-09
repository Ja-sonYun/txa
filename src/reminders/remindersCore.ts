import "@jxa/global-type";
import { run } from "@jxa/run";
import { UpdateExistingEventProps } from "../calendars/calendarsCoreType";
import { CalendarSerializableTypeMap } from "../calendars/calendarsType";
import { convertSerializableDict, deserializeObj } from "../utils/common";
import {
  Types,
  SerializedType,
  FieldsWithSerializableTypes,
} from "../utils/commonTypes";
import {
  AllOsascriptRemindersAction,
  GetListNamesProps,
  GetListByKeyProps,
  OsascriptRemindersActionType,
  OsascriptRemindersReturnType,
  GetTodoByKeyProps,
  GetTodosByListName,
  UpdateExistingTodoProps,
  CreateNewTodoProps,
} from "./remindersCoreType";
import {
  RemindersListObject,
  RemindersListFields,
  RemindersTodoFields,
  RemindersTodoObject,
  RemindersListSerializableTypeMap,
  RemindersTodoSerializableTypeMap,
  NewRemindersTodoFields,
} from "./remindersType";

export const accessReminderOsascript = async <
  T extends AllOsascriptRemindersAction
>(
  action: T,
  param: OsascriptRemindersActionType<T>
): Promise<OsascriptRemindersReturnType<T>> => {
  const _that = {
    action: action,
    param: param,
    typemap: {
      reminder_list: RemindersListSerializableTypeMap,
      reminder_todo: RemindersTodoSerializableTypeMap,
    },
  };
  const [result, is_obj = false, is_ary = false] = await run<
    [OsascriptRemindersReturnType<T>, boolean]
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

    const Reminders = Application("Reminders");
    const get_under_reminders = (arg: "lists" | "reminders") => {
      const reminders_obj = Reminders[arg];
      const reminders_ary: Array<RemindersListObject> = Array.apply(
        null,
        reminders_obj
      ) as any;
      return reminders_ary;
    };
    const get_under_reminders_list = (list_name: string) => {
      const reminders_list_obj = Reminders.lists[list_name].reminders;
      const reminders_list_ary: Array<RemindersTodoObject> = Array.apply(
        null,
        reminders_list_obj
      ) as any;
      return reminders_list_ary;
    };

    switch (that.action) {
      case "get_list_names": {
        const reminders_ary_gln = get_under_reminders("lists");
        const buff: Array<string> = [];
        for (let i = 0; i < reminders_ary_gln.length; i++) {
          if (reminders_ary_gln[i] === undefined) break;
          buff.push(reminders_ary_gln[i].name());
        }
        return [buff, false, true];
      }
      case "get_list_by_key":
        const param_glbk = that.param as GetListByKeyProps;
        return [
          zipObject<RemindersListFields, RemindersListObject>(
            param_glbk.request_field,
            Reminders.lists[param_glbk.value],
            that.typemap.reminder_list
          ),
          true,
          false,
        ];
      case "get_todo_by_key":
        const param_gtbk = that.param as GetTodoByKeyProps;
        const reminders_list_obj_gtbk =
          Reminders.lists[param_gtbk.list_name].reminders;
        const todoObj: RemindersTodoObject = (() => {
          switch (param_gtbk.value) {
            case "id":
              return reminders_list_obj_gtbk.byId(param_gtbk.value);
          }
        })();
        return [
          zipObject<RemindersTodoFields, RemindersTodoObject>(
            param_gtbk.request_field,
            todoObj,
            that.typemap.reminder_todo
          ),
          true,
          false,
        ];
      case "get_todos_by_list_name":
        const param_gtbln = that.param as GetTodosByListName;
        const reminders_list_ary_gtbln = get_under_reminders_list(
          param_gtbln.list_name
        );
        const buffer = [];
        const max_size = param_gtbln.max_size
          ? param_gtbln.max_size < reminders_list_ary_gtbln.length
            ? param_gtbln.max_size
            : reminders_list_ary_gtbln.length
          : reminders_list_ary_gtbln.length;
        for (let i = 0; i < max_size; i++) {
          if (reminders_list_ary_gtbln[i] === undefined) break;
          const todoObj = reminders_list_ary_gtbln[i];
          buffer.push(
            zipObject<RemindersTodoFields, RemindersTodoObject>(
              param_gtbln.request_field,
              todoObj,
              that.typemap.reminder_todo
            )
          );
        }
        return [buffer, true, true];
      case "create_new_todo":
        const param_cnt = that.param as CreateNewTodoProps;
        const entry: NewRemindersTodoFields = {
          name: param_cnt.name,
          body: param_cnt.body ?? "",
          dueDate: param_cnt.dueDate ? new Date(param_cnt.dueDate) : undefined,
          completed: param_cnt.completed ?? false,
          priority: param_cnt.priority ?? 0,
          flagged: param_cnt.flagged ?? false,
        };
        const id = Reminders.lists[param_cnt.list_name].reminders.push(
          Reminders.Reminder(entry)
        );
        return [id, false, false];
      case "update_existing_todo":
        // UPDATE_BY_ID
        const param_uet = that.param as UpdateExistingTodoProps;
        const { reminders_list_obj } =
          Reminders.lists[param_uet.list_name].reminders;
        const todo = reminders_list_obj.byId(param_uet.select_by_id);
        const update_query: Partial<UpdateExistingTodoProps> = param_uet;
        delete update_query.select_by_id;
        delete update_query.list_name;
        let result = false;
        try {
          for (const [key, value] of Object.entries(update_query)) {
            todo[key] = value;
          }
          result = true;
        } finally {
          return [result, false, false];
        }
    }
  }, _that);

  if (is_obj && is_ary) {
    return (result as any as Array<Record<string, [any, Types]>>).map((obj) => {
      return deserializeObj(obj);
    }) as OsascriptRemindersReturnType<T>;
  } else if (is_obj) {
    return deserializeObj(
      result as any as Record<string, [any, Types]>
    ) as OsascriptRemindersReturnType<T>;
  }
  return result;
};
