import clsx from 'clsx'
import { Button } from 'lifeforge-ui'
import { useMemo } from 'react'

import { useBoardState, useInputMode, useSession } from '../../../providers'

interface NumberGridProps {
  /** Size variant */
  size?: 'sm' | 'md'
  /** Whether to show delete button */
  showDeleteButton?: boolean
}

function NumberGrid({ showDeleteButton = true }: NumberGridProps) {
  const { currentBoard } = useSession()

  const {
    userInputs,
    selectedCell,
    setSelectedCell,
    handleInputChange,
    handleCandidateToggle,
    handleClearCell
  } = useBoardState()

  const { isCandidate } = useInputMode()

  // Calculate remaining count for each number (1-9)
  const remainingCounts = useMemo(() => {
    if (!currentBoard) return Array(9).fill(0)

    const counts: number[] = []

    for (let num = 1; num <= 9; num++) {
      const numStr = String(num)

      let filled = 0

      for (let i = 0; i < 81; i++) {
        if (currentBoard.mission[i] === numStr) {
          filled++
        } else if (
          currentBoard.mission[i] === '0' &&
          userInputs[i] === numStr
        ) {
          filled++
        }
      }

      counts.push(9 - filled)
    }

    return counts
  }, [currentBoard, userInputs])

  const canClearSelectedCell =
    selectedCell !== null && currentBoard?.mission[selectedCell] === '0'

  const handleNumberClick = (num: number) => {
    if (selectedCell !== null && currentBoard?.mission[selectedCell] === '0') {
      if (isCandidate) {
        handleCandidateToggle(selectedCell, num)
      } else {
        handleInputChange(selectedCell, String(num))
      }

      // Refocus the cell
      setSelectedCell(null)
      setTimeout(() => setSelectedCell(selectedCell), 0)
    }
  }

  const handleClear = () => {
    if (canClearSelectedCell) {
      handleClearCell(selectedCell)

      // Refocus the cell
      setSelectedCell(null)
      setTimeout(() => setSelectedCell(selectedCell), 0)
    }
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(4rem,1fr))] gap-2 sm:grid-cols-3">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
        const remaining = remainingCounts[num - 1]

        const isDisabled = remaining === 0

        return (
          <Button
            key={num}
            className="text-bg-800! dark:text-bg-100! border-bg-300 dark:border-bg-700 min-w-16 flex-1 flex-col border-2 p-2!"
            disabled={isDisabled}
            type="button"
            variant="tertiary"
            onClick={() => handleNumberClick(num)}
          >
            {num}
            <p className={clsx('text-bg-500', 'text-[10px]')}>{remaining}</p>
          </Button>
        )
      })}
      {showDeleteButton && (
        <Button
          dangerous
          className="col-span-3"
          disabled={!canClearSelectedCell}
          icon="tabler:trash"
          type="button"
          onClick={handleClear}
        >
          Clear
        </Button>
      )}
    </div>
  )
}

export default NumberGrid
