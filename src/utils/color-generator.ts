export class ColorGenerator {
  private usedColors: Set<string>;
  private currentHue: number;
  private saturation: number;
  private lightness: number;
  private step: number;

  constructor(
    step: number = 137.5,
    saturation: number = 50,
    lightness: number = 50
  ) {
    this.usedColors = new Set();
    this.currentHue = 0;
    this.saturation = saturation;
    this.lightness = lightness;
    this.step = step;
  }

  private hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0,
      g = 0,
      b = 0;
    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    const rgbToHex = (r: number, g: number, b: number) => {
      const toHex = (n: number) => {
        const hex = n.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      };
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    return rgbToHex(r, g, b);
  }

  public nextColor(): string {
    let color: string;
    do {
      color = this.hslToHex(this.currentHue, this.saturation, this.lightness);
      this.currentHue = (this.currentHue + this.step) % 360;
    } while (this.usedColors.has(color));

    this.usedColors.add(color);
    return color;
  }
}
