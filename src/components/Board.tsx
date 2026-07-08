import { useMemo } from 'react'
import { useGame } from '../state/gameContext'
import { findConflictingCells } from '../sudoku/validation'
import { getPeers, indexToRowCol } from '../utils/grid'
import { Cell } from './Cell'
import styles from './Board.module.css'

export function Board() {
  const { state, dispatch } = useGame()
  const { board, selectedCell, notesVariant } = state

  const peerSet = useMemo(
    () => new Set(selectedCell !== null ? getPeers(selectedCell) : []),
    [selectedCell],
  )

  const conflicts = useMemo(() => findConflictingCells(board), [board])

  const selectedValue = selectedCell !== null ? board[selectedCell].value : null

  return (
    <div className={styles.board}>
      {board.map((cell, index) => {
        const { row, col } = indexToRowCol(index)
        return (
          <Cell
            key={index}
            cell={cell}
            notes={notesVariant === 'smart' ? cell.smartNotes : cell.manualNotes}
            row={row}
            col={col}
            isSelected={index === selectedCell}
            isPeer={peerSet.has(index)}
            isSameNumber={
              selectedValue !== null && index !== selectedCell && cell.value === selectedValue
            }
            isError={cell.isError || conflicts.has(index)}
            onSelect={() => dispatch({ type: 'SELECT_CELL', index })}
          />
        )
      })}
    </div>
  )
}
