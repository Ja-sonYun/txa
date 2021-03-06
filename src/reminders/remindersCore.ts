import "@jxa/global-type";
import { run } from "@jxa/run";
import { deserializeObj } from "../utils/common";
import { Types, FieldsWithSerializableTypes } from "../utils/commonTypes";
import {
  AllOsascriptRemindersAction,
  GetListByKeyProps,
  OsascriptRemindersActionType,
  OsascriptRemindersReturnType,
  GetTodoByKeyProps,
  GetTodosByListName,
  UpdateExistingTodoProps,
  CreateNewTodoProps,
  DeleteExistingTodoProps,
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

const accessReminderOsascript = async <T extends AllOsascriptRemindersAction>(
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
      if (obj === undefined) {
        return buffer;
      }
      requested_fields.forEach((key) => {
        buffer[key] = [obj[key](), props_type[key]];
      });
      return buffer;
    };

    const SystemEvents = Application("System Events");
    SystemEvents.processes.whose({ name: "Reminders" })[0].visible = false;
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
          switch (param_gtbk.key) {
            case "id":
              return reminders_list_obj_gtbk.byId(param_gtbk.value);
            case "name":
              return reminders_list_obj_gtbk[param_gtbk.value];
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
          completed: param_cnt.completed ?? false,
          priority: param_cnt.priority ?? 0,
          flagged: param_cnt.flagged ?? false,
        };
        if (param_cnt.dueDate) {
          entry.dueDate = param_cnt.dueDate;
        }
        const id = Reminders.lists[param_cnt.list_name].reminders.push(
          Reminders.Reminder(entry)
        );
        return [id, false, false];
      case "update_existing_todo":
        const param_uet = that.param as UpdateExistingTodoProps;
        const reminders_list_obj_uet =
          Reminders.lists[param_uet.list_name].reminders;
        const todo_uet = reminders_list_obj_uet.byId(param_uet.select_by_id);
        const update_query: Partial<UpdateExistingTodoProps> = param_uet;
        delete update_query.select_by_id;
        delete update_query.list_name;
        let result = false;
        try {
          for (const [key, value] of Object.entries(update_query)) {
            todo_uet[key] = value;
          }
          result = true;
        } finally {
          return [result, false, false];
        }
      case "delete_existing_todo":
        const param_det = that.param as DeleteExistingTodoProps;
        const reminders_list_obj_det =
          Reminders.lists[param_det.list_name].reminders;
        const todo_det = reminders_list_obj_det.byId(param_det.select_by_id);
        todo_det.delete();
        return [true, false, false];
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

export default accessReminderOsascript;
