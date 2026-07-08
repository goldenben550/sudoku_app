import type { Board, Digit } from './types'
import { getPeers } from '../utils/grid'

const bit = (digit: number) => 1 << digit

export function hasNote(notes: number, digit: Digit): boolean {
  return (notes & bit(digit)) !== 0
}

export function toggleNote(notes: number, digit: Digit): number {
  return notes ^ bit(digit)
}

export function getNoteDigits(notes: number): Digit[] {
  const digits: Digit[] = []
  for (let d = 1; d <= 9; d++) {
    if (hasNote(notes, d as Digit)) digits.push(d as Digit)
  }
  return digits
}

/** Bitmask of digits not already used by any peer (row/column/box) of `index`. */
function candidateMask(board: Board, index: number): number {
  let used = 0
  for (const peer of getPeers(index)) {
    const value = board[peer].value
    if (value !== null) used |= bit(value)
  }
  let mask = 0
  for (let d = 1; d <= 9; d++) {
    if ((used & bit(d)) === 0) mask |= bit(d)
  }
  return mask
}

/**
 * Seeds `smartNotes` with computed candidates for any empty cell that hasn't been
 * touched yet (smartNotes === 0). Never overwrites a cell the player has already
 * edited, so switching back and forth preserves manual edits to the smart layer.
 */
export function initializeSmartNotes(board: Board): Board {
  return board.map((cell, index) => {
    if (cell.kind !== 'empty' || cell.smartNotes !== 0) return cell
    return { ...cell, smartNotes: candidateMask(board, index) }
  })
}
