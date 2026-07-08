export type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type Difficulty = 'easy' | 'medium' | 'hard'

export type InputMode = 'value' | 'notes'

export type CellKind = 'given' | 'entered' | 'empty'

/** Which notes bitmask is currently shown/edited for empty cells. */
export type NotesVariant = 'manual' | 'smart'

export interface CellState {
  kind: CellKind
  value: Digit | null
  /** Bitmask of pencil marks the player entered by hand; bit `d` (1<<d) set means digit d is noted. */
  manualNotes: number
  /** Bitmask of the "smart" notes layer — seeded with computed candidates, then freely editable. */
  smartNotes: number
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
  notesVariant: NotesVariant
  isComplete: boolean
}

export const SCHEMA_VERSION = 2

export interface PersistedGame {
  version: number
  board: Board
  solution: SolutionGrid
  difficulty: Difficulty
  mode: InputMode
  selectedCell: number | null
  notesVariant: NotesVariant
  isComplete: boolean
  savedAt: number
}
