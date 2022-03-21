export class FS<T extends Record<any, any>> {
  path: string;
  fs: any;
  constructor(path: string) {
    this.fs = require("fs");
    this.path = path;
  }

  save(data: T) {
    console.log(JSON.stringify(data));
    this.fs.writeFileSync(this.path, JSON.stringify(data));
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
