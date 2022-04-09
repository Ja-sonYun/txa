declare type partial_hex = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "A" | "B" | "C" | "D" | "E" | "F";
export declare type Hex = `${partial_hex}${partial_hex}`;
export declare type RgbColor = [Hex, Hex, Hex];
export declare class Rgb {
    rgbHex: RgbColor | string;
    constructor(rgbHex: string);
    constructor(rgbHex: RgbColor);
}
export {};
