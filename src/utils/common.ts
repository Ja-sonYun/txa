import { Types, SerializableTypes } from "./commonTypes";
import { Rgb } from "./hex";

export class FS<T extends Record<any, any>> {
  path: string;
  fs: any;
  private cache: string | undefined;
  constructor(path: string) {
    this.fs = require("fs");
    this.path = path;
  }

  save(data: T) {
    const stringified = JSON.stringify(data);
    if (stringified !== this.cache) {
      this.fs.writeFileSync(this.path, stringified);
      this.cache = stringified;
    }
  }

  load(): T | undefined {
    try {
      return JSON.parse(this.fs.readFileSync(this.path, "utf8"));
    } catch (err) {
      return undefined;
    }
  }
}

export type ConvertedType<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K];
};
export type Modify<T, R> = Omit<T, keyof R> & R;

export const convertSerializableDict = <T>(_dict?: T): T | undefined => {
  if (_dict === undefined) return undefined;
  const dict = _dict as any;
  for (const [key, value] of Object.entries(dict)) {
    if (value instanceof Date) {
      dict[key] = value.toISOString();
    } else if (value !== null && typeof value === "object") {
      dict[key] = convertSerializableDict(value);
    }
  }
  return dict;
};

export const rebuildObj = (
  dict: Record<string, [SerializableTypes, Types]>
): Record<string, any> => {
  const tempObj: Record<string, any> = {};
  for (const [key, [value, type]] of Object.entries(dict)) {
    if (type === "Date") {
      tempObj[key] = new Date(value as string);
    } else if (type === "Rgb") {
      tempObj[key] = new Rgb(value as string);
    } else {
      tempObj[key] = value;
    }
  }
  return tempObj;
};
