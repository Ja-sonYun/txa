// import "@jxa/global-type";
// import { run } from "@jxa/run";
// import { convertSerializableDict, ConvertedType } from "./utils";
// import { Years, Months, Days, Hours, Minutes } from "./types";

// type UID = string;

// type EventField =
//   | "summary"
//   | "startDate"
//   | "endDate"
//   | "url"
//   | "alldayEvent"
//   | "description"
//   | "location"
//   | "stampDate";

// interface CalendarEvent {
//   id: UID;
//   summary: string;
//   startDate: Date;
//   endDate: Date;
//   url?: string;
//   alldayEvent?: boolean;
//   description?: string;
//   location?: string;
//   stampDate: Date;
// }

// type CalendarCreateEventFields = Omit<CalendarEvent, "id" | "stampDate">;
// type CalendarUpdableEventFields = Partial<CalendarCreateEventFields>;

// interface CalendarEventObj {
//   [key: string]: any;
//   id: () => UID;
//   summary: () => string;
//   startDate: () => Date;
//   endDate: () => Date;
//   url: () => string;
//   alldayEvent: () => boolean;
//   description: () => string;
//   location: () => string;
//   stampDate: () => Date;
// }

// type OsascriptCalendarAction =
//   | "get_calendar_names"
//   | "new_event"
//   | "update_event"
//   | "find_event_by_id";

// interface NewEventParam {
//   calendar_name: string;
//   event: CalendarCreateEventFields;
// }
// interface InnerNewEventParam extends Omit<NewEventParam, "event"> {
//   event: ConvertedType<CalendarCreateEventFields>;
// }
// interface UpdateEventParam {
//   calendar_name: string;
//   event_id: UID;
//   event: CalendarUpdableEventFields;
// }
// interface InnerUpdateEventParam extends Omit<UpdateEventParam, "event"> {
//   event: ConvertedType<CalendarUpdableEventFields>;
// }
// interface FindEventByIdParam {
//   calendar_name: string;
//   event_id: UID;
//   query: EventField[];
// }

// type OsascriptActionType<T> = T extends "new_event"
//   ? NewEventParam
//   : T extends "update_event"
//   ? UpdateEventParam
//   : T extends "get_calendar_names"
//   ? undefined
//   : T extends "find_event_by_id"
//   ? FindEventByIdParam
//   : never;

// type OsascriptReturnType<T> = T extends "new_event"
//   ? UID
//   : T extends "update_event"
//   ? undefined
//   : T extends "get_calendar_names"
//   ? Array<string>
//   : T extends "find_event_by_id"
//   ? CalendarEvent
//   : never;

// export const accessCalendarOsascript = async <
//   T extends OsascriptCalendarAction
// >(
//   action: T,
//   param: OsascriptActionType<ConvertedType<T>>
// ): Promise<OsascriptReturnType<T>> => {
//   const _that = {
//     action: action,
//     param: convertSerializableDict(param),
//   };

//   return await run<OsascriptReturnType<T>>((that: typeof _that) => {
//     const calendar = Application("Calendar");
//     const newEvent = (event: ConvertedType<CalendarCreateEventFields>) => {
//       return calendar.Event({
//         summary: event.summary,
//         startDate: new Date(event.startDate),
//         endDate: new Date(event.endDate),
//         url: event.url ?? "",
//         alldayEvent: event.alldayEvent,
//         description: event.description ?? "",
//         location: event.location ?? "",
//       });
//     };

//     if (that.action === "get_calendar_names") {
//       const cs = calendar.calendars;
//       const buf: string[] = [];
//       for (let i = 0; i < cs.length; i++) {
//         buf.push(cs[i].name());
//       }
//       return buf;
//     } else if (that.action === "new_event") {
//       const param = that.param as unknown as InnerNewEventParam;
//       const event = newEvent(param.event);
//       calendar.calendars
//         .whose({
//           name: param.calendar_name,
//         })[0]
//         .events.push(event);
//       return event.id();
//     } else if (that.action === "update_event") {
//       const param = that.param as unknown as InnerUpdateEventParam;
//       const event: CalendarEventObj = calendar.calendars
//         .whose({
//           name: param.calendar_name,
//         })[0]
//         .events.byId(param.event_id);
//       for (const [key, value] of Object.entries(param.event)) {
//         event[key] = value;
//       }
//     } else if (that.action === "find_event_by_id") {
//       const param = that.param as unknown as FindEventByIdParam;
//       const event: CalendarEventObj = calendar.calendars
//         .whose({
//           name: param.calendar_name,
//         })[0]
//         .events.byId(param.event_id);
//       const buf: { [key: string]: any } = {};
//       param.query.forEach((field) => {
//         return (buf[field] = event[field]());
//       });
//       return buf;
//     }
//   }, _that);
// };

// class Event {
//   id?: UID;
//   summary?: string;
//   startDate?: Date;
//   endDate?: Date;
//   url?: string;
//   alldayEvent: boolean = false;
//   description?: string;
//   location?: string;
//   stampDate?: Date;
//   container: Calendar;

//   constructor(container: Calendar) {
//     this.container = container;
//   }

//   set event(event: Partial<CalendarEvent>) {
//     const that = this as Record<string, unknown>;
//     for (const [key, value] of Object.entries(event)) {
//       that[key] = value;
//     }
//   }

