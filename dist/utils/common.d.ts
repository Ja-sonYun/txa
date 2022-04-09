import { Types, SerializableTypes } from "./commonTypes";
export declare class FS<T extends Record<any, any>> {
    path: string;
    fs: any;
    private cache;
    constructor(path: string);
    save(data: T): void;
    load(): T | undefined;
}
export declare type ConvertedType<T> = {
    [K in keyof T]: T[K] extends Date ? string : T[K];
};
export declare type Modify<T, R> = Omit<T, keyof R> & R;
export declare const convertSerializableDict: <T>(_dict?: T | undefined) => T | undefined;
export declare const deserializeObj: (dict: Record<string, [SerializableTypes, Types]>) => Record<string, any>;
export declare const keyIsInAry: (ary: any[], key: string, val: any) => any;
