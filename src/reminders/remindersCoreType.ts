import "@jxa/global-type";
import {
  RemindersListFields,
  RemindersTodoFields,
  NewRemindersTodoFields,
  ModifiableRemindersTodoFields,
} from "./remindersType";

export type AllOsascriptRemindersAction =
  | "get_list_names"
  | "get_list_by_key"
  | "get_todo_by_key"
  | "get_todos_by_list_name"
  | "create_new_todo"
  | "update_existing_todo";
// | "delete_existing_todo";

export type GetListNamesProps = {};

export type GetListByKeyProps =
  // | {
  //     key: "id";
  //     value: string;
  //   }
  {
    key: "name";
    value: string;
  } & {
    request_field: Array<keyof RemindersListFields>;
  };

export type GetTodoByKeyProps = (
  | {
      key: "id";
      value: string;
    }
  | {
      key: "name";
      value: string;
    }
) & {
  list_name: string;
  request_field: Array<keyof RemindersTodoFields>;
  max_size?: number;
};

export type GetTodosByListName = {
  list_name: string;
  request_field: Array<keyof RemindersTodoFields>;
  max_size?: number;
};

export type CreateNewTodoProps = NewRemindersTodoFields & {
  list_name: string;
};

export type UpdateExistingTodoProps = ModifiableRemindersTodoFields & {
  list_name: string;
  select_by_id: string;
};

export type DeleteExistingTodoProps = {
  list_name: string;
  select_by_id: string;
};

export type OsascriptRemindersActionType<T> = T extends "get_list_names"
  ? GetListNamesProps
  : T extends "get_list_by_key"
  ? GetListByKeyProps
  : T extends "get_todo_by_key"
  ? GetTodoByKeyProps
  : T extends "get_todos_by_list_name"
  ? GetTodosByListName
  : T extends "create_new_todo"
  ? CreateNewTodoProps
  : T extends "update_existing_todo"
  ? UpdateExistingTodoProps
  : never;
// : T extends "delete_existing_event"
// ? DeleteExistingTodoProps

export type OsascriptRemindersReturnType<T> = T extends "get_list_names"
  ? Array<string>
  : T extends "get_list_by_key"
  ? RemindersListFields
  : T extends "get_todo_by_key"
  ? Array<RemindersTodoFields>
  : T extends "create_new_todo"
  ? string // id
  : T extends "update_existing_todo"
  ? boolean
  : never;
// : T extends "delete_existing_event"
// ? boolean
