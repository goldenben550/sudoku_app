import type { Board, SolutionGrid } from './types'

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
