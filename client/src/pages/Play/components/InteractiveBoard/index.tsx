import { memo, useCallback } from 'react'

import {
  GRID_INDICES,
  GRID_SIZE,
  getCellIndex
} from '../../../../constants/constants'
import { useBoardState, useInputMode, useSession } from '../../providers'
import Column from './components/Column'
import GridDividers from './components/GridDividers'

function InteractiveBoard() {
  const { currentBoard } = useSession()

  const {
    setSelectedCell,
    handleInputChange,
    handleCandidateToggle,
    handleClearCell
  } = useBoardState()

  const { isCandidate } = useInputMode()

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, cellIndex: number) => {
      if (!currentBoard) return

      const isOriginalCell = currentBoard.mission[cellIndex] !== '0'

      // Handle arrow key navigation (works for all cells)
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()

        const row = Math.floor(cellIndex / GRID_SIZE)

        const col = cellIndex % GRID_SIZE

        let newRow = row
        let newCol = col

        switch (e.key) {
          case 'ArrowUp':
            newRow = Math.max(0, row - 1)
            break
          case 'ArrowDown':
            newRow = Math.min(GRID_SIZE - 1, row + 1)
            break
          case 'ArrowLeft':
            newCol = Math.max(0, col - 1)
            break
          case 'ArrowRight':
            newCol = Math.min(GRID_SIZE - 1, col + 1)
            break
        }

        setSelectedCell(getCellIndex(newRow, newCol))

        return
      }

      // Don't allow input on original cells
      if (isOriginalCell) return

      if (e.key >= '1' && e.key <= '9') {
        const num = parseInt(e.key, 10)

        if (isCandidate) {
          handleCandidateToggle(cellIndex, num)
        } else {
          handleInputChange(cellIndex, e.key)
        }
      } else if (['Backspace', 'Delete', '0'].includes(e.key)) {
        handleClearCell(cellIndex)
      }
    },
    [
      currentBoard,
      isCandidate,
      setSelectedCell,
      handleInputChange,
      handleCandidateToggle,
      handleClearCell
    ]
  )

  if (!currentBoard) return null

  return (
    <div className="aspect-square w-full max-w-xl p-4">
      <div className="border-bg-800 dark:border-bg-100 relative grid size-full grid-cols-9 border-[3px]">
        {GRID_INDICES.map(col => (
          <Column key={col} col={col} onKeyDown={handleKeyDown} />
        ))}
        <GridDividers />
      </div>
    </div>
  )
}

export default memo(InteractiveBoard)
