import { createContext, useContext, useMemo, useReducer, useRef } from 'react'
import type { ReactNode } from 'react'
import { createInitialState, gameReducer } from './gameReducer'
import type { GameAction } from './gameReducer'
import { loadGame } from './persistence'
import { useAutosave } from '../hooks/useAutosave'
import type { GameState } from '../sudoku/types'

interface GameContextValue {
  state: GameState
  dispatch: (action: GameAction) => void
}

const GameContext = createContext<GameContextValue | null>(null)

function initState(): GameState {
  return loadGame() ?? createInitialState('medium')
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatchBase] = useReducer(gameReducer, undefined, initState)
  const saveImmediately = useRef(false)

  const dispatch = useMemo(
    () => (action: GameAction) => {
      if (action.type === 'NEW_PUZZLE') {
        saveImmediately.current = true
      }
      dispatchBase(action)
    },
    [],
  )

  useAutosave(state, saveImmediately)

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext)
  if (!context) throw new Error('useGame must be used within a GameProvider')
  return context
}
