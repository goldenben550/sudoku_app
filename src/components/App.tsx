import { GameProvider, useGame } from '../state/gameContext'
import { ThemeProvider } from '../theme/ThemeContext'
import { useKeyboardControls } from '../hooks/useKeyboardControls'
import { Board } from './Board'
import { DifficultySelector } from './DifficultySelector'
import { NumberPad } from './NumberPad'
import { Sidebar } from './Sidebar'
import { ThemeMenu } from './ThemeMenu'
import styles from './App.module.css'

function AppContent() {
  const { dispatch } = useGame()
  useKeyboardControls(dispatch)

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <h1>Sudoku</h1>
        <ThemeMenu />
      </div>
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
    <ThemeProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </ThemeProvider>
  )
}
