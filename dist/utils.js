"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSerializableDict = exports.FS = void 0;
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
//# sourceMappingURL=utils.js.map