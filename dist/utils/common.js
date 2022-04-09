"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyIsInAry = exports.deserializeObj = exports.convertSerializableDict = exports.FS = void 0;
const hex_1 = require("./hex");
class FS {
    constructor(path) {
        this.fs = require("fs");
        this.path = path;
    }
    save(data) {
        const stringified = JSON.stringify(data);
        if (stringified !== this.cache) {
            this.fs.writeFileSync(this.path, stringified);
            this.cache = stringified;
        }
    }
    load() {
        try {
            return JSON.parse(this.fs.readFileSync(this.path, "utf8"));
        }
        catch (err) {
            return undefined;
        }
    }
}
exports.FS = FS;
const convertSerializableDict = (_dict) => {
    if (_dict === undefined)
        return undefined;
    const dict = _dict;
    for (const [key, value] of Object.entries(dict)) {
        if (value instanceof Date) {
            dict[key] = value.toISOString();
        }
        else if (value !== null && typeof value === "object") {
            dict[key] = (0, exports.convertSerializableDict)(value);
        }
    }
    return dict;
};
exports.convertSerializableDict = convertSerializableDict;
const deserializeObj = (dict) => {
    const tempObj = {};
    for (const [key, [value, type]] of Object.entries(dict)) {
        if (type === "Date") {
            tempObj[key] = new Date(value);
        }
        else if (type === "Rgb") {
            tempObj[key] = new hex_1.Rgb(value);
        }
        else {
            tempObj[key] = value;
        }
    }
    return tempObj;
};
exports.deserializeObj = deserializeObj;
const keyIsInAry = (ary, key, val) => {
    return ary.includes(key) ? val : undefined;
};
exports.keyIsInAry = keyIsInAry;
//# sourceMappingURL=common.js.map