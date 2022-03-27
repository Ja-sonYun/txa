import { accessCalendarOsascript } from "./calendars/calendarsOsascript";

(async () => {
  let result;
  // result = await accessCalendarOsascript("get_calendar_names", {});
  // console.log(result);

  // result = await accessCalendarOsascript("get_calendar_by_key", {
  //   key: "name",
  //   value: "Busy",
  // });
  // console.log(result);

  // result = await accessCalendarOsascript("create_new_calendar", {
  //   name: "Test*********",
  //   description: "Test",
  // });
  // console.log(result);

  result = await accessCalendarOsascript("get_event_by_key", {
    key: "name",
    value: "花見",
    calendar_name: "Family",
  });
  console.log(result);
})();

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
