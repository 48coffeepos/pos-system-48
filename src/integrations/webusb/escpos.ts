export const LF = 0x0a;

export function init(): number[] {
  return [0x1b, 0x40];
}

export function setAlign(pos: "left" | "center" | "right"): number[] {
  const map = { left: 0, center: 1, right: 2 };
  return [0x1b, 0x61, map[pos]];
}

export function setBold(on: boolean): number[] {
  return [0x1b, 0x45, on ? 1 : 0];
}

export function setCharSize(w: number, h: number): number[] {
  const n = ((w - 1) << 4) | (h - 1);
  return [0x1d, 0x21, n];
}

export function feed(n: number): number[] {
  return [0x1b, 0x64, n];
}

export function cut(partial: boolean = true): number[] {
  return [0x1d, 0x56, partial ? 1 : 0];
}

export function text(str: string): number[] {
  const bytes: number[] = [];
  const upper = str.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    bytes.push(upper.charCodeAt(i));
  }
  return bytes;
}

export function textLine(str: string): number[] {
  return [...text(str), LF];
}
