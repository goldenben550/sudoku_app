import { CELL_COUNT, shuffled } from '../utils/grid'
import { randomClueTarget } from './difficulty'
import { countSolutions, fillGrid } from './solver'
import type { Board, CellState, Difficulty, Digit, SolutionGrid } from './types'

export function generateSolvedGrid(): SolutionGrid {
  const grid = new Array(CELL_COUNT).fill(0)
  fillGrid(grid)
  return grid as SolutionGrid
}

export interface GeneratedPuzzle {
  board: Board
  solution: SolutionGrid
}

export function generatePuzzle(difficulty: Difficulty): GeneratedPuzzle {
  const solution = generateSolvedGrid()
  const working = solution.slice() as number[]
  const targetClues = randomClueTarget(difficulty)

  let cluesRemaining = CELL_COUNT
  for (const index of shuffled(Array.from({ length: CELL_COUNT }, (_, i) => i))) {
    if (cluesRemaining <= targetClues) break

    const backup = working[index]
    working[index] = 0
    if (countSolutions(working, 2) !== 1) {
      working[index] = backup
    } else {
      cluesRemaining--
    }
  }

  const board: Board = working.map((value): CellState => ({
    kind: value !== 0 ? 'given' : 'empty',
    value: value !== 0 ? (value as Digit) : null,
    notes: 0,
    isError: false,
  }))

  return { board, solution }
}
