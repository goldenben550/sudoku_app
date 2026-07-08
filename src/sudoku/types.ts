export type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type Difficulty = 'easy' | 'medium' | 'hard'

export type InputMode = 'value' | 'notes'

export type CellKind = 'given' | 'entered' | 'empty'

export interface CellState {
  kind: CellKind
  value: Digit | null
  /** Bitmask of pencil-marked candidates; bit `d` (1<<d) set means digit d is noted. */
  notes: number
  isError: boolean
}

/** Flat length-81 board, index = row * 9 + col. */
export type Board = CellState[]

/** Flat length-81 solved grid, no empty cells. */
export type SolutionGrid = Digit[]

export interface GameState {
  board: Board
  solution: SolutionGrid
  difficulty: Difficulty
  mode: InputMode
  selectedCell: number | null
  smartNotes: boolean
  isComplete: boolean
}

export const SCHEMA_VERSION = 1

export interface PersistedGame {
  version: number
  board: Board
  solution: SolutionGrid
  difficulty: Difficulty
  mode: InputMode
  selectedCell: number | null
  smartNotes: boolean
  isComplete: boolean
  savedAt: number
}
