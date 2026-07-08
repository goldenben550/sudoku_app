import { useEffect } from 'react'
import type { MutableRefObject } from 'react'
import { saveGame } from '../state/persistence'
import type { GameState } from '../sudoku/types'

const DEBOUNCE_MS = 400

/** Persists `state` to localStorage, debounced — except when `saveImmediately.current` is set. */
export function useAutosave(state: GameState, saveImmediately: MutableRefObject<boolean>) {
  useEffect(() => {
    if (saveImmediately.current) {
      saveImmediately.current = false
      saveGame(state)
      return
    }
    const timeout = setTimeout(() => saveGame(state), DEBOUNCE_MS)
    return () => clearTimeout(timeout)
  }, [state, saveImmediately])
}
