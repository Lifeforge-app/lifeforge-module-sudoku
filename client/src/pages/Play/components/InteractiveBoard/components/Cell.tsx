import clsx from 'clsx'
import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

import {
  BOX_BORDERS,
  GRID_SIZE,
  checkViolation
} from '../../../../../constants/constants'
import { useBoardState, useSession } from '../../../providers'
import CellContent from './CellContent'

interface CellProps {
  cellIndex: number
  onKeyDown: (e: React.KeyboardEvent, cellIndex: number) => void
}

function Cell({ cellIndex, onKeyDown }: CellProps) {
  const cellRef = useRef<HTMLDivElement>(null)

  const { derivedThemeColor } = usePersonalization()

  const { currentBoard } = useSession()

  const {
    userInputs,
    candidates,
    selectedCell,
    highlightedNumber,
    setSelectedCell
  } = useBoardState()

  const isThemeDark = useMemo(
    () => tinycolor(derivedThemeColor).isDark(),
    [derivedThemeColor]
  )

  const row = Math.floor(cellIndex / GRID_SIZE)

  const isOriginal = currentBoard?.mission[cellIndex] !== '0'

  const userValue = userInputs[cellIndex]

  const cellCandidates = candidates[cellIndex]

  const isSelected = selectedCell === cellIndex

  const missionValue = currentBoard?.mission[cellIndex] ?? ''

  const cellValue = isOriginal ? missionValue : userValue || null

  // Check for Sudoku rule violations
  const hasViolation = useMemo(() => {
    if (!cellValue || !currentBoard) return false

    return checkViolation(
      cellIndex,
      cellValue,
      currentBoard.mission,
      userInputs
    )
  }, [cellIndex, cellValue, currentBoard, userInputs])

  // Auto-focus when selected
  useEffect(() => {
    if (isSelected && cellRef.current) {
      cellRef.current.focus()
    }
  }, [isSelected])

  const handleClick = useCallback(() => {
    setSelectedCell(cellIndex)
  }, [cellIndex, setSelectedCell])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      onKeyDown(e, cellIndex)
    },
    [cellIndex, onKeyDown]
  )

  return (
    <div
      ref={cellRef}
      className={clsx(
        'size-full cursor-pointer transition-colors outline-none',
        !BOX_BORDERS.has(row) && 'border-bg-500 border-b',
        !isOriginal && 'hover:bg-bg-200 dark:hover:bg-bg-700/50'
      )}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseDown={e => {
        // Handle ctrl+click on macOS which triggers contextmenu instead of click
        if (e.ctrlKey || e.metaKey) {
          handleClick()
        }
      }}
    >
      <div className="flex size-full items-center justify-center">
        <CellContent
          cellCandidates={cellCandidates}
          cellValue={cellValue}
          hasViolation={hasViolation}
          highlightedNumber={highlightedNumber}
          isOriginal={isOriginal}
          isSelected={isSelected}
          isThemeDark={isThemeDark}
        />
      </div>
    </div>
  )
}

export default memo(Cell)
