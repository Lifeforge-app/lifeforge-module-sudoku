import type { SudokuBoard } from '@'

// Grid constants
export const GRID_SIZE = 9

export const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const

export const GRID_INDICES = Array.from({ length: GRID_SIZE }, (_, i) => i)

export const BOX_BORDERS = new Set([2, 5, 8])

// Helper function to calculate cell index
export const getCellIndex = (row: number, col: number) => row * GRID_SIZE + col

// Helper function to check if a cell value violates Sudoku rules
export function checkViolation(
  cellIndex: number,
  value: string,
  mission: string,
  userInputs: string[]
): boolean {
  if (!value || value === '0') return false

  const row = Math.floor(cellIndex / GRID_SIZE)

  const col = cellIndex % GRID_SIZE

  const boxRow = Math.floor(row / 3) * 3

  const boxCol = Math.floor(col / 3) * 3

  // Check row for duplicates
  for (let c = 0; c < GRID_SIZE; c++) {
    if (c === col) continue

    const idx = getCellIndex(row, c)

    const cellValue = mission[idx] !== '0' ? mission[idx] : userInputs[idx]

    if (cellValue === value) return true
  }

  // Check column for duplicates
  for (let r = 0; r < GRID_SIZE; r++) {
    if (r === row) continue

    const idx = getCellIndex(r, col)

    const cellValue = mission[idx] !== '0' ? mission[idx] : userInputs[idx]

    if (cellValue === value) return true
  }

  // Check 3x3 box for duplicates
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (r === row && c === col) continue

      const idx = getCellIndex(r, c)

      const cellValue = mission[idx] !== '0' ? mission[idx] : userInputs[idx]

      if (cellValue === value) return true
    }
  }

  return false
}

// Type definitions
export interface InteractiveBoardProps {
  data: SudokuBoard
  userInputs: string[]
  candidates: Set<number>[]
  isCandidate: boolean
  selectedCell: number | null
  highlightedNumber: string | null
  onCellSelect: (index: number | null) => void
  onInputChange: (index: number, value: string) => void
  onCandidateToggle: (index: number, value: number) => void
  onClearCell: (index: number) => void
}

export interface CellProps {
  cellIndex: number
  isOriginal: boolean
  userValue: string
  cellCandidates: Set<number>
  isSelected: boolean
  isThemeDark: boolean
  highlightedNumber: string | null
  hasViolation: boolean
  missionValue: string
  onCellSelect: (index: number) => void
  onKeyDown: (e: React.KeyboardEvent, index: number) => void
}

export interface ColumnProps {
  col: number
  data: SudokuBoard
  userInputs: string[]
  candidates: Set<number>[]
  selectedCell: number | null
  isThemeDark: boolean
  highlightedNumber: string | null
  onCellSelect: (index: number) => void
  onKeyDown: (e: React.KeyboardEvent, index: number) => void
}

export interface CellContentProps {
  cellValue: string | null
  isOriginal: boolean
  isSelected: boolean
  isThemeDark: boolean
  highlightedNumber: string | null
  hasViolation: boolean
  cellCandidates: Set<number>
}
