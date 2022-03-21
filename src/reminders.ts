import "@jxa/global-type";
import { run } from "@jxa/run";
import { Modify } from "./utils";

type ID = string;

interface RemindersList {
  name: () => string;
}

type TodoFields =
  | "name"
  | "id"
  | "body"
  | "creationDate"
  | "dueDate"
  | "completed"
  | "completionDate"
  | "modificationDate"
  | "priority"
  | "flagged";

interface RemindersTodo {
  id: ID;
  name: string;
  body?: string;
  creationDate: Date;
  dueDate?: Date;
  modificationDate?: Date;
  completed: boolean;
  completionDate?: Date;
  priority?: number;
  flagged?: boolean;
}
type RemindersUpdatableTodoFields = Omit<
  RemindersTodo,
  "id" | "modificationDate"
>;

interface RemindersTodoObj {
  [key: string]: any;
  name: () => string;
  id: () => ID;
  body: () => string;
  creationDate: () => Date;
  dueDate: () => Date;
  modificationDate: () => Date;
  completed: () => boolean;
  completionDate: () => Date;
  priority: () => number;
  flagged: () => boolean;
}

type OsascriptReminderAction =
  | "get_list_names"
  | "get_todo_obj"
  | "search_by_id"
  | "update_by_id"
  | "search_and_update_by_id";
interface GetTodoObjParam {
  list_name: string;
  max: number;
  query: Array<TodoFields>;
}
interface SearchByIdParam {
  list_name: string;
  id: ID;
  query: Array<TodoFields>;
}
interface UpdateByIdParam {
  list_name: string;
  id: ID;
  update: RemindersUpdatableTodoFields;
}
type OsascriptActionType<T> = T extends "get_todo_obj"
  ? GetTodoObjParam
  : T extends "search_by_id"
  ? SearchByIdParam
  : T extends "get_list_names"
  ? undefined
  : T extends "update_by_id"
  ? UpdateByIdParam
  : never;
type OsascriptReturnType<T> = T extends "get_todo_obj"
  ? Array<RemindersTodo>
  : T extends "search_by_id"
  ? RemindersTodo
  : T extends "get_list_names"
  ? Array<string>
  : T extends "update_by_id"
  ? boolean
  : never;

const accessReminderOsascript = async <T extends OsascriptReminderAction>(
  action: T,
  param: OsascriptActionType<T>
): Promise<OsascriptReturnType<T>> => {
  const _that = {
    action: action,
    param: param,
  };

  return await run<OsascriptReturnType<T>>((that: typeof _that) => {
    // Internal functions
    const get_reminders_list = (list_name: string) => {
      const reminders_list_obj =
        Application("Reminders").lists[list_name].reminders;
      const reminders_list_ary: Array<RemindersTodoObj> = Array.apply(
        null,
        reminders_list_obj
      ) as any;
      return { reminders_list_obj, reminders_list_ary };
    };
    const get_reminders = (arg: "lists" | "reminders") => {
      const reminders_obj = Application("Reminders")[arg];
      const reminders_ary: Array<RemindersTodoObj> = Array.apply(
        null,
        reminders_obj
      ) as any;
      return { reminders_obj, reminders_ary };
    };
    const parse_todo_as_serializable = (
      todo: RemindersTodoObj,
      query: TodoFields[]
    ) => {
      return {
        id: todo.id(),
        name: todo.name(),
        body: query.includes("body") ? todo.body() : undefined,
        creationDate: todo.creationDate(),
        modificationDate: query.includes("modificationDate")
          ? todo.modificationDate()
          : undefined,
        dueDate: query.includes("dueDate") ? todo.dueDate() : undefined,
        completed: todo.completed(),
        completionDate: query.includes("completionDate")
          ? todo.completionDate()
          : undefined,
        priority: query.includes("priority") ? todo.priority() : undefined,
        flagged: query.includes("flagged") ? todo.flagged() : undefined,
      };
    };
    // End of internal functions

    if (that.action === "get_todo_obj") {
      // GET_TODO_OBJ
      const param = that.param as GetTodoObjParam;
      const { reminders_list_ary } = get_reminders_list(param.list_name);
      const buff: Array<RemindersTodo> = [];
      for (let i = 0; i < param.max; i++) {
        if (reminders_list_ary[i] === undefined) break;
        const todo = reminders_list_ary[i];
        buff.push(parse_todo_as_serializable(todo, param.query));
      }
      return buff;
    } else if (that.action === "search_by_id") {
      // SEARCH_BY_ID
      const param = that.param as SearchByIdParam;
      const { reminders_list_obj } = get_reminders_list(param.list_name);
      const todo = reminders_list_obj.byId(param.id);
      return parse_todo_as_serializable(todo, param.query);
    } else if (that.action === "get_list_names") {
      // GET_LIST_NAMES
      const { reminders_ary } = get_reminders("lists");
      return reminders_ary.map((item: RemindersTodoObj) => {
        return item.name();
      });
    } else if (that.action === "update_by_id") {
      // UPDATE_BY_ID
      const param = that.param as UpdateByIdParam;
      const { reminders_list_obj } = get_reminders_list(param.list_name);
      const todo = reminders_list_obj.byId(param.id);
      try {
        for (const [key, value] of Object.entries(param.update)) {
          todo[key] = value;
        }
        return true;
      } catch (e) {
        return false;
      }
    }
  }, _that);
};

