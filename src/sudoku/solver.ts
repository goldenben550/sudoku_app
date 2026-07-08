import { boxOf, indexToRowCol, shuffled } from '../utils/grid'

const ALL_DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const

interface Masks {
  rows: number[]
  cols: number[]
  boxes: number[]
}

function buildMasks(grid: readonly number[]): Masks {
  const rows = new Array(9).fill(0)
  const cols = new Array(9).fill(0)
  const boxes = new Array(9).fill(0)
  for (let i = 0; i < 81; i++) {
    const digit = grid[i]
    if (digit === 0) continue
    const { row, col } = indexToRowCol(i)
    const box = boxOf(row, col)
    const bit = 1 << digit
    rows[row] |= bit
    cols[col] |= bit
    boxes[box] |= bit
  }
  return { rows, cols, boxes }
}

function candidateDigits(masks: Masks, row: number, col: number): number[] {
  const used = masks.rows[row] | masks.cols[col] | masks.boxes[boxOf(row, col)]
  return ALL_DIGITS.filter((d) => (used & (1 << d)) === 0)
}

function place(masks: Masks, row: number, col: number, digit: number) {
  const bit = 1 << digit
  masks.rows[row] |= bit
  masks.cols[col] |= bit
  masks.boxes[boxOf(row, col)] |= bit
}

function remove(masks: Masks, row: number, col: number, digit: number) {
  const bit = ~(1 << digit)
  masks.rows[row] &= bit
  masks.cols[col] &= bit
  masks.boxes[boxOf(row, col)] &= bit
}

/** Randomized backtracking fill of a full 9x9 grid. Mutates and returns `grid` (length 81, 0 = empty). */
export function fillGrid(grid: number[]): boolean {
  const masks = buildMasks(grid)
  return fillFrom(grid, masks, 0)
}

function fillFrom(grid: number[], masks: Masks, pos: number): boolean {
  if (pos === 81) return true
  if (grid[pos] !== 0) return fillFrom(grid, masks, pos + 1)

  const { row, col } = indexToRowCol(pos)
  const candidates = shuffled(candidateDigits(masks, row, col))
  for (const digit of candidates) {
    grid[pos] = digit
    place(masks, row, col, digit)
    if (fillFrom(grid, masks, pos + 1)) return true
    remove(masks, row, col, digit)
    grid[pos] = 0
  }
  return false
}

/**
 * Counts solutions to `grid` up to `limit`, stopping early once reached.
 * Used to verify a puzzle has a unique solution without a full enumeration.
 */
export function countSolutions(grid: readonly number[], limit: number): number {
  const working = grid.slice()
  const masks = buildMasks(working)
  let count = 0

  function search(pos: number): void {
    if (count >= limit) return
    if (pos === 81) {
      count++
      return
    }
    if (working[pos] !== 0) {
      search(pos + 1)
      return
    }
    const { row, col } = indexToRowCol(pos)
    for (const digit of candidateDigits(masks, row, col)) {
      if (count >= limit) return
      working[pos] = digit
      place(masks, row, col, digit)
      search(pos + 1)
      remove(masks, row, col, digit)
      working[pos] = 0
    }
  }

  search(0)
  return count
}
