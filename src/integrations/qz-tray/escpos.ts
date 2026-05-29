export const ESC = "\x1B";
export const GS = "\x1D";
export const LF = "\x0A";

export function init(): string {
  return `${ESC}@`;
}

export function setAlign(pos: "left" | "center" | "right"): string {
  const map = { left: 0, center: 1, right: 2 };
  return `${ESC}a${String.fromCharCode(map[pos])}`;
}

export function setBold(on: boolean): string {
  return `${ESC}E${String.fromCharCode(on ? 1 : 0)}`;
}

export function setCharSize(w: number, h: number): string {
  const n = ((w - 1) << 4) | (h - 1);
  return `${GS}!${String.fromCharCode(n)}`;
}

export function feed(n: number): string {
  return `${ESC}d${String.fromCharCode(n)}`;
}

export function cut(partial: boolean = true): string {
  return `${GS}V${String.fromCharCode(partial ? 1 : 0)}`;
}
