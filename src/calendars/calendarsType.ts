import { UID, CID } from "../utils/commonTypes";
import { Rgb } from "../utils/hex";

export type CalendarStatus = "cancelled" | "confirmed" | "none" | "tentative";

// When inherit existing calendar
export interface CalendarProps {
  name: string;
  color: Rgb;
  // calendarIdentifier: CID; // cid
  writable: boolean;
  description?: string;
}

// When creating new calendar
export interface NewCalendarProps {
  name: string;
  color?: Rgb; // TODO: default color?
  description?: string;
  writable?: boolean; // = false
}

export type ModifiedCalendarProps = Partial<NewCalendarProps>;

export interface CalendarEventProps {
  uid: UID;
  summary: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDayEvent: boolean;
  location?: string;
  url?: string;
  status: CalendarStatus; // = none
}

export interface NewCalendarEventProps {
  summary: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  allDayEvent: boolean; // = false
  location?: string;
  url?: string;
}

export type ModifableCalendarEventProps = Partial<NewCalendarEventProps>;
