/** Parses a price shown in the UI ("$14.15", "14.15") into a number. */
export function parseMoney(text: string): number {
  const value = Number(text.replace(/[^0-9.]/g, ''));
  if (Number.isNaN(value)) {
    throw new Error(`Cannot parse a price from "${text}"`);
  }
  return value;
}
