# WrappedOsascriptInTypescript
Wrap mac osascript of reminder and calendar in typescript

build with `npm build`  
run with `npm jxa`  

Currently, `npm jxa` will sync icloud Reminder and Calendar.  
Script will check top 5 todos from each reminder's list, and push them in to a Calendar,  
named "Todo" with due date, summary and etc.  
Pushed calendar event and checked todo's ids will be stored to tracking and use in the future for prevent duplicate events.  
  
Goal of this project is seperate jxa stuffs as the library.  
 

## API List

### Calendars
**Calendars**
 - [ ] `constructor()`
 - [ ] `getCalNames() -> Array<string>`
 - [ ] `findCalBy(key: "cid" | "name", value: string) -> Array<Calendar>`

**Calendar**
 - [ ] `constructor(name: string) // if the same name exists, throw error`
 - [ ] `constructor(calendarIdentifier: string) // overload`
 - [ ] `constructor(nameOrCid: string, color?: RgbColor, description?: string, writable?: string) // overload`
 - [ ] `getEventsObjs() -> Event`
 - [ ] `findEventBy(key: "uid" | "name" | "startDate" | "endDate", value: string | Date)`
 - [ ] `findEventBy(key: "uid", value: string) -> Event // overload`
 - [ ] `findEventBy(key: "name", value: string) -> Array<Event> // overload`
 - [ ] `findEventBy(key: "startDate" | "endDate", value: Date) -> Array<Event> // overload`

**Event**
 - constructor()
