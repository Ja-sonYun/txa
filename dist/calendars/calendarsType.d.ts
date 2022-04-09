import { UID, FieldsToObject, Types } from "../utils/commonTypes";
import { Rgb } from "../utils/hex";
export declare type CalendarStatus = "cancelled" | "confirmed" | "none" | "tentative";
export interface CalendarFields {
    name: string;
    color: Rgb;
    writable: boolean;
    description?: string;
}
export interface CalendarObject extends FieldsToObject<CalendarFields> {
}
export declare const CalendarSerializableTypeMap: Record<keyof CalendarFields, Types>;
export interface NewCalendarFields {
    name: string;
    color?: Rgb;
    description?: string;
    writable?: boolean;
}
export interface ModifiedCalendarFields extends Partial<NewCalendarFields> {
}
export interface CalendarEventFields {
    uid: UID;
    summary: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    alldayEvent: boolean;
    location?: string;
    url?: string;
    status: CalendarStatus;
}
export declare const CalendarEventSerializableTypeMap: Record<keyof CalendarEventFields, Types>;
export interface CalendarEventObject extends FieldsToObject<CalendarEventFields> {
}
export interface NewCalendarEventFields {
    summary: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    alldayEvent: boolean;
    location?: string;
    url?: string;
}
export interface ModifableCalendarEventFields extends Partial<NewCalendarEventFields> {
}
