import type { Board, SolutionGrid } from './types'
import { getPeers } from '../utils/grid'

/** Returns a new board with `isError` set on every entered cell that doesn't match the solution. */
export function checkBoard(board: Board, solution: SolutionGrid): Board {
  return board.map((cell, index) => {
    if (cell.kind !== 'entered') return cell
    return { ...cell, isError: cell.value !== solution[index] }
  })
}

export function isBoardComplete(board: Board, solution: SolutionGrid): boolean {
  return board.every((cell, index) => cell.value === solution[index])
}

/** Indices of entered cells whose value duplicates a peer's value (same row/column/box). */
export function findConflictingCells(board: Board): Set<number> {
  const conflicts = new Set<number>()
  for (let index = 0; index < board.length; index++) {
    const cell = board[index]
    if (cell.kind !== 'entered' || cell.value === null) continue
    const hasConflict = getPeers(index).some((peer) => board[peer].value === cell.value)
    if (hasConflict) conflicts.add(index)
  }
  return conflicts
}
