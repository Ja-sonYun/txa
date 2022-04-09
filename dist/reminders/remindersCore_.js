"use strict";
// import "@jxa/global-type";
// import { run } from "@jxa/run";
// import { convertSerializableDict, deserializeObj } from "../utils/common";
// import { Types, SerializedType } from "../utils/commonTypes";
// import {
//   AllOsascriptRemindersAction,
//   OsascriptActionType,
//   OsascriptReturnType,
// } from "./remindersCoreType";
// const accessReminderOsascript = async <T extends AllOsascriptRemindersAction>(
//   action: T,
//   param: OsascriptActionType<T>
// ): Promise<OsascriptReturnType<T>> => {
//   const _that = {
//     action: action,
//     param: param,
//   };
//   return await run<OsascriptReturnType<T>>((that: typeof _that) => {
//     // Internal functions
//     const get_reminders_list = (list_name: string) => {
//       const reminders_list_obj =
//         Application("Reminders").lists[list_name].reminders;
//       const reminders_list_ary: Array<RemindersTodoObj> = Array.apply(
//         null,
//         reminders_list_obj
//       ) as any;
//       return { reminders_list_obj, reminders_list_ary };
//     };
//     const get_reminders = (arg: "lists" | "reminders") => {
//       const reminders_obj = Application("Reminders")[arg];
//       const reminders_ary: Array<RemindersTodoObj> = Array.apply(
//         null,
//         reminders_obj
//       ) as any;
//       return { reminders_obj, reminders_ary };
//     };
//     const parse_todo_as_serializable = (todo: any, query: TodoFields[]) => {
//       return {
//         id: todo.id(),
//         name: todo.name(),
//         body: query.includes("body") ? todo.body() : undefined,
//         creationDate: todo.creationDate(),
//         modificationDate: query.includes("modificationDate")
//           ? todo.modificationDate()
//           : undefined,
//         dueDate: query.includes("dueDate") ? todo.dueDate() : undefined,
//         completed: todo.completed(),
//         completionDate: query.includes("completionDate")
//           ? todo.completionDate()
//           : undefined,
//         priority: query.includes("priority") ? todo.priority() : undefined,
//         flagged: query.includes("flagged") ? todo.flagged() : undefined,
//       };
//     };
//     // End of internal functions
//     if (that.action === "get_todo_obj") {
//       // GET_TODO_OBJ
//       const param = that.param as GetTodoObjParam;
//       const { reminders_list_ary } = get_reminders_list(param.list_name);
//       const buff: Array<RemindersTodo> = [];
//       for (let i = 0; i < param.max; i++) {
//         if (reminders_list_ary[i] === undefined) break;
//         const todo = reminders_list_ary[i];
//         buff.push(parse_todo_as_serializable(todo, param.query));
//       }
//       return buff;
//     } else if (that.action === "search_by_id") {
//       // SEARCH_BY_ID
//       const param = that.param as SearchByIdParam;
//       const { reminders_list_obj } = get_reminders_list(param.list_name);
//       const todo = reminders_list_obj.byId(param.id);
//       return parse_todo_as_serializable(todo, param.query);
//     } else if (that.action === "get_list_names") {
//       // GET_LIST_NAMES
//       const { reminders_ary } = get_reminders("lists");
//       return reminders_ary.map((item: RemindersTodoObj) => {
//         return item.name();
//       });
//     } else if (that.action === "update_by_id") {
//       // UPDATE_BY_ID
//       const param = that.param as UpdateByIdParam;
//       const { reminders_list_obj } = get_reminders_list(param.list_name);
//       const todo = reminders_list_obj.byId(param.id);
//       try {
//         for (const [key, value] of Object.entries(param.update)) {
//           todo[key] = value;
//         }
//         return true;
//       } catch (e) {
//         return false;
//       }
//     }
//   }, _that);
// };
//# sourceMappingURL=remindersCore_.js.map