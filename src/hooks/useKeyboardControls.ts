import { useEffect } from 'react'
import type { GameAction } from '../state/gameReducer'
import type { Digit } from '../sudoku/types'

const DIRECTIONS: Record<string, [deltaRow: number, deltaCol: number]> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
}

export function useKeyboardControls(dispatch: (action: GameAction) => void) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === ' ') {
        event.preventDefault()
        dispatch({ type: 'TOGGLE_MODE' })
        return
      }

      if (event.key in DIRECTIONS) {
        event.preventDefault()
        const [deltaRow, deltaCol] = DIRECTIONS[event.key]
        dispatch({ type: 'MOVE_SELECTION', deltaRow, deltaCol })
        return
      }

      if (event.key >= '1' && event.key <= '9') {
        dispatch({ type: 'ENTER_DIGIT', digit: Number(event.key) as Digit })
        return
      }

      if (event.key === 'Backspace' || event.key === 'Delete') {
        dispatch({ type: 'CLEAR_CELL' })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dispatch])
}
