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
```

# Supported Applications

## Calendars

### glue
```typescript
export const accessCalendarOsascript = async <T extends AllOsascriptCalendarsAction>(
  action: T,
  param: OsascriptCalendarPropsType<T>
): Promise<OsascriptCalendarReturnType<T>>
```

| action | parameter | return |
| ------ | --------- | ------ |
| get_calendar_names | `{ }` | `Array<string>` |
| get_calendar_by_key | `{ key, value, request_field }` | object of requested fields |
| create_new_calendar | TODO | TODO |
| get_events_by_key | `{ key, value, until?, calendar_name, request_field, max_size? }` | list of events with requested fields |
| create_new_event | calendar name and object with possible keys and values | uid of new event |
| update_existing_event | calendar name and object with possible keys and new values | boolean |
| delete_existing_event | calendar name and uid | boolean |
TODO: add alarm


## Reminders

### glue

```typescript
export const accessReminderOsascript = async <T extends AllOsascriptRemindersAction>(
  action: T,
  param: OsascriptRemindersActionType<T>
): Promise<OsascriptRemindersReturnType<T>>
```
| action | parameter | return |
| ------ | --------- | ------ |
| get_list_names | | |
| get_list_by_key | | |
| get_todos_by_key | | |
| create_new_todo | | |
| update_existing_todo | | |
| delete_existing_todo | | |


# TODO

wrap glue codes with class
