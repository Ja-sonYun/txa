// single digit
export type sd = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
// double digit
export type dd = `${sd}${sd}`;

export type UID = string;
export type CID = string;

// type of types
export type Types = "string" | "number" | "boolean" | "Date" | "array" | "Rgb";
export const TypesPack: Types[] = [
  "string",
  "number",
  "boolean",
  "Date",
  "array",
  "Rgb",
];

export type SerializableTypes =
  | string
  | number
  | boolean
  | Record<string, string | number | boolean>;

export type SerializedType<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K];
};

export type FieldsToObject<T> = {
  [K in keyof T]-?: () => T[K];
};

// zip keyof t and type represented as string variable
export type FieldsWithSerializableTypes<T> = {
  [K in keyof T]?: [T[K], Types];
};
