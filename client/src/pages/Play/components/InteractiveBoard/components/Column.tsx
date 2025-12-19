import clsx from 'clsx'
import { memo } from 'react'

import {
  BOX_BORDERS,
  GRID_INDICES,
  getCellIndex
} from '../../../../../constants/constants'
import Cell from './Cell'

interface ColumnProps {
  col: number
  onKeyDown: (e: React.KeyboardEvent, cellIndex: number) => void
}

function Column({ col, onKeyDown }: ColumnProps) {
  return (
    <div
      className={clsx(
        'grid size-full grid-rows-9',
        !BOX_BORDERS.has(col) && 'border-bg-500 border-r'
      )}
    >
      {GRID_INDICES.map(row => {
        const cellIndex = getCellIndex(row, col)

        return <Cell key={row} cellIndex={cellIndex} onKeyDown={onKeyDown} />
      })}
    </div>
  )
}

export default memo(Column)
