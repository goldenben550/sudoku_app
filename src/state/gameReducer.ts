import { generatePuzzle } from '../sudoku/generator'
import { clearNote, singleNoteDigit, toggleNote } from '../sudoku/notes'
import type { Board, Difficulty, Digit, GameState, InputMode } from '../sudoku/types'
import { checkBoard, isBoardComplete } from '../sudoku/validation'
import { getPeers, indexToRowCol, rowColToIndex } from '../utils/grid'

export type GameAction =
  | { type: 'SELECT_CELL'; index: number }
  | { type: 'MOVE_SELECTION'; deltaRow: number; deltaCol: number }
  | { type: 'TOGGLE_MODE' }
  | { type: 'SET_MODE'; mode: InputMode }
  | { type: 'ENTER_DIGIT'; digit: Digit }
  | { type: 'CLEAR_CELL' }
  | { type: 'CHECK' }
  | { type: 'AUTOFILL_FROM_NOTES' }
  | { type: 'TOGGLE_SMART_NOTES' }
  | { type: 'NEW_PUZZLE'; difficulty: Difficulty }
  | { type: 'LOAD_STATE'; state: GameState }

export function createInitialState(difficulty: Difficulty): GameState {
  const { board, solution } = generatePuzzle(difficulty)
  return {
    board,
    solution,
    difficulty,
    mode: 'value',
    selectedCell: null,
    smartNotes: false,
    isComplete: false,
  }
}

function setMode(state: GameState, mode: InputMode): GameState {
  return { ...state, mode }
}

function enterDigit(state: GameState, digit: Digit): GameState {
  const { selectedCell } = state
  if (selectedCell === null) return state
  const cell = state.board[selectedCell]
  if (cell.kind === 'given') return state

  const board = state.board.slice()

  if (state.mode === 'value') {
    board[selectedCell] = { kind: 'entered', value: digit, notes: 0, isError: false }
    if (state.smartNotes) {
      for (const peer of getPeers(selectedCell)) {
        const peerCell = board[peer]
        if (peerCell.notes !== 0) {
          board[peer] = { ...peerCell, notes: clearNote(peerCell.notes, digit) }
        }
      }
    }
  } else {
    // Notes mode: typing a note on a valued cell reverts it to notes-only first.
    const baseNotes = cell.kind === 'entered' ? 0 : cell.notes
    board[selectedCell] = {
      kind: 'empty',
      value: null,
      notes: toggleNote(baseNotes, digit),
      isError: false,
    }
  }

  const isComplete = isBoardComplete(board, state.solution)
  return { ...state, board, isComplete }
}

function clearCell(state: GameState): GameState {
  const { selectedCell } = state
  if (selectedCell === null) return state
  const cell = state.board[selectedCell]
  if (cell.kind === 'given') return state

  const board = state.board.slice()
  board[selectedCell] = { kind: 'empty', value: null, notes: 0, isError: false }
  return { ...state, board, isComplete: false }
}

function moveSelection(state: GameState, deltaRow: number, deltaCol: number): GameState {
  const current = state.selectedCell ?? 0
  const { row, col } = indexToRowCol(current)
  const nextRow = Math.min(8, Math.max(0, row + deltaRow))
  const nextCol = Math.min(8, Math.max(0, col + deltaCol))
  return { ...state, selectedCell: rowColToIndex(nextRow, nextCol) }
}

function check(state: GameState): GameState {
  const board = checkBoard(state.board, state.solution)
  const isComplete = isBoardComplete(board, state.solution)
  return { ...state, board, isComplete }
}

function autofillFromNotes(state: GameState): GameState {
  const board: Board = state.board.map((cell) => {
    if (cell.kind !== 'empty' || cell.notes === 0) return cell
    const digit = singleNoteDigit(cell.notes)
    if (digit === null) return cell
    return { kind: 'entered', value: digit, notes: 0, isError: false }
  })
  const isComplete = isBoardComplete(board, state.solution)
  return { ...state, board, isComplete }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_CELL':
      return { ...state, selectedCell: action.index }
    case 'MOVE_SELECTION':
      return moveSelection(state, action.deltaRow, action.deltaCol)
    case 'TOGGLE_MODE':
      return setMode(state, state.mode === 'value' ? 'notes' : 'value')
    case 'SET_MODE':
      return setMode(state, action.mode)
    case 'ENTER_DIGIT':
      return enterDigit(state, action.digit)
    case 'CLEAR_CELL':
      return clearCell(state)
    case 'CHECK':
      return check(state)
    case 'AUTOFILL_FROM_NOTES':
      return autofillFromNotes(state)
    case 'TOGGLE_SMART_NOTES':
      return { ...state, smartNotes: !state.smartNotes }
    case 'NEW_PUZZLE':
      return createInitialState(action.difficulty)
    case 'LOAD_STATE':
      return action.state
    default:
      return state
  }
}
