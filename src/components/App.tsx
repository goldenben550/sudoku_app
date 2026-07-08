import { GameProvider, useGame } from '../state/gameContext'
import { useKeyboardControls } from '../hooks/useKeyboardControls'
import { Board } from './Board'
import { DifficultySelector } from './DifficultySelector'
import { NumberPad } from './NumberPad'
import { Sidebar } from './Sidebar'
import styles from './App.module.css'

function AppContent() {
  const { dispatch } = useGame()
  useKeyboardControls(dispatch)

  return (
    <div className={styles.app}>
      <h1>Sudoku</h1>
      <DifficultySelector />
      <div className={styles.main}>
        <div className={styles.boardColumn}>
          <Board />
          <NumberPad />
        </div>
        <Sidebar />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}
