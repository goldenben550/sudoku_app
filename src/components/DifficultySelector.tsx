import { DIFFICULTIES } from '../sudoku/difficulty'
import { useGame } from '../state/gameContext'
import styles from './DifficultySelector.module.css'

export function DifficultySelector() {
  const { state, dispatch } = useGame()

  return (
    <div className={styles.selector}>
      {DIFFICULTIES.map((difficulty) => (
        <button
          key={difficulty}
          className={`${styles.button} ${state.difficulty === difficulty ? styles.active : ''}`}
          onClick={() => dispatch({ type: 'NEW_PUZZLE', difficulty })}
        >
          {difficulty}
        </button>
      ))}
    </div>
  )
}
