import { UID, CID, FieldsToObject, Types } from "../utils/commonTypes";
import { Rgb } from "../utils/hex";

export type CalendarStatus = "cancelled" | "confirmed" | "none" | "tentative";

// When inherit existing calendar
export interface CalendarFields {
  name: string;
  color: Rgb;
  // calendarIdentifier: CID; // cid
  writable: boolean;
  description?: string;
}

export interface CalendarObject extends FieldsToObject<CalendarFields> {}

export const CalendarSerializableTypeMap: Record<keyof CalendarFields, Types> =
  {
    name: "string",
    color: "string",
    writable: "boolean",
    description: "string",
  };

// When creating new calendar
export interface NewCalendarFields {
  name: string;
  color?: Rgb; // TODO: default color?
  description?: string;
  writable?: boolean; // = false
}

export interface ModifiedCalendarFields extends Partial<NewCalendarFields> {}

export interface CalendarEventFields {
  uid: UID;
  summary: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  alldayEvent: boolean;
  location?: string;
  url?: string;
  status: CalendarStatus; // = none
}

export const CalendarEventSerializableTypeMap: Record<
  keyof CalendarEventFields,
  Types
> = {
  uid: "string",
  summary: "string",
  description: "string",
  startDate: "Date",
  endDate: "Date",
  alldayEvent: "boolean",
  location: "string",
  url: "string",
  status: "string",
};

export interface CalendarEventObject
  extends FieldsToObject<CalendarEventFields> {}

export interface NewCalendarEventFields {
  summary: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  alldayEvent: boolean; // = false
  location?: string;
  url?: string;
}

export interface ModifableCalendarEventFields
  extends Partial<NewCalendarEventFields> {}
