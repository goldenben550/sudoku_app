import { generatePuzzle } from '../sudoku/generator'
import { initializeSmartNotes, toggleNote } from '../sudoku/notes'
import type { Difficulty, Digit, GameState, InputMode } from '../sudoku/types'
import { checkBoard, isBoardComplete } from '../sudoku/validation'
import { indexToRowCol, rowColToIndex } from '../utils/grid'

export type GameAction =
  | { type: 'SELECT_CELL'; index: number }
  | { type: 'MOVE_SELECTION'; deltaRow: number; deltaCol: number }
  | { type: 'TOGGLE_MODE' }
  | { type: 'SET_MODE'; mode: InputMode }
  | { type: 'ENTER_DIGIT'; digit: Digit }
  | { type: 'CLEAR_CELL' }
  | { type: 'CHECK' }
  | { type: 'TOGGLE_NOTES_VARIANT' }
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
    notesVariant: 'manual',
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

  if (state.mode === 'notes') {
    const noteKey = state.notesVariant === 'smart' ? 'smartNotes' : 'manualNotes'
    const board = state.board.slice()
    board[selectedCell] = {
      ...cell,
      kind: 'empty',
      value: null,
      [noteKey]: toggleNote(cell[noteKey], digit),
    }
    return { ...state, board, isComplete: isBoardComplete(board, state.solution) }
  }

  const board = state.board.slice()
  board[selectedCell] = {
    kind: 'entered',
    value: digit,
    manualNotes: 0,
    smartNotes: 0,
    isError: false,
  }

  const isComplete = isBoardComplete(board, state.solution)
  return { ...state, board, isComplete }
}

function clearCell(state: GameState): GameState {
  const { selectedCell } = state
  if (selectedCell === null) return state
  const cell = state.board[selectedCell]
  if (cell.kind === 'given') return state

  let board = state.board.slice()
  board[selectedCell] = { kind: 'empty', value: null, manualNotes: 0, smartNotes: 0, isError: false }
  if (state.notesVariant === 'smart') {
    board = initializeSmartNotes(board)
  }
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

function toggleNotesVariant(state: GameState): GameState {
  const notesVariant = state.notesVariant === 'smart' ? 'manual' : 'smart'
  const board = notesVariant === 'smart' ? initializeSmartNotes(state.board) : state.board
  return { ...state, notesVariant, board }
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
    case 'TOGGLE_NOTES_VARIANT':
      return toggleNotesVariant(state)
    case 'NEW_PUZZLE':
      return createInitialState(action.difficulty)
    case 'LOAD_STATE':
      return action.state
    default:
      return state
  }
}
