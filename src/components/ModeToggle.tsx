import { useGame } from '../state/gameContext'
import styles from './ModeToggle.module.css'

export function ModeToggle() {
  const { state, dispatch } = useGame()

  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.option} ${state.mode === 'value' ? styles.active : ''}`}
        onClick={() => dispatch({ type: 'SET_MODE', mode: 'value' })}
      >
        Enter Number
      </button>
      <button
        className={`${styles.option} ${state.mode === 'notes' ? styles.active : ''}`}
        onClick={() => dispatch({ type: 'SET_MODE', mode: 'notes' })}
      >
        Notes
      </button>
    </div>
  )
}
