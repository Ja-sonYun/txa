import "@jxa/global-type";
// import { accessCalendarOsascript } from "./calendars/calendarsCore";
import { accessReminderOsascript } from "./reminders/remindersCore";
import { run } from "@jxa/run";

// (async () => {
//   await run(() => {
//     const Calendar = Application("Calendar").calendars;
//     const fromCalendar = Calendar.byName("Events");
//     console.log(fromCalendar.name());
//     const a = fromCalendar.events.whose({
//       summary: "NewEvent",
//     });
//     // console.log(typeof a[0]);
//     console.log(a.length);
//   });
// })();

(async () => {
  let result;
  result = await accessReminderOsascript("get_list_names", {});
  console.log(result);

  result = await accessReminderOsascript("get_list_by_key", {
    key: "name",
    value: "GitHub",
    request_field: ["id", "name", "emblem"],
  });
  console.log(result);

  result = await accessReminderOsascript("get_todos_by_list_name", {
    list_name: "GitHub",
    request_field: ["id", "name"],
    max_size: 3,
  });
  console.log(result);

  // result = await accessReminderOsascript("get_list_by_key", {
  //   key: "name",
  //   value: "GitHub",
  //   request_field: ["id", "name", "emblem"],
  // });
  // console.log(result);
})();

// (async () => {
//   let result;
//   result = await accessCalendarOsascript("get_calendar_names", {});
//   console.log(result);
//   result = await accessCalendarOsascript("get_calendar_by_key", {
//     key: "name",
//     value: "Busy",
//     request_field: ["name"],
//   });
//   console.log(result);
//   // result = await accessCalendarOsascript("create_new_calendar", {
//   //   name: "Test",
//   //   description: "Test",
//   // });
//   // console.log(result);
//   const id = await accessCalendarOsascript("create_new_event", {
//     calendar_name: "Events",
//     summary: "NewEvent",
//     startDate: new Date(),
//     endDate: new Date(),
//     alldayEvent: false,
//   });
//   console.log(id);
//   // result = await accessCalendarOsascript("get_events_by_key", {
//   //   key: "summary",
//   //   value: "NewEvent",
//   //   calendar_name: "Events",
//   //   request_field: ["uid", "summary", "startDate"],
//   // });
//   // console.log(result);
//   result = await accessCalendarOsascript("get_events_by_key", {
//     key: "uid",
//     value: id,
//     calendar_name: "Events",
//     request_field: ["uid", "summary", "startDate"],
//   });
//   console.log(result);
//   result = await accessCalendarOsascript("get_events_by_key", {
//     key: "startDate",
//     value: new Date(),
//     calendar_name: "Busy",
//     request_field: ["uid", "summary", "startDate"],
//     max_size: 2,
//   });
//   console.log(result);
//   result = await accessCalendarOsascript("update_existing_event", {
//     calendar_name: "Events",
//     select_by_uid: id,
//     summary: "updatedNewEvent",
//   });
//   console.log(result);
//   // result = await accessCalendarOsascript("delete_existing_event", {
//   //   calendar_name: "Events",
//   //   select_by_uid: id,
//   // });
// })();

//
// import "@jxa/global-type";
// import { Reminders } from "./reminders";
// import { Calendars } from "./calendar";
// import { FS } from "./utils";

// interface Logger {
//   tracked_calendar: Array<string>;
//   tracked_reminder: Array<string>;
// }

// const fs = new FS<Logger>("./last_reminders.temp");
// const logger: Logger = fs.load() || {
//   tracked_calendar: [],
//   tracked_reminder: [],
// };
// const log_pusher = (key: keyof Logger, value: string) => {
//   logger[key].push(value);
//   fs.save(logger);
// };

// (async () => {
//   const reminder_fetch_limit = 5;
//   const calendars = new Calendars();
//   const reminders = new Reminders();

//   const reminder_names = await reminders.getListNames();
//   reminder_names.forEach(async (list_name) => {
//     // check new reminders
//     const list = await reminders
//       .listName(list_name)
//       .getTodoObj(
//         ["name", "body", "flagged", "dueDate", "completed"],
//         reminder_fetch_limit
//       );
//     list
//       .unCompleted()
//       .hasDuedate()
//       .todos.forEach(async (todo) => {
//         if (!logger.tracked_reminder.includes(todo.id)) {
//           const calendar_id = await calendars
//             .name("Todo")
//             .newEvent({
//               summary: "Todo │ " + todo.name,
//               location: todo.container_name,
//               description: todo.body,
//             })
//             .from(todo.dueDate)
//             .all_day()
//             .save();
//           if (calendar_id) {
//             log_pusher("tracked_reminder", todo.id);
//             log_pusher("tracked_calendar", calendar_id);
//           }
//         }
//       });
//   });
// })();
