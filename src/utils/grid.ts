export const GRID_SIZE = 9
export const CELL_COUNT = GRID_SIZE * GRID_SIZE

export function rowColToIndex(row: number, col: number): number {
  return row * GRID_SIZE + col
}

export function indexToRowCol(index: number): { row: number; col: number } {
  return { row: Math.floor(index / GRID_SIZE), col: index % GRID_SIZE }
}

export function boxOf(row: number, col: number): number {
  return Math.floor(row / 3) * 3 + Math.floor(col / 3)
}

/** Indices sharing a row, column, or 3x3 box with `index`, excluding itself. */
export function getPeers(index: number): number[] {
  const { row, col } = indexToRowCol(index)
  const peers = new Set<number>()
  for (let i = 0; i < GRID_SIZE; i++) {
    peers.add(rowColToIndex(row, i))
    peers.add(rowColToIndex(i, col))
  }
  const boxRow = Math.floor(row / 3) * 3
  const boxCol = Math.floor(col / 3) * 3
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      peers.add(rowColToIndex(boxRow + r, boxCol + c))
    }
  }
  peers.delete(index)
  return Array.from(peers)
}

export function shuffled<T>(items: readonly T[]): T[] {
  const arr = items.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
