import { getNoteDigits } from '../sudoku/notes'
import type { CellState } from '../sudoku/types'
import styles from './Cell.module.css'

interface CellProps {
  cell: CellState
  notes: number
  row: number
  col: number
  isSelected: boolean
  isPeer: boolean
  isSameNumber: boolean
  isError: boolean
  onSelect: () => void
}

export function Cell({
  cell,
  notes,
  row,
  col,
  isSelected,
  isPeer,
  isSameNumber,
  isError,
  onSelect,
}: CellProps) {
  const classNames = [styles.cell]
  if (col % 3 === 2 && col !== 8) classNames.push(styles.boxRight)
  if (row % 3 === 2 && row !== 8) classNames.push(styles.boxBottom)
  if (isPeer) classNames.push(styles.peer)
  if (isSameNumber) classNames.push(styles.sameNumber)
  if (isSelected) classNames.push(styles.selected)
  if (isError) classNames.push(styles.error)

  return (
    <div className={classNames.join(' ')} onClick={onSelect}>
      {cell.value !== null ? (
        <span className={cell.kind === 'given' ? styles.given : styles.entered}>
          {cell.value}
        </span>
      ) : notes !== 0 ? (
        <div className={styles.notes}>
          {getNoteDigits(notes).map((digit) => (
            <span key={digit} className={styles.note} style={{ gridArea: noteArea(digit) }}>
              {digit}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function noteArea(digit: number): string {
  const pos = digit - 1
  const row = Math.floor(pos / 3) + 1
  const col = (pos % 3) + 1
  return `${row} / ${col} / ${row + 1} / ${col + 1}`
}
