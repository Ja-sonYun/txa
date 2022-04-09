import { Rgb } from "../utils/hex";
import { FieldsToObject, Types } from "../utils/commonTypes";
export interface RemindersListFields {
    id: string;
    name: string;
    color: Rgb;
    emblem: string;
}
export declare const RemindersListSerializableTypeMap: Record<keyof RemindersListFields, Types>;
export interface RemindersListObject extends FieldsToObject<RemindersListFields> {
}
export interface RemindersTodoFields {
    id: string;
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
export declare const RemindersTodoSerializableTypeMap: Record<keyof RemindersTodoFields, Types>;
export interface RemindersTodoObject extends FieldsToObject<RemindersTodoFields> {
}
export interface NewRemindersTodoFields extends Omit<RemindersTodoFields, "id" | "creationDate" | "modificationDate" | "completionDate"> {
}
export interface ModifiableRemindersTodoFields extends Partial<Omit<RemindersTodoFields, "id" | "modificationDate">> {
}
//# sourceMappingURL=remindersType.d.ts.map