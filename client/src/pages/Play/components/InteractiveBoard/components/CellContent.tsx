import clsx from 'clsx'
import { memo } from 'react'

import {
  type CellContentProps,
  NUMBERS
} from '../../../../../constants/constants'

function CellContent({
  cellValue,
  isOriginal,
  isSelected,
  isThemeDark,
  highlightedNumber,
  hasViolation,
  cellCandidates
}: CellContentProps) {
  // Render main value (original or user input)
  if (cellValue) {
    const isHighlighted = highlightedNumber === cellValue

    return (
      <span
        className={clsx(
          'flex-center relative size-[85%] rounded-full text-lg font-medium transition-all',
          // Selected cell background: red if violation, theme color otherwise
          isSelected && !hasViolation && 'bg-custom-500',
          isSelected && hasViolation && 'bg-red-500',
          isSelected && isThemeDark && 'text-white',
          isSelected && !isThemeDark && 'text-bg-900',
          !isSelected && isHighlighted && !hasViolation && 'bg-custom-500/20',
          !isSelected && isHighlighted && hasViolation && 'bg-red-500/20',
          // Original cells without violation: use default text color
          !isSelected &&
            isOriginal &&
            !hasViolation &&
            'text-bg-800 dark:text-bg-100',
          // Original cells with violation: show red
          !isSelected &&
            isOriginal &&
            hasViolation &&
            'text-red-600 dark:text-red-400',
          // User input with violation: show red
          !isSelected &&
            !isOriginal &&
            hasViolation &&
            'text-red-600 dark:text-red-400',
          // User input without violation: use theme color
          !isSelected &&
            !isOriginal &&
            !hasViolation &&
            'text-custom-600 dark:text-custom-400'
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
                  'flex-center text-sm leading-none transition-all',
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