//   get event(): Partial<CalendarEvent> {
//     return {
//       id: this.id,
//       summary: this.summary,
//       startDate: this.startDate,
//       endDate: this.endDate,
//       url: this.url,
//       alldayEvent: this.alldayEvent,
//       description: this.description,
//       location: this.location,
//       stampDate: this.stampDate,
//     };
//   }

//   checkDuplicate() {}

//   get is_created(): boolean {
//     return this.id !== undefined;
//   }

//   from(date: Date): Omit<Event, "from" | "save" | "update">;
//   from(date: string): Omit<Event, "from" | "save" | "update">;
//   from(
//     hours_or_date: Hours | Date | string,
//     min?: Minutes,
//     day?: Days,
//     months?: Months,
//     year?: Years
//   ): Omit<Event, "from" | "save" | "update"> {
//     if (typeof hours_or_date === "string") {
//       this.startDate = new Date(hours_or_date);
//     } else if (hours_or_date instanceof Date) {
//       this.startDate = hours_or_date;
//     } else {
//       this.startDate = new Date(
//         year ?? new Date().getFullYear(),
//         months ?? new Date().getMonth(),
//         day ?? new Date().getDate(),
//         hours_or_date,
//         min ?? new Date().getMinutes(),
//         0,
//         0
//       );
//     }
//     return this;
//   }

//   to(date: Date): Omit<Event, "from" | "to" | "until" | "update">;
//   to(date: string): Omit<Event, "from" | "to" | "until" | "update">;
//   to(
//     hours: Hours | Date | string,
//     min: Minutes = 0,
//     day: Days = new Date().getDate() as Days,
//     months: Months = new Date().getMonth() as Months,
//     year: Years = new Date().getFullYear() as Years
//   ): Omit<Event, "from" | "to" | "until" | "update"> {
//     if (this.startDate) {
//       if (typeof hours === "string") {
//         this.endDate = new Date(hours);
//       } else if (hours instanceof Date) {
//         this.endDate = hours;
//       } else {
//         this.endDate = new Date(year, months, day, hours, min, 0, 0);
//         if (this.startDate > this.endDate) {
//           throw new Error("startDate is after endDate");
//         }
//       }
//       return this;
//     }
//     throw new Error("startDate is not set");
//   }

//   until(
//     hours: number,
//     min: Minutes = 0,
//     day: number = 0
//   ): Omit<Event, "from" | "to" | "until" | "update"> {
//     if (this.startDate) {
//       this.endDate = new Date(
//         this.startDate.getFullYear(),
//         this.startDate.getMonth(),
//         this.startDate.getDate() + day,
//         hours,
//         min,
//         0,
//         0
//       );
//       if (this.startDate > this.endDate) {
//         throw new Error("startDate is after endDate");
//       }
//       return this;
//     }
//     throw new Error("startDate is not set");
//   }

//   all_day(): Omit<Event, "from" | "to" | "until" | "update" | "all_day"> {
//     if (this.startDate) {
//       this.endDate = this.startDate;
//       this.alldayEvent = true;
//       return this;
//     }
//     throw new Error("start date is not set");
//   }

//   async update(event: CalendarUpdableEventFields): Promise<boolean> {
//     if (this.id) {
//       await accessCalendarOsascript("update_event", {
//         calendar_name: this.container.name,
//         event_id: this.id,
//         event: event,
//       });
//       return true;
//     }
//     return false;
//   }

//   async save(): Promise<UID | undefined> {
//     if (
//       this.endDate !== undefined &&
//       this.startDate !== undefined &&
//       this.summary !== undefined &&
//       this.alldayEvent !== undefined &&
//       this.id === undefined
//     ) {
//       const id = await accessCalendarOsascript("new_event", {
//         calendar_name: this.container.name,
//         event: this as CalendarCreateEventFields,
//       });
//       this.id = id;
//       return id;
//     }
//   }
// }

// class Calendar {
//   name: string;
//   constructor(name: string) {
//     this.name = name;
//   }

//   newEvent(
//     event: Omit<
//       CalendarCreateEventFields,
//       "startDate" | "endDate" | "alldayEvent"
//     >
//   ): Omit<Event, "save" | "to" | "all_day" | "until" | "update"> {
//     const new_event = new Event(this);
//     new_event.event = event;
//     return new_event;
//   }

//   async findEventById(
//     id: UID,
//     query: EventField[] = ["summary"]
//   ): Promise<Event | undefined> {
//     const event = await accessCalendarOsascript("find_event_by_id", {
//       calendar_name: this.name,
//       event_id: id,
//       query: query,
//     });
//     if (event) {
//       const new_event = new Event(this);
//       new_event.id = id;
//       new_event.event = event;
//       return new_event;
//     }
//   }

//   async newEventFrom(event: CalendarCreateEventFields): Promise<Event> {
//     const new_event = new Event(this);
//     new_event.event.id = await accessCalendarOsascript("new_event", {
//       calendar_name: this.name,
//       event: event,
//     });
//     new_event.event = event;
//     return new_event;
//   }
// }

// export class Calendars {
//   async getCalendarNames(): Promise<Array<string>> {
//     return await accessCalendarOsascript("get_calendar_names", undefined);
//   }

//   name(name: string) {
//     return new Calendar(name);
//   }
// }
