import { useGame } from '../state/gameContext'
import type { Digit } from '../sudoku/types'
import styles from './NumberPad.module.css'

const DIGITS: Digit[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function NumberPad() {
  const { dispatch } = useGame()

  return (
    <div className={styles.pad}>
      {DIGITS.map((digit) => (
        <button
          key={digit}
          className={styles.key}
          onClick={() => dispatch({ type: 'ENTER_DIGIT', digit })}
        >
          {digit}
        </button>
      ))}
      <button
        className={`${styles.key} ${styles.erase}`}
        onClick={() => dispatch({ type: 'CLEAR_CELL' })}
      >
        Erase
      </button>
    </div>
  )
}
