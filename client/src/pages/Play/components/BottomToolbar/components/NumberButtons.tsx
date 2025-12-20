import { Icon } from '@iconify/react'
import { useMemo } from 'react'

import { useBoardState, useInputMode, useSession } from '../../../providers'

function NumberButtons() {
  const { currentBoard } = useSession()

  const {
    userInputs,
    selectedCell,
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
        // Count pre-filled cells from mission
        if (currentBoard.mission[i] === numStr) {
          filled++
        }
        // Count user-filled cells
        else if (currentBoard.mission[i] === '0' && userInputs[i] === numStr) {
          filled++
        }
      }

      // Each number should appear 9 times in a complete Sudoku
      counts.push(9 - filled)
    }

    return counts
  }, [currentBoard, userInputs])

  const canClearSelectedCell =
    selectedCell !== null && currentBoard?.mission[selectedCell] === '0'

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
        const remaining = remainingCounts[num - 1]

        const isDisabled = remaining === 0

        return (
          <button
            key={num}
            className={`flex-center flex aspect-square w-14 shrink-0 flex-col rounded-lg border-2 text-base font-semibold transition-all duration-150 sm:text-lg ${
              isDisabled
                ? 'bg-bg-100 dark:bg-bg-800 border-bg-200 dark:border-bg-700 text-bg-400 dark:text-bg-600 cursor-not-allowed'
                : 'bg-bg-50 dark:bg-bg-900 border-bg-300 dark:border-bg-600 text-bg-800 dark:text-bg-100 hover:border-custom-500 hover:text-custom-500 active:scale-90'
            }`}
            disabled={isDisabled}
            type="button"
            onClick={() => {
              if (
                selectedCell !== null &&
                currentBoard?.mission[selectedCell] === '0'
              ) {
                if (isCandidate) {
                  handleCandidateToggle(selectedCell, num)
                } else {
                  handleInputChange(selectedCell, String(num))
                }
              }
            }}
          >
            {num}
            <p className="text-bg-500 text-[10px] sm:text-xs">{remaining}</p>
          </button>
        )
      })}
      <button
        className={`border-bg-300 dark:border-bg-600 flex-center flex aspect-square w-14 shrink-0 flex-col rounded-lg border-2 text-lg font-semibold transition-all duration-150 active:scale-90 sm:text-lg ${
          canClearSelectedCell
            ? 'bg-bg-50 dark:bg-bg-900 text-bg-800 dark:text-bg-100 hover:border-red-500 hover:text-red-500'
            : 'bg-bg-100 dark:bg-bg-800 text-bg-400 dark:text-bg-600 cursor-not-allowed'
        }`}
        disabled={!canClearSelectedCell}
        type="button"
        onClick={() => {
          if (canClearSelectedCell) {
            handleClearCell(selectedCell)
          }
        }}
      >
        <Icon className="size-5 sm:size-6" icon="tabler:trash" />
      </button>
    </div>
  )
}

export default NumberButtons
