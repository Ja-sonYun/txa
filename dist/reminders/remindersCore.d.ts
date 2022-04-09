import "@jxa/global-type";
import { AllOsascriptRemindersAction, OsascriptRemindersActionType, OsascriptRemindersReturnType } from "./remindersCoreType";
export declare const accessReminderOsascript: <T extends AllOsascriptRemindersAction>(action: T, param: OsascriptRemindersActionType<T>) => Promise<OsascriptRemindersReturnType<T>>;
