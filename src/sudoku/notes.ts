import type { Digit } from './types'

const bit = (digit: number) => 1 << digit

export function hasNote(notes: number, digit: Digit): boolean {
  return (notes & bit(digit)) !== 0
}

export function toggleNote(notes: number, digit: Digit): number {
  return notes ^ bit(digit)
}

export function clearNote(notes: number, digit: Digit): number {
  return notes & ~bit(digit)
}

export function getNoteDigits(notes: number): Digit[] {
  const digits: Digit[] = []
  for (let d = 1; d <= 9; d++) {
    if (hasNote(notes, d as Digit)) digits.push(d as Digit)
  }
  return digits
}

/** If exactly one candidate is noted, returns it; otherwise null. */
export function singleNoteDigit(notes: number): Digit | null {
  const digits = getNoteDigits(notes)
  return digits.length === 1 ? digits[0] : null
}