class Todo {
  id: ID;
  name: string;
  body?: string;
  creationDate: Date;
  modificationDate?: Date;
  dueDate?: Date;
  completed: boolean;
  completionDate?: Date;
  priority?: number;
  flagged?: boolean;
  container: List;
  query: TodoFields[];
  constructor(todo: RemindersTodo, container: List, query: TodoFields[]) {
    this.id = todo.id;
    this.name = todo.name;
    this.body = todo.body;
    this.creationDate = todo.creationDate;
    this.modificationDate = todo.modificationDate;
    this.dueDate = todo.dueDate;
    this.completed = todo.completed;
    this.completionDate = todo.completionDate;
    this.priority = todo.priority;
    this.flagged = todo.flagged;
    this.container = container;
    this.query = query;
  }

  async update(update: RemindersUpdatableTodoFields) {
    return await accessReminderOsascript("update_by_id", {
      list_name: this.container.name,
      id: this.id,
      update: update,
    });
  }

  get container_name() {
    return this.container.name;
  }

  get is_completed() {
    return this.completed;
  }

  get has_due_date() {
    return this.dueDate !== null;
  }
}

class Todos<T extends Todo> {
  todos: Array<T>;
  query: TodoFields[];
  constructor(todos: Array<T>, query: TodoFields[]) {
    this.todos = todos;
    this.query = query;
  }

  unCompleted(): Omit<Todos<T>, "uncompleted"> {
    if (this.query.includes("completed")) {
      return new Todos(
        this.todos.filter((todo) => !todo.is_completed),
        this.query
      );
    }
    throw new Error("completed is not in query");
  }

  hasDuedate(): Omit<Todos<Modify<Todo, { dueDate: Date }>>, "hasDuedate"> {
    if (this.query.includes("dueDate")) {
      const filtered_todo: Array<Modify<Todo, { dueDate: Date }>> =
        this.todos.filter((todo) => todo.has_due_date) as any;
      return new Todos(filtered_todo, this.query);
    }
    throw new Error("dueDate is not in query");
  }
}

class List {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  async getTodoObj(query: TodoFields[] = ["name"], max: number = 25) {
    return new Todos(
      (
        await accessReminderOsascript("get_todo_obj", {
          list_name: this.name,
          max,
          query,
        })
      ).map((todo: RemindersTodo) => {
        return new Todo(todo, this, query);
      }),
      query
    );
  }

  async searchById(id: ID, query: TodoFields[] = ["name"]) {
    return new Todo(
      await accessReminderOsascript("search_by_id", {
        list_name: this.name,
        id,
        query,
      }),
      this,
      query
    );
  }
}

export class Reminders {
  async getListNames(): Promise<Array<string>> {
    return await accessReminderOsascript("get_list_names", undefined);
  }

  listName(name: string) {
    return new List(name);
  }
}
