import clsx from 'clsx'
import { memo } from 'react'

import {
  type CellContentProps,
  NUMBERS
} from '../../../../../../constants/constants'

function CellContent({
  cellValue,
  isOriginal,
  isSelected,
  isThemeDark,
  highlightedNumber,
  hasViolation,
  isIncorrect,
  cellCandidates
}: CellContentProps) {
  // Render main value (original or user input)
  if (cellValue) {
    const isHighlighted = highlightedNumber === cellValue

    const hasError = hasViolation || isIncorrect

    const getBackgroundClass = () => {
      if (isSelected) return hasError ? 'bg-red-500' : 'bg-custom-500'
      if (isHighlighted) return hasError ? 'bg-red-500/20' : 'bg-custom-500/20'

      return ''
    }

    const getTextClass = () => {
      if (isSelected) return isThemeDark ? 'text-white' : 'text-bg-900'
      if (hasError) return 'text-red-600 dark:text-red-400'
      if (isOriginal) return 'text-bg-800 dark:text-bg-100'

      return 'text-custom-600 dark:text-custom-400'
    }

    return (
      <span
        className={clsx(
          'flex-center relative size-[85%] rounded-full font-medium transition-all sm:text-lg',
          getBackgroundClass(),
          getTextClass()
        )}
      >
        {cellValue}
      </span>
    )
  }

  // Render candidates
  if (cellCandidates.size > 0) {
    // Check if any candidate matches the highlighted number
    const hasHighlightedCandidate =
      highlightedNumber !== null &&
      cellCandidates.has(Number(highlightedNumber))

    return (
      <div
        className={clsx(
          'relative size-[85%] rounded-full p-0.5',
          isSelected && 'bg-custom-500/20',
          !isSelected && hasHighlightedCandidate && 'bg-custom-500/20'
        )}
      >
        <div className="grid size-full grid-cols-3 grid-rows-3">
          {NUMBERS.map(num => {
            const hasCandidate = cellCandidates.has(num)

            const isHighlighted = highlightedNumber === String(num)

            return (
              <span
                key={num}
                className={clsx(
                  'flex-center text-[8px] leading-none transition-all sm:text-xs',
                  hasCandidate && isHighlighted && 'text-custom-500 font-bold',
                  hasCandidate && !isHighlighted && 'text-text-secondary'
                )}
              >
                {hasCandidate ? num : ''}
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  // Empty selected cell
  if (isSelected) {
    return (
      <span className="bg-custom-500/20 flex-center relative size-[85%] rounded-full" />
    )
  }

  return null
}

export default memo(CellContent)
