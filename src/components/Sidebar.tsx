import { useGame } from '../state/gameContext'
import { ModeToggle } from './ModeToggle'
import styles from './Sidebar.module.css'

export function Sidebar() {
  const { state, dispatch } = useGame()

  return (
    <div className={styles.sidebar}>
      <ModeToggle />

      {state.isComplete && <p className={styles.status}>Puzzle solved!</p>}

      <button className={styles.button} onClick={() => dispatch({ type: 'CHECK' })}>
        Check puzzle
      </button>

      <label className={styles.smartNotesRow}>
        Smart notes
        <input
          type="checkbox"
          checked={state.notesVariant === 'smart'}
          onChange={() => dispatch({ type: 'TOGGLE_NOTES_VARIANT' })}
        />
      </label>
    </div>
  )
}
