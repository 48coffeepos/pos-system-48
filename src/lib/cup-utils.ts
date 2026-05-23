export function parseCupInfo(name: string): {
  cup_type: string;
  cup_size: string;
} {
  const lower = name.toLowerCase();
  const cup_type = lower.includes("iced") ? "ICED" : "HOT";
  const cup_size = lower.includes("16oz") ? "16OZ" : "12OZ";
  return { cup_type, cup_size };
}

export function parseCupInfoKey(name: string): string {
  const { cup_type, cup_size } = parseCupInfo(name);
  return `${cup_size} ${cup_type}`;
}
