import { Rgb } from "../utils/hex";
import { FieldsToObject, Types } from "../utils/commonTypes";

export interface RemindersListFields {
  id: string;
  name: string;
  color: Rgb;
  emblem: string; // icon name
}

export const RemindersListSerializableTypeMap: Record<
  keyof RemindersListFields,
  Types
> = {
  id: "string",
  name: "string",
  color: "Rgb",
  emblem: "string",
};

export interface RemindersListObject
  extends FieldsToObject<RemindersListFields> {}

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

export const RemindersTodoSerializableTypeMap: Record<
  keyof RemindersTodoFields,
  Types
> = {
  id: "string",
  name: "string",
  body: "string",
  creationDate: "Date",
  dueDate: "Date",
  modificationDate: "Date",
  completed: "boolean",
  completionDate: "Date",
  priority: "number",
  flagged: "boolean",
};

export interface RemindersTodoObject
  extends FieldsToObject<RemindersTodoFields> {}

export interface NewRemindersTodoFields
  extends Omit<
    RemindersTodoFields,
    "id" | "creationDate" | "modificationDate" | "completionDate"
  > {}

export interface ModifiableRemindersTodoFields
  extends Partial<Omit<RemindersTodoFields, "id" | "modificationDate">> {}
