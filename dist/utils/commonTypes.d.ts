export declare type sd = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export declare type dd = `${sd}${sd}`;
export declare type UID = string;
export declare type CID = string;
export declare type Types = "string" | "number" | "boolean" | "Date" | "array" | "Rgb";
export declare const TypesPack: Types[];
export declare type SerializableTypes = string | number | boolean | Record<string, string | number | boolean>;
export declare type SerializedType<T> = {
    [K in keyof T]: T[K] extends Date ? string : T[K];
};
export declare type FieldsToObject<T> = {
    [K in keyof T]-?: () => T[K];
};
export declare type FieldsWithSerializableTypes<T> = {
    [K in keyof T]?: [T[K], Types];
};
//# sourceMappingURL=commonTypes.d.ts.map