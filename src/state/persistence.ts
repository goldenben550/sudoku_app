import { SCHEMA_VERSION } from '../sudoku/types'
import type { GameState, PersistedGame } from '../sudoku/types'

const STORAGE_KEY = 'sudoku:v1:game'

export function saveGame(state: GameState): void {
  const payload: PersistedGame = {
    version: SCHEMA_VERSION,
    board: state.board,
    solution: state.solution,
    difficulty: state.difficulty,
    mode: state.mode,
    selectedCell: state.selectedCell,
    smartNotes: state.smartNotes,
    isComplete: state.isComplete,
    savedAt: Date.now(),
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — progress just won't persist.
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedGame
    if (parsed.version !== SCHEMA_VERSION) return null
    if (!Array.isArray(parsed.board) || parsed.board.length !== 81) return null
    if (!Array.isArray(parsed.solution) || parsed.solution.length !== 81) return null

    return {
      board: parsed.board,
      solution: parsed.solution,
      difficulty: parsed.difficulty,
      mode: parsed.mode,
      selectedCell: parsed.selectedCell,
      smartNotes: parsed.smartNotes,
      isComplete: parsed.isComplete,
    }
  } catch {
    return null
  }
}

export function clearGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
