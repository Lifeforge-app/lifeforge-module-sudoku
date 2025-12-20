import clsx from 'clsx'
import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

import {
  BOX_BORDERS,
  GRID_SIZE,
  checkViolation
} from '../../../../../../constants/constants'
import { useBoardState, useSession, useSettings } from '../../../../providers'
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

  const { autoCheckMode } = useSettings()

  const isThemeDark = useMemo(
    () => tinycolor(derivedThemeColor).isDark(),
    [derivedThemeColor]
  )

  const row = Math.floor(cellIndex / GRID_SIZE)

  const col = cellIndex % GRID_SIZE

  const boxRow = Math.floor(row / 3)

  const boxCol = Math.floor(col / 3)

  const isOriginal = currentBoard?.mission[cellIndex] !== '0'

  const userValue = userInputs[cellIndex]

  const cellCandidates = candidates[cellIndex]

  const isSelected = selectedCell === cellIndex

  const missionValue = currentBoard?.mission[cellIndex] ?? ''

  const cellValue = isOriginal ? missionValue : userValue || null

  // Check if this cell is in the same row, column, or box as the selected cell
  const isChainHighlighted = useMemo(() => {
    if (selectedCell === null || isSelected) return false

    const selectedRow = Math.floor(selectedCell / GRID_SIZE)

    const selectedCol = selectedCell % GRID_SIZE

    const selectedBoxRow = Math.floor(selectedRow / 3)

    const selectedBoxCol = Math.floor(selectedCol / 3)

    const sameRow = row === selectedRow

    const sameCol = col === selectedCol

    const sameBox = boxRow === selectedBoxRow && boxCol === selectedBoxCol

    return sameRow || sameCol || sameBox
  }, [selectedCell, isSelected, row, col, boxRow, boxCol])

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

  // Check if user input is incorrect (for auto-check mode)
  const isIncorrect = useMemo(() => {
    if (!autoCheckMode || isOriginal || !userValue || !currentBoard)
      return false

    return userValue !== currentBoard.solution[cellIndex]
  }, [autoCheckMode, isOriginal, userValue, currentBoard, cellIndex])

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
        !BOX_BORDERS.has(row) && 'border-bg-300 dark:border-bg-700 border-b',
        !isOriginal && 'hover:bg-bg-200 dark:hover:bg-bg-700/50',
        (isSelected || isChainHighlighted) && 'bg-bg-500/5 hover:bg-bg-500/20!'
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
          isIncorrect={isIncorrect}
          isOriginal={isOriginal}
          isSelected={isSelected}
          isThemeDark={isThemeDark}
        />
      </div>
    </div>
  )
}

export default memo(Cell)
