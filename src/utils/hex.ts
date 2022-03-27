// single hex
type partial_hex =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F";
export type Hex = `${partial_hex}${partial_hex}`;

export type RgbColor = [Hex, Hex, Hex];

export class Rgb {
  rgbHex: RgbColor | string;

  constructor(rgbHex: string);
  constructor(rgbHex: RgbColor);
  constructor(key: RgbColor | string) {
    this.rgbHex = key;
  }

  // serialize(): string {
  //   return `#${this.rgbHex.join("")}`;
  // }
}
