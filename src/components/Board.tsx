import { useMemo } from 'react'
import { useGame } from '../state/gameContext'
import { getPeers, indexToRowCol } from '../utils/grid'
import { Cell } from './Cell'
import styles from './Board.module.css'

export function Board() {
  const { state, dispatch } = useGame()
  const { board, selectedCell } = state

  const peerSet = useMemo(
    () => new Set(selectedCell !== null ? getPeers(selectedCell) : []),
    [selectedCell],
  )

  const selectedValue = selectedCell !== null ? board[selectedCell].value : null

  return (
    <div className={styles.board}>
      {board.map((cell, index) => {
        const { row, col } = indexToRowCol(index)
        return (
          <Cell
            key={index}
            cell={cell}
            row={row}
            col={col}
            isSelected={index === selectedCell}
            isPeer={peerSet.has(index)}
            isSameNumber={
              selectedValue !== null && index !== selectedCell && cell.value === selectedValue
            }
            onSelect={() => dispatch({ type: 'SELECT_CELL', index })}
          />
        )
      })}
    </div>
  )
}
