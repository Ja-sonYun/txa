![npm-publish](https://github.com/ja-sonyun/txa/actions/workflows/npm-publish-github-packages.yml/badge.svg)
![version](https://img.shields.io/badge/version-1.0.9-blue)

## My page

# TXA(Typescript for apple Automation)

Use jxa with typescript  

# Installation
```
npm install @ja-sonyun/txa
```
# Example
```typescript
import txa from "@ja-sonyun/txa"

(async () => {
  console.log(await txa.Reminders("get_list_names", {}))
})();

// txa.Reminders(action: string,  ...)
// txa.Calendars(action: string,  ...)
```

# Supported Applications

## Calendars

### glue functions

#### get_calendar_names
```typescript
await txa.Calendars("get_calendar_names", {})
// [ "Events", "Important", "Busy", ... ]
```

#### get_events_by_key
```typescript
await txa.Calendars("get_events_by_key", {
  key: "startDate", // uid, summary
  value: new Date(),
// ... until:Date if key is startDate
  calendar_name: "home",
  request_field: ["uid", "summary"], // uid, description, startDate, endDate, alldayEvent, location, url, status
  max_size: 2
})
// [ { uid: '620602C3-31E1-4A7F-96E4-44AED7015500', summary: 'new' } ]
```

#### create_new_event
```typescript
await txa.Calendars("create_new_event", {
  calendar_name: "Events",// required
  summary: "New Events",  // required
  description: "New Events",
  location: "location",
  startDate: new Date(),  // required
  endDate: new Date(),    // required
  alldayEvent: false,     // required
  // status: "none" | "confirmed" | "tentative" | "cancelled",
  // url: string,
})
// 03DEA53B-4A9A-4D3F-BC27-D78622747130
```

#### update_existing_event
```typescript
await txa.Calendars("update_existing_event", {
  calendar_name: "Events",// required
  select_by_uid: "03DEA53B-4A9A-4D3F-BC27-D78622747130",
  description: "updated descripiton",
  // summary: "updated summary",
  // location: "location",
  // startDate: new Date(),
  // endDate: new Date(),
  // alldayEvent: false,
  // status: "none" | "confirmed" | "tentative" | "cancelled",
  // url: string,
})
// true
```

#### delete_existing_event
```typescript
await txa.Calendars("delete_existing_event", {
  calendar_name: "Events",// required
  select_by_uid: "03DEA53B-4A9A-4D3F-BC27-D78622747130",
})
// true
```

## Reminders

### glue functions

#### get_list_names
```typescript
await txa.Reminders("get_list_names", {})
// [ "your", "reminder", "lists" ]
```

#### get_list_by_key
```typescript
await txa.Reminders("get_list_by_key", {
  key: "name", // or "id"
  value: "GitHub",
  request_field: ["id", "name"] // color, emblem
})
// { id: 'F677E7BC-A288-4A64-BE06-2AF0B4EC46C8', name: 'GitHub' }
```

#### get_todos_by_list_name
```typescript
await txa.Reminders("get_todos_by_list_name", {
  list_name: "GitHub",
  request_field: ["id", "name", "completed"], // body, creationDate, dueDate, modificationDate, completionDate, priority, flagged
  max_size: 2 // optional, greater value will takes more times.
})
//[
//  {
//    id: 'x-apple-reminder://712CBC5E-539A-4AA7-A9FC-659F432117DB',
//    name: 'some todo',
//    completed: false
//  },
//  {
//    id: 'x-apple-reminder://982A8652-5163-4D32-9C19-D33149A4C6B1',
//    name: 'other todo',
//    completed: true
//  }
//]
```

#### get_todo_by_key
```typescript
await txa.Reminders("get_todo_by_key", {
  key:"id",
  value: "x-apple-reminder://982A8652-5163-4D32-9C19-D33149A4C6B1",
  list_name: "GitHub",
  request_field: ["name"], // id, completed, body, creationDate, dueDate, modificationDate, completionDate, priority, flagged
})
// { name: 'other todo' }
```

#### create_new_todo
```typescript
await txa.Reminders("create_new_todo", {
  list_name: "GitHub",
  name: "Create new todo",
  dueDate: new Date(),
// ... body:string, , priority:number, flagged:boolean
})
// 7
// return value is an index
```

#### update_existing_todo
```typescript
await txa.Reminders("update_existing_todo", {
  list_name: "GitHub",
  select_by_id: "x-apple-reminder://982A8652-5163-4D32-9C19-D33149A4C6B1",
  name: "new name"
// ... dueDate:Date, body:string, , priority:number, flagged:boolean
})
// true
```

#### delete_existing_event
```typescript
await txa.Reminders("delete_existing_todo", {
  list_name: "GitHub",
  select_by_id: "x-apple-reminder://982A8652-5163-4D32-9C19-D33149A4C6B1",
})
// true
```

# TODO

wrap glue codes with class
